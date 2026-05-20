"""Hatchling build hook that vendors @aortl/admin-css source into the package.

Runs for every build target (wheel, sdist, editable). Consumers installing
the PyPI wheel never see this — they get a wheel with the CSS already baked
in. Local dev and CI get the sync automatically on `uv build` / `uv pip
install -e .`, so the synced dir doesn't need to be committed to git.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

from hatchling.builders.hooks.plugin.interface import BuildHookInterface


class VendorCssHook(BuildHookInterface):
    PLUGIN_NAME = "vendor-css"

    def initialize(self, version: str, build_data: dict) -> None:
        script = Path(self.root) / "scripts" / "sync_css.py"
        subprocess.run([sys.executable, str(script)], check=True)
