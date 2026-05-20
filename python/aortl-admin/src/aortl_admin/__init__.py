from __future__ import annotations

from importlib.resources import files
from pathlib import Path

__version__ = "0.0.1"

default_app_config = "aortl_admin.apps.AortlAdminConfig"


def css_source_dir() -> Path:
    """Absolute path to the vendored design-system CSS source.

    The Tailwind v4 standalone CLI compiles user input CSS that `@import`s
    these files. The path is stable within a venv, so the init management
    command writes it into the scaffolded input.css verbatim.
    """
    return Path(str(files("aortl_admin").joinpath("static/aortl_admin/css"))).resolve()
