from unittest.mock import Mock

import pytest


@pytest.fixture
def request_at():
    def _make(path: str):
        return Mock(path=path)

    return _make
