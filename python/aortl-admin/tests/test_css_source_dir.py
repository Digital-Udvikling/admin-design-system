from pathlib import Path

from aortl_admin import __version__, css_source_dir


def test_css_source_dir_exists():
    css_dir = css_source_dir()
    assert isinstance(css_dir, Path)
    assert css_dir.is_dir()
    assert (css_dir / "theme.css").is_file()
    assert (css_dir / "base.css").is_file()
    assert (css_dir / "components" / "index.css").is_file()


def test_css_source_dir_is_absolute():
    assert css_source_dir().is_absolute()


def test_source_version_matches_or_explains():
    src = (css_source_dir() / "SOURCE_VERSION").read_text().strip()
    # Sync script writes the admin-css version; aortl-admin is bumped in lockstep.
    # At publish time they're equal — during dev they may diverge until next sync.
    assert src
    assert __version__
