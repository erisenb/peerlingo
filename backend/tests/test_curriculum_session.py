"""
Tests for the Phase 1-3 curriculum/session workflow:
level -> curriculum, pairing, next-lesson calculation, session lifecycle,
progress advancement, duplicate-completion protection, permissions, and
tutor-only content protection.

Tests within a class share mutable state deliberately (each step of the
class builds on the previous, mirroring a real tutor/student session) and
run in definition order, which is pytest's default within a module.
Standalone functions are self-contained.
"""
from conftest import auth_headers

_TUTOR_ONLY_KEYS = {
    'goal', 'tutor_steps', 'listen_for', 'common_mistakes', 'if_struggling',
    'if_finishes_early', 'move_on_when', 'prompts', 'tutor_script', 'debrief',
    'model_answer', 'materials_needed', 'completion_criteria',
}


def _find_tutor_only_leaks(obj, path=''):
    leaks = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in _TUTOR_ONLY_KEYS:
                leaks.append(f'{path}.{k}')
            leaks += _find_tutor_only_leaks(v, f'{path}.{k}')
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            leaks += _find_tutor_only_leaks(v, f'{path}[{i}]')
    return leaks


# ── Level → curriculum ──────────────────────────────────────────────────────

def test_admin_can_set_valid_level(client, admin_token, student1_id):
    r = client.patch(f"/api/admin/students/{student1_id}/level",
                      json={"level": "beginner"}, headers=auth_headers(admin_token))
    assert r.status_code == 200
    assert r.json()["english_level"] == "beginner"


def test_admin_cannot_set_invalid_level(client, admin_token, student1_id):
    r = client.patch(f"/api/admin/students/{student1_id}/level",
                      json={"level": "fluent"}, headers=auth_headers(admin_token))
    assert r.status_code == 400


def test_non_admin_cannot_set_level(client, tutor1_token, student1_id):
    r = client.patch(f"/api/admin/students/{student1_id}/level",
                      json={"level": "beginner"}, headers=auth_headers(tutor1_token))
    assert r.status_code == 403


# ── Pairing validation ───────────────────────────────────────────────────────

def test_pairing_rejects_student_as_tutor(client, admin_token, student1_id, student2_id):
    r = client.post("/api/admin/pairings",
                     json={"tutor_id": student1_id, "student_id": student2_id},
                     headers=auth_headers(admin_token))
    assert r.status_code == 400


def test_pairing_rejects_nonexistent_users(client, admin_token):
    r = client.post("/api/admin/pairings",
                     json={"tutor_id": 999999, "student_id": 999998},
                     headers=auth_headers(admin_token))
    assert r.status_code == 400


def test_pairing_creation_requires_admin(client, tutor1_token, student1_id):
    r = client.post("/api/admin/pairings",
                     json={"tutor_id": student1_id, "student_id": student1_id},
                     headers=auth_headers(tutor1_token))
    assert r.status_code == 403


# ── Full workflow: pairing -> curriculum -> session -> progress -> completion ─

