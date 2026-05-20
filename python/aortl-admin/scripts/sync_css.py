#!/usr/bin/env python3
"""Vendor packages/admin-css/src/ into the Python package's static dir.

Run from anywhere; paths resolve relative to this script. After a release of
@aortl/admin-css, re-run this and bump aortl-admin's version to match.
"""

from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PACKAGE_DIR = SCRIPT_DIR.parent
MONOREPO_ROOT = PACKAGE_DIR.parent.parent

SOURCE = MONOREPO_ROOT / "packages" / "admin-css" / "src"
DEST = PACKAGE_DIR / "src" / "aortl_admin" / "static" / "aortl_admin" / "css"
ADMIN_CSS_PKG = MONOREPO_ROOT / "packages" / "admin-css" / "package.json"
AORTL_ADMIN_INIT = PACKAGE_DIR / "src" / "aortl_admin" / "__init__.py"


def admin_css_version() -> str:
    return json.loads(ADMIN_CSS_PKG.read_text())["version"]


def aortl_admin_version() -> str:
    for line in AORTL_ADMIN_INIT.read_text().splitlines():
        if line.startswith("__version__"):
            return line.split("=", 1)[1].strip().strip("\"'")
    raise RuntimeError("__version__ not found in aortl_admin/__init__.py")


def main() -> int:
    if not SOURCE.is_dir():
        # No source available — common when hatchling builds a wheel from an
        # sdist, since the sdist already vendored the CSS at sdist-build time.
        # Bail out only if the destination is empty too.
        if DEST.is_dir() and (DEST / "theme.css").is_file():
            print(f"source missing, dest already populated → skip ({DEST})")
            return 0
        print(f"error: source CSS dir not found at {SOURCE}", file=sys.stderr)
        return 1

    if DEST.exists():
        shutil.rmtree(DEST)
    shutil.copytree(SOURCE, DEST)

    css_v = admin_css_version()
    (DEST / "SOURCE_VERSION").write_text(css_v + "\n")

    py_v = aortl_admin_version()
    print(f"synced @aortl/admin-css@{css_v} → {DEST.relative_to(MONOREPO_ROOT)}")
    if css_v != py_v:
        print(
            f"warning: aortl-admin version is {py_v}, admin-css is {css_v}. "
            "Bump aortl-admin to match before publishing.",
            file=sys.stderr,
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
