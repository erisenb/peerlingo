import enum
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Enum, ForeignKey, Integer, String
from vp_database import Base


class UserRole(str, enum.Enum):
    admin = "admin"
    tutor = "tutor"
    student = "student"


class LessonStatus(str, enum.Enum):
    draft = "draft"
    active = "active"


class AssignmentType(str, enum.Enum):
    homework = "homework"
    practice = "practice"
    quiz = "quiz"


class User(Base):
    __tablename__ = "vp_users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    school = Column(String, nullable=True)
    grade = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    goals = Column(String, nullable=True)
    profile_pic_filename = Column(String, nullable=True)
    language = Column(String, default='en', nullable=True)
    google_id = Column(String, nullable=True)
    country = Column(String, nullable=True)
    city = Column(String, nullable=True)
    date_of_birth = Column(String, nullable=True)
    english_level = Column(String, nullable=True)
    preferred_focus = Column(String, nullable=True)
    preferred_tutor_gender = Column(String, nullable=True)
    survey_completed = Column(Boolean, default=False, nullable=True)
    state = Column(String, nullable=True)
    spanish_level = Column(String, nullable=True)
    availability_days = Column(String, nullable=True)
    availability_times = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    receive_reminders = Column(Boolean, default=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Lesson(Base):
    __tablename__ = "vp_lessons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    vocab_words = Column(String, nullable=True)
    content = Column(String, nullable=True)
    status = Column(Enum(LessonStatus), default=LessonStatus.draft, nullable=False)
    tutor_id = Column(Integer, ForeignKey("vp_users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class LessonProgress(Base):
    __tablename__ = "vp_lesson_progress"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("vp_lessons.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("vp_users.id"), nullable=False)
    completed_at = Column(DateTime, default=datetime.utcnow)


class AdminLesson(Base):
    __tablename__ = "vp_admin_lessons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    video_url = Column(String, nullable=True)
    pdf_filename = Column(String, nullable=True)
    content = Column(String, nullable=True)
    admin_id = Column(Integer, ForeignKey("vp_users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Assignment(Base):
    __tablename__ = "vp_assignments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    type = Column(Enum(AssignmentType), nullable=False)
    due_date = Column(String, nullable=True)
    tutor_id = Column(Integer, ForeignKey("vp_users.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("vp_users.id"), nullable=True)
    curriculum_id = Column(Integer, ForeignKey("vp_admin_lessons.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class AssignmentCompletion(Base):
    __tablename__ = "vp_assignment_completions"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("vp_assignments.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("vp_users.id"), nullable=False)
    completed_at = Column(DateTime, default=datetime.utcnow)


class Meeting(Base):
    __tablename__ = "vp_meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    scheduled_at = Column(DateTime, nullable=False)
    duration_minutes = Column(Integer, default=45)
    meeting_url = Column(String, nullable=True)
    tutor_id = Column(Integer, ForeignKey("vp_users.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("vp_users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class TutorStudentPairing(Base):
    __tablename__ = "vp_pairings"

    id = Column(Integer, primary_key=True, index=True)
    tutor_id = Column(Integer, ForeignKey("vp_users.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("vp_users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class ChatMessage(Base):
    __tablename__ = "vp_chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("vp_users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("vp_users.id"), nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class ContactMessage(Base):
    __tablename__ = "vp_contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False)
    purpose = Column(String, nullable=False)
    message = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class PasswordResetToken(Base):
    __tablename__ = "vp_password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("vp_users.id"), nullable=False)
    token = Column(String, unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# ── Curriculum tables ─────────────────────────────────────────────────────────

class VPCurriculum(Base):
    __tablename__ = "vp_curriculums"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    level = Column(String, nullable=False)        # beginner | intermediate | advanced
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class VPCurriculumLesson(Base):
    __tablename__ = "vp_curriculum_lessons"

    id = Column(Integer, primary_key=True, index=True)
    curriculum_id = Column(Integer, ForeignKey("vp_curriculums.id"), nullable=False)
    lesson_number = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    outline = Column(String, nullable=False)      # full lesson outline text (English)
    outline_es = Column(String, nullable=True)    # Spanish translation of outline
    slides_url = Column(String, nullable=True)    # Google Slides URL generated by AI
    created_at = Column(DateTime, default=datetime.utcnow)


class VPHomeworkAssignment(Base):
    __tablename__ = "vp_homework_assignments"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("vp_curriculum_lessons.id"), nullable=False, unique=True)
    vocabulary = Column(String, nullable=False)   # JSON: [{word, definition}]
    expressions = Column(String, nullable=False)  # JSON: [{expression, meaning}]
    created_at = Column(DateTime, default=datetime.utcnow)


class VPStudentProgress(Base):
    __tablename__ = "vp_student_progress"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("vp_users.id"), nullable=False)
    curriculum_id = Column(Integer, ForeignKey("vp_curriculums.id"), nullable=False)
    current_lesson_number = Column(Integer, default=1, nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)


class StudentCurriculum(Base):
    __tablename__ = "vp_student_curriculum"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("vp_users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("vp_curriculum_lessons.id"), nullable=False)
    order_index = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
