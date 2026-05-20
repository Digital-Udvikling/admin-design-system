from io import StringIO
from pathlib import Path

import pytest
from django.core.management import call_command
from django.core.management.base import CommandError


def test_init_scaffolds_files(tmp_path: Path):
    out = StringIO()
    call_command("aortl_admin_init", "--target", str(tmp_path), stdout=out)
    input_css = tmp_path / "assets" / "css" / "aortl.input.css"
    base = tmp_path / "templates" / "aortl_base.html"
    assert input_css.is_file()
    assert base.is_file()
    body = input_css.read_text()
    assert '@import "tailwindcss";' in body
    assert "aortl_admin/static/aortl_admin/css/theme.css" in body
    assert "aortl_admin/static/aortl_admin/css/components/index.css" in body
    # Absolute path is on disk
    for line in body.splitlines():
        if line.startswith("@import") and "aortl_admin/static" in line:
            path = line.split('"')[1]
            assert Path(path).is_file()


def test_init_idempotent(tmp_path: Path):
    call_command("aortl_admin_init", "--target", str(tmp_path), stdout=StringIO())
    input_css = tmp_path / "assets" / "css" / "aortl.input.css"
    input_css.write_text("manually edited")
    out = StringIO()
    call_command("aortl_admin_init", "--target", str(tmp_path), stdout=out)
    assert input_css.read_text() == "manually edited"
    assert "exists, skipping" in out.getvalue()


def test_init_force_overwrites(tmp_path: Path):
    call_command("aortl_admin_init", "--target", str(tmp_path), stdout=StringIO())
    input_css = tmp_path / "assets" / "css" / "aortl.input.css"
    input_css.write_text("manually edited")
    call_command("aortl_admin_init", "--target", str(tmp_path), "--force", stdout=StringIO())
    assert input_css.read_text() != "manually edited"


def test_refresh_paths_rewrites_imports(tmp_path: Path):
    call_command("aortl_admin_init", "--target", str(tmp_path), stdout=StringIO())
    input_css = tmp_path / "assets" / "css" / "aortl.input.css"
    original = input_css.read_text()
    # Simulate a venv move by replacing the absolute prefix
    munged = original.replace("aortl_admin/static", "OLD_PATH/aortl_admin/static")
    input_css.write_text(munged)
    call_command(
        "aortl_admin_init",
        "--target",
        str(tmp_path),
        "--refresh-paths",
        stdout=StringIO(),
    )
    refreshed = input_css.read_text()
    assert "OLD_PATH" not in refreshed
    assert refreshed == original


def test_refresh_paths_errors_if_missing(tmp_path: Path):
    with pytest.raises(CommandError):
        call_command(
            "aortl_admin_init",
            "--target",
            str(tmp_path),
            "--refresh-paths",
            stdout=StringIO(),
        )