class TestFullWorkflow:
    """Sequential story using tutor1 + student1, exercising the entire
    Admin pairs -> curriculum appears -> session -> progress -> next lesson chain."""

    def test_01_set_level(self, client, admin_token, student1_id):
        r = client.patch(f"/api/admin/students/{student1_id}/level",
                          json={"level": "beginner"}, headers=auth_headers(admin_token))
        assert r.status_code == 200

    def test_02_pairing_creates_enrollment(self, client, admin_token, tutor1_token, student1_id):
        # Ensure a clean slate: remove any existing pairing, then re-create it.
        existing = client.get("/api/admin/pairings", headers=auth_headers(admin_token)).json()
        for p in existing:
            if p["tutor_id"] == self._tutor1_id(client, tutor1_token) and p["student_id"] == student1_id:
                client.delete(f"/api/admin/pairings/{p['id']}", headers=auth_headers(admin_token))

        r = client.post("/api/admin/pairings",
                         json={"tutor_id": self._tutor1_id(client, tutor1_token), "student_id": student1_id},
                         headers=auth_headers(admin_token))
        assert r.status_code == 201

        # Curriculum must be immediately visible to the tutor — no manual assignment step.
        prog = client.get(f"/api/tutor/students/{student1_id}/progress",
                           headers=auth_headers(tutor1_token)).json()
        assert prog["curriculum_level"] == "beginner"
        assert prog["total_lessons"] == 20
        assert prog["next_lesson"]["lesson_number"] == 1

    def test_03_tutor_sees_next_lesson(self, client, tutor1_token, student1_id):
        prog = client.get(f"/api/tutor/students/{student1_id}/progress",
                           headers=auth_headers(tutor1_token)).json()
        assert prog["next_lesson"] is not None
        assert prog["lessons"][0]["status"] == "next"
        assert all(l["status"] == "locked" for l in prog["lessons"][1:])

    def test_04_tutor_starts_session_without_assigning(self, client, tutor1_token, student1_id):
        prog = client.get(f"/api/tutor/students/{student1_id}/progress",
                           headers=auth_headers(tutor1_token)).json()
        lesson_id = prog["next_lesson"]["id"]
        r = client.post("/api/sessions", json={"student_id": student1_id, "lesson_id": lesson_id},
                         headers=auth_headers(tutor1_token))
        assert r.status_code == 201
        session = r.json()
        assert session["current_step"] == 0
        assert session["completed"] is False
        TestFullWorkflow._session_id = session["id"]

    def test_05_tutor_view_has_full_content(self, client, tutor1_token):
        r = client.get(f"/api/sessions/{TestFullWorkflow._session_id}", headers=auth_headers(tutor1_token))
        section0 = r.json()["lesson"]["data"]["sections"][0]
        assert "tutor_steps" in section0
        assert "prompts" in section0

    def test_06_student_view_is_stripped(self, client, student1_token):
        r = client.get("/api/sessions/mine", headers=auth_headers(student1_token))
        data = r.json()
        assert data["id"] == TestFullWorkflow._session_id
        leaks = _find_tutor_only_leaks(data["lesson"]["data"])
        assert leaks == [], f"tutor-only fields leaked to student: {leaks}"

    def test_07_reopening_session_is_idempotent(self, client, tutor1_token, student1_id):
        """Starting the same lesson again must reuse the session, not create a duplicate."""
        prog = client.get(f"/api/tutor/students/{student1_id}/progress",
                           headers=auth_headers(tutor1_token)).json()
        lesson_id = prog["next_lesson"]["id"]
        r = client.post("/api/sessions", json={"student_id": student1_id, "lesson_id": lesson_id},
                         headers=auth_headers(tutor1_token))
        assert r.json()["id"] == TestFullWorkflow._session_id

    def test_08_step_progression_persists(self, client, tutor1_token):
        sid = TestFullWorkflow._session_id
        r = client.patch(f"/api/sessions/{sid}/step", json={"current_step": 3},
                          headers=auth_headers(tutor1_token))
        assert r.status_code == 200
        r2 = client.get(f"/api/sessions/{sid}", headers=auth_headers(tutor1_token))
        assert r2.json()["current_step"] == 3

    def test_09_step_out_of_bounds_rejected(self, client, tutor1_token):
        sid = TestFullWorkflow._session_id
        r = client.patch(f"/api/sessions/{sid}/step", json={"current_step": 9999},
                          headers=auth_headers(tutor1_token))
        assert r.status_code == 400
        r2 = client.patch(f"/api/sessions/{sid}/step", json={"current_step": -1},
                           headers=auth_headers(tutor1_token))
        assert r2.status_code == 400

    def test_10_complete_advances_progress(self, client, tutor1_token, student1_id):
        sid = TestFullWorkflow._session_id
        r = client.post(f"/api/sessions/{sid}/complete", headers=auth_headers(tutor1_token))
        assert r.status_code == 200
        assert r.json()["already_completed"] is False

        prog = client.get(f"/api/tutor/students/{student1_id}/progress",
                           headers=auth_headers(tutor1_token)).json()
        assert prog["current_lesson_number"] == 2
        assert prog["completed_count"] == 1
        assert prog["next_lesson"]["lesson_number"] == 2
        assert prog["lessons"][0]["status"] == "completed"
        assert prog["lessons"][1]["status"] == "next"

    def test_11_duplicate_completion_does_not_advance_twice(self, client, tutor1_token, student1_id):
        sid = TestFullWorkflow._session_id
        r = client.post(f"/api/sessions/{sid}/complete", headers=auth_headers(tutor1_token))
        assert r.status_code == 200
        assert r.json()["already_completed"] is True

        prog = client.get(f"/api/tutor/students/{student1_id}/progress",
                           headers=auth_headers(tutor1_token)).json()
        assert prog["current_lesson_number"] == 2  # unchanged

    @staticmethod
    def _tutor1_id(client, tutor1_token):
        return client.get("/api/auth/me", headers=auth_headers(tutor1_token)).json()["id"]


