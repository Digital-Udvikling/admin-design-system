"""Scaffold the Tailwind input CSS and an extendable base template.

Idempotent by default — refuses to overwrite existing files unless `--force`
is passed. Use `--refresh-paths` after switching virtualenvs to rewrite the
absolute `@import` paths in `aortl.input.css` without touching other files.
"""

from __future__ import annotations

import re
from pathlib import Path
from typing import Any

from django.core.management.base import BaseCommand, CommandError

from aortl_admin import css_source_dir

INPUT_CSS_TEMPLATE = """\
@import "tailwindcss";

/* Scan your project templates and Python source for Tailwind utility usage.
   Adjust the globs to match your layout. */
@source "{project_root}/**/templates/**/*.html";
@source "{project_root}/**/*.py";

/* Design-system source from the aortl-admin Python package. These absolute
   paths are written by `manage.py aortl_admin_init` and resolve to this
   venv's site-packages location. Re-run the command with --refresh-paths
   after switching virtualenvs. */
@import "{css_dir}/theme.css";
@import "{css_dir}/base.css";
@import "{css_dir}/components/index.css";

/* Add your own component classes or token overrides below. */
"""

BASE_TEMPLATE = """\
{% extends "aortl_admin/base.html" %}

{# Edit this file freely — it's your project's copy of the app shell.
   The canonical version lives in the aortl_admin package as
   `aortl_admin/base.html`; you can extend it directly if you'd rather not
   own the shell. #}

{% block navbar_brand %}My App{% endblock %}

{% block sidebar_nav %}
  {% load aortl_admin %}
  <div class="sidebar-group">
    {# Examples — replace with your own routes. #}
    {# {% sidebar_item url='/' label='Dashboard' icon='ti-home' %} #}
  </div>
{% endblock %}
"""

IMPORT_LINE_RE = re.compile(r'@import\s+"[^"]*aortl_admin/static/aortl_admin/css/(?P<rest>[^"]+)";')


class Command(BaseCommand):
    help = "Scaffold the Tailwind input CSS and base template for aortl-admin."

    def add_arguments(self, parser: Any) -> None:
        parser.add_argument(
            "--target",
            default=".",
            help="Project root (default: current directory).",
        )
        parser.add_argument(
            "--input-css",
            default="assets/css/aortl.input.css",
            help="Relative path inside --target for the Tailwind input CSS.",
        )
        parser.add_argument(
            "--base-template",
            default="templates/aortl_base.html",
            help="Relative path inside --target for the extendable base template.",
        )
        parser.add_argument(
            "--force",
            action="store_true",
            help="Overwrite existing files.",
        )
        parser.add_argument(
            "--refresh-paths",
            action="store_true",
            help="Only rewrite the @import paths in an existing input CSS.",
        )

    def handle(self, *args: Any, **opts: Any) -> None:
        target = Path(opts["target"]).resolve()
        input_css = target / opts["input_css"]
        base_template = target / opts["base_template"]
        force = opts["force"]
        refresh = opts["refresh_paths"]

        css_dir = css_source_dir()
        if not css_dir.is_dir():
            raise CommandError(
                f"aortl-admin CSS source dir not found at {css_dir}. "
                "Is the package installed correctly?"
            )

        if refresh:
            self._refresh_paths(input_css, css_dir)
            return

        self._write(
            input_css,
            INPUT_CSS_TEMPLATE.format(project_root=target.as_posix(), css_dir=css_dir.as_posix()),
            force=force,
        )
        self._write(base_template, BASE_TEMPLATE, force=force)

        self.stdout.write(self.style.SUCCESS("aortl-admin scaffolded."))
        self.stdout.write("Next:")
        self.stdout.write(f'  1. Set TAILWIND_CLI_SRC_CSS = "{opts["input_css"]}"')
        self.stdout.write('  2. Set TAILWIND_CLI_DIST_CSS = "css/aortl.output.css"')
        self.stdout.write('  3. Add "aortl_admin" and "django_tailwind_cli" to INSTALLED_APPS')
        self.stdout.write("  4. Run: python manage.py tailwind build")

    def _write(self, path: Path, content: str, *, force: bool) -> None:
        if path.exists() and not force:
            self.stdout.write(
                self.style.WARNING(f"exists, skipping: {path} (use --force to overwrite)")
            )
            return
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content)
        self.stdout.write(self.style.SUCCESS(f"wrote {path}"))

    def _refresh_paths(self, input_css: Path, css_dir: Path) -> None:
        if not input_css.is_file():
            raise CommandError(
                f"{input_css} does not exist; run without --refresh-paths to scaffold it."
            )
        original = input_css.read_text()
        rewritten = IMPORT_LINE_RE.sub(
            lambda m: f'@import "{css_dir.as_posix()}/{m.group("rest")}";', original
        )
        if rewritten == original:
            self.stdout.write("paths already current, no changes.")
            return
        input_css.write_text(rewritten)
        self.stdout.write(self.style.SUCCESS(f"refreshed @import paths in {input_css}"))
