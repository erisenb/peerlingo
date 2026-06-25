import enum
from datetime import datetime
from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String
from database import Base


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
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    school = Column(String, nullable=True)
    grade = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    vocab_words = Column(String, nullable=True)
    content = Column(String, nullable=True)
    status = Column(Enum(LessonStatus), default=LessonStatus.draft, nullable=False)
    tutor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class LessonProgress(Base):
    __tablename__ = "lesson_progress"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    completed_at = Column(DateTime, default=datetime.utcnow)


class AdminLesson(Base):
    __tablename__ = "admin_lessons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    video_url = Column(String, nullable=True)
    pdf_filename = Column(String, nullable=True)   # filename stored in uploads/
    content = Column(String, nullable=True)
    admin_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    type = Column(Enum(AssignmentType), nullable=False)
    due_date = Column(String, nullable=True)            # ISO date YYYY-MM-DD
    tutor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # None = all students
    curriculum_id = Column(Integer, ForeignKey("admin_lessons.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class AssignmentCompletion(Base):
    __tablename__ = "assignment_completions"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    completed_at = Column(DateTime, default=datetime.utcnow)


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    scheduled_at = Column(DateTime, nullable=False)
    duration_minutes = Column(Integer, default=45)
    meeting_url = Column(String, nullable=True)
    tutor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