# ── Next lesson determinism & curriculum-complete state ─────────────────────

def test_curriculum_complete_after_final_lesson(client, admin_token, tutor1_token, student1_id):
    tutor_id = client.get("/api/auth/me", headers=auth_headers(tutor1_token)).json()["id"]

    for _ in range(25):  # more than 20 lessons — must stop cleanly, never error
        prog = client.get(f"/api/tutor/students/{student1_id}/progress",
                           headers=auth_headers(tutor1_token)).json()
        if prog["curriculum_complete"]:
            break
        lesson_id = prog["next_lesson"]["id"]
        s = client.post("/api/sessions", json={"student_id": student1_id, "lesson_id": lesson_id},
                         headers=auth_headers(tutor1_token)).json()
        client.post(f"/api/sessions/{s['id']}/complete", headers=auth_headers(tutor1_token))

    final = client.get(f"/api/tutor/students/{student1_id}/progress",
                        headers=auth_headers(tutor1_token)).json()
    assert final["curriculum_complete"] is True
    assert final["next_lesson"] is None
    assert final["completed_count"] == 20
    assert all(l["status"] == "completed" for l in final["lessons"])


def test_students_own_curriculum_view_reflects_completion(client, student1_token):
    """Regression test: /api/curriculum/mine (the student's own 'Currículo' tab)
    must never report current_lesson_number beyond the lesson count, even
    though internal progress tracking intentionally goes one past the last
    lesson so the tutor-facing curriculum_complete flag can flip to True."""
    r = client.get("/api/curriculum/mine", headers=auth_headers(student1_token))
    data = r.json()
    total = len(data["lessons"])
    assert data["current_lesson_number"] <= total
    assert data["current_lesson_number"] == total  # fully finished, capped at the last lesson


def test_next_lesson_calculation_is_deterministic(client, tutor1_token, student1_id):
    a = client.get(f"/api/tutor/students/{student1_id}/progress", headers=auth_headers(tutor1_token)).json()
    b = client.get(f"/api/tutor/students/{student1_id}/progress", headers=auth_headers(tutor1_token)).json()
    assert a["current_lesson_number"] == b["current_lesson_number"]
    assert a["next_lesson"] == b["next_lesson"]


# ── Cross-curriculum session protection ──────────────────────────────────────

def test_cannot_start_session_for_lesson_outside_students_curriculum(client, admin_token, tutor2_token, student2_id):
    client.patch(f"/api/admin/students/{student2_id}/level",
                 json={"level": "beginner"}, headers=auth_headers(admin_token))
    # Grab an advanced-level lesson id via the public endpoint.
    adv = client.get("/api/curriculum/by-level/advanced").json()
    advanced_lesson_id = adv["lessons"][0]["id"]

    r = client.post("/api/sessions", json={"student_id": student2_id, "lesson_id": advanced_lesson_id},
                     headers=auth_headers(tutor2_token))
    assert r.status_code == 400


# ── Permissions ───────────────────────────────────────────────────────────────

def test_tutor_cannot_view_unassigned_students_progress(client, tutor2_token, student1_id):
    r = client.get(f"/api/tutor/students/{student1_id}/progress", headers=auth_headers(tutor2_token))
    assert r.status_code == 403


def test_tutor_cannot_start_session_for_unassigned_student(client, tutor2_token, student1_id):
    r = client.post("/api/sessions", json={"student_id": student1_id, "lesson_id": 1},
                     headers=auth_headers(tutor2_token))
    assert r.status_code == 403


def test_student_cannot_access_tutor_only_progress_endpoint(client, student1_token, student1_id):
    r = client.get(f"/api/tutor/students/{student1_id}/progress", headers=auth_headers(student1_token))
    assert r.status_code == 403


