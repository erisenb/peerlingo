import os
import shutil
import sys
from datetime import datetime
from typing import Optional

_BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

UPLOAD_DIR = os.environ.get("VP_UPLOAD_DIR", os.path.join(_BACKEND_DIR, "uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy import and_, or_, text
from sqlalchemy.orm import Session

import vp_database as database
import vp_models as models
from vp_auth import create_access_token, get_current_user, hash_password, verify_password
from vp_database import get_db

models.Base.metadata.create_all(bind=database.engine)

# Migrate existing databases that lack the language column
with database.engine.connect() as _c:
    try:
        _c.execute(text("ALTER TABLE vp_users ADD COLUMN language VARCHAR DEFAULT 'en'"))
        _c.commit()
    except Exception:
        pass
    try:
        _c.execute(text("ALTER TABLE vp_users ADD COLUMN google_id VARCHAR"))
        _c.commit()
    except Exception:
        pass
    for _col, _coltype in [
        ('country', 'VARCHAR'),
        ('city', 'VARCHAR'),
        ('date_of_birth', 'VARCHAR'),
        ('english_level', 'VARCHAR'),
        ('preferred_focus', 'VARCHAR'),
        ('preferred_tutor_gender', 'VARCHAR'),
        ('survey_completed', 'BOOLEAN DEFAULT FALSE'),
        ('state', 'VARCHAR'),
        ('spanish_level', 'VARCHAR'),
        ('availability_days', 'VARCHAR'),
        ('availability_times', 'VARCHAR'),
        ('phone', 'VARCHAR'),
        ('receive_reminders', 'BOOLEAN DEFAULT TRUE'),
    ]:
        try:
            _c.execute(text(f"ALTER TABLE vp_users ADD COLUMN {_col} {_coltype}"))
            _c.commit()
        except Exception:
            pass
    try:
        _c.execute(text("ALTER TABLE vp_curriculum_lessons ADD COLUMN outline_es TEXT"))
        _c.commit()
    except Exception:
        pass


# ── Curriculum seed ────────────────────────────────────────────────────────────

try:
    from vp_curriculum_seed import seed_curriculum as _seed_curriculum_fn
    with database.SessionLocal() as _seed_db:
        _seed_curriculum_fn(_seed_db)
except Exception as _seed_err:
    print(f"[curriculum seed] {_seed_err}")

try:
    from vp_curriculum_seed_es import seed_curriculum_es as _seed_curriculum_es_fn
    with database.SessionLocal() as _seed_db:
        _seed_curriculum_es_fn(_seed_db)
except Exception as _seed_err:
    print(f"[curriculum seed es] {_seed_err}")

_CURRICULUM_TRACKS = {
    'beginner': [
        {
            'title': 'Greetings & Introductions',
            'desc': 'Learn how to greet people and introduce yourself in English.',
            'content': (
                "Common Greetings:\n"
                "• Hello! / Hi! / Hey!\n"
                "• Good morning / Good afternoon / Good evening / Good night\n"
                "• How are you? → I'm fine, thank you! / I'm great! / Not bad!\n\n"
                "Introducing Yourself:\n"
                "• My name is ___.\n"
                "• I am from ___ (city, country).\n"
                "• I am ___ years old.\n"
                "• Nice to meet you! / Pleased to meet you!\n\n"
                "Saying Goodbye:\n"
                "• Goodbye! / Bye! / See you later!\n"
                "• Have a great day!\n\n"
                "💡 Practice: Introduce yourself to your tutor using at least 5 of these phrases!"
            ),
        },
        {
            'title': 'Numbers, Colors & Everyday Words',
            'desc': 'Master numbers 1–20, basic colors, and common everyday objects.',
            'content': (
                "Numbers 1–20:\n"
                "1 one · 2 two · 3 three · 4 four · 5 five\n"
                "6 six · 7 seven · 8 eight · 9 nine · 10 ten\n"
                "11 eleven · 12 twelve · 13 thirteen · 14 fourteen · 15 fifteen\n"
                "16 sixteen · 17 seventeen · 18 eighteen · 19 nineteen · 20 twenty\n\n"
                "Colors:\n"
                "red (rojo) · blue (azul) · green (verde) · yellow (amarillo)\n"
                "orange (anaranjado) · purple (morado) · pink (rosado)\n"
                "white (blanco) · black (negro) · brown (marrón)\n\n"
                "Everyday Objects:\n"
                "chair (silla) · table (mesa) · door (puerta) · window (ventana)\n"
                "book (libro) · pen (lapicero) · phone (teléfono) · bag (bolsa)\n\n"
                "💡 Practice: Point to 10 objects around you and say their English names!"
            ),
        },
        {
            'title': 'My Family & My Home',
            'desc': 'Learn vocabulary for family members and rooms in the home.',
            'content': (
                "Family Members:\n"
                "mother/mom (mamá) · father/dad (papá)\n"
                "sister (hermana) · brother (hermano)\n"
                "grandmother/grandma (abuela) · grandfather/grandpa (abuelo)\n"
                "aunt (tía) · uncle (tío) · cousin (primo/prima)\n\n"
                "Talking About Your Family:\n"
                "• I have ___ brothers and ___ sisters.\n"
                "• My mother's name is ___.\n"
                "• I live with my ___.\n\n"
                "Rooms in the Home:\n"
                "bedroom (cuarto) · bathroom (baño) · kitchen (cocina)\n"
                "living room (sala) · dining room (comedor)\n\n"
                "Describing Your Home:\n"
                "• My home is ___ (big/small/cozy).\n"
                "• My favorite room is the ___ because ___.\n\n"
                "💡 Practice: Describe your family and home in at least 5 sentences!"
            ),
        },
        {
            'title': 'Asking Simple Questions',
            'desc': 'Learn question words and how to form basic yes/no questions.',
            'content': (
                "Question Words:\n"
                "What? (¿Qué?) — What is this? / What is your name?\n"
                "Where? (¿Dónde?) — Where are you from?\n"
                "Who? (¿Quién?) — Who is that?\n"
                "When? (¿Cuándo?) — When is your birthday?\n"
                "How? (¿Cómo?) — How are you? / How old are you?\n"
                "Why? (¿Por qué?) — Why do you study English?\n\n"
                "Yes/No Questions:\n"
                "• Do you speak English? → Yes, I do. / No, I don't.\n"
                "• Is this a book? → Yes, it is. / No, it isn't.\n"
                "• Are you a student? → Yes, I am. / No, I'm not.\n\n"
                "Polite Requests:\n"
                "• Can you repeat that, please?\n"
                "• Can you speak more slowly?\n"
                "• I don't understand. Can you explain?\n\n"
                "💡 Practice: Ask your tutor 5 different questions using the words above!"
            ),
        },
    ],
    'intermediate': [
        {
            'title': 'Daily Routines & Present Tense',
            'desc': 'Talk about your daily activities using present tense verbs.',
            'content': (
                "Common Daily Verbs:\n"
                "wake up (despertarse) · get dressed (vestirse) · eat breakfast (desayunar)\n"
                "go to school (ir al colegio) · study (estudiar) · cook (cocinar)\n"
                "watch TV (ver TV) · exercise (ejercitarse) · go to bed (acostarse)\n\n"
                "Present Tense Structure:\n"
                "• I wake up at 7 a.m. every day.\n"
                "• She studies English on Tuesdays.\n"
                "• He doesn't like to wake up early.\n"
                "• Do you exercise in the morning?\n\n"
                "Adverbs of Frequency:\n"
                "always · usually · often · sometimes · rarely · never\n"
                "Example: I always eat breakfast. I sometimes watch TV. I never skip school.\n\n"
                "Telling Time:\n"
                "• It's 8 o'clock. / It's 8:30 (eight thirty).\n"
                "• At what time do you ___?\n\n"
                "💡 Practice: Describe your typical Monday — from waking up to going to bed!"
            ),
        },
        {
            'title': 'American School Life in New Jersey',
            'desc': 'Understand US school culture and academic vocabulary.',
            'content': (
                "The American School System:\n"
                "Elementary School: Grades K–5 (ages 5–11)\n"
                "Middle School: Grades 6–8 (ages 11–14)\n"
                "High School: Grades 9–12 (ages 14–18)\n"
                "College / University: After high school\n\n"
                "Common School Vocabulary:\n"
                "schedule (horario) · homework (tarea) · grade (calificación)\n"
                "teacher (maestro/a) · principal (director/a)\n"
                "cafeteria · gym (gimnasio) · library (biblioteca)\n"
                "semester (semestre) · GPA (promedio de calificaciones)\n\n"
                "School Culture in NJ:\n"
                "• Students move to different classrooms for each subject.\n"
                "• Extracurriculars: sports, clubs, band, debate team.\n"
                "• School spirit events: homecoming, prom, spirit week.\n\n"
                "Useful School Phrases:\n"
                "• 'Can I go to the bathroom?'\n"
                "• 'I didn't understand the assignment.'\n"
                "• 'When is the test?'\n\n"
                "💡 Practice: Ask your tutor what their school is like and compare it to yours!"
            ),
        },
        {
            'title': 'Shopping, Money & Getting Around',
            'desc': 'Navigate stores, handle money, and ask for directions.',
            'content': (
                "Money:\n"
                "penny = $0.01 · nickel = $0.05 · dime = $0.10 · quarter = $0.25\n"
                "'How much does this cost?' → 'It's $___.\"\n"
                "'That's too expensive.' / 'Do you have anything cheaper?'\n\n"
                "Shopping Phrases:\n"
                "• 'I'm looking for ___.\"\n"
                "• 'Do you have this in a different size/color?'\n"
                "• 'Can I try this on?' (for clothing)\n"
                "• 'Is this on sale?'\n\n"
                "Asking for Directions:\n"
                "• 'Excuse me, where is the nearest ___?'\n"
                "• Turn left · Turn right · Go straight · It's on the corner.\n"
                "• 'How far is it?' → 'About ___ blocks / minutes away.'\n\n"
                "Getting Around:\n"
                "bus (autobús) · train (tren) · taxi / Uber\n"
                "'Which bus goes to ___?' / 'Where do I get off?'\n\n"
                "💡 Practice: Role-play a shopping scenario with your tutor!"
            ),
        },
        {
            'title': 'Talking About the Past',
            'desc': 'Use simple past tense to share stories and past experiences.',
            'content': (
                "Regular Past Tense (add -ed):\n"
                "walk → walked · study → studied · play → played · watch → watched\n\n"
                "Irregular Verbs (must memorize!):\n"
                "go → went · eat → ate · see → saw · have → had\n"
                "do → did · say → said · come → came · get → got\n"
                "make → made · think → thought · know → knew\n\n"
                "Forming Past Sentences:\n"
                "(+) I went to school yesterday.\n"
                "(-) I didn't go to the store.\n"
                "(?) Did you eat breakfast? → Yes, I did. / No, I didn't.\n\n"
                "Time Expressions:\n"
                "yesterday · last week · last year · this morning\n"
                "a few days ago · when I was young\n\n"
                "Telling a Story:\n"
                "'Last weekend, I ___. Then I ___. After that, I ___. Finally, I ___.'\n\n"
                "💡 Practice: Tell your tutor about your favorite memory or a recent fun day!"
            ),
        },
    ],
    'advanced': [
        {
            'title': 'Expressing Opinions & Debate',
            'desc': 'Learn to share your point of view and engage in respectful debate.',
            'content': (
                "Expressing Opinions:\n"
                "• In my opinion, ... / I think that ... / I believe ...\n"
                "• From my perspective, ... / As I see it, ...\n"
                "• I'm convinced that ... / I strongly believe ...\n\n"
                "Agreeing:\n"
                "• I totally agree! / Absolutely! / Exactly!\n"
                "• That's a great point. / You're right about that.\n"
                "• I couldn't agree more.\n\n"
                "Disagreeing Politely:\n"
                "• I see your point, but ... / I respectfully disagree because ...\n"
                "• That's interesting, however ... / On the other hand, ...\n"
                "• With all due respect, I think ...\n\n"
                "Discussion Topics to Practice:\n"
                "• Should students have homework? Why or why not?\n"
                "• What is the most important skill for success in life?\n"
                "• Is social media good or bad for young people?\n\n"
                "💡 Practice: Pick one topic and debate it with your tutor for 5+ minutes!"
            ),
        },
        {
            'title': 'American Idioms & Expressions',
            'desc': 'Master common idioms and informal phrases used in everyday American English.',
            'content': (
                "Common American Idioms:\n"
                "'Break a leg!' → Good luck!\n"
                "'It's a piece of cake.' → It's very easy.\n"
                "'Hit the books.' → Start studying.\n"
                "'Under the weather.' → Feeling sick.\n"
                "'Cost an arm and a leg.' → Very expensive.\n"
                "'The ball is in your court.' → It's your decision/turn.\n"
                "'Once in a blue moon.' → Very rarely.\n"
                "'On the fence.' → Undecided.\n"
                "'Spill the beans.' → Tell a secret.\n\n"
                "Informal Everyday Phrases:\n"
                "'What's up?' → How are you? (informal)\n"
                "'No worries.' / 'No biggie.' → It's okay.\n"
                "'Hang out.' → Spend casual time with friends.\n"
                "'My bad.' → My mistake, I'm sorry.\n"
                "'For real?' → Are you serious?\n\n"
                "💡 Practice: Use 5 idioms from this lesson in conversation today!"
            ),
        },
        {
            'title': 'Professional English & Job Interviews',
            'desc': 'Build formal vocabulary for workplace settings and job interviews.',
            'content': (
                "Professional Vocabulary:\n"
                "resume (currículum) · cover letter (carta de presentación)\n"
                "interview (entrevista) · salary (salario) · benefits (beneficios)\n"
                "employer (empleador) · colleague (colega) · deadline (fecha límite)\n"
                "promotion (ascenso) · internship (pasantía)\n\n"
                "Common Interview Questions & Answers:\n"
                "Q: 'Tell me about yourself.'\n"
                "A: 'I am a ___ with experience in ___. I am passionate about ___...'\n\n"
                "Q: 'What are your strengths?'\n"
                "A: 'I am highly organized, a strong communicator, and work well under pressure.'\n\n"
                "Q: 'Why do you want this job?'\n"
                "A: 'I am drawn to this role because ___, and my skills in ___ would contribute greatly.'\n\n"
                "Professional Email Phrases:\n"
                "• 'I am writing to inquire about ...'\n"
                "• 'Please find attached my resume.'\n"
                "• 'I look forward to hearing from you.'\n\n"
                "💡 Practice: Do a mock job interview with your tutor — switch roles!"
            ),
        },
        {
            'title': 'Cultural Nuances: US & Latin America',
            'desc': 'Navigate cultural differences between the US and Latin America with confidence.',
            'content': (
                "Communication Styles:\n"
                "US: Direct and efficient — people get to the point quickly.\n"
                "Latin America: More relational — building trust before business is common.\n\n"
                "Time & Punctuality:\n"
                "In the US, being on time (or 5 min early) is very important.\n"
                "Lateness in professional/school settings is considered disrespectful.\n"
                "Phrase: 'I'm running a few minutes late — I'll be there by ___.\"\n\n"
                "Greetings & Personal Space:\n"
                "US: Handshake (formal) or wave (casual). Hugs for close friends only.\n"
                "Latin America: Cheek kiss or hug is common even with new people.\n\n"
                "Safe Small Talk Topics:\n"
                "✅ Weather, sports, movies, weekend plans, food, travel\n"
                "❌ Avoid at work: salary, age, politics, religion\n\n"
                "Dining Culture:\n"
                "• Tipping 15–20% at restaurants is expected.\n"
                "• 'Check, please!' asks for the bill.\n"
                "• 'Going Dutch' = splitting the bill with friends.\n"
                "• 'To go' / 'takeout' = food to eat elsewhere.\n\n"
                "💡 Practice: Tell your tutor about a cultural difference that surprised you!"
            ),
        },
    ],
}


def _seed_curriculum():
    from sqlalchemy.orm import Session as _S
    with _S(database.engine) as _db:
        admin = _db.query(models.User).filter(models.User.role == models.UserRole.admin).first()
        if not admin:
            return
        for level, lessons in _CURRICULUM_TRACKS.items():
            tag = f'[TRACK:{level}]'
            if _db.query(models.AdminLesson).filter(
                models.AdminLesson.description.like(f'{tag}%')
            ).count() > 0:
                continue
            for lesson in lessons:
                _db.add(models.AdminLesson(
                    title=lesson['title'],
                    description=f"{tag} {lesson['desc']}",
                    content=lesson['content'],
                    admin_id=admin.id,
                ))
        _db.commit()


_seed_curriculum()

router = APIRouter()


# ── Schemas ───────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: str
    full_name: str
    password: str
    role: models.UserRole
    school: Optional[str] = None
    grade: Optional[str] = None
    language: Optional[str] = 'en'

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    school: Optional[str]
    grade: Optional[str]
    bio: Optional[str]
    goals: Optional[str]
    has_photo: bool
    language: Optional[str] = 'en'
    country: Optional[str] = None
    city: Optional[str] = None
    date_of_birth: Optional[str] = None
    english_level: Optional[str] = None
    preferred_focus: Optional[str] = None
    preferred_tutor_gender: Optional[str] = None
    survey_completed: Optional[bool] = False
    state: Optional[str] = None
    spanish_level: Optional[str] = None
    availability_days: Optional[str] = None
    availability_times: Optional[str] = None
    phone: Optional[str] = None
    receive_reminders: Optional[bool] = True
    has_social_login: bool = False

class ProfileUpdate(BaseModel):
    bio: Optional[str] = None
    goals: Optional[str] = None
    school: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    grade: Optional[str] = None
    spanish_level: Optional[str] = None
    date_of_birth: Optional[str] = None
    english_level: Optional[str] = None
    preferred_focus: Optional[str] = None
    preferred_tutor_gender: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class SurveyRequest(BaseModel):
    full_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    english_level: Optional[str] = None
    goals: Optional[str] = None
    preferred_focus: Optional[str] = None
    preferred_tutor_gender: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    school: Optional[str] = None
    phone: Optional[str] = None
    receive_reminders: Optional[bool] = True

class TutorSurveyRequest(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    school: Optional[str] = None
    grade: Optional[str] = None
    spanish_level: Optional[str] = None

class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

def _user_out(user: models.User) -> UserOut:
    return UserOut(id=user.id, email=user.email, full_name=user.full_name,
                   role=user.role.value, school=user.school, grade=user.grade,
                   bio=user.bio, goals=user.goals,
                   has_photo=bool(user.profile_pic_filename),
                   language=user.language or 'en',
                   country=user.country,
                   city=user.city,
                   date_of_birth=user.date_of_birth,
                   english_level=user.english_level,
                   preferred_focus=user.preferred_focus,
                   preferred_tutor_gender=user.preferred_tutor_gender,
                   survey_completed=bool(user.survey_completed),
                   state=user.state,
                   spanish_level=user.spanish_level,
                   availability_days=user.availability_days,
                   availability_times=user.availability_times,
                   phone=user.phone,
                   receive_reminders=True if user.receive_reminders is None else bool(user.receive_reminders),
                   has_social_login=bool(user.google_id))

class LessonBody(BaseModel):
    title: str
    description: Optional[str] = None
    vocab_words: Optional[str] = None
    content: Optional[str] = None
    status: models.LessonStatus = models.LessonStatus.draft

class LessonOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    vocab_words: Optional[str]
    content: Optional[str]
    status: str
    tutor_id: int
    tutor_name: str
    created_at: str
    completion_count: int
    completed_by_me: bool

class ProgressOut(BaseModel):
    id: int
    lesson_id: int
    student_id: int
    student_name: str
    completed_at: str

class CurriculumOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    video_url: Optional[str]
    has_pdf: bool
    content: Optional[str]
    admin_id: int
    admin_name: str
    created_at: str

class StudentCurriculumLesson(BaseModel):
    id: int
    title: str
    description: Optional[str]
    content: Optional[str]
    status: str          # "to_be_scheduled" | "scheduled" | "completed"
    assignment_id: int
    lesson_number: int

class AssignmentBody(BaseModel):
    title: str
    description: Optional[str] = None
    type: models.AssignmentType
    due_date: Optional[str] = None
    student_id: Optional[int] = None   # None = all students
    curriculum_id: Optional[int] = None

class AssignmentOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    type: str
    due_date: Optional[str]
    tutor_id: int
    tutor_name: str
    student_id: Optional[int]
    curriculum_id: Optional[int]
    curriculum_title: Optional[str]
    completed_by_me: bool
    created_at: str

class MeetingBody(BaseModel):
    title: str
    scheduled_at: str     # ISO datetime string e.g. "2026-06-25T14:30"
    duration_minutes: int = 45
    meeting_url: Optional[str] = None
    student_id: int

class MeetingOut(BaseModel):
    id: int
    title: str
    scheduled_at: str
    duration_minutes: int
    meeting_url: Optional[str]
    tutor_id: int
    tutor_name: str
    student_id: int
    student_name: str
    created_at: str

class PairingOut(BaseModel):
    id: int
    tutor_id: int
    tutor_name: str
    student_id: int
    student_name: str
    created_at: str

class PairingBody(BaseModel):
    tutor_id: int
    student_id: int

class ContactRequest(BaseModel):
    email: str
    purpose: str
    message: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


# ── Helpers ───────────────────────────────────────────────────────────────────

def _require_admin(user: models.User):
    if user.role != models.UserRole.admin:
        raise HTTPException(status_code=403, detail="Admins only")

def _require_tutor(user: models.User):
    if user.role != models.UserRole.tutor:
        raise HTTPException(status_code=403, detail="Tutors only")

def _require_student(user: models.User):
    if user.role != models.UserRole.student:
        raise HTTPException(status_code=403, detail="Students only")

def _lesson_out(lesson: models.Lesson, db: Session, current_user_id: Optional[int] = None) -> LessonOut:
    tutor = db.query(models.User).filter(models.User.id == lesson.tutor_id).first()
    comp_count = db.query(models.LessonProgress).filter(models.LessonProgress.lesson_id == lesson.id).count()
    completed_by_me = False
    if current_user_id:
        completed_by_me = db.query(models.LessonProgress).filter(
            models.LessonProgress.lesson_id == lesson.id,
            models.LessonProgress.student_id == current_user_id,
        ).first() is not None
    return LessonOut(
        id=lesson.id, title=lesson.title, description=lesson.description,
        vocab_words=lesson.vocab_words, content=lesson.content,
        status=lesson.status.value, tutor_id=lesson.tutor_id,
        tutor_name=tutor.full_name if tutor else "Unknown",
        created_at=lesson.created_at.isoformat(),
        completion_count=comp_count, completed_by_me=completed_by_me,
    )

def _curriculum_out(cl: models.AdminLesson, db: Session) -> CurriculumOut:
    admin = db.query(models.User).filter(models.User.id == cl.admin_id).first()
    return CurriculumOut(
        id=cl.id, title=cl.title, description=cl.description,
        video_url=cl.video_url, has_pdf=bool(cl.pdf_filename),
        content=cl.content, admin_id=cl.admin_id,
        admin_name=admin.full_name if admin else "Unknown",
        created_at=cl.created_at.isoformat(),
    )

def _assignment_out(a: models.Assignment, db: Session, current_user_id: Optional[int] = None) -> AssignmentOut:
    tutor = db.query(models.User).filter(models.User.id == a.tutor_id).first()
    cur = db.query(models.AdminLesson).filter(models.AdminLesson.id == a.curriculum_id).first() if a.curriculum_id else None
    completed = False
    if current_user_id:
        completed = db.query(models.AssignmentCompletion).filter(
            models.AssignmentCompletion.assignment_id == a.id,
            models.AssignmentCompletion.student_id == current_user_id,
        ).first() is not None
    return AssignmentOut(
        id=a.id, title=a.title, description=a.description,
        type=a.type.value, due_date=a.due_date,
        tutor_id=a.tutor_id, tutor_name=tutor.full_name if tutor else "Unknown",
        student_id=a.student_id, curriculum_id=a.curriculum_id,
        curriculum_title=cur.title if cur else None,
        completed_by_me=completed, created_at=a.created_at.isoformat(),
    )

def _meeting_out(m: models.Meeting, db: Session) -> MeetingOut:
    tutor = db.query(models.User).filter(models.User.id == m.tutor_id).first()
    student = db.query(models.User).filter(models.User.id == m.student_id).first()
    return MeetingOut(
        id=m.id, title=m.title,
        scheduled_at=m.scheduled_at.isoformat(),
        duration_minutes=m.duration_minutes,
        meeting_url=m.meeting_url,
        tutor_id=m.tutor_id, tutor_name=tutor.full_name if tutor else "Unknown",
        student_id=m.student_id, student_name=student.full_name if student else "Unknown",
        created_at=m.created_at.isoformat(),
    )


def _send_reset_email(to_email: str, full_name: str, reset_url: str) -> None:
    import smtplib
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText

    smtp_host = os.environ.get("VP_SMTP_HOST", "")
    smtp_port = int(os.environ.get("VP_SMTP_PORT", "587"))
    smtp_user = os.environ.get("VP_SMTP_USER", "")
    smtp_pass = os.environ.get("VP_SMTP_PASS", "")
    from_email = os.environ.get("VP_FROM_EMAIL", smtp_user)

    if not smtp_host or not smtp_user:
        print(f"[DEV] Password reset link for {to_email}: {reset_url}", flush=True)
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Reset your PeerLingo password"
    msg["From"] = from_email
    msg["To"] = to_email

    text_body = (
        f"Hi {full_name},\n\n"
        f"Click the link below to reset your PeerLingo password:\n\n{reset_url}\n\n"
        f"This link expires in 1 hour. If you didn't request this, you can safely ignore this email."
    )
    html_body = f"""<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px">
      <h2 style="color:#6366f1;margin-bottom:8px">PeerLingo</h2>
      <p style="color:#374151">Hi {full_name},</p>
      <p style="color:#374151">Click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
      <a href="{reset_url}" style="display:inline-block;background:#6366f1;color:#fff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;margin:20px 0">
        Reset My Password
      </a>
      <p style="color:#9ca3af;font-size:13px">If you didn't request a password reset, you can safely ignore this email.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
      <p style="color:#9ca3af;font-size:12px">PeerLingo · Free peer tutoring across borders</p>
    </div>"""

    msg.attach(MIMEText(text_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(from_email, to_email, msg.as_string())
    except Exception as exc:
        print(f"[ERROR] Failed to send reset email to {to_email}: {exc}", flush=True)


# ── Auth ──────────────────────────────────────────────────────────────────────

_admin_emails_env = os.environ.get("VP_ADMIN_EMAILS", "")
ADMIN_GMAIL_WHITELIST = {e.strip().lower() for e in _admin_emails_env.split(",") if e.strip()}

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")

class GoogleOAuthRequest(BaseModel):
    credential: str
    role: Optional[models.UserRole] = None

@router.post("/api/auth/register", response_model=AuthResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    email_lower = req.email.lower()
    if req.role == models.UserRole.admin and email_lower.endswith("@gmail.com") and email_lower not in ADMIN_GMAIL_WHITELIST:
        raise HTTPException(status_code=403, detail="This email is not authorized to create an admin account")
    existing = db.query(models.User).filter(models.User.email == req.email).first()
    if existing:
        if existing.role != req.role:
            raise HTTPException(status_code=409, detail="This email is already registered as a different account type. Please sign in instead.")
        raise HTTPException(status_code=400, detail="Email already registered")
    user = models.User(email=req.email, full_name=req.full_name,
                       hashed_password=hash_password(req.password),
                       role=req.role, school=req.school, grade=req.grade,
                       language=req.language or 'en')
    db.add(user); db.commit(); db.refresh(user)
    return AuthResponse(access_token=create_access_token(user.id),
                        token_type="bearer", user=_user_out(user))

@router.post("/api/dev/ensure-accounts")
def dev_ensure_accounts(db: Session = Depends(get_db)):
    # Blocked in production (when VP_SECRET_KEY env var is set)
    if os.environ.get("VP_SECRET_KEY"):
        raise HTTPException(status_code=404, detail="Not found")
    _DEV_ACCOUNTS = [
        dict(email="admin@test.com", full_name="Alex Rivera", role=models.UserRole.admin, school="Virtual Peers HQ", grade=None),
        dict(email="tutor@test.com", full_name="Jamie Chen", role=models.UserRole.tutor, school="New Jersey High School", grade="11th Grade"),
        dict(email="student@test.com", full_name="Maria Flores", role=models.UserRole.student, school="Peru School", grade="4th Grade"),
    ]
    result = {}
    for acct in _DEV_ACCOUNTS:
        user = db.query(models.User).filter(models.User.email == acct["email"]).first()
        if user:
            user.hashed_password = hash_password("testpass")
            db.commit()
            db.refresh(user)
        else:
            user = models.User(
                email=acct["email"], full_name=acct["full_name"],
                hashed_password=hash_password("testpass"),
                role=acct["role"], school=acct["school"],
                grade=acct["grade"], language="en",
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        result[user.role.value] = {
            "token": create_access_token(user.id),
            "user": _user_out(user).model_dump(),
        }
    return result

@router.post("/api/dev/reset-for-registration")
def dev_reset_for_registration(role: str, db: Session = Depends(get_db)):
    """Wipe survey/profile data for a test account so registration flow can be re-tested."""
    if os.environ.get("VP_SECRET_KEY"):
        raise HTTPException(status_code=404, detail="Not found")
    email_map = {"student": "student@test.com", "tutor": "tutor@test.com"}
    email = email_map.get(role)
    if not email:
        raise HTTPException(status_code=400, detail="role must be 'student' or 'tutor'")
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Test account not found — run ensure-accounts first")
    # Wipe all survey + profile fields that registration/survey flow fills in
    user.survey_completed     = False
    user.bio                  = None
    user.goals                = None
    user.school               = None
    user.city                 = None
    user.state                = None
    user.country              = None
    user.grade                = None
    user.spanish_level        = None
    user.availability_days    = None
    user.availability_times   = None
    user.date_of_birth        = None
    user.english_level        = None
    user.preferred_focus      = None
    user.preferred_tutor_gender = None
    user.phone                  = None
    user.receive_reminders      = True
    if role == "student":
        # Remove auto-assigned curriculum progress and assignments
        db.query(models.VPStudentProgress).filter(
            models.VPStudentProgress.student_id == user.id
        ).delete()
        db.query(models.Assignment).filter(
            models.Assignment.student_id == user.id
        ).delete()
    db.commit()
    db.refresh(user)
    return {"ok": True, "user": _user_out(user).model_dump(), "token": create_access_token(user.id)}


@router.post("/api/auth/login", response_model=AuthResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return AuthResponse(access_token=create_access_token(user.id),
                        token_type="bearer", user=_user_out(user))

@router.post("/api/auth/google")
def google_auth(req: GoogleOAuthRequest, db: Session = Depends(get_db)):
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=503, detail="Google OAuth is not configured on this server")
    try:
        import urllib.request, json as _json
        url = f"https://oauth2.googleapis.com/tokeninfo?id_token={req.credential}"
        with urllib.request.urlopen(url, timeout=5) as resp:
            idinfo = _json.loads(resp.read())
        if idinfo.get("aud") != GOOGLE_CLIENT_ID:
            raise ValueError("Wrong audience")
        if idinfo.get("email_verified") != "true":
            raise ValueError("Email not verified")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google credential")

    email = idinfo["email"]
    full_name = idinfo.get("name", email.split("@")[0])
    google_id = idinfo["sub"]

    existing = db.query(models.User).filter(models.User.email == email).first()
    if existing:
        if req.role and existing.role != req.role:
            raise HTTPException(status_code=409, detail="This Google account is already registered as a different account type.")
        return AuthResponse(access_token=create_access_token(existing.id), token_type="bearer", user=_user_out(existing))

    if not req.role:
        from fastapi.responses import JSONResponse
        return JSONResponse({"needs_role": True, "email": email, "full_name": full_name})

    gmail_lower = email.lower()
    if req.role == models.UserRole.admin and gmail_lower.endswith("@gmail.com") and gmail_lower not in ADMIN_GMAIL_WHITELIST:
        raise HTTPException(status_code=403, detail="Not authorized to create an admin account")

    new_user = models.User(
        email=email, full_name=full_name, hashed_password="",
        role=req.role, language='es' if req.role == models.UserRole.student else 'en',
        google_id=google_id,
    )
    db.add(new_user); db.commit(); db.refresh(new_user)
    return AuthResponse(access_token=create_access_token(new_user.id), token_type="bearer", user=_user_out(new_user))

@router.post("/api/auth/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    import secrets
    from datetime import timedelta
    user = db.query(models.User).filter(models.User.email == req.email.strip().lower()).first()
    if not user:
        return {"ok": True}  # Don't reveal whether email exists

    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=1)
    reset_token = models.PasswordResetToken(user_id=user.id, token=token, expires_at=expires_at, used=False)
    db.add(reset_token)
    db.commit()

    app_url = os.environ.get("VP_APP_URL", "http://localhost:5177")
    reset_url = f"{app_url}/reset-password?token={token}"
    _send_reset_email(user.email, user.full_name, reset_url)
    return {"ok": True}


@router.post("/api/auth/reset-password")
def reset_password_endpoint(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    if len(req.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    reset_token = db.query(models.PasswordResetToken).filter(
        models.PasswordResetToken.token == req.token,
        models.PasswordResetToken.used == False,
        models.PasswordResetToken.expires_at > datetime.utcnow(),
    ).first()
    if not reset_token:
        raise HTTPException(status_code=400, detail="Invalid or expired reset link. Please request a new one.")
    user = db.query(models.User).filter(models.User.id == reset_token.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.hashed_password = hash_password(req.new_password)
    reset_token.used = True
    db.commit()
    return {"ok": True}


@router.post("/api/contact")
def submit_contact(req: ContactRequest, db: Session = Depends(get_db)):
    if len(req.message) > 512:
        raise HTTPException(status_code=400, detail="Message too long")
    if not req.email or "@" not in req.email:
        raise HTTPException(status_code=400, detail="Invalid email")
    msg = models.ContactMessage(email=req.email.strip(), purpose=req.purpose.strip(), message=req.message.strip())
    db.add(msg)
    db.commit()
    return {"ok": True}

@router.get("/api/auth/me", response_model=UserOut)
def get_me(current_user: models.User = Depends(get_current_user)):
    return _user_out(current_user)

@router.patch("/api/auth/profile", response_model=UserOut)
def update_profile(body: ProfileUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if body.bio is not None:
        current_user.bio = body.bio
    if body.goals is not None:
        current_user.goals = body.goals
    if body.school is not None:
        current_user.school = body.school
    if body.city is not None:
        current_user.city = body.city
    if body.state is not None:
        current_user.state = body.state
    if body.country is not None:
        current_user.country = body.country
    if body.grade is not None:
        current_user.grade = body.grade
    if body.spanish_level is not None:
        current_user.spanish_level = body.spanish_level
    if body.date_of_birth is not None:
        current_user.date_of_birth = body.date_of_birth
    if body.english_level is not None:
        current_user.english_level = body.english_level
    if body.preferred_focus is not None:
        current_user.preferred_focus = body.preferred_focus
    if body.preferred_tutor_gender is not None:
        current_user.preferred_tutor_gender = body.preferred_tutor_gender
    db.commit(); db.refresh(current_user)
    return _user_out(current_user)

@router.post("/api/auth/change-password")
def change_password(body: ChangePasswordRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.google_id:
        raise HTTPException(status_code=400, detail="Social login accounts cannot change password here")
    if len(body.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")
    if not verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    current_user.hashed_password = hash_password(body.new_password)
    db.commit()
    return {"ok": True}

@router.put("/api/profile/survey", response_model=UserOut)
def submit_survey(body: SurveyRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_student(current_user)
    if body.full_name and body.full_name.strip():
        current_user.full_name = body.full_name.strip()
    if body.date_of_birth is not None:
        current_user.date_of_birth = body.date_of_birth
    if body.english_level is not None:
        current_user.english_level = body.english_level
    if body.goals is not None:
        current_user.goals = body.goals
    if body.preferred_focus is not None:
        current_user.preferred_focus = body.preferred_focus
    if body.preferred_tutor_gender is not None:
        current_user.preferred_tutor_gender = body.preferred_tutor_gender
    if body.country is not None:
        current_user.country = body.country
    if body.city is not None:
        current_user.city = body.city
    if body.school is not None:
        current_user.school = body.school
    if body.phone is not None:
        current_user.phone = body.phone
    if body.receive_reminders is not None:
        current_user.receive_reminders = body.receive_reminders
    current_user.survey_completed = True
    db.commit()
    db.refresh(current_user)

    # Auto-assign curriculum based on english_level (idempotent)
    if current_user.english_level:
        already_enrolled = db.query(models.VPStudentProgress).filter(
            models.VPStudentProgress.student_id == current_user.id
        ).first()
        if not already_enrolled:
            curriculum = db.query(models.VPCurriculum).filter(
                models.VPCurriculum.level == current_user.english_level
            ).first()
            if curriculum:
                db.add(models.VPStudentProgress(
                    student_id=current_user.id,
                    curriculum_id=curriculum.id,
                    current_lesson_number=1,
                ))
                db.commit()

    # Send welcome message from first admin on first survey completion
    admin = db.query(models.User).filter(models.User.role == models.UserRole.admin).first()
    if admin:
        first_name = current_user.full_name.split()[0] if current_user.full_name else 'Estudiante'
        welcome_text = (
            f"¡Hola {first_name}! 🌟\n\n"
            "Me llamo Ethan Isenberg, fundador y creador de PeerLingo. "
            "En nombre de todo el equipo, ¡bienvenido/a a nuestra familia!\n\n"
            "Estamos muy emocionados de que hayas dado este gran paso. "
            "Muy pronto te emparejaremos con un tutor que se adapte perfectamente a tus preferencias y objetivos. "
            "Nuestro proceso de emparejamiento tiene en cuenta tu nivel de inglés, tus metas y tus preferencias personales para encontrar el tutor ideal para ti.\n\n"
            "Esta es una oportunidad increíble. El inglés puede abrir puertas que antes parecían imposibles — "
            "nuevos empleos, nuevas culturas, nuevas amistades y un futuro lleno de posibilidades. "
            "Nos emociona mucho ser parte de este camino contigo. 💪\n\n"
            "Si tienes alguna pregunta, no dudes en escribirme aquí. Estamos contigo en cada paso del camino.\n\n"
            "¡Mucho ánimo y bienvenido/a a esta aventura!\n\n"
            "Con entusiasmo,\n"
            "Ethan Isenberg\n"
            "Fundador, PeerLingo"
        )
        welcome_msg = models.ChatMessage(
            sender_id=admin.id,
            receiver_id=current_user.id,
            content=welcome_text,
        )
        db.add(welcome_msg)
        db.commit()

    return _user_out(current_user)

# ── Curriculum endpoints ───────────────────────────────────────────────────────

@router.get("/api/curriculum/by-level/{level}")
def get_curriculum_by_level(level: str, db: Session = Depends(get_db)):
    """Public — no auth required. Returns full curriculum + lessons + homework for a level."""
    if level not in ('beginner', 'intermediate', 'advanced'):
        raise HTTPException(status_code=400, detail="level must be beginner, intermediate, or advanced")
    curriculum = db.query(models.VPCurriculum).filter(models.VPCurriculum.level == level).first()
    if not curriculum:
        return {"enrolled": False, "lessons": []}
    lessons = db.query(models.VPCurriculumLesson).filter(
        models.VPCurriculumLesson.curriculum_id == curriculum.id
    ).order_by(models.VPCurriculumLesson.lesson_number).all()
    lessons_out = []
    for lesson in lessons:
        hw = db.query(models.VPHomeworkAssignment).filter(
            models.VPHomeworkAssignment.lesson_id == lesson.id
        ).first()
        lessons_out.append({
            "id": lesson.id,
            "lesson_number": lesson.lesson_number,
            "title": lesson.title,
            "outline": lesson.outline,
            "outline_es": lesson.outline_es,
            "vocabulary": hw.vocabulary if hw else "[]",
            "expressions": hw.expressions if hw else "[]",
        })
    return {
        "curriculum": {
            "id": curriculum.id,
            "title": curriculum.title,
            "level": curriculum.level,
            "description": curriculum.description,
        },
        "lessons": lessons_out,
    }

@router.get("/api/curriculum/mine")
def get_my_curriculum(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_student(current_user)
    progress = db.query(models.VPStudentProgress).filter(
        models.VPStudentProgress.student_id == current_user.id
    ).first()
    if not progress:
        return {"enrolled": False}
    curriculum = db.query(models.VPCurriculum).filter(
        models.VPCurriculum.id == progress.curriculum_id
    ).first()
    lessons = db.query(models.VPCurriculumLesson).filter(
        models.VPCurriculumLesson.curriculum_id == curriculum.id
    ).order_by(models.VPCurriculumLesson.lesson_number).all()
    lessons_out = []
    for lesson in lessons:
        hw = db.query(models.VPHomeworkAssignment).filter(
            models.VPHomeworkAssignment.lesson_id == lesson.id
        ).first()
        lessons_out.append({
            "id": lesson.id,
            "lesson_number": lesson.lesson_number,
            "title": lesson.title,
            "outline": lesson.outline,
            "outline_es": lesson.outline_es,
            "vocabulary": hw.vocabulary if hw else "[]",
            "expressions": hw.expressions if hw else "[]",
        })
    return {
        "enrolled": True,
        "curriculum": {
            "id": curriculum.id,
            "title": curriculum.title,
            "level": curriculum.level,
            "description": curriculum.description,
        },
        "current_lesson_number": progress.current_lesson_number,
        "lessons": lessons_out,
    }

@router.post("/api/curriculum/advance")
def advance_lesson(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_student(current_user)
    progress = db.query(models.VPStudentProgress).filter(
        models.VPStudentProgress.student_id == current_user.id
    ).first()
    if not progress:
        raise HTTPException(status_code=404, detail="No curriculum enrolled")
    total = db.query(models.VPCurriculumLesson).filter(
        models.VPCurriculumLesson.curriculum_id == progress.curriculum_id
    ).count()
    if progress.current_lesson_number < total:
        progress.current_lesson_number += 1
        if progress.current_lesson_number == total:
            progress.completed_at = datetime.utcnow()
        db.commit()
    return {"current_lesson_number": progress.current_lesson_number}

@router.put("/api/profile/tutor-survey", response_model=UserOut)
def submit_tutor_survey(body: TutorSurveyRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_tutor(current_user)
    if body.full_name and body.full_name.strip():
        current_user.full_name = body.full_name.strip()
    if body.bio is not None:
        current_user.bio = body.bio
    if body.city is not None:
        current_user.city = body.city
    if body.state is not None:
        current_user.state = body.state
    if body.school is not None:
        current_user.school = body.school
    if body.grade is not None:
        current_user.grade = body.grade
    if body.spanish_level is not None:
        current_user.spanish_level = body.spanish_level
    current_user.survey_completed = True
    db.commit()
    db.refresh(current_user)
    return _user_out(current_user)

class AvailabilityUpdate(BaseModel):
    days: list[str] = []
    blocks: list[str] = []

@router.put("/api/profile/availability", response_model=UserOut)
def update_availability(body: AvailabilityUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.availability_days = ','.join(body.days) if body.days else None
    current_user.availability_times = ','.join(body.blocks) if body.blocks else None
    db.commit(); db.refresh(current_user)
    return _user_out(current_user)

class LanguageUpdate(BaseModel):
    language: str

@router.patch("/api/auth/language", response_model=UserOut)
def update_language(body: LanguageUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if body.language not in ('en', 'es'):
        raise HTTPException(status_code=400, detail="language must be 'en' or 'es'")
    current_user.language = body.language
    db.commit(); db.refresh(current_user)
    return _user_out(current_user)

@router.post("/api/auth/profile/photo", response_model=UserOut)
async def upload_profile_photo(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Only image files are accepted")
    if current_user.profile_pic_filename:
        old_path = os.path.join(UPLOAD_DIR, current_user.profile_pic_filename)
        if os.path.exists(old_path):
            os.remove(old_path)
    ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else 'jpg'
    safe_name = f"profile_{current_user.id}_{int(datetime.utcnow().timestamp())}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, safe_name)
    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)
    current_user.profile_pic_filename = safe_name
    db.commit(); db.refresh(current_user)
    return _user_out(current_user)

@router.get("/api/users/{user_id}/photo")
def get_profile_photo(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user or not user.profile_pic_filename:
        raise HTTPException(status_code=404, detail="No photo")
    filepath = os.path.join(UPLOAD_DIR, user.profile_pic_filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(filepath)


# ── Users ─────────────────────────────────────────────────────────────────────

@router.get("/api/users/students", response_model=list[UserOut])
def list_students(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in (models.UserRole.tutor, models.UserRole.admin):
        raise HTTPException(status_code=403, detail="Tutors and admins only")
    if current_user.role == models.UserRole.tutor:
        pairings = db.query(models.TutorStudentPairing).filter(
            models.TutorStudentPairing.tutor_id == current_user.id
        ).all()
        student_ids = [p.student_id for p in pairings]
        if not student_ids:
            return []
        rows = db.query(models.User).filter(models.User.id.in_(student_ids)).all()
    else:
        rows = db.query(models.User).filter(models.User.role == models.UserRole.student).all()
    return [_user_out(u) for u in rows]

@router.get("/api/users/tutors", response_model=list[UserOut])
def list_tutors(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_admin(current_user)
    rows = db.query(models.User).filter(models.User.role == models.UserRole.tutor).all()
    return [_user_out(u) for u in rows]

@router.get("/api/users/my-tutor", response_model=UserOut)
def get_my_tutor(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_student(current_user)
    pairing = db.query(models.TutorStudentPairing).filter(
        models.TutorStudentPairing.student_id == current_user.id
    ).first()
    if not pairing:
        raise HTTPException(status_code=404, detail="No tutor assigned yet")
    tutor = db.query(models.User).filter(models.User.id == pairing.tutor_id).first()
    if not tutor:
        raise HTTPException(status_code=404, detail="Tutor not found")
    return _user_out(tutor)


# ── Tutor Lessons (existing) ──────────────────────────────────────────────────

@router.get("/api/lessons", response_model=list[LessonOut])
def list_lessons(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == models.UserRole.tutor:
        rows = (db.query(models.Lesson)
                .filter(models.Lesson.tutor_id == current_user.id)
                .order_by(models.Lesson.created_at.desc()).all())
        return [_lesson_out(l, db) for l in rows]
    rows = (db.query(models.Lesson)
            .filter(models.Lesson.status == models.LessonStatus.active)
            .order_by(models.Lesson.created_at.desc()).all())
    return [_lesson_out(l, db, current_user.id) for l in rows]

@router.post("/api/lessons", response_model=LessonOut, status_code=201)
def create_lesson(body: LessonBody, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_tutor(current_user)
    lesson = models.Lesson(title=body.title, description=body.description,
                           vocab_words=body.vocab_words, content=body.content,
                           status=body.status, tutor_id=current_user.id)
    db.add(lesson); db.commit(); db.refresh(lesson)
    return _lesson_out(lesson, db)

@router.get("/api/lessons/{lesson_id}", response_model=LessonOut)
def get_lesson(lesson_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    student_id = current_user.id if current_user.role == models.UserRole.student else None
    return _lesson_out(lesson, db, student_id)

@router.patch("/api/lessons/{lesson_id}", response_model=LessonOut)
def update_lesson(lesson_id: int, body: LessonBody, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_tutor(current_user)
    lesson = db.query(models.Lesson).filter(
        models.Lesson.id == lesson_id, models.Lesson.tutor_id == current_user.id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    lesson.title = body.title; lesson.description = body.description
    lesson.vocab_words = body.vocab_words; lesson.content = body.content
    lesson.status = body.status
    db.commit(); db.refresh(lesson)
    return _lesson_out(lesson, db)

@router.delete("/api/lessons/{lesson_id}", status_code=204)
def delete_lesson(lesson_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_tutor(current_user)
    lesson = db.query(models.Lesson).filter(
        models.Lesson.id == lesson_id, models.Lesson.tutor_id == current_user.id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    db.delete(lesson); db.commit()

@router.get("/api/lessons/{lesson_id}/progress", response_model=list[ProgressOut])
def get_lesson_progress(lesson_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_tutor(current_user)
    rows = (db.query(models.LessonProgress)
            .filter(models.LessonProgress.lesson_id == lesson_id)
            .order_by(models.LessonProgress.completed_at.desc()).all())
    result = []
    for p in rows:
        s = db.query(models.User).filter(models.User.id == p.student_id).first()
        result.append(ProgressOut(id=p.id, lesson_id=p.lesson_id, student_id=p.student_id,
                                  student_name=s.full_name if s else "Unknown",
                                  completed_at=p.completed_at.isoformat()))
    return result

@router.post("/api/lessons/{lesson_id}/complete", response_model=ProgressOut, status_code=201)
def mark_lesson_complete(lesson_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_student(current_user)
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    existing = db.query(models.LessonProgress).filter(
        models.LessonProgress.lesson_id == lesson_id,
        models.LessonProgress.student_id == current_user.id).first()
    if existing:
        return ProgressOut(id=existing.id, lesson_id=existing.lesson_id,
                           student_id=existing.student_id, student_name=current_user.full_name,
                           completed_at=existing.completed_at.isoformat())
    progress = models.LessonProgress(lesson_id=lesson_id, student_id=current_user.id)
    db.add(progress); db.commit(); db.refresh(progress)
    return ProgressOut(id=progress.id, lesson_id=progress.lesson_id,
                       student_id=progress.student_id, student_name=current_user.full_name,
                       completed_at=progress.completed_at.isoformat())

@router.delete("/api/lessons/{lesson_id}/complete", status_code=204)
def unmark_lesson_complete(lesson_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_student(current_user)
    existing = db.query(models.LessonProgress).filter(
        models.LessonProgress.lesson_id == lesson_id,
        models.LessonProgress.student_id == current_user.id).first()
    if existing:
        db.delete(existing); db.commit()


# ── Student curriculum lessons ────────────────────────────────────────────────

@router.get("/api/curriculum/my-lessons", response_model=list[StudentCurriculumLesson])
def get_my_curriculum_lessons(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_student(current_user)
    assignments = (
        db.query(models.Assignment)
        .filter(
            models.Assignment.student_id == current_user.id,
            models.Assignment.curriculum_id.isnot(None),
        )
        .order_by(models.Assignment.id)
        .all()
    )
    completed_ids = {
        c.assignment_id for c in
        db.query(models.AssignmentCompletion)
        .filter(models.AssignmentCompletion.student_id == current_user.id)
        .all()
    }
    has_future_meeting = db.query(models.Meeting).filter(
        models.Meeting.student_id == current_user.id,
        models.Meeting.scheduled_at > datetime.utcnow(),
    ).count() > 0

    results = []
    for i, a in enumerate(assignments, start=1):
        cl = db.query(models.AdminLesson).filter(models.AdminLesson.id == a.curriculum_id).first()
        if not cl:
            continue
        if a.id in completed_ids:
            status = "completed"
        elif has_future_meeting:
            status = "scheduled"
        else:
            status = "to_be_scheduled"
        desc = cl.description or ''
        if '] ' in desc:
            desc = desc.split('] ', 1)[1]
        results.append(StudentCurriculumLesson(
            id=cl.id,
            title=cl.title,
            description=desc,
            content=cl.content,
            status=status,
            assignment_id=a.id,
            lesson_number=i,
        ))
    return results


# ── Admin Curriculum ──────────────────────────────────────────────────────────

@router.get("/api/curriculum", response_model=list[CurriculumOut])
def list_curriculum(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.query(models.AdminLesson).order_by(models.AdminLesson.created_at.desc()).all()
    return [_curriculum_out(cl, db) for cl in rows]

@router.get("/api/curriculum/{cl_id}", response_model=CurriculumOut)
def get_curriculum_item(cl_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    cl = db.query(models.AdminLesson).filter(models.AdminLesson.id == cl_id).first()
    if not cl:
        raise HTTPException(status_code=404, detail="Curriculum item not found")
    return _curriculum_out(cl, db)

@router.post("/api/curriculum", response_model=CurriculumOut, status_code=201)
def create_curriculum(body: dict, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_admin(current_user)
    cl = models.AdminLesson(
        title=body.get("title"), description=body.get("description"),
        video_url=body.get("video_url"), content=body.get("content"),
        admin_id=current_user.id,
    )
    db.add(cl); db.commit(); db.refresh(cl)
    return _curriculum_out(cl, db)

@router.patch("/api/curriculum/{cl_id}", response_model=CurriculumOut)
def update_curriculum(cl_id: int, body: dict, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_admin(current_user)
    cl = db.query(models.AdminLesson).filter(models.AdminLesson.id == cl_id).first()
    if not cl:
        raise HTTPException(status_code=404, detail="Curriculum item not found")
    cl.title = body.get("title", cl.title)
    cl.description = body.get("description", cl.description)
    cl.video_url = body.get("video_url", cl.video_url)
    cl.content = body.get("content", cl.content)
    db.commit(); db.refresh(cl)
    return _curriculum_out(cl, db)

@router.delete("/api/curriculum/{cl_id}", status_code=204)
def delete_curriculum(cl_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_admin(current_user)
    cl = db.query(models.AdminLesson).filter(models.AdminLesson.id == cl_id).first()
    if not cl:
        raise HTTPException(status_code=404, detail="Curriculum item not found")
    if cl.pdf_filename:
        filepath = os.path.join(UPLOAD_DIR, cl.pdf_filename)
        if os.path.exists(filepath):
            os.remove(filepath)
    db.delete(cl); db.commit()

@router.post("/api/curriculum/{cl_id}/pdf", response_model=CurriculumOut)
async def upload_pdf(
    cl_id: int,
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _require_admin(current_user)
    cl = db.query(models.AdminLesson).filter(models.AdminLesson.id == cl_id).first()
    if not cl:
        raise HTTPException(status_code=404, detail="Curriculum item not found")
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    # Remove old PDF if present
    if cl.pdf_filename:
        old_path = os.path.join(UPLOAD_DIR, cl.pdf_filename)
        if os.path.exists(old_path):
            os.remove(old_path)
    safe_name = f"cl{cl_id}_{int(datetime.utcnow().timestamp())}_{file.filename}"
    filepath = os.path.join(UPLOAD_DIR, safe_name)
    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)
    cl.pdf_filename = safe_name
    db.commit(); db.refresh(cl)
    return _curriculum_out(cl, db)

@router.get("/api/curriculum/{cl_id}/pdf")
def download_pdf(cl_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    cl = db.query(models.AdminLesson).filter(models.AdminLesson.id == cl_id).first()
    if not cl or not cl.pdf_filename:
        raise HTTPException(status_code=404, detail="No PDF for this lesson")
    filepath = os.path.join(UPLOAD_DIR, cl.pdf_filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found on disk")
    # Strip timestamp prefix for the download filename
    parts = cl.pdf_filename.split("_", 2)
    display_name = parts[2] if len(parts) == 3 else cl.pdf_filename
    return FileResponse(filepath, media_type="application/pdf", filename=display_name)


# ── Assignments ───────────────────────────────────────────────────────────────

@router.get("/api/assignments", response_model=list[AssignmentOut])
def list_assignments(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == models.UserRole.tutor:
        rows = (db.query(models.Assignment)
                .filter(models.Assignment.tutor_id == current_user.id)
                .order_by(models.Assignment.created_at.desc()).all())
        return [_assignment_out(a, db) for a in rows]
    if current_user.role == models.UserRole.student:
        rows = (db.query(models.Assignment)
                .filter(or_(models.Assignment.student_id == current_user.id,
                            models.Assignment.student_id == None))
                .order_by(models.Assignment.created_at.desc()).all())
        return [_assignment_out(a, db, current_user.id) for a in rows]
    # admin sees all
    rows = db.query(models.Assignment).order_by(models.Assignment.created_at.desc()).all()
    return [_assignment_out(a, db) for a in rows]

@router.post("/api/assignments", response_model=AssignmentOut, status_code=201)
def create_assignment(body: AssignmentBody, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_tutor(current_user)
    a = models.Assignment(
        title=body.title, description=body.description,
        type=body.type, due_date=body.due_date,
        tutor_id=current_user.id, student_id=body.student_id,
        curriculum_id=body.curriculum_id,
    )
    db.add(a); db.commit(); db.refresh(a)
    return _assignment_out(a, db)

@router.delete("/api/assignments/{assignment_id}", status_code=204)
def delete_assignment(assignment_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_tutor(current_user)
    a = db.query(models.Assignment).filter(
        models.Assignment.id == assignment_id,
        models.Assignment.tutor_id == current_user.id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Assignment not found")
    db.delete(a); db.commit()

@router.post("/api/assignments/{assignment_id}/complete", status_code=201)
def complete_assignment(assignment_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_student(current_user)
    existing = db.query(models.AssignmentCompletion).filter(
        models.AssignmentCompletion.assignment_id == assignment_id,
        models.AssignmentCompletion.student_id == current_user.id).first()
    if existing:
        return {"status": "already_complete"}
    comp = models.AssignmentCompletion(assignment_id=assignment_id, student_id=current_user.id)
    db.add(comp); db.commit()
    return {"status": "complete"}

@router.delete("/api/assignments/{assignment_id}/complete", status_code=204)
def uncomplete_assignment(assignment_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_student(current_user)
    existing = db.query(models.AssignmentCompletion).filter(
        models.AssignmentCompletion.assignment_id == assignment_id,
        models.AssignmentCompletion.student_id == current_user.id).first()
    if existing:
        db.delete(existing); db.commit()


# ── Meetings ──────────────────────────────────────────────────────────────────

@router.get("/api/meetings", response_model=list[MeetingOut])
def list_meetings(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == models.UserRole.tutor:
        rows = (db.query(models.Meeting)
                .filter(models.Meeting.tutor_id == current_user.id)
                .order_by(models.Meeting.scheduled_at).all())
    elif current_user.role == models.UserRole.student:
        rows = (db.query(models.Meeting)
                .filter(models.Meeting.student_id == current_user.id)
                .order_by(models.Meeting.scheduled_at).all())
    else:
        rows = db.query(models.Meeting).order_by(models.Meeting.scheduled_at).all()
    return [_meeting_out(m, db) for m in rows]

@router.post("/api/meetings", response_model=MeetingOut, status_code=201)
def create_meeting(body: MeetingBody, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_tutor(current_user)
    try:
        scheduled = datetime.fromisoformat(body.scheduled_at)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid datetime format")
    m = models.Meeting(
        title=body.title, scheduled_at=scheduled,
        duration_minutes=body.duration_minutes, meeting_url=body.meeting_url,
        tutor_id=current_user.id, student_id=body.student_id,
    )
    db.add(m); db.commit(); db.refresh(m)
    return _meeting_out(m, db)

@router.delete("/api/meetings/{meeting_id}", status_code=204)
def delete_meeting(meeting_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_tutor(current_user)
    m = db.query(models.Meeting).filter(
        models.Meeting.id == meeting_id,
        models.Meeting.tutor_id == current_user.id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Meeting not found")
    db.delete(m); db.commit()


# ── Pairings ──────────────────────────────────────────────────────────────────

def _pairing_out(p: models.TutorStudentPairing, db: Session) -> PairingOut:
    tutor = db.query(models.User).filter(models.User.id == p.tutor_id).first()
    student = db.query(models.User).filter(models.User.id == p.student_id).first()
    return PairingOut(
        id=p.id, tutor_id=p.tutor_id,
        tutor_name=tutor.full_name if tutor else "Unknown",
        student_id=p.student_id,
        student_name=student.full_name if student else "Unknown",
        created_at=p.created_at.isoformat(),
    )

@router.get("/api/admin/pairings", response_model=list[PairingOut])
def list_pairings(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_admin(current_user)
    rows = db.query(models.TutorStudentPairing).order_by(models.TutorStudentPairing.created_at.desc()).all()
    return [_pairing_out(p, db) for p in rows]

@router.post("/api/admin/pairings", response_model=PairingOut, status_code=201)
def create_pairing(body: PairingBody, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_admin(current_user)
    existing = db.query(models.TutorStudentPairing).filter(
        models.TutorStudentPairing.tutor_id == body.tutor_id,
        models.TutorStudentPairing.student_id == body.student_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="This pairing already exists")
    pairing = models.TutorStudentPairing(tutor_id=body.tutor_id, student_id=body.student_id)
    db.add(pairing); db.commit(); db.refresh(pairing)
    return _pairing_out(pairing, db)

@router.delete("/api/admin/pairings/{pairing_id}", status_code=204)
def delete_pairing(pairing_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_admin(current_user)
    pairing = db.query(models.TutorStudentPairing).filter(models.TutorStudentPairing.id == pairing_id).first()
    if not pairing:
        raise HTTPException(status_code=404, detail="Pairing not found")
    db.delete(pairing); db.commit()


# ── Admin User Management ──────────────────────────────────────────────────────

@router.delete("/api/admin/users/{user_id}", status_code=204)
def delete_user(user_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_admin(current_user)
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role == models.UserRole.admin:
        raise HTTPException(status_code=403, detail="Cannot delete admin accounts")
    if user.id == current_user.id:
        raise HTTPException(status_code=403, detail="Cannot delete your own account")
    db.query(models.TutorStudentPairing).filter(
        or_(models.TutorStudentPairing.tutor_id == user_id,
            models.TutorStudentPairing.student_id == user_id)
    ).delete(synchronize_session=False)
    if user.role == models.UserRole.tutor:
        db.query(models.Assignment).filter(models.Assignment.tutor_id == user_id).delete(synchronize_session=False)
        db.query(models.Meeting).filter(models.Meeting.tutor_id == user_id).delete(synchronize_session=False)
        db.query(models.Lesson).filter(models.Lesson.tutor_id == user_id).delete(synchronize_session=False)
    else:
        db.query(models.AssignmentCompletion).filter(models.AssignmentCompletion.student_id == user_id).delete(synchronize_session=False)
        db.query(models.LessonProgress).filter(models.LessonProgress.student_id == user_id).delete(synchronize_session=False)
    db.delete(user)
    db.commit()

@router.get("/api/admin/stats")
def get_admin_stats(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_admin(current_user)
    return {
        "tutors":      db.query(models.User).filter(models.User.role == models.UserRole.tutor).count(),
        "students":    db.query(models.User).filter(models.User.role == models.UserRole.student).count(),
        "pairings":    db.query(models.TutorStudentPairing).count(),
        "curriculum":  db.query(models.AdminLesson).count(),
        "assignments": db.query(models.Assignment).count(),
        "meetings":    db.query(models.Meeting).count(),
        "completions": db.query(models.AssignmentCompletion).count(),
    }


# ── Chat ──────────────────────────────────────────────────────────────────────

class MessageBody(BaseModel):
    content: str

class MessageOut(BaseModel):
    id: int
    sender_id: int
    sender_name: str
    receiver_id: int
    content: str
    created_at: str

def _message_out(msg: models.ChatMessage, db: Session) -> MessageOut:
    sender = db.query(models.User).filter(models.User.id == msg.sender_id).first()
    return MessageOut(
        id=msg.id,
        sender_id=msg.sender_id,
        sender_name=sender.full_name if sender else "Unknown",
        receiver_id=msg.receiver_id,
        content=msg.content,
        created_at=msg.created_at.isoformat(),
    )

@router.get("/api/chat/{other_user_id}", response_model=list[MessageOut])
def get_messages(other_user_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = (db.query(models.ChatMessage)
            .filter(or_(
                and_(models.ChatMessage.sender_id == current_user.id,
                     models.ChatMessage.receiver_id == other_user_id),
                and_(models.ChatMessage.sender_id == other_user_id,
                     models.ChatMessage.receiver_id == current_user.id),
            ))
            .order_by(models.ChatMessage.created_at)
            .all())
    return [_message_out(m, db) for m in rows]

@router.post("/api/chat/{other_user_id}", response_model=MessageOut, status_code=201)
def send_message(other_user_id: int, body: MessageBody, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not body.content.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    other = db.query(models.User).filter(models.User.id == other_user_id).first()
    if not other:
        raise HTTPException(status_code=404, detail="User not found")
    msg = models.ChatMessage(sender_id=current_user.id, receiver_id=other_user_id, content=body.content.strip())
    db.add(msg); db.commit(); db.refresh(msg)
    return _message_out(msg, db)
