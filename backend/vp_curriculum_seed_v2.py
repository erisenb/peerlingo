"""
Curriculum v2 seed — structured lesson data with full tutor guide, student slides,
and teaching notes. Applied on top of the existing curriculum seed (additive, idempotent).
"""
import json
import vp_models as models

# ── Lesson data ────────────────────────────────────────────────────────────────
# Each entry is keyed by (level, lesson_number).
# lesson_data is stored as JSON in the database lesson_data column.

LESSON_DATA_V2 = {

# ── BEGINNER LESSON 1 ─────────────────────────────────────────────────────────
('beginner', 1): {
    "version": "2.0",
    "duration_minutes": 30,
    "theme": "American School Life",
    "learning_objectives": [
        "Say hello and goodbye in casual American English",
        "Introduce yourself: name, grade, and where you are from",
        "Ask and answer basic get-to-know-you questions",
        "Understand the difference between formal and casual greetings"
    ],
    "materials_needed": [
        "Vocabulary list below (review it before class)",
        "A photo of your school hallway or locker — optional but great!",
        "5 minutes to read this lesson guide before the session starts"
    ],
    "warm_up": {
        "duration": "3 min",
        "note": "Smile and go slowly. This is their first real English conversation. Make it feel safe and fun. Use hand gestures freely.",
        "prompts": [
            {
                "tutor": "Hello! My name is [your name]. What is your name?",
                "expected": "My name is ___.",
                "tip": "Point to yourself when you say 'my name is' — visual cues help"
            },
            {
                "tutor": "Nice to meet you! How are you today?",
                "expected": "I am fine / good / okay. Thank you!",
                "tip": "Model the answer first if they look confused — say it yourself, then ask them to repeat"
            },
            {
                "tutor": "What day is today?",
                "expected": "Today is [Monday / Tuesday / Wednesday...].",
                "tip": ""
            },
            {
                "tutor": "What is the weather like where you are right now?",
                "expected": "It is sunny / rainy / cold / hot.",
                "tip": "Point outside or make a sun / rain gesture to help"
            },
            {
                "tutor": "How are you feeling right now — excited, nervous, or happy?",
                "expected": "I feel excited / nervous / happy.",
                "tip": "Act out the emotions with your face — students love this!"
            }
        ]
    },
    "review": {
        "duration": "0 min",
        "note": "This is Lesson 1 — no review needed! Use this extra time for more warm-up if your student seems nervous.",
        "questions": []
    },
    "vocabulary": {
        "duration": "6 min",
        "teaching_method": "Say the word slowly → Student repeats 3 times → Use it in a sentence → Ask one question about it",
        "words": [
            {
                "word": "greeting",
                "pronunciation": "GREET-ing",
                "definition": "What you say when you see or meet someone — like 'hello' or 'hey.'",
                "example_sentence": "'What's up?' is a very common American greeting.",
                "tutor_script": "Repeat after me: greeting. [pause] greeting. [pause] greeting. Great! A greeting is what you say when you see someone. When I wave and say 'Hello!' — that is a greeting. What is a greeting in Spanish?",
                "visual": "Show a wave emoji or two people saying hello"
            },
            {
                "word": "introduction",
                "pronunciation": "in-tro-DUK-shun",
                "definition": "When you tell someone your name for the very first time.",
                "example_sentence": "Let me do a quick introduction — my name is ___.",
                "tutor_script": "Repeat: introduction. [pause] introduction. [pause] introduction. When you say 'My name is Maria' to someone new — that is an introduction! Have you ever introduced yourself in English before?",
                "visual": "Show two people shaking hands or emoji: 🤝"
            },
            {
                "word": "classmate",
                "pronunciation": "KLASS-mayt",
                "definition": "Someone who goes to the same class or school as you.",
                "example_sentence": "My classmate and I study together after school.",
                "tutor_script": "Repeat: classmate. [pause] classmate. [pause] classmate. In American school, the people in your class are your classmates. Right now, we are kind of like classmates! Do you have a best classmate at your school?",
                "visual": "Two students sitting together at school desks"
            },
            {
                "word": "casual",
                "pronunciation": "KAZ-yoo-ul",
                "definition": "Relaxed and informal — not serious or official.",
                "example_sentence": "'Hey!' is casual. 'Good morning, sir' is formal.",
                "tutor_script": "Repeat: casual. [pause] casual. [pause] casual. Think of it like clothes — jeans are casual, a suit is formal. American teenagers say 'Hey what's up' — that is casual. Do you speak differently to your friends vs. your teachers?",
                "visual": "Side-by-side: jeans emoji 👖 vs suit emoji 👔"
            },
            {
                "word": "locker",
                "pronunciation": "LOK-er",
                "definition": "A small metal cabinet at school where students store their books and backpack.",
                "example_sentence": "I keep my textbooks in my locker between classes.",
                "tutor_script": "Repeat: locker. [pause] locker. [pause] locker. [Show a photo if you have one!] Every American high school student has their own locker with a combination lock. It is like your own storage space at school. Do you have something like this?",
                "visual": "Row of school lockers — search 'school locker' for a photo"
            },
            {
                "word": "hallway",
                "pronunciation": "HAWL-way",
                "definition": "The long path inside a building that connects the classrooms.",
                "example_sentence": "The hallway is super loud when class ends!",
                "tutor_script": "Repeat: hallway. [pause] hallway. [pause] hallway. Between every class in American school, hundreds of students walk through the hallway at the same time — it is very loud and crowded! Does that happen at your school too?",
                "visual": "Photo of a busy American school hallway with students"
            }
        ]
    },
    "grammar": {
        "duration": "5 min",
        "concept": "Introducing yourself: 'My name is... / I am from... / I am in ___ grade.'",
        "note": "Do NOT explain grammar rules — just model the sentences naturally and have the student copy you. Make it feel like a conversation, not a lesson.",
        "examples": [
            "My name is Sarah.",
            "I am from New Jersey.",
            "I am in 11th grade.",
            "I am 16 years old.",
            "I like soccer and music."
        ],
        "practice_script": "Now your turn! Fill in the blanks as I say them: 'My name is ___. I am from ___. I am in ___ grade. I am ___ years old. I like ___.'",
        "follow_up": "Now say it all together one more time, fast! [Let student say their full introduction.]",
        "transition": "Perfect — you just introduced yourself in English! Now let's use this in a real conversation."
    },
    "guided_conversation": {
        "duration": "8 min",
        "setup": "Pretend you just bumped into each other in the hallway at an American high school. You have never met before.",
        "prompts": [
            {
                "tutor": "Hey! I do not think I have seen you before. Are you new here?",
                "follow_ups": ["Where are you from?", "Wow, that is so cool — what is it like there?"],
                "comparison": "Ask: Is your school bigger or smaller than an American high school?"
            },
            {
                "tutor": "What grade are you in?",
                "follow_ups": ["What is your favorite subject?", "Do you have a lot of homework?"],
                "comparison": "Ask: What subjects do you study at your school?"
            },
            {
                "tutor": "Do you play any sports or have any hobbies?",
                "follow_ups": ["Have you heard of [sport they might not know]?", "Do you play it at school?"],
                "comparison": "Ask: What do students in your country do after school?"
            },
            {
                "tutor": "It was really nice meeting you! I will see you around.",
                "follow_ups": ["Do you know what 'see you around' means?", "It means we will probably run into each other again!"],
                "comparison": "Ask: How do you say goodbye to a new friend in your country?"
            }
        ],
        "tips": "Let them make mistakes — do not stop to correct every single one. Keep the conversation flowing. At the very end, gently model the correct version: 'By the way, in English we say I AM 16, not I HAVE 16 years old.' Then move on."
    },
    "activity": {
        "duration": "3 min",
        "name": "Two Truths and a Lie",
        "type": "Guessing Game",
        "vocabulary_focus": ["greeting", "introduction", "classmate", "locker", "hallway"],
        "setup": "You go first to model the game, then the student tries.",
        "tutor_script": "Okay, let's play a game! It's called Two Truths and a Lie. I will say three sentences about myself. Two are TRUE and one is a LIE. You have to guess which one is the lie! Ready? [1] My name is ___. [2] I go to school in Canada. [3] I have a locker at school. Which one is the lie? [Pause for answer.] YES! Number 2 is the lie — I go to school in [your state], not Canada! Now you try. Make three sentences about yourself. Use 'My name is...' and 'I am from...' and one more.",
        "debrief": "Great job! This game is a real American conversation starter — people play it at parties and on first days of school."
    },
    "wrap_up": {
        "duration": "2 min",
        "review_questions": [
            "How do you say hello in casual American English? (Hey! / What's up! / Hi!)",
            "What is a locker?",
            "How do you introduce yourself? Say it for me! (My name is...)",
            "What does 'casual' mean?",
            "How do you say goodbye casually? (See you around! / Later! / Bye!)"
        ],
        "encouragement": "You just had your first real English conversation — and you did amazing! Every lesson gets a little easier and a little more fun from here. I am genuinely proud of you.",
        "homework": "Practice your introduction out loud 5 times today: 'My name is ___. I am from ___. I am ___ years old. I like ___.' Record yourself on your phone, then listen back. Do you sound confident? Try again until you do!"
    },
    "tutor_notes": {
        "common_mistakes": [
            "Students often say 'I HAVE 16 years' instead of 'I AM 16 years old' — this is a Spanish translation error ('tengo 16 anos'). Gently correct: 'In English we say I AM, not I HAVE' and move on without dwelling on it.",
            "Students sometimes over-explain: 'My name is Maria, I am from Lima in Peru in South America which is near Brazil...' They are nervous. Encourage them to relax and keep it short.",
            "Students may respond to 'How are you?' with a very detailed answer. In casual American English, 'Fine, thanks' or 'Pretty good!' is completely normal and expected."
        ],
        "shy_student_tips": [
            "If they go quiet, break the question all the way down. Instead of 'Tell me about yourself,' try 'What is your name?' One question at a time.",
            "Celebrate every sentence — even a simple one. Say 'Perfect!' or 'That was great!' or 'Wow, exactly right!' as genuinely and often as you can.",
            "Speak more slowly than you think you need to. Use your hands. Point to yourself when you say 'I' and point to them when you ask 'you.'"
        ],
        "if_struggling": "If the student cannot form sentences yet, switch to yes/no questions: 'Do you like soccer? Yes or no?' Build up one small step at a time: 'Do you PLAY soccer?' Then: 'Do you play soccer at school?' This builds confidence before you add full sentences.",
        "alternatives": [
            "If Two Truths and a Lie is too complex, simplify to 'Repeat After Me' — you say a phrase slowly, they repeat it exactly, then try it independently.",
            "If the student already knows greetings well, challenge them with more casual slang: 'What's good?' 'How's everything?' 'Long time no see!' and explain when each one is used."
        ]
    },
    "student_slides": [
        {
            "slide": 1,
            "title": "Lesson 1: Greetings!",
            "emoji": "👋",
            "content": ["Hello! / Hey! / Hi there!", "What's up?  →  Not much, just hanging out!", "Nice to meet you!"],
            "visual_description": "Bright welcoming slide with wave emojis and speech bubbles showing different greetings side by side"
        },
        {
            "slide": 2,
            "title": "Today's Vocabulary",
            "emoji": "📚",
            "content": ["👋 greeting", "🤝 introduction", "🧑‍🤝‍🧑 classmate", "😎 casual vs. formal", "🔒 locker", "🏫 hallway"],
            "visual_description": "Six vocabulary words arranged in a 2×3 grid — each card has an emoji and the word in large bold text"
        },
        {
            "slide": 3,
            "title": "Introducing Yourself",
            "emoji": "🙋",
            "content": ["My name is ___.", "I am from ___.", "I am in ___ grade.", "I am ___ years old.", "I like ___."],
            "visual_description": "Fill-in-the-blank cards on a colorful background — student fills in their own information"
        },
        {
            "slide": 4,
            "title": "American School 🏫",
            "emoji": "🏫",
            "content": ["Students have their own lockers 🔒", "Hallways get VERY busy between classes!", "Everyone says 'Hey!' or 'What's up?'", "It feels just like the movies!"],
            "visual_description": "Collage of American high school: rows of lockers, busy hallway, students talking and laughing"
        },
        {
            "slide": 5,
            "title": "Two Truths and a Lie! 🎭",
            "emoji": "🎭",
            "content": ["1. ___________", "2. ___________", "3. ___________", "Which one is the LIE? 🤔"],
            "visual_description": "Three numbered boxes — one has a 🤥 hidden. Reveal-style layout, fun game show energy"
        },
        {
            "slide": 6,
            "title": "Homework! 📱",
            "emoji": "📱",
            "content": ["Say this 5 times today:", "My name is ___.", "I am from ___.", "I am ___ years old.", "I like ___.", "🎙️ Record yourself and listen back!"],
            "visual_description": "Phone with microphone emoji — encouraging, not like school homework"
        }
    ]
},

# ── BEGINNER LESSON 2 ─────────────────────────────────────────────────────────
('beginner', 2): {
    "version": "2.0",
    "duration_minutes": 30,
    "theme": "American School Life",
    "learning_objectives": [
        "Describe your school schedule using 'I have...' sentences",
        "Name common school subjects and activities in English",
        "Compare your school day with an American school day",
        "Use time expressions: 'at 8 AM,' 'after lunch,' 'first period'"
    ],
    "materials_needed": [
        "Your own school schedule if you have one — fun to compare!",
        "Photo of an American school cafeteria (search it quickly) — optional"
    ],
    "warm_up": {
        "duration": "3 min",
        "note": "Recap Lesson 1 naturally in conversation — not like a quiz. Make it feel like catching up with a friend.",
        "prompts": [
            {
                "tutor": "Hey! Great to see you again. How are you today?",
                "expected": "I am good / tired / happy. Thank you!",
                "tip": ""
            },
            {
                "tutor": "What day is today? And what is the weather like?",
                "expected": "Today is ___. It is ___.",
                "tip": ""
            },
            {
                "tutor": "Quick — introduce yourself to me like we just met!",
                "expected": "My name is ___. I am from ___. I am ___ years old.",
                "tip": "Celebrate them! This is already major progress from Lesson 1."
            },
            {
                "tutor": "What is one word you remember from last lesson?",
                "expected": "greeting / locker / classmate / casual / hallway",
                "tip": "Any answer is great — the act of remembering is the win."
            }
        ]
    },
    "review": {
        "duration": "3 min",
        "note": "Quick-fire review of Lesson 1 vocab. Keep it fast and fun — like a game show.",
        "questions": [
            "What do you say when you meet someone new for the first time? (Nice to meet you!)",
            "What is a locker? (A small cabinet at school for your books)",
            "What does 'casual' mean? (Relaxed, informal)",
            "What is a classmate? (Someone in the same class as you)",
            "What is a hallway? (The long path between classrooms)",
            "How do you say goodbye casually? (See you around! / Later!)",
            "Can you say your full introduction from homework?"
        ]
    },
    "vocabulary": {
        "duration": "6 min",
        "teaching_method": "Say word → Repeat 3x → Sentence → Question",
        "words": [
            {
                "word": "period",
                "pronunciation": "PEER-ee-ud",
                "definition": "A block of time in the school day dedicated to one class — usually 45 to 90 minutes.",
                "example_sentence": "I have five periods every day.",
                "tutor_script": "Repeat: period. [pause] period. [pause] period. In American school, the day is divided into periods — each one is a different class. I have 7 periods a day. How many classes do you have each day?",
                "visual": "A school day clock or simple schedule grid"
            },
            {
                "word": "schedule",
                "pronunciation": "SKEJ-ool",
                "definition": "Your personal list of classes and what time they happen each day.",
                "example_sentence": "My schedule changes every semester.",
                "tutor_script": "Repeat: schedule. [pause] schedule. [pause] schedule. Your schedule is like a map of your whole school day. Do you have a printed schedule at your school?",
                "visual": "Simple weekly schedule grid with class names"
            },
            {
                "word": "cafeteria",
                "pronunciation": "kaf-uh-TEER-ee-uh",
                "definition": "The large room at school where students buy and eat lunch.",
                "example_sentence": "The cafeteria has pizza every single Friday.",
                "tutor_script": "Repeat: cafeteria. [pause] cafeteria. [pause] cafeteria. In American schools, the cafeteria is a huge deal! You wait in line, buy food, and sit with your friends. Where do you eat lunch at your school?",
                "visual": "Photo of American school cafeteria with food trays"
            },
            {
                "word": "elective",
                "pronunciation": "ee-LEK-tiv",
                "definition": "A class you CHOOSE to take based on your interests — not required by school.",
                "example_sentence": "I chose drama as my elective because I love acting.",
                "tutor_script": "Repeat: elective. [pause] elective. [pause] elective. Some classes are required — you HAVE to take them. Electives are the fun ones you pick yourself. What would your dream elective be?",
                "visual": "Icons for art 🎨 music 🎵 drama 🎭 photography 📷 coding 💻"
            },
            {
                "word": "passing period",
                "pronunciation": "PASS-ing PEER-ee-ud",
                "definition": "The short time between classes — usually 4 to 7 minutes — when you walk to your next class.",
                "example_sentence": "I only have 5 minutes during passing period to get across the building.",
                "tutor_script": "Repeat: passing period. [pause] passing period. [pause] passing period. When one class ends, you have only 5 minutes to get to the next one! The hallways get absolutely packed. Have you ever had to rush between classes?",
                "visual": "Clock showing 5 minutes, crowded hallway illustration"
            },
            {
                "word": "substitute",
                "pronunciation": "SUB-stih-toot",
                "definition": "A teacher who fills in for the regular teacher when they are absent.",
                "example_sentence": "We had a substitute today and nobody did any work.",
                "tutor_script": "Repeat: substitute. [pause] substitute. [pause] substitute. When the real teacher is sick, a substitute comes in. Sub days are usually very relaxed — students do not always take it seriously! Do you have something like this in Peru?",
                "visual": "Teacher with question mark, 'Sub Day!' energy"
            }
        ]
    },
    "grammar": {
        "duration": "5 min",
        "concept": "Describing your schedule: 'I have ___ class / I have ___ at ___ o'clock.'",
        "note": "Do not explain grammar rules. Use lots of examples and have them fill in the blanks naturally.",
        "examples": [
            "I have math first period.",
            "I have lunch at 12 o'clock.",
            "I have an elective after lunch.",
            "I have 7 periods today.",
            "I have a substitute in science."
        ],
        "practice_script": "Now tell me about YOUR day using 'I have.' What classes do you have? Just try — any subjects you know in English! [Help with vocab as needed: math, science, English, history, art, music, P.E., biology, geography]",
        "follow_up": "Excellent! You just described your whole school day in English.",
        "transition": "Now I am going to ask you about your school day — answer me using 'I have.'"
    },
    "guided_conversation": {
        "duration": "8 min",
        "setup": "You are both students comparing your school days. Be genuinely curious about each other.",
        "prompts": [
            {
                "tutor": "What time does your school start?",
                "follow_ups": ["Do you think that is too early?", "American schools usually start at 7:30 AM — what do you think about that?"],
                "comparison": "My school starts at ___ AM. Is that earlier or later than yours?"
            },
            {
                "tutor": "What is your favorite class? Tell me about it.",
                "follow_ups": ["Why do you like it?", "Is your teacher nice?", "What do you actually DO in that class?"],
                "comparison": "My favorite class is ___. We learn about ___ and I love it because ___."
            },
            {
                "tutor": "What do you eat for lunch at school?",
                "follow_ups": ["Do you bring food from home or buy it?", "What does the cafeteria at your school look like?"],
                "comparison": "At my school, the cafeteria has pizza, burgers, and salads. Every Friday is pizza day!"
            },
            {
                "tutor": "What time does school end? What do you do right after?",
                "follow_ups": ["Do you have any after-school activities or sports?", "How much homework do you usually have?"],
                "comparison": "After school I usually have ___. Then I do homework until about ___ PM."
            }
        ],
        "tips": "Be genuinely curious — students love when tutors ask real questions about their actual life. Share real details from your own school day too. The more personal and specific you are, the better."
    },
    "activity": {
        "duration": "3 min",
        "name": "Would You Rather: School Edition",
        "type": "Discussion Game",
        "vocabulary_focus": ["period", "cafeteria", "elective", "schedule", "substitute"],
        "setup": "Take turns asking Would You Rather questions about school. Each person must answer AND say why!",
        "tutor_script": "Let's play Would You Rather! I ask a question, you answer in English AND explain. Ready? [1] Would you rather have school start at 7 AM or end at 6 PM? [2] Would you rather have math every single day or P.E. every single day? [3] Would you rather have a substitute teacher every day or the strictest teacher in the world? [4] Would you rather have a 2-hour lunch or end school 2 hours early? Answer in English — just try your best!",
        "debrief": "Fantastic! You just gave your opinions in English — that is one of the most important real-world conversation skills."
    },
    "wrap_up": {
        "duration": "2 min",
        "review_questions": [
            "What is a period? (A block of time for one class)",
            "What is a cafeteria? (Where students eat lunch at school)",
            "What is an elective? (A class you choose)",
            "How do you say you have math class? (I have math.)",
            "What is a substitute teacher? (A teacher who fills in)"
        ],
        "encouragement": "You just described your entire school day in English and compared it to American school — that is real fluency happening right now. I am impressed.",
        "homework": "Draw or write your school schedule in English. Write each class name in English with the time it starts. Take a photo and bring it to next class — we will compare it together!"
    },
    "tutor_notes": {
        "common_mistakes": [
            "Students sometimes say 'I have classes of math' instead of 'I have math class' — gently correct and move on.",
            "Time expressions can be tricky: 'at 8 AM,' 'in the morning,' 'after lunch' — practice several of these if you have time.",
            "Students may not know school subject names in English — keep a quick list ready: math, science, history, English, art, music, P.E., biology, geography, Spanish."
        ],
        "shy_student_tips": [
            "If they do not know an English word for a subject, say it for them and have them repeat: 'It is called science. Say it: science. Great!'",
            "Let them use Spanish for subjects they do not know — write the English word, have them say it once, then move on immediately."
        ],
        "if_struggling": "If full sentences are too hard, just compare with yes/no questions: 'Do you have math class? Yes or no?' Then build: 'I have math. Do you have math too?' Simple agreement builds confidence fast.",
        "alternatives": [
            "If Would You Rather is too hard, play True or False about American school: 'American school starts at 7 AM — true or false?' 'Students have lockers — true or false?' Keep energy high."
        ]
    },
    "student_slides": [
        {
            "slide": 1,
            "title": "Lesson 2: A Day at American School! 🏫",
            "emoji": "🏫",
            "content": ["What time does school start?", "What do you eat for lunch?", "What classes do you have?", "Is it like the movies?"],
            "visual_description": "American school building with school bus out front — classic, inviting image"
        },
        {
            "slide": 2,
            "title": "Quick Review! 🔄",
            "emoji": "🔄",
            "content": ["👋 greeting", "🔒 locker", "🧑‍🤝‍🧑 classmate", "😎 casual", "🏫 hallway"],
            "visual_description": "Row of Lesson 1 vocabulary as mini flashcards — quick visual recap"
        },
        {
            "slide": 3,
            "title": "Today's Vocabulary",
            "emoji": "📚",
            "content": ["⏰ period", "📋 schedule", "🍕 cafeteria", "🎨 elective", "⚡ passing period", "🧑‍🏫 substitute"],
            "visual_description": "Six vocabulary cards in 2×3 grid with bold emojis"
        },
        {
            "slide": 4,
            "title": "Grammar: I have...",
            "emoji": "✏️",
            "content": ["I have math first period.", "I have lunch at noon. 🍕", "I have an elective! 🎨", "I have 7 periods today.", "Now YOU try: I have ___."],
            "visual_description": "Fill-in-the-blank sentences on a whiteboard-style background"
        },
        {
            "slide": 5,
            "title": "The American School Day ⏰",
            "emoji": "⏰",
            "content": ["7:30 AM — School starts (early!)", "12:00 PM — Lunch in the cafeteria 🍕", "3:00 PM — School ends", "After: sports, clubs, homework..."],
            "visual_description": "Simple timeline of the American school day with clock icons"
        },
        {
            "slide": 6,
            "title": "Would You Rather? 🤔",
            "emoji": "🤔",
            "content": ["7 AM start  OR  6 PM end?", "Math every day  OR  P.E. every day?", "Substitute every day  OR  strictest teacher?"],
            "visual_description": "VS-style split cards — two funny choices on each, bright colors"
        },
        {
            "slide": 7,
            "title": "Homework! 📐",
            "emoji": "📐",
            "content": ["Write your school schedule in ENGLISH 📝", "What time does each class start?", "Bring it to next lesson!", "We will compare our schedules!"],
            "visual_description": "Simple schedule template with days and times — blank for student to fill"
        }
    ]
},

# ── BEGINNER LESSON 3 ─────────────────────────────────────────────────────────
('beginner', 3): {
    "version": "2.0",
    "duration_minutes": 30,
    "theme": "American Food & Restaurants",
    "learning_objectives": [
        "Order food at a restaurant using 'I would like...' and 'I'll have...'",
        "Describe food with adjectives: delicious, spicy, sweet, salty, crispy",
        "Understand American dining culture: tipping, free refills, drive-throughs",
        "Compare American food with your own country's food"
    ],
    "materials_needed": [
        "Think of your favorite food from home — you will describe it today!",
        "Photo of a diner menu (search 'American diner menu') — optional but fun"
    ],
    "warm_up": {
        "duration": "3 min",
        "note": "Start with food — everyone has an opinion about food. This topic opens shy students right up.",
        "prompts": [
            {
                "tutor": "Hey! How are you today? Are you hungry?",
                "expected": "I am [good/okay]. Yes, I am hungry! / No, I already ate.",
                "tip": ""
            },
            {
                "tutor": "What day is today? What is the weather?",
                "expected": "Today is ___. It is ___.",
                "tip": ""
            },
            {
                "tutor": "What did you eat for breakfast or lunch today? Tell me!",
                "expected": "I ate ___ / I had ___.",
                "tip": "Teach 'I had' = 'I ate' — both are natural. Accept whichever they use."
            },
            {
                "tutor": "What is your absolute FAVORITE food in the whole world?",
                "expected": "My favorite food is ___.",
                "tip": "Remember their answer — it will come up in guided conversation!"
            }
        ]
    },
    "review": {
        "duration": "3 min",
        "note": "Quick review of Lesson 2 vocabulary. Fast and fun.",
        "questions": [
            "What is a period? (A block of time for one class)",
            "What is a cafeteria? (Where students eat lunch at school)",
            "What is an elective? (A class you choose)",
            "What is a schedule? (Your list of classes and times)",
            "What is a substitute? (A teacher who fills in when another is absent)",
            "Tell me one thing about your school day — use 'I have.'"
        ]
    },
    "vocabulary": {
        "duration": "6 min",
        "teaching_method": "Say word → Repeat 3x → Sentence → Question",
        "words": [
            {
                "word": "appetizer",
                "pronunciation": "AP-uh-tie-zer",
                "definition": "A small dish served BEFORE the main meal — like chips, soup, or a salad.",
                "example_sentence": "We ordered mozzarella sticks as an appetizer.",
                "tutor_script": "Repeat: appetizer. [pause] appetizer. [pause] appetizer. An appetizer is a small thing you eat BEFORE your main food arrives. Like an opening act! Do you have appetizers in restaurants where you live?",
                "visual": "Photo of mozzarella sticks, chips and salsa, or soup"
            },
            {
                "word": "tip",
                "pronunciation": "TIP",
                "definition": "Extra money you give your server to thank them for good service — usually 15 to 20 percent of the bill.",
                "example_sentence": "We left a $10 tip because the service was great.",
                "tutor_script": "Repeat: tip. [pause] tip. [pause] tip. In America, tipping is VERY important. After your meal, you pay the bill PLUS extra money for the server — usually 20%. It is a big part of how servers earn their living. Is tipping common in your country?",
                "visual": "Dollar bills, receipt with tip line highlighted in yellow"
            },
            {
                "word": "drive-through",
                "pronunciation": "DRIVE-throo",
                "definition": "A window at a fast food restaurant where you order and receive your food without leaving your car.",
                "example_sentence": "I went through the McDonald's drive-through on my way to school.",
                "tutor_script": "Repeat: drive-through. [pause] drive-through. [pause] drive-through. A drive-through is one of the most American things in existence! You pull up in your car, speak into a speaker, pay at one window, and get your food at the next. You never even get out! Do you have anything like this in your country?",
                "visual": "Car at a McDonald's drive-through window with a bag of food"
            },
            {
                "word": "combo meal",
                "pronunciation": "KOM-bo MEEL",
                "definition": "A fast food bundle: a main item plus a side dish plus a drink, all at one price.",
                "example_sentence": "I always order the Number 1 combo — burger, fries, and a Coke.",
                "tutor_script": "Repeat: combo meal. [pause] combo meal. [pause] combo meal. At McDonald's or Burger King, you can order a combo meal — one number gets you the sandwich, fries, AND a drink. It is cheaper than buying each thing separately. Do you like fries?",
                "visual": "Classic fast food tray: burger + fries + large drink cup"
            },
            {
                "word": "server",
                "pronunciation": "SER-ver",
                "definition": "The person at a restaurant who takes your order and brings your food. Also called a waiter or waitress.",
                "example_sentence": "Our server was incredibly friendly and brought us free dessert!",
                "tutor_script": "Repeat: server. [pause] server. [pause] server. The server is the person who takes care of you at a sit-down restaurant. They bring your food and you give them a tip at the end. What do you say to a server when you want to order?",
                "visual": "Person in apron with notepad, taking an order"
            },
            {
                "word": "refill",
                "pronunciation": "REE-fill",
                "definition": "A second or third serving of your drink — often FREE at American restaurants.",
                "example_sentence": "Can I get a refill on my Coke, please?",
                "tutor_script": "Repeat: refill. [pause] refill. [pause] refill. One thing Americans absolutely love — FREE refills! You drink your soda, and the server fills it again for free. Unlimited drinks! Students from other countries are always surprised by this. Do you have free refills in your country?",
                "visual": "Cup being refilled from a soda machine, with FREE label"
            }
        ]
    },
    "grammar": {
        "duration": "5 min",
        "concept": "Ordering food: 'I would like...' / 'I'll have...' / 'Can I get...'",
        "note": "Model this as a real restaurant interaction. Make it playful — you are the server, they are the customer.",
        "examples": [
            "I would like a cheeseburger, please.",
            "I'll have the combo meal number 2.",
            "Can I get a large Coke with no ice?",
            "I would like fries on the side.",
            "Can I get a refill?"
        ],
        "practice_script": "I am going to be your server. You are the customer at an American diner. Here is the menu: [1] Cheeseburger $8, [2] Chicken sandwich $9, [3] Large fries $4, [4] Chocolate milkshake $6. What would you like? [Let them order using 'I would like...' or 'I'll have...'] Great! Now ask for a refill using 'Can I get a...'",
        "follow_up": "Perfect order! In a real American restaurant, that is exactly how it works.",
        "transition": "Now let's talk about American food culture."
    },
    "guided_conversation": {
        "duration": "8 min",
        "setup": "You are sitting together at an American restaurant, looking at a menu. Be genuinely curious.",
        "prompts": [
            {
                "tutor": "Have you ever tried American food? What do you think of it?",
                "follow_ups": ["What American food do you most want to try?", "Have you ever had a burger? What did you think?"],
                "comparison": "What is the most popular food in your country? Describe it to me — I want to try it!"
            },
            {
                "tutor": "Tell me about your favorite food from home. What is it called? What does it taste like?",
                "follow_ups": ["Is it spicy? Sweet? Salty?", "Do you make it at home or buy it at a restaurant?"],
                "comparison": "My favorite American food is ___. It is ___. Would you try it?"
            },
            {
                "tutor": "In America, tipping is really important. Did you know that? What do you think?",
                "follow_ups": ["Do people tip in your country?", "How much do you think is a fair tip?"],
                "comparison": "Servers in America often depend on tips as a big part of their income."
            },
            {
                "tutor": "What do you think about fast food? Do you like it or do you prefer home cooking?",
                "follow_ups": ["Do you have fast food restaurants near your home?", "What would you order at McDonald's?"],
                "comparison": "I eat fast food about ___ times a week. My usual order is ___."
            }
        ],
        "tips": "Food comparisons are the best low-pressure topic — there are no wrong answers and everyone has opinions. Let them describe flavors and textures freely. This builds excellent vocabulary naturally."
    },
    "activity": {
        "duration": "3 min",
        "name": "Restaurant Roleplay",
        "type": "Roleplay",
        "vocabulary_focus": ["server", "tip", "combo meal", "refill", "appetizer"],
        "setup": "You are the server at an American diner. The student is a first-time visitor from their country.",
        "tutor_script": "Okay, I am going to be your server at an American diner — PeerLingo Diner! You just sat down. Ready? [As server]: 'Hi there, welcome to PeerLingo Diner! Can I start you off with something to drink?' [Let them order a drink.] 'Great choice! Are you ready to order your food, or do you need a few more minutes?' [Let them order main food.] 'Excellent! Can I bring you an appetizer while you wait — maybe some chips and salsa or soup?' [After they order:] 'Perfect! I will put that in for you right away. And remember — free refills on all drinks! Just let me know!' [End:] 'Enjoy your meal! Here is your check — and a tip is always appreciated!'",
        "debrief": "Amazing! You just ordered a full meal in English. In a real American restaurant, that is exactly how it happens. You are ready."
    },
    "wrap_up": {
        "duration": "2 min",
        "review_questions": [
            "What is an appetizer? (Small food before the main meal)",
            "What is a tip? (Extra money you leave for the server)",
            "What is a drive-through? (You order food from your car)",
            "How do you order food? (I would like... / I'll have... / Can I get...)",
            "What is a free refill? (A second drink for free)"
        ],
        "encouragement": "You ordered a full meal in English today — that is a real life skill you can actually use! The next time you visit an American restaurant, you will know exactly what to do. That is incredible.",
        "homework": "Find a menu from an American restaurant online — search 'Chili's menu' or 'Denny's menu.' Pick 3 things you would order and practice saying them out loud: 'I would like the ___, please. Can I also get ___? And can I get a refill?'"
    },
    "tutor_notes": {
        "common_mistakes": [
            "Students may say 'I want a burger' — technically correct but blunt. Teach 'I would like' as the natural restaurant phrase.",
            "Food adjectives often come up and students do not know them — have these ready: crispy, juicy, savory, sweet, spicy, creamy, crunchy, soft, salty, greasy.",
            "Tipping is genuinely confusing for students from countries where it is not common — be patient explaining WHY servers depend on it."
        ],
        "shy_student_tips": [
            "If they freeze during roleplay, give them the first word: 'Try starting with I would like...' and let them finish the thought.",
            "Food comparisons have no wrong answers. Celebrate every opinion they express, no matter how simple."
        ],
        "if_struggling": "Simplify the roleplay down to just one line: 'I would like ___.' Practice it three times with three different foods before you add more complexity.",
        "alternatives": [
            "Play 'Guess My Food' — describe a meal without naming it and have them guess: 'It is round. It has cheese. It has meat inside. It is very American.' (A burger!) Then switch roles.",
            "If they love food, spend extra time on food comparisons — Peruvian ceviche vs. American seafood, chicha vs. American soda, etc."
        ]
    },
    "student_slides": [
        {
            "slide": 1,
            "title": "Lesson 3: American Food! 🍔",
            "emoji": "🍔",
            "content": ["Burgers, pizza, tacos, sushi...", "America has food from EVERYWHERE! 🌍", "Today: we order our first American meal!"],
            "visual_description": "Collage of diverse American foods — vibrant and appetizing"
        },
        {
            "slide": 2,
            "title": "Today's Vocabulary",
            "emoji": "🍽️",
            "content": ["🥗 appetizer", "💵 tip", "🚗 drive-through", "🍟 combo meal", "👨‍🍳 server", "🥤 refill"],
            "visual_description": "Six vocabulary cards with bold emojis — fun food theme"
        },
        {
            "slide": 3,
            "title": "How to Order Food 🗣️",
            "emoji": "🗣️",
            "content": ["I would like a cheeseburger.", "I'll have the combo meal.", "Can I get a large Coke?", "Can I get a refill, please? 🥤"],
            "visual_description": "Customer speaking to a server with a speech bubble showing order — friendly cartoon style"
        },
        {
            "slide": 4,
            "title": "American Fast Food 🏪",
            "emoji": "🏪",
            "content": ["🍟 McDonald's", "🍗 Chick-fil-A", "🌯 Chipotle", "🌮 Taco Bell", "Which one would you try FIRST?"],
            "visual_description": "Four fast food names in colorful boxes — fun and energetic"
        },
        {
            "slide": 5,
            "title": "Tipping in America 💵",
            "emoji": "💵",
            "content": ["😍 20% = excellent service", "🙂 15% = good service", "😐 10% = okay service", "TIP = Thank you for taking care of me!"],
            "visual_description": "Simple chart with percentages and emoji faces — easy to understand"
        },
        {
            "slide": 6,
            "title": "PeerLingo Diner! 🍽️",
            "emoji": "🍽️",
            "content": ["You are the CUSTOMER 🙋", "Your tutor is the SERVER 👨‍🍳", "Order your full meal in English!", "Don't forget to ask for a refill! 🥤"],
            "visual_description": "Fun diner illustration — retro American diner sign, menu board, counter"
        },
        {
            "slide": 7,
            "title": "Homework! 🍕",
            "emoji": "🍕",
            "content": ["Search online: 'Denny's menu' or 'Chili's menu'", "Pick 3 things you would order 🍽️", "Practice: 'I would like the ___'", "Bring your order to next class!"],
            "visual_description": "Laptop showing restaurant menu — student picks their dream order"
        }
    ]
},

}  # end LESSON_DATA_V2


# ── Seed function ──────────────────────────────────────────────────────────────

def apply_lesson_data_v2(db) -> None:
    """
    Updates existing curriculum lessons with structured v2 lesson_data.
    Idempotent — only writes if lesson_data is currently empty.
    """
    import vp_models as models

    count = 0
    for (level, lesson_number), lesson_data in LESSON_DATA_V2.items():
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

        if not lesson.lesson_data:
            lesson.lesson_data = json.dumps(lesson_data)
            count += 1

    if count:
        db.commit()
        print(f"[curriculum seed v2] Applied structured lesson data to {count} lesson(s).")
    else:
        print("[curriculum seed v2] All structured lessons already up to date.")