def test_student_cannot_create_sessions(client, student1_token, student1_id):
    r = client.post("/api/sessions", json={"student_id": student1_id, "lesson_id": 1},
                     headers=auth_headers(student1_token))
    assert r.status_code == 403


def test_student_cannot_fetch_arbitrary_session_id(client, student2_token):
    r = client.get("/api/sessions/999999", headers=auth_headers(student2_token))
    assert r.status_code == 404


def test_unpaired_tutor_loses_session_control(client, admin_token, tutor2_token, student2_id):
    # Fresh pairing + session for tutor2/student2.
    tutor2_id = client.get("/api/auth/me", headers=auth_headers(tutor2_token)).json()["id"]
    existing = client.get("/api/admin/pairings", headers=auth_headers(admin_token)).json()
    pairing = next((p for p in existing if p["tutor_id"] == tutor2_id and p["student_id"] == student2_id), None)
    if not pairing:
        pairing = client.post("/api/admin/pairings", json={"tutor_id": tutor2_id, "student_id": student2_id},
                               headers=auth_headers(admin_token)).json()

    prog = client.get(f"/api/tutor/students/{student2_id}/progress", headers=auth_headers(tutor2_token)).json()
    assert prog["next_lesson"] is not None, "student2 needs an active curriculum for this test"
    s = client.post("/api/sessions", json={"student_id": student2_id, "lesson_id": prog["next_lesson"]["id"]},
                     headers=auth_headers(tutor2_token)).json()

    client.delete(f"/api/admin/pairings/{pairing['id']}", headers=auth_headers(admin_token))

    r_step = client.patch(f"/api/sessions/{s['id']}/step", json={"current_step": 1},
                           headers=auth_headers(tutor2_token))
    assert r_step.status_code == 403

    r_complete = client.post(f"/api/sessions/{s['id']}/complete", headers=auth_headers(tutor2_token))
    assert r_complete.status_code == 403

    r_get = client.get(f"/api/sessions/{s['id']}", headers=auth_headers(tutor2_token))
    assert r_get.status_code == 403


# ── Tutor-only content protection (defense in depth) ─────────────────────────

def test_public_curriculum_endpoint_strips_tutor_content(client):
    r = client.get("/api/curriculum/by-level/beginner")
    assert r.status_code == 200
    data = r.json()
    import json as _json
    for lesson in data["lessons"]:
        if not lesson.get("lesson_data"):
            continue
        leaks = _find_tutor_only_leaks(_json.loads(lesson["lesson_data"]))
        assert leaks == [], f"lesson {lesson['id']} leaks tutor-only fields publicly: {leaks}"


def test_invalid_level_in_url_rejected(client):
    r = client.get("/api/curriculum/by-level/not-a-real-level")
    assert r.status_code == 400


# ── Account deletion cleanup ──────────────────────────────────────────────────

def test_deleting_student_cleans_up_progress_and_sessions(client, admin_token, tutor2_token, student2_id):
    """A deleted student's progress/session rows must not remain reachable
    or orphaned in a way that breaks other endpoints."""
    # A prior test may have revoked this pairing — re-establish it so this
    # test is self-contained regardless of execution order.
    tutor2_id = client.get("/api/auth/me", headers=auth_headers(tutor2_token)).json()["id"]
    existing = client.get("/api/admin/pairings", headers=auth_headers(admin_token)).json()
    if not any(p["tutor_id"] == tutor2_id and p["student_id"] == student2_id for p in existing):
        client.post("/api/admin/pairings", json={"tutor_id": tutor2_id, "student_id": student2_id},
                     headers=auth_headers(admin_token))

    prog = client.get(f"/api/tutor/students/{student2_id}/progress", headers=auth_headers(tutor2_token)).json()
    active_session_id = prog.get("active_session_id")

    r = client.delete(f"/api/admin/users/{student2_id}", headers=auth_headers(admin_token))
    assert r.status_code == 204

    if active_session_id:
        r2 = client.get(f"/api/sessions/{active_session_id}", headers=auth_headers(tutor2_token))
        assert r2.status_code == 404

    r3 = client.get("/api/users/students", headers=auth_headers(tutor2_token))
    assert all(s["id"] != student2_id for s in r3.json())
