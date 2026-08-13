"""
Shared pytest fixtures for the curriculum/session test suite.

Uses a throwaway SQLite database for the whole test session (router.py's
startup seeding — base curricula, all 60 structured lessons, demo accounts —
only needs to run once) and FastAPI's TestClient against the real app.
"""
import os
import sys
import tempfile

import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


@pytest.fixture(scope="session")
def client():
    db_fd, db_path = tempfile.mkstemp(suffix=".db")
    os.close(db_fd)
    os.environ["VP_DB_PATH"] = db_path

    import router  # noqa: E402  (import after VP_DB_PATH is set so the engine binds to it)
    from fastapi.testclient import TestClient

    with TestClient(router.app) as c:
        yield c

    try:
        os.remove(db_path)
    except OSError:
        pass


@pytest.fixture(scope="session")
def accounts(client):
    """Seed (idempotently) the fixed demo admin/tutor/student accounts and
    return {email: {"token": ..., "user": {...}}} exactly as the API does."""
    resp = client.post("/api/dev/ensure-accounts")
    assert resp.status_code == 200, resp.text
    return resp.json()


def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="session")
def admin_token(accounts):
    return accounts["admin@test.com"]["token"]


@pytest.fixture(scope="session")
def tutor1_token(accounts):
    return accounts["demo-tutor1@peerlingo.test"]["token"]


@pytest.fixture(scope="session")
def tutor2_token(accounts):
    return accounts["demo-tutor2@peerlingo.test"]["token"]


@pytest.fixture(scope="session")
def student1_id(accounts):
    return accounts["demo-student1@peerlingo.test"]["user"]["id"]


@pytest.fixture(scope="session")
def student2_id(accounts):
    return accounts["demo-student2@peerlingo.test"]["user"]["id"]


@pytest.fixture(scope="session")
def student1_token(accounts):
    return accounts["demo-student1@peerlingo.test"]["token"]


@pytest.fixture(scope="session")
def student2_token(accounts):
    return accounts["demo-student2@peerlingo.test"]["token"]
