"""
Curriculum v3 seed — structured lesson data with full tutor guide, adaptive
guidance (struggling/early-finisher/move-on-when), student activities, and
slides. Lesson content lives per-level in vp_lessons_beginner.py,
vp_lessons_intermediate.py, and vp_lessons_advanced.py; this module just
combines and applies them.

Unlike ordinary user data, this content is authored/versioned curriculum
material, so applying it always overwrites whatever is currently stored —
that is what lets us revise a lesson and have the revision actually reach
the database on the next server start.
"""
import json
import vp_models as models


def _load_all_lessons() -> dict:
    data = {}
    try:
        from vp_lessons_beginner import LESSONS as beginner_lessons
        for number, content in beginner_lessons.items():
            data[('beginner', number)] = content
    except ImportError:
        pass
    try:
        from vp_lessons_intermediate import LESSONS as intermediate_lessons
        for number, content in intermediate_lessons.items():
            data[('intermediate', number)] = content
    except ImportError:
        pass
    try:
        from vp_lessons_advanced import LESSONS as advanced_lessons
        for number, content in advanced_lessons.items():
            data[('advanced', number)] = content
    except ImportError:
        pass
    return data


def apply_lesson_data_v2(db) -> None:
    """Writes structured lesson_data onto curriculum lessons, overwriting any
    previous content so revisions to the authored lessons above always take effect."""
    count = 0
    for (level, lesson_number), lesson_data in _load_all_lessons().items():
        curriculum = db.query(models.VPCurriculum).filter(
            models.VPCurriculum.level == level
        ).first()
        if not curriculum:
            continue

        lesson = db.query(models.VPCurriculumLesson).filter(
            models.VPCurriculumLesson.curriculum_id == curriculum.id,
            models.VPCurriculumLesson.lesson_number == lesson_number,
        ).first()
        if not lesson:
            continue

        new_json = json.dumps(lesson_data)
        if lesson.lesson_data != new_json:
            lesson.lesson_data = new_json
            count += 1

    if count:
        db.commit()
        print(f"[curriculum seed v3] Applied structured lesson data to {count} lesson(s).")
    else:
        print("[curriculum seed v3] All structured lessons already up to date.")
