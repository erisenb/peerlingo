import json
import vp_models as models

CURRICULUM_DATA = [
    {
        'level': 'beginner',
        'title': 'English with American Friends: Beginner',
        'description': 'A beginner-level English curriculum built around authentic conversations with American high school students. Students explore everyday American life, culture, and language in a friendly, low-pressure environment.',
        'lessons': [
            {
                'number': 1,
                'title': 'Greetings and Introductions at School',
                'outline': """LESSON OVERVIEW
Your tutor will teach you how real American students greet each other and introduce themselves at school. This is different from textbook English — Americans use casual, friendly language that you will not find in a grammar book.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What is your name and where are you from?
   - Have you ever tried to greet someone in English before? What happened?
   - What do you think Americans say when they first meet someone?

2. Casual Greetings Americans Actually Use
   - "Hey, what's up?" and how to respond naturally
   - The difference between "How are you?" (formal) and "How's it going?" (casual)
   - Greetings that change by time of day vs. ones that work anytime

3. Introducing Yourself at School
   - Sharing your name, grade, and hometown
   - Asking follow-up questions to keep a conversation going
   - What American students talk about when they first meet someone new

4. Cultural Deep Dive
   Share a memory of meeting a new classmate on the first day of school — what you said, how nervous you felt, and how the conversation went. Describe the hallway energy on day one.

5. Conversation Practice
   Role-play: You are a new student at an American high school. Your tutor is a classmate you just met at your locker. Practice a 2-minute getting-to-know-you conversation.

6. Wrap-Up
   - What was the hardest part of this conversation for you?
   - What is one greeting you want to remember and use this week?

TUTOR NOTE: Speak at a natural pace and do not over-correct every error. Focus on building the student's confidence to actually speak.""",
                'vocabulary': [
                    {'word': 'greeting', 'definition': 'A word or phrase you say when you meet or see someone, like "hello" or "hey."'},
                    {'word': 'introduction', 'definition': 'The act of telling someone your name and basic information about yourself for the first time.'},
                    {'word': 'classmate', 'definition': 'A person who is in the same class or school as you.'},
                    {'word': 'casual', 'definition': 'Relaxed and informal, not serious or official.'},
                    {'word': 'formal', 'definition': 'Polite and official, used in professional or serious situations.'},
                    {'word': 'locker', 'definition': 'A small metal cabinet at school where students keep their books and belongings.'},
                    {'word': 'hallway', 'definition': 'The long corridor inside a school building that connects classrooms.'},
                    {'word': 'hometown', 'definition': 'The city or town where you were born or grew up.'},
                    {'word': 'nickname', 'definition': 'An informal name that friends or family call you instead of your real name.'},
                    {'word': 'sophomore', 'definition': 'A student in the second year of high school or college in the United States.'},
                    {'word': 'confident', 'definition': 'Feeling sure of yourself and not afraid to speak or act.'},
                    {'word': 'conversation', 'definition': 'A spoken exchange of thoughts and ideas between two or more people.'},
                ],
                'expressions': [
                    {'expression': "What's up?", 'meaning': 'A very casual American greeting that means "How are you?" or "What is happening?" You can reply with "Not much" or "Just hanging out."'},
                    {'expression': "Nice to meet you.", 'meaning': 'Said when you are introduced to someone for the first time. It is polite and works in both formal and casual situations.'},
                    {'expression': "How's it going?", 'meaning': 'A friendly, informal way to ask how someone is doing. A common reply is "Pretty good" or "Can\'t complain."'},
                    {'expression': "I go by...", 'meaning': 'Used to share a nickname or a shorter version of your name, for example: "My name is Alejandro but I go by Alex."'},
                    {'expression': "What grade are you in?", 'meaning': 'An American way to ask what year of school someone is in. Grades 9-12 are the four years of high school.'},
                    {'expression': "See you around.", 'meaning': 'A relaxed way to say goodbye that suggests you expect to see the person again soon, common among classmates.'},
                ],
            },
            {
                'number': 2,
                'title': 'A Day at American School',
                'outline': """LESSON OVERVIEW
American school life is full of routines, rituals, and unwritten rules that textbooks never explain. Your tutor will walk you through what a real school day looks like — from the morning bell to the final dismissal — and why it feels so different from school in other countries.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What time does your school day start and end in Peru?
   - What is your favorite and least favorite part of your school day?
   - Have you ever imagined what going to school in America would be like?

2. The American School Day: Bell to Bell
   - How the schedule works: periods, passing time, and the bell system
   - What happens at lunch (the cafeteria, sitting with friends, lunch lines)
   - The role of homeroom and advisory periods

3. Classroom Culture in America
   - How students interact with teachers (first names vs. last names, raising hands)
   - Group work, presentations, and participation grades
   - What gets students in trouble vs. what is totally normal

4. Cultural Deep Dive
   Describe your own school day in vivid detail — what you eat for lunch, who you sit with, the noise level in the hallway between classes, and a funny or memorable moment from a regular school day.

5. Conversation Practice
   Role-play: Your student is a new exchange student at your school. Give them a tour of a typical day — explain the schedule, warn them about the bad cafeteria food, and tell them one thing they absolutely need to know.

6. Wrap-Up
   - What surprised you most about the American school day?
   - How is your school day in Peru similar or different?

TUTOR NOTE: Use specific, real details from your own school. The more personal and specific you are, the more valuable this session is compared to any app or textbook.""",
                'vocabulary': [
                    {'word': 'period', 'definition': 'A set block of time in the school day dedicated to one class, usually 45 to 90 minutes long.'},
                    {'word': 'schedule', 'definition': 'A list showing what classes you have and at what times each day.'},
                    {'word': 'cafeteria', 'definition': 'The large room at school where students buy and eat lunch.'},
                    {'word': 'bell', 'definition': 'The loud sound that signals the beginning or end of a class period in American schools.'},
                    {'word': 'homeroom', 'definition': 'A short period at the start of the school day where attendance is taken and announcements are made.'},
                    {'word': 'elective', 'definition': 'A class that students choose to take based on their interests, rather than a required course.'},
                    {'word': 'attendance', 'definition': 'The record of whether a student is present or absent from school each day.'},
                    {'word': 'passing period', 'definition': 'The short time between classes — usually 4 to 7 minutes — when students move through the hallways.'},
                    {'word': 'substitute', 'definition': 'A teacher who fills in for the regular teacher when they are absent.'},
                    {'word': 'detention', 'definition': 'A punishment where a student must stay after school for breaking a rule.'},
                    {'word': 'dismissal', 'definition': 'The end of the school day when students are released to go home.'},
                    {'word': 'permission slip', 'definition': 'A form that a parent or guardian must sign to allow a student to participate in a school trip or activity.'},
                ],
                'expressions': [
                    {'expression': "Hit the books.", 'meaning': 'An idiom meaning to study seriously. "I can\'t hang out tonight — I have to hit the books for tomorrow\'s test."'},
                    {'expression': "The bell rings.", 'meaning': 'Used to describe when a class period starts or ends. "As soon as the bell rings, everyone runs to the cafeteria."'},
                    {'expression': "I have a free period.", 'meaning': 'Means you have a block of time with no class scheduled, used for studying, relaxing, or socializing.'},
                    {'expression': "Cut class.", 'meaning': 'To skip a class without permission. "He cut class and got detention." This is considered a serious offense.'},
                    {'expression': "Extra credit.", 'meaning': 'Optional work students can do to earn additional points and improve their grade beyond the regular assignments.'},
                    {'expression': "Pop quiz.", 'meaning': 'A surprise, unannounced test given by a teacher. "Nobody was ready for the pop quiz on Friday."'},
                ],
            },
            {
                'number': 3,
                'title': 'American Food and Restaurants',
                'outline': """LESSON OVERVIEW
Food is one of the most fun and personal ways to explore a culture. American food culture is huge, diverse, and full of regional differences and strong opinions. Your tutor will share what Americans really eat — not just hamburgers and pizza — and what dining out looks like in the United States.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What is your favorite food in Peru? Describe it to me!
   - Have you ever tried American food? What did you think?
   - What do you imagine a typical American meal looks like?

2. What Americans Really Eat
   - Breakfast foods: cereal, toast, eggs, bagels — and why many teens skip breakfast
   - Fast food culture: McDonald's, Chipotle, Chick-fil-A and what "going through the drive-through" means
   - Regional food differences: Southern BBQ, New England clam chowder, NYC pizza

3. Eating Out in America
   - How restaurants work: being seated, ordering from a menu, asking for the check
   - Tipping culture and why 20% is the standard
   - The difference between fast food, fast casual, and sit-down restaurants

4. Cultural Deep Dive
   Tell the student about your favorite restaurant or your go-to fast food order. Describe the food, the atmosphere, and a memory you associate with that place — a birthday dinner, a post-game meal, a late-night run with friends.

5. Conversation Practice
   Role-play: You are a server at an American diner. Your student is a visitor ordering for the first time. Practice the full exchange: greeting, taking the order, offering extras, and bringing the check.

6. Wrap-Up
   - What American food do you most want to try someday?
   - Did anything about American food culture surprise you?

TUTOR NOTE: Keep this session fun and light. Food is a comfortable topic that opens students up. Share real opinions — your actual favorite meal, what you think is overrated, what you always order.""",
                'vocabulary': [
                    {'word': 'appetizer', 'definition': 'A small dish served before the main meal to start the dining experience.'},
                    {'word': 'entree', 'definition': 'The main course of a meal at a restaurant.'},
                    {'word': 'tip', 'definition': 'Extra money given to a server or service worker to thank them for good service, usually a percentage of the total bill.'},
                    {'word': 'drive-through', 'definition': 'A part of a fast food restaurant where you order and receive food while staying in your car.'},
                    {'word': 'combo meal', 'definition': 'A fast food option that bundles a main item, a side (like fries), and a drink at a discounted price.'},
                    {'word': 'menu', 'definition': 'A list of all the food and drinks a restaurant offers, along with their prices.'},
                    {'word': 'takeout', 'definition': 'Food you order at a restaurant but take home to eat instead of eating there.'},
                    {'word': 'leftovers', 'definition': 'Food that was not eaten during a meal and is saved to be eaten later.'},
                    {'word': 'brunch', 'definition': 'A meal eaten late in the morning that combines breakfast and lunch, popular on weekends.'},
                    {'word': 'server', 'definition': 'The person who takes your order and brings your food at a restaurant; also called a waiter or waitress.'},
                    {'word': 'refill', 'definition': 'A second (or third) serving of a drink, often provided for free at American restaurants.'},
                    {'word': 'booth', 'definition': 'A type of seating at a restaurant with cushioned benches on either side of a table.'},
                ],
                'expressions': [
                    {'expression': "I\'ll have...", 'meaning': 'The standard way to order food at a restaurant in America. "I\'ll have the cheeseburger with fries, please."'},
                    {'expression': "Can I get a refill?", 'meaning': 'A polite way to ask your server for more of your drink. Free refills are common at American casual restaurants.'},
                    {'expression': "Split the bill.", 'meaning': 'To divide the cost of a meal between multiple people. "Do you want to split the bill?" is common among friends.'},
                    {'expression': "To go.", 'meaning': 'Used when ordering food you plan to take with you rather than eat at the restaurant. "Can I get that to go?"'},
                    {'expression': "On the menu.", 'meaning': 'Used to describe something a restaurant offers. Also used figuratively: "What\'s on the menu for today?" meaning what is planned.'},
                    {'expression': "Eat out.", 'meaning': 'To have a meal at a restaurant rather than cooking at home. "We eat out every Friday night."'},
                ],
            },
            {
                'number': 4,
                'title': 'Getting Around: Transportation Basics',
                'outline': """LESSON OVERVIEW
Getting around in America is very different from Peru, and understanding transportation is essential for anyone visiting or living there. American car culture is central to daily life, but cities also have buses, subways, and rideshares. Your tutor will explain how real American teens get around every day.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - How do you get to school each day in Peru?
   - Do you know how to drive or have you ever been in a car on a long road trip?
   - What do you think transportation is like for American teenagers?

2. The Car-Centered Culture of America
   - Why so many Americans depend entirely on cars to get everywhere
   - Getting a driver's license at 16 and what it means socially
   - What a typical American suburb looks like and why walking is not always possible

3. Public Transportation and Ridesharing
   - Buses and subways: how they work and who uses them
   - Uber and Lyft: how teenagers use ridesharing to get around
   - School buses: a unique American experience

4. Cultural Deep Dive
   Describe how you personally get around — whether your parents drive you, you take the school bus, or you recently got your license. Share how it felt the first time you rode somewhere without an adult.

5. Conversation Practice
   Role-play: Your student needs directions from school to a nearby shopping center. Practice giving step-by-step directions using landmarks and street names.

6. Wrap-Up
   - What is the biggest transportation difference between Peru and America that you noticed?
   - Would you want to drive a car someday?

TUTOR NOTE: Be honest about how dependent American life is on cars. Students are often surprised. This opens good discussions about environmental impact and urban planning if the student seems interested.""",
                'vocabulary': [
                    {'word': 'license', 'definition': 'An official card that gives you legal permission to drive a car.'},
                    {'word': 'suburb', 'definition': 'A residential area outside of a major city where many American families live.'},
                    {'word': 'rideshare', 'definition': 'A service like Uber or Lyft where you pay a driver to take you somewhere using a smartphone app.'},
                    {'word': 'commute', 'definition': 'The regular trip a person makes between their home and school or work.'},
                    {'word': 'intersection', 'definition': 'A place where two or more roads cross each other, often controlled by a traffic light.'},
                    {'word': 'carpool', 'definition': 'When multiple people share a ride in one car to the same destination to save time and money.'},
                    {'word': 'traffic jam', 'definition': 'A situation where many vehicles are stopped or moving very slowly on a road.'},
                    {'word': 'pedestrian', 'definition': 'A person who is walking, especially on streets or sidewalks.'},
                    {'word': 'fare', 'definition': 'The money you pay to use public transportation like a bus or subway.'},
                    {'word': 'GPS', 'definition': 'A navigation system that uses satellites to tell you your location and give directions.'},
                    {'word': 'freeway', 'definition': 'A wide, high-speed road designed for long-distance travel with no traffic lights.'},
                    {'word': 'parking lot', 'definition': 'An area, often paved, where cars can be parked temporarily.'},
                ],
                'expressions': [
                    {'expression': "Can you give me a ride?", 'meaning': 'Asking someone to drive you somewhere. Very common among American teenagers who do not yet have their own car.'},
                    {'expression': "I\'ll drive.", 'meaning': 'Volunteering to be the driver for a group. Common when friends are going somewhere together.'},
                    {'expression': "Take the bus.", 'meaning': 'To use the bus as your method of transportation. "I\'ll just take the bus home after practice."'},
                    {'expression': "Head out.", 'meaning': 'To leave and start going somewhere. "We should head out soon or we\'ll be late."'},
                    {'expression': "Make a left/right.", 'meaning': 'A casual way to give directions, meaning turn left or turn right at the next intersection.'},
                    {'expression': "Rush hour.", 'meaning': 'The busiest time of day on roads, usually early morning and late afternoon when people are commuting to and from work or school.'},
                ],
            },
            {
                'number': 5,
                'title': 'Shopping at the Mall',
                'outline': """LESSON OVERVIEW
The American mall is more than just a place to shop — it is a social hub for teenagers. Understanding how Americans shop, what stores are popular, and how to interact during a shopping trip gives students practical English skills tied to real cultural experiences.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Do you enjoy shopping? Where do you usually shop in Peru?
   - Have you heard of any American stores like Nike, Target, or Forever 21?
   - What do you think an American mall looks like?

2. The American Mall Experience
   - The layout of a mall: anchor stores, food court, movie theater
   - Popular stores for American teenagers: H&M, Foot Locker, Spencer's, GameStop
   - Mall culture: hanging out vs. actually buying things

3. How Shopping Works in America
   - Interacting with store employees: "Just browsing" and other key phrases
   - Sales, discounts, and loyalty programs
   - Returns and exchanges: knowing your rights as a customer

4. Cultural Deep Dive
   Tell the student about a memorable shopping trip — maybe a back-to-school shopping day with your parents, hunting for the perfect outfit for a dance, or waiting in line for a limited sneaker drop. Make it vivid and personal.

5. Conversation Practice
   Role-play: Your student is shopping for a birthday gift at an American store. Practice the full interaction: entering the store, asking an employee for help, deciding on a product, and checking out at the register.

6. Wrap-Up
   - What surprised you about how Americans shop?
   - What American store would you most want to visit?

TUTOR NOTE: Use brand names freely — they are part of authentic American culture. Asking your student which brands they recognize is a great warm-up to gauge their existing exposure.""",
                'vocabulary': [
                    {'word': 'mall', 'definition': 'A large indoor shopping center with many stores, restaurants, and sometimes entertainment options.'},
                    {'word': 'receipt', 'definition': 'A printed or digital record showing what you bought and how much you paid.'},
                    {'word': 'sale', 'definition': 'A period when a store reduces the prices of its items, often by a percentage.'},
                    {'word': 'discount', 'definition': 'A reduction in the original price of an item.'},
                    {'word': 'fitting room', 'definition': 'A small private space in a clothing store where you can try on clothes before buying them.'},
                    {'word': 'checkout', 'definition': 'The process of paying for your items at the register before leaving the store.'},
                    {'word': 'cashier', 'definition': 'The person at the register who takes your payment and gives you your receipt.'},
                    {'word': 'brand', 'definition': 'The name or logo of a company that makes specific products, like Nike or Apple.'},
                    {'word': 'clearance', 'definition': 'Deeply discounted items a store wants to sell quickly to make room for new inventory.'},
                    {'word': 'anchor store', 'definition': 'A large, well-known department store at the end of a mall that attracts shoppers, like Macy\'s or JCPenney.'},
                    {'word': 'food court', 'definition': 'An area in a mall with many fast food and casual restaurant counters and shared seating.'},
                    {'word': 'exchange', 'definition': 'Returning an item to a store and trading it for a different size, color, or product.'},
                ],
                'expressions': [
                    {'expression': "Just browsing.", 'meaning': 'What you say to a store employee when you are looking around but do not need help yet. It politely signals you want to be left alone.'},
                    {'expression': "Do you have this in a different size?", 'meaning': 'A common question when shopping for clothes. You can also say "in a different color" or "in stock."'},
                    {'expression': "It\'s on sale.", 'meaning': 'Used to describe an item whose price has been reduced. "I got these shoes for 40 dollars — they were on sale!"'},
                    {'expression': "I\'m looking for...", 'meaning': 'The standard way to tell a store employee what you need. "I\'m looking for a birthday gift for my mom."'},
                    {'expression': "Can I return this?", 'meaning': 'Asking if you can bring an item back to the store for a refund. Always check the store\'s return policy first.'},
                    {'expression': "Swipe your card.", 'meaning': 'The instruction to pay with a debit or credit card at the register by sliding or tapping it on the machine.'},
                ],
            },
            {
                'number': 6,
                'title': 'American Sports: Football and Basketball',
                'outline': """LESSON OVERVIEW
Sports are deeply woven into American identity, especially at the high school level. Football and basketball are more than games — they shape social life, school spirit, and community pride. Your tutor will bring these sports to life in a way that no rulebook ever could.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What sports do you play or watch in Peru?
   - Have you ever watched American football or basketball? What did you think?
   - Who is your favorite athlete, American or otherwise?

2. American Football: The Basics and the Culture
   - Basic rules: downs, touchdowns, field goals
   - Why Friday night football games are a huge social event in American towns
   - The Super Bowl as a cultural phenomenon, not just a game

3. Basketball: From Playgrounds to the NBA
   - How basketball is played and why it is fast and exciting
   - The difference between high school, college, and NBA basketball
   - Famous players students may already know: LeBron, Steph Curry, Kobe

4. Cultural Deep Dive
   Share a personal memory from a game you attended — the noise of the crowd, the smell of concession stand food, the tension of a close score in the final seconds. Help the student feel what it is actually like to be there.

5. Conversation Practice
   Discussion: Imagine you are watching a big game together. Your tutor explains what is happening on the field or court. Practice asking questions like "What does that mean?" and "Why is the crowd going crazy?"

6. Wrap-Up
   - Which sport sounds more exciting to you and why?
   - What is a sport in Peru that Americans might not know much about?

TUTOR NOTE: Do not assume the student knows any rules. Start from scratch and use enthusiasm — sports are a gateway to friendship in American culture.""",
                'vocabulary': [
                    {'word': 'touchdown', 'definition': 'In American football, when a player carries or catches the ball in the opposing team\'s end zone, scoring six points.'},
                    {'word': 'quarterback', 'definition': 'The player in American football who leads the offense by throwing the ball or handing it off.'},
                    {'word': 'dribble', 'definition': 'In basketball, to bounce the ball continuously while moving across the court.'},
                    {'word': 'slam dunk', 'definition': 'A powerful basketball shot where the player jumps and pushes the ball directly down through the hoop.'},
                    {'word': 'halftime', 'definition': 'The break in the middle of a sports game, during which teams rest and entertainment may be performed.'},
                    {'word': 'bleachers', 'definition': 'The rows of tiered seats in a stadium or gymnasium where spectators watch games.'},
                    {'word': 'foul', 'definition': 'An illegal action in a sport that results in a penalty for the player or team who committed it.'},
                    {'word': 'overtime', 'definition': 'Extra time added to a game when both teams are tied at the end of regular play.'},
                    {'word': 'playoff', 'definition': 'A series of games played after the regular season to determine the champion.'},
                    {'word': 'concession stand', 'definition': 'A booth or counter at a sports venue where spectators buy food and drinks like hot dogs and popcorn.'},
                    {'word': 'mascot', 'definition': 'An animal, person, or symbol that represents a sports team and rallies fan support.'},
                    {'word': 'cheerleader', 'definition': 'A person who performs organized cheers and dances at sports events to encourage the team and excite the crowd.'},
                ],
                'expressions': [
                    {'expression': "Go team!", 'meaning': 'A simple cheer shouted at sports events to encourage a team. You can also use the team name: "Go Eagles!"'},
                    {'expression': "That was a foul!", 'meaning': 'Said when someone thinks a player broke a rule. Also used informally to say something was unfair.'},
                    {'expression': "He\'s on fire.", 'meaning': 'An expression meaning a player is playing extremely well and making every shot or play. "Steph is on fire tonight!"'},
                    {'expression': "Nail-biter.", 'meaning': 'A game so close and tense that it makes you nervous. "That championship game was a total nail-biter."'},
                    {'expression': "The crowd goes wild.", 'meaning': 'Used to describe the audience getting very loud and excited, usually after a big play or score.'},
                    {'expression': "Bench player.", 'meaning': 'A player who is not in the starting lineup and waits on the bench to be substituted in during the game.'},
                ],
            },
            {
                'number': 7,
                'title': 'After-School Clubs and Activities',
                'outline': """LESSON OVERVIEW
After-school life in America is incredibly rich — students join clubs, play sports, perform in theater, compete in academic leagues, and much more. This is a world that is almost entirely invisible in English textbooks but central to American teen identity. Your tutor will walk you through what this life actually looks like.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Do you participate in any activities outside of school in Peru?
   - What kinds of clubs or activities do you think American schools have?
   - If you could join any club at an American school, what would it be?

2. The World of American Extracurriculars
   - Sports teams: tryouts, practices, and the commitment level expected
   - Arts programs: theater, band, choir, visual arts
   - Academic clubs: debate team, robotics, student government, math olympiad

3. Why Extracurriculars Matter in America
   - How activities affect college applications and social status
   - The concept of being a "well-rounded student"
   - Time management: balancing homework, activities, and a social life

4. Cultural Deep Dive
   Talk about your own extracurriculars — what you do after school, why you chose those activities, and what a typical practice or meeting looks like. Be honest about whether you love it or do it mainly for college.

5. Conversation Practice
   Role-play: Your student is a new exchange student being asked to join a club. Practice the conversation: the club member explains what the club does, and the student asks questions about time commitment, what skills are needed, and when meetings happen.

6. Wrap-Up
   - What did you learn about American after-school life that surprised you?
   - Do you think extracurriculars are important? Why or why not?

TUTOR NOTE: Be candid about which activities you genuinely enjoy versus which ones feel like obligations. That honesty makes the conversation real and memorable.""",
                'vocabulary': [
                    {'word': 'extracurricular', 'definition': 'An activity done outside of regular school classes, such as sports, clubs, or the arts.'},
                    {'word': 'tryout', 'definition': 'An audition or test where students compete for a limited number of spots on a team or in a group.'},
                    {'word': 'rehearsal', 'definition': 'A practice session for a performance, such as a play, concert, or dance show.'},
                    {'word': 'varsity', 'definition': 'The top-level competitive team at a school, as opposed to junior varsity (JV), which is the lower level.'},
                    {'word': 'debate', 'definition': 'A formal argument or discussion where two sides present opposing viewpoints on a topic.'},
                    {'word': 'yearbook', 'definition': 'An annual book produced by students that captures photos and memories of the school year.'},
                    {'word': 'commitment', 'definition': 'A promise or obligation to continue doing something consistently over time.'},
                    {'word': 'well-rounded', 'definition': 'Describing a person who has skills and experience in many different areas, not just one.'},
                    {'word': 'application', 'definition': 'A formal request to join a school, program, or club, often requiring essays or recommendations.'},
                    {'word': 'captain', 'definition': 'The elected or appointed leader of a sports team or club.'},
                    {'word': 'audition', 'definition': 'A performance or test where you show your skills to be selected for a role in a play, band, or choir.'},
                    {'word': 'roster', 'definition': 'An official list of the members or players on a team or in an organization.'},
                ],
                'expressions': [
                    {'expression': "Make the team.", 'meaning': 'To successfully pass tryouts and earn a spot on a sports team. "She worked so hard and finally made the team!"'},
                    {'expression': "Sign up for.", 'meaning': 'To register or join an activity or club. "I\'m going to sign up for theater this semester."'},
                    {'expression': "After-school activities.", 'meaning': 'A general term for all programs, clubs, and sports that happen outside of regular class hours.'},
                    {'expression': "On the team.", 'meaning': 'Being a member of a sports team or competitive group. "He has been on the swim team since freshman year."'},
                    {'expression': "Show up.", 'meaning': 'To arrive and be present, especially at a practice or meeting. It also means to perform well or make an effort.'},
                    {'expression': "Cut from the team.", 'meaning': 'To be eliminated during tryouts and not selected for the team. It can be a disappointing experience for students.'},
                ],
            },
            {
                'number': 8,
                'title': 'American Holidays and Celebrations',
                'outline': """LESSON OVERVIEW
American holidays are windows into the country's values, history, and social fabric. Many of them — like Thanksgiving and Halloween — are uniquely American experiences that students are curious about but only know from movies. Your tutor will share what these days actually feel like from the inside.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What is your favorite holiday in Peru? What do you do to celebrate?
   - Which American holiday have you heard of or seen in movies?
   - Is there anything about American holidays that confuses or surprises you?

2. The Big American Holidays
   - Halloween: costumes, trick-or-treating, parties, and haunted houses
   - Thanksgiving: the meal, the family gathering, and what it really means culturally
   - Christmas and the holiday season: decorations, gifts, and winter break

3. Holidays That Americans Take Seriously
   - The Fourth of July: fireworks, BBQs, and patriotism
   - Memorial Day and Labor Day as the unofficial start and end of summer
   - Valentine's Day and how teens celebrate it at school

4. Cultural Deep Dive
   Pick your single favorite holiday memory and describe it in full sensory detail — the food, who was there, what you wore, what the house looked like, and one moment that made you laugh or cry.

5. Conversation Practice
   Discussion: Compare a Peruvian holiday with an American holiday. What are the similarities? What is completely different? Take turns describing traditions.

6. Wrap-Up
   - Which American holiday would you most want to experience and why?
   - What Peruvian holiday do you think Americans would love if they tried it?

TUTOR NOTE: Avoid treating holidays as history lessons. Focus on the personal, emotional, and sensory aspects — what it smells like, who you see, and how it feels.""",
                'vocabulary': [
                    {'word': 'tradition', 'definition': 'A custom or way of doing something that has been passed down in a family or community over many years.'},
                    {'word': 'costume', 'definition': 'A special outfit worn to dress up as a character, animal, or theme, especially on Halloween.'},
                    {'word': 'trick-or-treat', 'definition': 'The Halloween tradition where children go door-to-door in costumes asking for candy.'},
                    {'word': 'feast', 'definition': 'A large, special meal shared with many people, often to celebrate a holiday.'},
                    {'word': 'fireworks', 'definition': 'Explosive devices that create colorful lights and loud sounds in the sky, used to celebrate events like the Fourth of July.'},
                    {'word': 'decoration', 'definition': 'Objects used to make a place look festive or beautiful for a holiday or celebration.'},
                    {'word': 'holiday', 'definition': 'A day or period when people stop working or school to celebrate a cultural, religious, or national event.'},
                    {'word': 'patriotism', 'definition': 'A strong sense of love, pride, and support for one\'s country.'},
                    {'word': 'carol', 'definition': 'A traditional song sung at Christmas, often about the holiday season or religious themes.'},
                    {'word': 'parade', 'definition': 'A public celebration where groups of people, floats, and bands march through the streets.'},
                    {'word': 'gather', 'definition': 'To come together in one place, especially for a shared event or meal.'},
                    {'word': 'resolution', 'definition': 'A personal goal or promise someone makes to themselves, especially at the start of a new year.'},
                ],
                'expressions': [
                    {'expression': "Trick or treat!", 'meaning': 'The phrase children say at doors on Halloween night while waiting for candy. It is said in a playful, friendly way.'},
                    {'expression': "Happy holidays.", 'meaning': 'A general greeting used during the winter season that covers Christmas, Hanukkah, and New Year\'s without specifying one religion.'},
                    {'expression': "Get into the holiday spirit.", 'meaning': 'To start feeling excited and festive about an upcoming holiday. "I love decorating because it helps me get into the holiday spirit."'},
                    {'expression': "It\'s a tradition.", 'meaning': 'Used to explain a repeated custom, often without needing further explanation. "We always watch football on Thanksgiving — it\'s a tradition."'},
                    {'expression': "Deck the halls.", 'meaning': 'A phrase from a Christmas carol that means to decorate your home for the holidays. Now used casually to mean putting up decorations.'},
                    {'expression': "Ring in the New Year.", 'meaning': 'To celebrate and welcome the arrival of January 1st, usually by counting down to midnight.'},
                ],
            },
            {
                'number': 9,
                'title': 'Everyday American Slang',
                'outline': """LESSON OVERVIEW
Slang is the living heartbeat of everyday American English. No textbook teaches it — you can only learn it from real people. This lesson introduces the expressions American teenagers use constantly, from text messages to hallway conversations, and helps students understand what they are actually hearing in movies, music, and online.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Have you heard any American slang words before? What were they?
   - Is there slang in Spanish that would be hard to explain to an outsider?
   - What is a word or phrase from American movies you have always wondered about?

2. Slang for Everyday Reactions
   - "That's fire" / "That slaps" — complimenting something awesome
   - "No cap" — swearing you are telling the truth
   - "Slay" / "She ate that" — saying someone did something impressively well
   - "It's giving..." — describing the vibe something gives off

3. Slang for People and Relationships
   - "Bestie" / "Bro" / "Sis" as terms of closeness
   - "Lowkey" and "highkey" to describe how much you feel something
   - "They're sus" — calling someone suspicious
   - "Ghost" — to suddenly stop talking to someone

4. Cultural Deep Dive
   Share 3 slang words you actually use every day, explain exactly when and how you use them, and give a real example from your own life. Then react when the student tries to use them.

5. Conversation Practice
   Read out a list of slang phrases and have the student guess the meaning before you explain. Then have them write a text message using at least 3 slang words from the lesson.

6. Wrap-Up
   - Which slang word was your favorite and why?
   - Which one do you think will be hardest to remember?

TUTOR NOTE: Keep this lesson fun and playful. Laugh together. Reward attempts even when wrong. The goal is joy in language learning.""",
                'vocabulary': [
                    {'word': 'slang', 'definition': 'Informal words or phrases used by a specific group of people, often young people, that are not part of standard language.'},
                    {'word': 'vibe', 'definition': 'The general feeling or atmosphere that a person, place, or situation gives off.'},
                    {'word': 'cap', 'definition': 'In modern slang, a lie. "No cap" means "I am not lying."'},
                    {'word': 'slay', 'definition': 'To do something extremely well or to look amazing. "She absolutely slayed that performance."'},
                    {'word': 'sus', 'definition': 'Short for suspicious — used to describe someone or something that seems dishonest or untrustworthy.'},
                    {'word': 'ghost', 'definition': 'To suddenly stop responding to someone\'s messages or calls without explanation.'},
                    {'word': 'lowkey', 'definition': 'To a moderate degree, or secretly. "I\'m lowkey obsessed with that show" means you like it more than you openly admit.'},
                    {'word': 'fire', 'definition': 'Slang adjective meaning excellent, amazing, or impressive. "That song is fire!"'},
                    {'word': 'bet', 'definition': 'Used to express agreement or confirmation, similar to saying "okay" or "sounds good." "I\'ll meet you at 3." — "Bet."'},
                    {'word': 'lit', 'definition': 'Exciting, fun, or excellent. "That party was so lit last night."'},
                    {'word': 'drip', 'definition': 'Fashionable clothing or accessories. Someone with "drip" dresses stylishly.'},
                    {'word': 'goat', 'definition': 'An acronym for Greatest Of All Time. Used to describe someone who is the best at what they do.'},
                ],
                'expressions': [
                    {'expression': "No cap.", 'meaning': 'Means "I am being completely honest." Used to emphasize that what you just said is 100% true. "That was the best burger I\'ve ever had, no cap."'},
                    {'expression': "It\'s giving...", 'meaning': 'Used to describe what kind of energy or vibe something has. "This song is giving summer vibes." Can be positive or negative.'},
                    {'expression': "Slay!", 'meaning': 'An exclamation of approval and admiration when someone does something impressive. "You got an A on the test? Slay!"'},
                    {'expression': "That slaps.", 'meaning': 'Means something is really good, usually used for music. "Have you heard her new album? It absolutely slaps."'},
                    {'expression': "Lowkey obsessed.", 'meaning': 'Saying you really like something but in a relaxed or slightly embarrassed way. "I\'m lowkey obsessed with that cooking show."'},
                    {'expression': "He ghosted me.", 'meaning': 'Means someone suddenly stopped all contact with you without explanation. Common in friendship and dating contexts.'},
                ],
            },
            {
                'number': 10,
                'title': 'Texting and Social Media Basics',
                'outline': """LESSON OVERVIEW
American teenagers communicate almost entirely through text abbreviations, social media platforms, and digital shorthand. Understanding these is essential to understanding American youth culture. This lesson covers the most common abbreviations, how different platforms are used, and the unwritten rules of digital communication.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What social media platforms do you use most in Peru?
   - Do you use abbreviations when you text? Which ones?
   - What apps do you think American teenagers use the most?

2. Text Abbreviations Americans Use Every Day
   - LOL, OMG, NGL (not gonna lie), TBH (to be honest), IDK (I don't know)
   - BRB (be right back), SMH (shaking my head), IRL (in real life)
   - IYKYK (if you know you know), FWIW (for what it's worth)

3. Social Media Platforms and How They Are Used
   - Instagram: photos, stories, reels, and the pressure of likes
   - TikTok: short videos, trends, sounds, and going viral
   - Snapchat: disappearing messages and streaks between friends
   - Twitter/X: opinions, news, memes, and public conversation

4. Cultural Deep Dive
   Show the student a screenshot of a real text conversation (with personal info removed) or describe a funny texting exchange. Explain the tone, the abbreviations, and the unwritten rules — like how a period at the end of a text sounds angry.

5. Conversation Practice
   Have the student reply to a series of text messages using abbreviations and casual language. Example: "omg did u see that?? lol" — how do you respond naturally?

6. Wrap-Up
   - Which abbreviation was the most confusing or surprising?
   - How is digital communication in Peru different from what you learned today?

TUTOR NOTE: Be current — platforms and abbreviations change fast. Share what you actually use today. If something is outdated, say so honestly.""",
                'vocabulary': [
                    {'word': 'abbreviation', 'definition': 'A shortened form of a word or phrase, often used in texting to save time.'},
                    {'word': 'streak', 'definition': 'On Snapchat, a streak is a record of consecutive days two people have sent each other snaps. Keeping streaks is a social obligation for many teens.'},
                    {'word': 'viral', 'definition': 'When a piece of content spreads rapidly and is seen by a very large number of people online.'},
                    {'word': 'reel', 'definition': 'A short video on Instagram, typically 15 to 90 seconds, set to music or audio.'},
                    {'word': 'meme', 'definition': 'A funny image, video, or text that spreads rapidly across the internet, often with a shared cultural reference.'},
                    {'word': 'story', 'definition': 'A photo or video post on Instagram or Snapchat that disappears after 24 hours.'},
                    {'word': 'dm', 'definition': 'Direct message — a private message sent to one person on a social media platform.'},
                    {'word': 'notification', 'definition': 'An alert on your phone or computer telling you about new activity, like a like, comment, or message.'},
                    {'word': 'feed', 'definition': 'The main stream of posts you see when you open a social media app, made up of content from people you follow.'},
                    {'word': 'follower', 'definition': 'A person who subscribes to your social media account to see your posts.'},
                    {'word': 'hashtag', 'definition': 'The symbol # placed before a word or phrase to categorize posts and make them searchable on social media.'},
                    {'word': 'trending', 'definition': 'Something that is currently very popular and widely discussed online.'},
                ],
                'expressions': [
                    {'expression': "LOL", 'meaning': 'Stands for "laughing out loud." Used to show something is funny, though it is often used casually even when someone is not actually laughing.'},
                    {'expression': "NGL", 'meaning': 'Stands for "not gonna lie." Used to introduce an honest or sometimes embarrassing confession. "NGL, I cried during that movie."'},
                    {'expression': "TBH", 'meaning': 'Stands for "to be honest." Used before a candid or direct opinion. "TBH I think that song is overrated."'},
                    {'expression': "IYKYK", 'meaning': 'Stands for "if you know, you know." Used when referencing something that only a specific group will understand, often with a tone of exclusivity.'},
                    {'expression': "Sliding into DMs.", 'meaning': 'Sending a private message to someone on social media, often used in the context of romantic interest. "He slid into her DMs after the game."'},
                    {'expression': "Going viral.", 'meaning': 'When a video, post, or image spreads very quickly and is seen by millions of people. "Her dance video went viral overnight."'},
                ],
            },
            {
                'number': 11,
                'title': 'Making Friends in America',
                'outline': """LESSON OVERVIEW
Friendship in America has its own unwritten rules and patterns. Americans can seem very friendly at first — smiling, chatting, saying "we should hang out" — but deeper friendships take time. This lesson explores how American teenagers actually make and keep friends, and how it might feel different for someone from another country.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - How did you meet your best friend?
   - Do you think it is easy or hard to make friends in a new place?
   - What do you imagine it would be like to be the new kid at an American school?

2. How American Friendships Start
   - Small talk as a gateway to friendship
   - Shared activities: sports, classes, lunch tables, and group chats
   - Why "we should hang out sometime" does not always mean anything specific

3. Different Kinds of Friends in America
   - Acquaintances vs. close friends vs. best friends
   - Friend groups and why where you sit at lunch matters
   - Online friends and whether they count as real friends

4. Cultural Deep Dive
   Tell the student about a friendship that started in an unexpected way — maybe someone you met in a class you hated, a teammate who became your closest friend, or a friendship that faded and why. Be honest and human.

5. Conversation Practice
   Role-play: You are at a school event and your student is a new exchange student. Practice striking up a genuine conversation, exchanging contact information, and making a real plan to hang out.

6. Wrap-Up
   - What do you think is the most important ingredient in a good friendship?
   - Do you think friendship looks different in Peru than in America?

TUTOR NOTE: Vulnerability is the point here. The more honestly you share about your own friendships, the more the student will open up. Avoid giving a lecture — have a real conversation.""",
                'vocabulary': [
                    {'word': 'acquaintance', 'definition': 'A person you know slightly but who is not a close friend.'},
                    {'word': 'bond', 'definition': 'A close connection or relationship built through shared experiences or trust.'},
                    {'word': 'hang out', 'definition': 'To spend time with friends in a relaxed, informal way.'},
                    {'word': 'small talk', 'definition': 'Light, casual conversation about unimportant topics, used to be polite or to start a relationship.'},
                    {'word': 'clique', 'definition': 'A small, exclusive group of friends who spend most of their time together and are not very open to outsiders.'},
                    {'word': 'peer', 'definition': 'Someone of the same age or social group as you.'},
                    {'word': 'trust', 'definition': 'The belief that someone is reliable, honest, and will not hurt you.'},
                    {'word': 'loyalty', 'definition': 'The quality of being faithful and supportive to someone even in difficult times.'},
                    {'word': 'awkward', 'definition': 'Feeling uncomfortable or embarrassed in a social situation.'},
                    {'word': 'icebreaker', 'definition': 'A game or activity designed to help people relax and get to know each other for the first time.'},
                    {'word': 'mutual', 'definition': 'Something shared by two or more people, like a mutual friend — someone both of you know.'},
                    {'word': 'drift apart', 'definition': 'When two friends slowly lose contact and become less close over time without a specific reason.'},
                ],
                'expressions': [
                    {'expression': "We should hang out.", 'meaning': 'A casual suggestion to spend time together. In America, this is often said without a specific plan. Follow up with "When are you free?" to make it real.'},
                    {'expression': "We have a lot in common.", 'meaning': 'Used when two people share interests, values, or experiences. A great sign of a budding friendship.'},
                    {'expression': "Break the ice.", 'meaning': 'To do or say something to make a social situation less awkward and get a conversation started with someone new.'},
                    {'expression': "Keep in touch.", 'meaning': 'Said when saying goodbye to encourage someone to continue communicating. "It was great meeting you — keep in touch!"'},
                    {'expression': "Hit it off.", 'meaning': 'When two people instantly like each other and have a great first interaction. "We met at practice and totally hit it off."'},
                    {'expression': "A friend of a friend.", 'meaning': 'Someone you do not know personally but who is connected to you through a mutual friend. Many American friendships start this way.'},
                ],
            },
            {
                'number': 12,
                'title': 'American Family Life',
                'outline': """LESSON OVERVIEW
American families look very different from each other and from families in many other countries. This lesson explores what family life actually looks like for American teenagers — the routines, the structure, the role of parents, and how family shapes a teen's daily experience.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Tell me about your family. Who do you live with?
   - What is a typical weeknight like in your home?
   - What do you think family life looks like for an American teenager?

2. What American Families Look Like
   - Nuclear families, single-parent households, blended families, and extended families
   - The concept of "immediate family" vs. the wider family network
   - How family size and structure vary widely across America

3. Daily Family Routines and Dynamics
   - Family dinners: the tradition and how rare they have become
   - Chores and household responsibilities for American kids
   - How much independence American teenagers typically have

4. Cultural Deep Dive
   Describe your own family dynamic honestly — who makes the rules, what dinner looks like, what you argue about, and what you love about your family. Share something personal and real that the student would not learn from a textbook.

5. Conversation Practice
   Discussion: Compare family life in Peru and in America. Talk about rules, independence, meals, and how teenagers relate to their parents in each culture. What would feel strange in the other culture?

6. Wrap-Up
   - What surprised you most about American family life?
   - What part of family life in Peru do you think is really special?

TUTOR NOTE: Be respectful that family is a deeply personal topic. Share your own experience generously and let the student lead on how much they share about theirs.""",
                'vocabulary': [
                    {'word': 'nuclear family', 'definition': 'A family unit consisting of two parents and their children, living together in one home.'},
                    {'word': 'blended family', 'definition': 'A family where one or both parents have children from previous relationships, all living together.'},
                    {'word': 'guardian', 'definition': 'A person who is legally responsible for a child, which may or may not be a biological parent.'},
                    {'word': 'chores', 'definition': 'Regular household tasks that family members are expected to do, such as washing dishes or vacuuming.'},
                    {'word': 'curfew', 'definition': 'The time by which a teenager must be home at night, set by their parents.'},
                    {'word': 'allowance', 'definition': 'A regular amount of money given to a child by their parents, often in exchange for doing chores.'},
                    {'word': 'grounded', 'definition': 'A punishment where a teenager is not allowed to leave the house or use electronics for a period of time.'},
                    {'word': 'sibling', 'definition': 'A brother or sister.'},
                    {'word': 'household', 'definition': 'All the people who live together in one home, treated as a unit.'},
                    {'word': 'independence', 'definition': 'The freedom and ability to make your own choices and take care of yourself without relying on others.'},
                    {'word': 'routine', 'definition': 'A regular set of activities done in the same order at the same time each day.'},
                    {'word': 'extended family', 'definition': 'Relatives beyond the immediate family, including grandparents, aunts, uncles, and cousins.'},
                ],
                'expressions': [
                    {'expression': "Family dinner.", 'meaning': 'A meal where the whole family sits and eats together, traditionally considered an important bonding time in American culture.'},
                    {'expression': "Ground someone.", 'meaning': 'When parents punish a teenager by restricting their freedom — no going out, no phone, no social life. "I got grounded for a week."'},
                    {'expression': "Empty nester.", 'meaning': 'A parent whose children have grown up and moved out of the house, leaving the home feeling empty.'},
                    {'expression': "Quality time.", 'meaning': 'Time spent together that is meaningful and focused, not just being in the same room. Parents often talk about wanting quality time with their kids.'},
                    {'expression': "Set a curfew.", 'meaning': 'When parents establish a time by which their child must return home. "My parents set my curfew at 10 p.m. on weekends."'},
                    {'expression': "My parents are strict.", 'meaning': 'Used to describe parents who have many rules and enforce them seriously. A very common topic of conversation among American teenagers.'},
                ],
            },
            {
                'number': 13,
                'title': 'Music and Pop Culture',
                'outline': """LESSON OVERVIEW
American music and pop culture are exported around the world, but understanding them from the inside — with context, history, and personal connection — is something only a real American peer can give. This lesson explores music genres, artists, and the role pop culture plays in everyday teen life.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What music do you listen to? Do you listen to any American artists?
   - Who is a famous American singer or rapper you have heard of?
   - What does pop culture mean to you?

2. American Music Genres Students Should Know
   - Pop: the mainstream sound — Taylor Swift, Olivia Rodrigo, Doja Cat
   - Hip-hop and rap: cultural roots and modern artists — Drake, Kendrick Lamar, Tyler the Creator
   - Country: what it sounds like and why it matters in America
   - R&B: soulful music with a long history — SZA, Frank Ocean, The Weeknd

3. Music and Teen Identity
   - How music taste defines your social group and personality
   - Concerts, festivals, and what the experience is like
   - How music goes viral on TikTok and shapes trends

4. Cultural Deep Dive
   Talk about your all-time favorite song or album. Not what is popular — your personal favorite. Describe the first time you heard it, what it makes you feel, and a memory tied to it. Play it if you can.

5. Conversation Practice
   Take turns: each person shares their favorite song right now and explains in 3 sentences why they love it. Then ask each other two questions about the music.

6. Wrap-Up
   - Which American music genre interests you most after today?
   - What Peruvian music would you want your tutor to listen to?

TUTOR NOTE: Share real, current taste. Do not default to "safe" artists. Authentic passion is contagious and shows the student what genuine cultural engagement looks like.""",
                'vocabulary': [
                    {'word': 'genre', 'definition': 'A category of music defined by a shared style, rhythm, or cultural origin, such as pop, hip-hop, or country.'},
                    {'word': 'lyrics', 'definition': 'The words of a song.'},
                    {'word': 'album', 'definition': 'A collection of songs released together as a complete artistic work by a musician or band.'},
                    {'word': 'streaming', 'definition': 'Listening to or watching media over the internet without downloading it, using services like Spotify or Apple Music.'},
                    {'word': 'playlist', 'definition': 'A curated list of songs grouped together, often by mood, activity, or theme.'},
                    {'word': 'chart', 'definition': 'A ranked list of the most popular songs or albums based on sales or streaming numbers.'},
                    {'word': 'drop', 'definition': 'When an artist suddenly releases new music, often with little advance notice. "Taylor Swift just dropped a new album!"'},
                    {'word': 'fan', 'definition': 'A person who strongly admires and follows a musician, actor, or public figure.'},
                    {'word': 'collab', 'definition': 'Short for collaboration — when two or more artists work together on a song or project.'},
                    {'word': 'beat', 'definition': 'The rhythmic foundation of a song, especially in hip-hop and pop, created by a producer.'},
                    {'word': 'hook', 'definition': 'The catchy, repeating part of a song — usually the chorus — that sticks in your head.'},
                    {'word': 'mainstream', 'definition': 'Music or culture that is widely popular and accepted by the general public, as opposed to underground or indie.'},
                ],
                'expressions': [
                    {'expression': "This song is a bop.", 'meaning': 'Means a song is catchy, fun, and great to listen to. "Have you heard her new single? Total bop."'},
                    {'expression': "I\'m obsessed with this album.", 'meaning': 'A strong way to say you love a piece of music intensely. Americans use "obsessed" hyperbolically to mean deeply enthusiastic.'},
                    {'expression': "That song is stuck in my head.", 'meaning': 'When you cannot stop mentally hearing a song even when it is not playing. Also called an "earworm."'},
                    {'expression': "Drop the playlist.", 'meaning': 'Asking someone to share their music playlist, often digitally. "Your taste is so good — drop the playlist!"'},
                    {'expression': "Live for this song.", 'meaning': 'An expression of intense love for a piece of music. "I literally live for this song — it gets me every time."'},
                    {'expression': "Fan base.", 'meaning': 'The group of dedicated fans that support an artist. Some fan bases have names, like Taylor Swift\'s "Swifties."'},
                ],
            },
            {
                'number': 14,
                'title': 'Movies and TV Shows',
                'outline': """LESSON OVERVIEW
Hollywood shapes global culture, and American television defines how millions of people around the world spend their evenings. But watching a movie or show with an American is completely different from watching alone — the context, the references, and the shared reactions make it real. This lesson connects students to American screen culture through personal recommendation and conversation.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What is your favorite movie or TV show of all time?
   - Have you watched any American movies or shows with subtitles?
   - What American film or show have you always wanted to watch?

2. American TV: What Everyone Is Watching
   - Streaming wars: Netflix, Hulu, Disney+, HBO Max, and how Americans choose what to watch
   - Binge-watching culture and why Americans talk about "avoiding spoilers"
   - Popular teen shows: Stranger Things, Euphoria, Outer Banks — what they say about American culture

3. Hollywood Movies and American Life
   - Blockbusters vs. indie films and why the difference matters
   - The Oscars as a cultural event
   - How movies portray American high school (and why it is often wrong)

4. Cultural Deep Dive
   Recommend one movie or show as if you are a critic — describe the plot without spoilers, explain why it matters, and share a scene or moment that really affected you. Make your tutor want to watch it.

5. Conversation Practice
   Role-play: One person is recommending a show to a friend who has nothing to watch. Practice giving a convincing recommendation, handling pushback ("Is it too long? Is it scary?"), and agreeing on something to watch.

6. Wrap-Up
   - What is one American movie or show you now want to watch as homework?
   - How do movies help you learn English in a way classes cannot?

TUTOR NOTE: Avoid listing shows without passion. The point is authentic recommendation. Pick the shows and movies that actually matter to you and share them with real enthusiasm.""",
                'vocabulary': [
                    {'word': 'streaming', 'definition': 'Watching video content over the internet in real time through a service like Netflix or Hulu.'},
                    {'word': 'binge-watch', 'definition': 'To watch multiple episodes of a TV series in rapid succession, often in one sitting.'},
                    {'word': 'spoiler', 'definition': 'Information that reveals key plot details of a movie or show before someone has had a chance to watch it.'},
                    {'word': 'sequel', 'definition': 'A film or show that continues the story of a previously released one.'},
                    {'word': 'plot', 'definition': 'The sequence of events that make up the story of a movie or TV show.'},
                    {'word': 'cast', 'definition': 'The complete group of actors who appear in a movie or TV show.'},
                    {'word': 'premiere', 'definition': 'The first public showing or airing of a movie or TV series.'},
                    {'word': 'cliffhanger', 'definition': 'An ending to an episode or scene that is unresolved and creates suspense, making you want to watch more.'},
                    {'word': 'blockbuster', 'definition': 'A movie produced on a large budget that is expected to be a major commercial hit.'},
                    {'word': 'screenplay', 'definition': 'The written script of a movie, including dialogue and scene descriptions.'},
                    {'word': 'director', 'definition': 'The person responsible for overseeing the artistic and creative vision of a film.'},
                    {'word': 'genre', 'definition': 'A category of film or TV defined by its style, such as comedy, drama, horror, or action.'},
                ],
                'expressions': [
                    {'expression': "No spoilers!", 'meaning': 'A warning or request not to reveal plot details about a movie or show you have not seen yet. Taken very seriously in American pop culture.'},
                    {'expression': "I\'m hooked.", 'meaning': 'You are so interested in a show or movie that you cannot stop watching. "I watched one episode and I was completely hooked."'},
                    {'expression': "Worth watching.", 'meaning': 'A recommendation that something is good enough to deserve your time. "It\'s slow at first, but totally worth watching."'},
                    {'expression': "Just dropped.", 'meaning': 'Used when a new season, movie, or episode was just released. "Season 3 just dropped on Netflix!"'},
                    {'expression': "On the edge of my seat.", 'meaning': 'Describes feeling intense suspense during a movie or show. "The finale had me on the edge of my seat the whole time."'},
                    {'expression': "I\'ve seen it a million times.", 'meaning': 'Hyperbolic way to say you have watched something very many times because you love it so much.'},
                ],
            },
            {
                'number': 15,
                'title': 'Simple Workplace Conversations',
                'outline': """LESSON OVERVIEW
Many American teenagers have part-time jobs — at fast food restaurants, retail stores, summer camps, and more. The workplace has its own language and etiquette that is very different from school. This lesson introduces students to basic professional conversation and gives them a peek at what working in America actually looks like for a young person.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Do you or anyone in your family have a job? What do they do?
   - Do you think you would want to work a part-time job as a teenager?
   - What jobs do you think American teenagers commonly have?

2. Common Teen Jobs in America
   - Food service: cashier, server, prep cook at fast food or restaurants
   - Retail: stocking shelves, helping customers, working the register
   - Babysitting, lawn care, tutoring as informal income sources

3. How to Communicate at Work
   - Greeting customers professionally vs. greeting friends casually
   - Asking a manager a question or reporting a problem
   - Calling in sick: what to say and how to say it

4. Cultural Deep Dive
   Describe your first job or the first job someone in your family had as a teenager. Talk about the awkward first week, the rules you had to follow, the people you worked with, and whether you enjoyed it.

5. Conversation Practice
   Role-play: Your student is applying for a job at a coffee shop. Practice a basic job interview: introducing yourself, answering "Tell me about yourself," and asking one question at the end.

6. Wrap-Up
   - What part of American work culture surprised you?
   - Do you think you would be a good employee? Why?

TUTOR NOTE: Keep the tone encouraging. Many students find professional English intimidating. Normalize the nervousness and share your own experience of feeling unprepared in a work situation.""",
                'vocabulary': [
                    {'word': 'shift', 'definition': 'A scheduled period of time during which an employee works, such as a morning shift or a closing shift.'},
                    {'word': 'manager', 'definition': 'A person who is in charge of employees and responsible for the daily operations of a business.'},
                    {'word': 'minimum wage', 'definition': 'The lowest amount of money an employer is legally allowed to pay workers per hour.'},
                    {'word': 'applicant', 'definition': 'A person who formally applies for a job or position.'},
                    {'word': 'resume', 'definition': 'A document summarizing a person\'s work experience, skills, and education, submitted when applying for a job.'},
                    {'word': 'interview', 'definition': 'A formal meeting between a job applicant and an employer to evaluate whether the applicant is right for the position.'},
                    {'word': 'tip', 'definition': 'Extra money customers give service workers beyond the bill as thanks for good service.'},
                    {'word': 'uniform', 'definition': 'A specific outfit required by an employer for all employees to wear during work.'},
                    {'word': 'break', 'definition': 'A short period of rest during a work shift when an employee is not required to work.'},
                    {'word': 'paycheck', 'definition': 'A check or direct deposit from an employer giving an employee their earned wages for the pay period.'},
                    {'word': 'customer service', 'definition': 'The practice of helping and assisting customers in a pleasant and professional way.'},
                    {'word': 'part-time', 'definition': 'Working fewer hours than a full-time employee, typically fewer than 35 hours per week.'},
                ],
                'expressions': [
                    {'expression': "How can I help you?", 'meaning': 'The standard greeting used by American employees when a customer approaches. Professional and friendly.'},
                    {'expression': "Call in sick.", 'meaning': 'To phone or message your employer to let them know you are too ill to come to work. "I had to call in sick because I had a fever."'},
                    {'expression': "On the clock.", 'meaning': 'When you are officially working and being paid. "No personal calls while you\'re on the clock."'},
                    {'expression': "Give two weeks notice.", 'meaning': 'The professional standard of telling your employer two weeks before you plan to quit, so they have time to find a replacement.'},
                    {'expression': "Go above and beyond.", 'meaning': 'To do more than what is expected or required. "She always goes above and beyond — that\'s why she got promoted."'},
                    {'expression': "Clock out.", 'meaning': 'To officially end your work shift by recording the time you stop working. "I can\'t wait to clock out — it\'s been a long day."'},
                ],
            },
            {
                'number': 16,
                'title': 'Health and Wellness Basics',
                'outline': """LESSON OVERVIEW
Health and wellness in America is a huge cultural topic — from what people eat to how they exercise to how they handle stress. American teenagers face unique health pressures around body image, mental health, and the expectation to always be "doing well." This lesson builds practical health vocabulary while sparking an honest, human conversation.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What do you do to stay healthy?
   - How do you feel when you are stressed? What helps you feel better?
   - What does "being healthy" mean to you?

2. Physical Health in America
   - Going to the doctor: appointments, health insurance, and co-pays
   - Exercise culture: gyms, running, school sports, and fitness apps
   - Food and diet: healthy eating vs. American fast food reality

3. Mental Health: A Growing Conversation in America
   - Why teens talk openly about anxiety, depression, and therapy more than previous generations
   - Common stressors for American teens: grades, college, social media, family
   - Simple coping strategies: journaling, talking to someone, taking a break

4. Cultural Deep Dive
   Be honest about a time you felt really stressed or overwhelmed — by school, by a relationship, by something you did not tell anyone. Share how you dealt with it and whether it helped. This normalizes the conversation.

5. Conversation Practice
   Discussion: What do you do when you feel stressed or sick? Compare home remedies, habits, and attitudes toward mental health between Peru and America. Are there things that feel taboo to talk about?

6. Wrap-Up
   - What is one thing you can do this week to take care of your health?
   - What surprised you about how Americans think about health?

TUTOR NOTE: Mental health is a sensitive topic. Lead with your own experience first. Do not push the student to share if they seem uncomfortable. Normalize the subject gently.""",
                'vocabulary': [
                    {'word': 'appointment', 'definition': 'A scheduled meeting, often with a doctor, that you arrange in advance.'},
                    {'word': 'insurance', 'definition': 'A system where you pay regular fees so that medical costs are covered if you get sick or injured.'},
                    {'word': 'prescription', 'definition': 'A doctor\'s written order for a specific medicine for a patient.'},
                    {'word': 'symptom', 'definition': 'A physical or mental sign that indicates a disease or health condition, such as fever or headache.'},
                    {'word': 'anxiety', 'definition': 'A feeling of worry, nervousness, or fear about something with an uncertain outcome.'},
                    {'word': 'therapy', 'definition': 'Treatment for mental health conditions through regular conversations with a trained professional.'},
                    {'word': 'wellness', 'definition': 'The active pursuit of good physical and mental health as a way of life.'},
                    {'word': 'nutrition', 'definition': 'The study of how food and drink affect the body and its health.'},
                    {'word': 'hydration', 'definition': 'The process of maintaining enough water in the body for it to function properly.'},
                    {'word': 'routine', 'definition': 'A regular set of habits or behaviors done consistently, especially for health benefits.'},
                    {'word': 'stress', 'definition': 'A feeling of emotional or physical tension caused by demanding or difficult situations.'},
                    {'word': 'burnout', 'definition': 'A state of physical and emotional exhaustion caused by prolonged stress or overwork.'},
                ],
                'expressions': [
                    {'expression': "Under the weather.", 'meaning': 'Feeling slightly ill or unwell. "I can\'t come to practice today — I\'m feeling a little under the weather."'},
                    {'expression': "Take a mental health day.", 'meaning': 'To stay home from school or work to rest and recover emotionally, not due to physical illness. Increasingly accepted in American culture.'},
                    {'expression': "Burn out.", 'meaning': 'To become exhausted and lose motivation from doing too much for too long. "She burned out after taking five AP classes."'},
                    {'expression': "Check in with yourself.", 'meaning': 'To pause and reflect on how you are feeling emotionally and physically. Common in wellness and mental health conversations.'},
                    {'expression': "Sweat it out.", 'meaning': 'To exercise hard as a way to relieve stress or feel better. "I was anxious all day, so I went for a run to sweat it out."'},
                    {'expression': "I\'m not feeling well.", 'meaning': 'A clear and simple way to tell someone you are sick or unwell, appropriate in any situation.'},
                ],
            },
            {
                'number': 17,
                'title': 'School Grades, Tests, and Report Cards',
                'outline': """LESSON OVERVIEW
The American grading system is different from Peru's — and the pressure around grades, GPA, and standardized tests shapes every American student's high school experience. Understanding this system helps students communicate about academic life and also reveals a lot about American values around achievement and success.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - How does grading work at your school in Peru?
   - Do you consider yourself a good student? What does that mean to you?
   - What do you think American students stress about most in school?

2. The American Grading System
   - Letter grades: A, B, C, D, F — what each means and what scores they correspond to
   - GPA (Grade Point Average): how it is calculated and why it matters
   - The difference between weighted and unweighted GPA (for honors and AP classes)

3. Tests, Quizzes, and High-Stakes Exams
   - Regular tests vs. midterms and finals
   - Standardized tests: the SAT and ACT, and why they loom so large
   - Extra credit and grade curving — strategies students use to boost their grades

4. Cultural Deep Dive
   Share your honest experience with grades — a test you bombed, a grade you were proud of, how your parents react to your report card, and whether you think grades define you as a person.

5. Conversation Practice
   Discussion: Compare how grading and academic pressure work in Peru vs. America. Is there more pressure in one system? Do you think grades are a fair way to measure a student's intelligence?

6. Wrap-Up
   - After today, what do you understand about American school pressure that you did not before?
   - Do you think you would do well in the American grading system?

TUTOR NOTE: Be real about the pressure you feel. Students connect deeply when tutors admit that grades are stressful. This session can double as a discussion about academic identity and self-worth.""",
                'vocabulary': [
                    {'word': 'GPA', 'definition': 'Grade Point Average — a number calculated from all your grades that represents your overall academic performance, typically on a 4.0 scale.'},
                    {'word': 'transcript', 'definition': 'An official record of a student\'s grades and courses taken throughout their school career.'},
                    {'word': 'semester', 'definition': 'One of two halves of the academic school year, each typically lasting about 18 weeks.'},
                    {'word': 'final exam', 'definition': 'A comprehensive test given at the end of a semester covering all the material from that course.'},
                    {'word': 'extra credit', 'definition': 'Optional work that allows students to earn additional points to improve their grade.'},
                    {'word': 'honor roll', 'definition': 'A list of students who have achieved a GPA above a certain threshold, typically a 3.5 or higher.'},
                    {'word': 'valedictorian', 'definition': 'The student with the highest GPA in their graduating class, who traditionally gives a speech at graduation.'},
                    {'word': 'curve', 'definition': 'When a teacher adjusts all students\' scores upward because the test was too difficult or scores were lower than expected.'},
                    {'word': 'report card', 'definition': 'A periodic document sent home to parents showing a student\'s grades in each subject.'},
                    {'word': 'pass/fail', 'definition': 'A grading system where a student either passes or fails a course rather than receiving a letter grade.'},
                    {'word': 'AP class', 'definition': 'Advanced Placement class — a college-level course taken in high school that can earn college credit if the student passes the AP exam.'},
                    {'word': 'midterm', 'definition': 'An exam given at the halfway point of a semester, covering all material taught up to that point.'},
                ],
                'expressions': [
                    {'expression': "Ace the test.", 'meaning': 'To get a very high score on a test, usually an A. "She studied all weekend and aced the final exam."'},
                    {'expression': "Bomb a test.", 'meaning': 'To do very poorly on a test. "I completely bombed the chemistry midterm — I wasn\'t prepared at all."'},
                    {'expression': "On the honor roll.", 'meaning': 'Being recognized for achieving high grades. Parents and students consider this a point of pride.'},
                    {'expression': "Pull an all-nighter.", 'meaning': 'To stay awake all night, usually to study for an exam. Very common before finals week. "I pulled an all-nighter before the SAT."'},
                    {'expression': "Extra credit.", 'meaning': 'Additional optional work that can raise your grade. Students often ask "Is there any extra credit?" when their grade is low.'},
                    {'expression': "What did you get?", 'meaning': 'The classic question American students ask each other after a test is returned. It means "What was your score?"'},
                ],
            },
            {
                'number': 18,
                'title': 'Weekend Activities and Recreation',
                'outline': """LESSON OVERVIEW
Weekends are when American teens truly reveal who they are outside of school. Whether they are at the mall, a park, a friend's house, a game, or just on their couch watching Netflix, weekend life is rich with cultural meaning. This lesson gives students a real window into how American teenagers recharge and have fun.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What do you usually do on weekends in Peru?
   - What is your idea of a perfect weekend?
   - Do you prefer spending weekends with family or with friends?

2. What American Teens Do on Weekends
   - Hanging out: going to the mall, driving around, watching movies at a friend's house
   - Outdoor activities: hiking, sports, beach trips, going to the park
   - Weekend jobs and volunteering for teenagers who work or do community service

3. American Recreation Culture
   - Sports leagues and recreational teams beyond school
   - Theme parks, fairs, and festivals as seasonal weekend destinations
   - The importance of doing "nothing" — how Americans relax and decompress

4. Cultural Deep Dive
   Describe your own perfect Saturday in detail — from the moment you wake up to when you go to sleep. Include everything: what you eat, who you are with, what you watch or play, and one moment that made you genuinely happy.

5. Conversation Practice
   Role-play: It is Friday afternoon and your student just finished school. You are planning the weekend together. What should you do? Practice suggesting options, agreeing or disagreeing, and making a plan.

6. Wrap-Up
   - What American weekend activity sounds most fun to you?
   - What is something you do on weekends in Peru that you would want to share with an American friend?

TUTOR NOTE: This is a light, fun session. Let it be joyful and spontaneous. The goal is fluent, natural conversation about everyday life.""",
                'vocabulary': [
                    {'word': 'recreation', 'definition': 'Activities done for enjoyment and relaxation during free time.'},
                    {'word': 'leisure', 'definition': 'Time when you are not working or studying and can do whatever you enjoy.'},
                    {'word': 'hang out', 'definition': 'To spend time relaxing with friends without a specific structured plan.'},
                    {'word': 'road trip', 'definition': 'A long journey by car, often for fun or travel, taken alone or with friends and family.'},
                    {'word': 'bonfire', 'definition': 'A large outdoor fire made for warmth, celebration, or socializing, often at beaches or parks.'},
                    {'word': 'sleepover', 'definition': 'When a friend stays overnight at your house, a classic American social tradition especially among younger teens.'},
                    {'word': 'pickup game', 'definition': 'An informal, unplanned sports game organized spontaneously by whoever shows up to a court or field.'},
                    {'word': 'theme park', 'definition': 'A large amusement park built around a specific theme, like Disney World or Six Flags, with rides and entertainment.'},
                    {'word': 'fair', 'definition': 'A seasonal outdoor event with rides, games, food, and entertainment, often featuring local agriculture or crafts.'},
                    {'word': 'suburb', 'definition': 'A residential community outside of a city where many American families live with more space and less urban density.'},
                    {'word': 'downtown', 'definition': 'The central area of a city, typically with restaurants, shops, theaters, and entertainment.'},
                    {'word': 'movie night', 'definition': 'An informal gathering where friends or family watch one or more movies together, usually at home.'},
                ],
                'expressions': [
                    {'expression': "What are you up to this weekend?", 'meaning': 'A casual way to ask someone about their plans for the weekend. Very common among American friends and classmates.'},
                    {'expression': "I\'m free Saturday.", 'meaning': 'Used to tell someone you have no plans and are available to do something together on Saturday.'},
                    {'expression': "Let\'s do something.", 'meaning': 'A vague but enthusiastic suggestion to make plans with a friend without specifying exactly what.'},
                    {'expression': "Stay in.", 'meaning': 'To choose to remain at home rather than going out. "I was so tired — I just stayed in and watched TV all weekend."'},
                    {'expression': "Go out.", 'meaning': 'To leave the house for a social activity, like visiting a restaurant, attending an event, or meeting friends.'},
                    {'expression': "Make plans.", 'meaning': 'To arrange specific activities with other people. "We should make plans before the weekend fills up."'},
                ],
            },
            {
                'number': 19,
                'title': 'Dreams and Future Goals',
                'outline': """LESSON OVERVIEW
Talking about dreams and goals is one of the most personal and meaningful conversations you can have — and it is central to American culture, where the idea that "you can be anything you want to be" is deeply embedded. This lesson creates space for genuine reflection and helps students practice aspirational language in English.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What do you want to be when you grow up — or have you already decided?
   - What is one dream you have that you have not told many people?
   - Do you think dreams usually come true? Why or why not?

2. How Americans Think About the Future
   - The concept of the "American Dream" and how it shapes ambition
   - College as the default path — and why some teens are questioning it
   - Career goals vs. passion projects: the difference between what you do and who you are

3. Talking About Goals in English
   - Using "I want to," "I hope to," "I plan to," and "I dream of"
   - The difference between a goal and a wish
   - How to talk about setbacks: "I tried but..." and "I changed my mind about..."

4. Cultural Deep Dive
   Share your genuine goals — where you want to go to college, what career you are considering, and one personal dream that has nothing to do with career. Be vulnerable. Tell the student about a goal you gave up and why, and one you still hold onto.

5. Conversation Practice
   Each person shares: one goal for this year, one goal for five years from now, and one big dream. Then ask each other one follow-up question about their goals.

6. Wrap-Up
   - What goal did you most want to remember from today?
   - What would you tell your younger self about dreams?

TUTOR NOTE: This session creates lasting connection. Take notes on what the student shares — referencing their goals in future sessions shows you were truly listening.""",
                'vocabulary': [
                    {'word': 'ambition', 'definition': 'A strong desire to achieve something difficult or significant in life.'},
                    {'word': 'career', 'definition': 'A long-term professional path or occupation that someone pursues over many years.'},
                    {'word': 'goal', 'definition': 'A specific result or achievement that a person is working toward.'},
                    {'word': 'scholarship', 'definition': 'Financial support awarded to students to help pay for their education, often based on academic merit or financial need.'},
                    {'word': 'internship', 'definition': 'A temporary work position, often unpaid or low-paid, where a student gains practical experience in a professional field.'},
                    {'word': 'passion', 'definition': 'A strong and intense enthusiasm or love for something.'},
                    {'word': 'inspiration', 'definition': 'A person, idea, or experience that motivates you to create, achieve, or improve.'},
                    {'word': 'perseverance', 'definition': 'The quality of continuing to work toward a goal even when it is difficult or discouraging.'},
                    {'word': 'opportunity', 'definition': 'A favorable moment or situation that makes it possible to achieve something.'},
                    {'word': 'mentor', 'definition': 'An experienced and trusted person who advises and guides a less experienced person.'},
                    {'word': 'sacrifice', 'definition': 'Giving up something valuable in order to achieve a more important goal.'},
                    {'word': 'legacy', 'definition': 'What you leave behind after you are gone — the impact you had on people, your community, or the world.'},
                ],
                'expressions': [
                    {'expression': "I dream of...", 'meaning': 'Used to describe a deep, personal ambition or hope. "I dream of becoming the first person in my family to go to college."'},
                    {'expression': "Set a goal.", 'meaning': 'To decide on a specific aim and commit to working toward it. "I set a goal to read one book a month."'},
                    {'expression': "Go after your dreams.", 'meaning': 'An encouraging phrase meaning to actively pursue what you want, even if it is difficult. Very common in American motivational culture.'},
                    {'expression': "One step at a time.", 'meaning': 'Encouragement to focus on each small action rather than feeling overwhelmed by a big goal.'},
                    {'expression': "It\'s not too late.", 'meaning': 'An encouraging reminder that you can still pursue something even if you feel like you missed your moment.'},
                    {'expression': "Dare to dream.", 'meaning': 'An inspirational phrase encouraging someone to imagine possibilities beyond what seems immediately realistic.'},
                ],
            },
            {
                'number': 20,
                'title': 'American Values and Way of Life',
                'outline': """LESSON OVERVIEW
To truly understand American English, you must understand American values — the ideas that shape how Americans think, speak, and behave. This closing beginner lesson pulls everything together and gives students a framework for making sense of everything they have learned so far.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - After everything we have talked about, what is one thing about American culture you find really interesting?
   - What is one thing that surprised you or confused you?
   - If someone asked you "What are Americans like?" what would you say?

2. Core American Values
   - Individualism: the belief that personal freedom and self-reliance are deeply important
   - Optimism: the cultural expectation to be positive and solution-oriented
   - Hard work: the idea that success is earned through effort, not luck

3. Things That Might Seem Strange From the Outside
   - Small talk with strangers: why Americans chat with people they will never see again
   - The phrase "I\'m fine" even when you are not
   - The concept of being "busy" as a status symbol

4. Cultural Deep Dive
   Reflect honestly: What American value do you personally believe in? What is one thing about American culture you find hard to understand or disagree with? Model genuine critical thinking about your own culture.

5. Conversation Practice
   Discussion: Compare core values from Peru and America. Are there values that overlap? Are there any that seem to conflict? What does "success" mean in each culture?

6. Wrap-Up
   - What is the most important thing you have learned from this entire beginner curriculum?
   - What topic do you want to explore more in the next level?

TUTOR NOTE: This session is reflective and open-ended. Resist the urge to "teach" — instead, think out loud together. The best outcome is two people genuinely exchanging perspectives on how their cultures work.""",
                'vocabulary': [
                    {'word': 'value', 'definition': 'A principle or belief that is considered important and that guides how a person or society behaves.'},
                    {'word': 'individualism', 'definition': 'The cultural belief that personal independence and self-expression are more important than conformity to the group.'},
                    {'word': 'optimism', 'definition': 'A general tendency to believe that good things will happen and that problems can be overcome.'},
                    {'word': 'freedom', 'definition': 'The right to act, speak, and live without unnecessary restriction from others or the government.'},
                    {'word': 'diversity', 'definition': 'The presence of many different types of people, backgrounds, and cultures in a group or place.'},
                    {'word': 'opportunity', 'definition': 'The chance to do or experience something that can lead to improvement or success.'},
                    {'word': 'equality', 'definition': 'The belief and practice that all people should have the same rights and be treated fairly.'},
                    {'word': 'community', 'definition': 'A group of people who live in the same area or share common interests and support one another.'},
                    {'word': 'pride', 'definition': 'A feeling of deep satisfaction and respect for yourself, your family, your team, or your country.'},
                    {'word': 'democracy', 'definition': 'A system of government where citizens vote to choose their leaders and have a say in how the country is run.'},
                    {'word': 'self-reliance', 'definition': 'The ability and preference to depend on yourself rather than asking others for help.'},
                    {'word': 'melting pot', 'definition': 'A metaphor for America as a place where people of many different backgrounds blend together into one shared culture.'},
                ],
                'expressions': [
                    {'expression': "The American Dream.", 'meaning': 'The belief that anyone in America, regardless of where they were born, can achieve success and prosperity through hard work and determination.'},
                    {'expression': "Pull yourself up by your bootstraps.", 'meaning': 'An American expression meaning to succeed through your own hard work and effort without help from others. Reflects the value of self-reliance.'},
                    {'expression': "Land of opportunity.", 'meaning': 'A common description of America as a place where people from anywhere can find a chance to improve their lives.'},
                    {'expression': "It\'s a free country.", 'meaning': 'A casual American expression used to justify doing something, reminding others that personal freedom is a right. Often said with a lighthearted tone.'},
                    {'expression': "Live and let live.", 'meaning': 'An expression of American tolerance — meaning people should be free to live however they choose without interference.'},
                    {'expression': "The pursuit of happiness.", 'meaning': 'A phrase from the Declaration of Independence that has become a core American ideal — the right to seek a fulfilling life.'},
                ],
            },
        ]
    },
    {
        'level': 'intermediate',
        'title': 'English with American Friends: Intermediate',
        'description': 'An intermediate-level curriculum that explores American culture and teen life with greater depth and nuance. Students develop conversational fluency through authentic discussion of social dynamics, school pressures, pop culture, and American values.',
        'lessons': [
            {
                'number': 1,
                'title': 'High School Social Life and Cliques',
                'outline': """LESSON OVERVIEW
American high school social life is famously complex — organized into groups, hierarchies, and unwritten rules that outsiders rarely see. This lesson goes beyond surface-level greetings to explore the real social dynamics of American teenagers: the lunch table politics, the friend groups, and the pressure to belong somewhere.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - How would you describe your social life at school? Are you part of a particular group?
   - Do you think your school has social hierarchies? How do they work?
   - What do you think high school social life in America is actually like vs. what movies show?

2. The Anatomy of American High School Social Groups
   - Classic cliques: athletes, theater kids, nerds, popular kids — and why these labels are both real and reductive
   - Lunch tables as a map of the social landscape
   - How cliques form, how people move between them, and what it feels like to be on the outside

3. Social Hierarchies and Popularity
   - What makes someone "popular" in American high school and how that changes by senior year
   - The difference between being liked and being respected
   - How social media extends and amplifies high school social dynamics

4. Cultural Deep Dive
   Be honest about your own social life — what group you identified with, whether you ever felt excluded, what you wish you had done differently socially, and what you have learned about authenticity since then.

5. Conversation Practice
   Discussion: Compare high school social dynamics in Peru and America. Are there similar cliques or hierarchies? Does belonging to a group feel more or less important in each culture?

6. Wrap-Up
   - What surprised you about how American social life actually works?
   - How do you decide who to be friends with?

TUTOR NOTE: This topic can surface real insecurities. Create a safe, nonjudgmental space. Share your own vulnerabilities first so the student feels permission to be honest.""",
                'vocabulary': [
                    {'word': 'clique', 'definition': 'A small, tightly bonded social group that tends to exclude outsiders, common in high schools.'},
                    {'word': 'hierarchy', 'definition': 'A system in which people are ranked above or below each other based on status, power, or popularity.'},
                    {'word': 'popularity', 'definition': 'The state of being widely liked, admired, or recognized within a social group.'},
                    {'word': 'outcast', 'definition': 'A person who is rejected from or does not fit into a social group.'},
                    {'word': 'peer pressure', 'definition': 'The influence exerted by a peer group to encourage someone to act in a certain way, often against their own values.'},
                    {'word': 'social status', 'definition': 'A person\'s position or rank within a social group, determined by factors like popularity, appearance, and achievement.'},
                    {'word': 'reputation', 'definition': 'The general opinion others have formed about a person based on their past behavior and actions.'},
                    {'word': 'authentic', 'definition': 'Being genuine and true to your own personality, values, and feelings rather than performing for others.'},
                    {'word': 'conform', 'definition': 'To follow the norms, rules, or expectations of a group, often at the expense of your own individuality.'},
                    {'word': 'exclusion', 'definition': 'The act of deliberately leaving someone out of a group, activity, or conversation.'},
                    {'word': 'belonging', 'definition': 'The feeling of being accepted and included as a valued member of a group.'},
                    {'word': 'drama', 'definition': 'In social contexts, unnecessary conflict, gossip, or emotional tension within a friend group.'},
                ],
                'expressions': [
                    {'expression': "Sit at the cool table.", 'meaning': 'A metaphor for being socially accepted by the popular group. References the high school cafeteria as the stage of social life.'},
                    {'expression': "Fit in.", 'meaning': 'To be accepted and feel comfortable in a social group. "He tried so hard to fit in with the athletes, but it felt fake."'},
                    {'expression': "Stand out.", 'meaning': 'To be noticeably different from others, in a way that draws attention. Can be positive or negative depending on context.'},
                    {'expression': "Talk behind someone\'s back.", 'meaning': 'To say negative things about a person when they are not present. Considered disloyal and a sign of social drama.'},
                    {'expression': "Leave someone out.", 'meaning': 'To not include someone in an activity, event, or conversation, whether intentionally or accidentally.'},
                    {'expression': "Own who you are.", 'meaning': 'To embrace your identity confidently without trying to change yourself to please others. A very American self-empowerment concept.'},
                ],
            },
            {
                'number': 2,
                'title': 'The American School System: GPA and Graduation',
                'outline': """LESSON OVERVIEW
The American school system has a structure — grades 9 through 12, GPA, credit requirements, and graduation milestones — that shapes every teen's experience. For an intermediate student, this goes beyond just vocabulary and into genuine understanding of why the system creates so much pressure and what it actually means to graduate in America.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - How many years of high school do you have left? What does graduation look like for you?
   - What do you think happens at an American high school graduation ceremony?
   - Have you heard of GPA? What do you understand about it?

2. The Four Years of American High School
   - Freshman, sophomore, junior, senior — what each year means culturally
   - Credit requirements: why you have to take certain classes to graduate
   - The junior year as the most intense: SAT, ACT, college prep, and AP exams

3. GPA and What It Unlocks
   - How GPA is calculated and what a "good" GPA looks like
   - Class rank: being in the top 10% and why it matters
   - Honors, AP, and dual-enrollment classes and their effect on weighted GPA

4. Cultural Deep Dive
   Share what your junior year felt like — the pressure, the workload, the moments when you questioned everything. Describe your own graduation: what you wore, who was there, how it felt, and the one moment that made it real.

5. Conversation Practice
   Discussion: Walk the student through building a hypothetical 4-year plan for high school in America. What classes would they need? What extracurriculars would help them? What GPA should they aim for?

6. Wrap-Up
   - What part of the American school system seems most different from Peru?
   - If you could change one thing about the American school system, what would it be?

TUTOR NOTE: Be honest about the flaws — the pressure, the inequality between schools, the way GPA can crush a student\'s confidence. Critical thinking about your own system builds trust.""",
                'vocabulary': [
                    {'word': 'freshman', 'definition': 'A student in their first year of high school or college in the United States.'},
                    {'word': 'junior', 'definition': 'A student in the third year of high school — often considered the most academically intense year.'},
                    {'word': 'senior', 'definition': 'A student in the fourth and final year of high school.'},
                    {'word': 'credit', 'definition': 'A unit of academic recognition given for completing a class, required to graduate.'},
                    {'word': 'graduation', 'definition': 'The ceremony marking the successful completion of a degree or educational program.'},
                    {'word': 'class rank', 'definition': 'A student\'s position within their graduating class based on cumulative GPA.'},
                    {'word': 'diploma', 'definition': 'The official document certifying that a student has completed their high school education.'},
                    {'word': 'valedictorian', 'definition': 'The student with the highest GPA in their graduating class who gives the keynote speech at graduation.'},
                    {'word': 'dual enrollment', 'definition': 'A program where high school students take college-level courses and earn both high school and college credit simultaneously.'},
                    {'word': 'prerequisite', 'definition': 'A course that must be completed before a student is allowed to take a more advanced class.'},
                    {'word': 'counselor', 'definition': 'A school professional who helps students plan their academic path, manage stress, and prepare for college.'},
                    {'word': 'requirement', 'definition': 'Something that is necessary to complete in order to achieve a goal, such as courses needed to graduate.'},
                ],
                'expressions': [
                    {'expression': "Walk the stage.", 'meaning': 'To participate in a graduation ceremony, specifically walking across the stage to receive your diploma. A major American milestone.'},
                    {'expression': "On track to graduate.", 'meaning': 'Having enough credits and grades to graduate on schedule. "She missed a lot of school but she\'s still on track to graduate."'},
                    {'expression': "Take the SAT.", 'meaning': 'To sit for the Scholastic Assessment Test, a standardized college admissions exam most American juniors take.'},
                    {'expression': "Raise your GPA.", 'meaning': 'To improve your Grade Point Average by earning higher grades in your classes.'},
                    {'expression': "Drop a class.", 'meaning': 'To officially withdraw from a course during the school year, sometimes without academic penalty depending on the timing.'},
                    {'expression': "Senior year.", 'meaning': 'The fourth and final year of high school, culturally associated with college applications, prom, and graduation. Often bittersweet for American students.'},
                ],
            },
            {
                'number': 3,
                'title': 'American Food Culture and Dining Etiquette',
                'outline': """LESSON OVERVIEW
At the intermediate level, food culture goes far beyond menu vocabulary — it includes the unspoken rules of dining, the regional identity tied to food, and the complex relationship Americans have with eating, health, and social dining. Your tutor will help unpack why food is both deeply personal and culturally rich in America.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - If you could eat any meal from any country, what would it be?
   - What is a food from Peru that you think Americans would love?
   - Have you ever been to a sit-down restaurant where the waiter brought the food to your table?

2. Regional American Food Identity
   - Southern food: fried chicken, biscuits, grits — and why food is tied to Southern identity
   - New York vs. Chicago pizza: a real cultural debate
   - New England seafood, Texas BBQ, and California health food culture

3. The Rules of American Dining
   - Tipping culture: who, how much, and why skipping a tip is considered rude
   - Sharing food: is it normal to share dishes or does everyone order separately?
   - Dietary restrictions and how to politely communicate them at a restaurant

4. Cultural Deep Dive
   Describe your family\'s food culture — a dish your family makes that no restaurant could replicate, the rules at your dinner table growing up, and a meal you associate with a specific powerful memory.

5. Conversation Practice
   Role-play: You are at a nice American restaurant for a first date. Practice ordering, managing a small problem (your food is wrong), and navigating the check.

6. Wrap-Up
   - What did you learn about American dining that you did not know before?
   - If you were cooking an American a Peruvian meal, what would you make and why?

TUTOR NOTE: Food discussions naturally get personal and cultural — let them go deep. The best sessions on this topic end with both people hungry and laughing.""",
                'vocabulary': [
                    {'word': 'etiquette', 'definition': 'The customary rules of polite behavior in social or professional situations.'},
                    {'word': 'cuisine', 'definition': 'A style of cooking associated with a particular country, region, or cultural group.'},
                    {'word': 'dietary restriction', 'definition': 'A limitation on what a person eats, due to health, allergies, religion, or personal choice.'},
                    {'word': 'vegan', 'definition': 'A person who does not consume any animal products, including meat, dairy, or eggs.'},
                    {'word': 'gluten-free', 'definition': 'A diet that avoids gluten, a protein found in wheat, rye, and barley, often required by people with celiac disease.'},
                    {'word': 'portion', 'definition': 'The amount of food served to one person in a single meal. American portions are notoriously large.'},
                    {'word': 'doggie bag', 'definition': 'A container provided by a restaurant to take home uneaten food from your meal.'},
                    {'word': 'reservation', 'definition': 'An advance arrangement to hold a table at a restaurant for a specific time.'},
                    {'word': 'host', 'definition': 'At a restaurant, the person who greets customers and shows them to their table.'},
                    {'word': 'specialty', 'definition': 'A dish or food item that a region or restaurant is particularly known for.'},
                    {'word': 'comfort food', 'definition': 'Food that provides emotional satisfaction, often associated with childhood or home cooking.'},
                    {'word': 'organic', 'definition': 'Food produced without synthetic chemicals or pesticides, often associated with health-conscious American eating habits.'},
                ],
                'expressions': [
                    {'expression': "The check, please.", 'meaning': 'What you say to the server when you are ready to pay. You can also say "Can we get the bill?" in more formal settings.'},
                    {'expression': "I\'ll get this one.", 'meaning': 'Offering to pay for the entire meal. Often said among friends alternating who pays.'},
                    {'expression': "Go Dutch.", 'meaning': 'When each person pays for their own meal rather than one person covering the whole bill.'},
                    {'expression': "This place is a hole in the wall.", 'meaning': 'A small, unimpressive-looking restaurant that serves surprisingly excellent food. A term of affection in American food culture.'},
                    {'expression': "Eating clean.", 'meaning': 'Choosing whole, unprocessed foods as a lifestyle habit. A popular American wellness and diet concept.'},
                    {'expression': "On the house.", 'meaning': 'When a restaurant gives you something for free — a drink, a dessert, or a dish. "The manager sent over dessert — it was on the house."'},
                ],
            },
            {
                'number': 4,
                'title': 'Getting Around American Cities',
                'outline': """LESSON OVERVIEW
At the intermediate level, transportation is about more than basic directions — it is about understanding how America is designed and how that design shapes daily life. From the car-dependent suburbs to the dense transit networks of cities like New York, how Americans get around reveals deep truths about class, geography, and urban planning.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - If you could live in any American city, which one would you choose and why?
   - Have you ever used a subway, bus, or Uber? What was it like?
   - Do you think public transportation in Peru is better or worse than in America?

2. American Cities and How They Are Built
   - Dense cities: New York, Chicago, Boston — walkable, transit-heavy
   - Sprawling cities: Los Angeles, Houston, Phoenix — car-dependent with massive freeways
   - Why the city you live in determines how you get around

3. Navigating a City as a Teenager
   - Getting a driver's license at 16 and its social significance
   - Using Uber, Lyft, and public transit as a teenager without a car
   - The experience of taking the New York subway for the first time

4. Cultural Deep Dive
   Tell the student about the most memorable trip you have taken in or to an American city — a subway ride that confused you, a road trip with friends, getting lost somewhere and what happened. Make it vivid.

5. Conversation Practice
   Role-play: Your student has just arrived at Penn Station in New York City and needs to get to Times Square. Guide them through the subway system step by step, answering their questions along the way.

6. Wrap-Up
   - What do you think is the best city in America to visit and why?
   - How would you compare getting around Lima to getting around an American city?

TUTOR NOTE: If you have traveled to an American city outside your own, use that experience. If not, YouTube walkthroughs of New York streets are excellent supplements to this session.""",
                'vocabulary': [
                    {'word': 'transit', 'definition': 'A system of public transportation, including buses, subways, and trains, used to move people around a city.'},
                    {'word': 'grid', 'definition': 'A city layout where streets are arranged in a pattern of perpendicular lines, making navigation easier.'},
                    {'word': 'borough', 'definition': 'One of the five administrative districts of New York City: Manhattan, Brooklyn, Queens, the Bronx, and Staten Island.'},
                    {'word': 'metro', 'definition': 'Short for metropolitan — relating to a major city and its surrounding areas. Also used as a term for the subway in some cities.'},
                    {'word': 'crosswalk', 'definition': 'A marked area on a road where pedestrians have the right to cross safely.'},
                    {'word': 'hail', 'definition': 'To signal a taxi by raising your hand while standing at the curb, a classic New York experience.'},
                    {'word': 'one-way street', 'definition': 'A road where traffic is only allowed to move in one direction.'},
                    {'word': 'toll', 'definition': 'A fee charged to use a bridge, tunnel, or highway.'},
                    {'word': 'urban', 'definition': 'Relating to a city or densely populated area.'},
                    {'word': 'sprawl', 'definition': 'The uncontrolled spread of urban development into surrounding rural areas, typical of many American cities.'},
                    {'word': 'block', 'definition': 'The distance from one street intersection to the next, commonly used as a unit of walking distance in American cities.'},
                    {'word': 'landmark', 'definition': 'A recognizable feature or building used as a reference point for navigation.'},
                ],
                'expressions': [
                    {'expression': "Take the subway.", 'meaning': 'To use the underground rail system to travel within a city. "It\'s faster to take the subway than to drive through Manhattan."'},
                    {'expression': "Catch a cab.", 'meaning': 'To hail or call a taxi. Less common now with rideshare apps, but still used. "We missed the last train so we caught a cab."'},
                    {'expression': "It\'s a 10-minute walk.", 'meaning': 'A common American way to give distance in terms of walking time rather than miles or kilometers.'},
                    {'expression': "Stuck in traffic.", 'meaning': 'Unable to move because of a traffic jam. "I was late because I got completely stuck in traffic on the 405."'},
                    {'expression': "Explore the city.", 'meaning': 'To walk around a city without a fixed plan, discovering neighborhoods, restaurants, and places of interest.'},
                    {'expression': "Across town.", 'meaning': 'On the other side of the city. "The concert is across town, so we should leave early."'},
                ],
            },
            {
                'number': 5,
                'title': 'Shopping Culture and Consumer Habits',
                'outline': """LESSON OVERVIEW
American shopping culture is its own ecosystem — with malls, outlet stores, online shopping, and the psychology of consumerism built into daily life. At the intermediate level, this lesson goes beyond basic shopping vocabulary to explore what American buying habits say about identity, class, and culture.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What was your most recent purchase? Was it something you needed or wanted?
   - Do you enjoy shopping or do you find it stressful?
   - What brand or product do you think of when you imagine American shopping culture?

2. How Americans Shop: The Full Picture
   - Black Friday and Cyber Monday: the annual shopping frenzy and what it reveals
   - Online shopping: Amazon Prime, next-day delivery, and the shift away from malls
   - Outlet malls and thrift stores — the full price range of American retail

3. Brand Identity and Status Signaling
   - Why certain brands (Jordan, Supreme, Lululemon) carry social meaning
   - "Hypebeasts" and sneaker culture: limited drops, resale, and waiting in line
   - The thrift and resale movement: why Gen Z prefers secondhand shopping

4. Cultural Deep Dive
   Share your own relationship with shopping — a purchase you were really proud of, something you saved up for, something you bought impulsively and regretted, and how your spending habits have changed as you have grown up.

5. Conversation Practice
   Discussion: Is it possible to spend too much on clothes or consumer goods? When does shopping become a problem? Compare attitudes toward spending and materialism in Peru and America.

6. Wrap-Up
   - What surprised you about American consumer culture at this deeper level?
   - Do you think advertising influences how you shop? How?

TUTOR NOTE: This lesson works best as a genuine two-way conversation. Challenge the student to share their opinions — not just absorb information. Let the discussion go where it wants to go.""",
                'vocabulary': [
                    {'word': 'consumerism', 'definition': 'The cultural tendency to acquire goods and services in increasing quantities as a marker of success and identity.'},
                    {'word': 'impulse buy', 'definition': 'A purchase made without planning, on a sudden desire. "I went to buy milk and came back with five things I didn\'t need."'},
                    {'word': 'resale', 'definition': 'The business of buying items and selling them again, often at a higher price due to rarity or demand.'},
                    {'word': 'thrift store', 'definition': 'A secondhand store that sells used clothing and goods, often at very low prices.'},
                    {'word': 'markup', 'definition': 'The increase in price from the cost of production to the retail selling price, representing profit.'},
                    {'word': 'retail therapy', 'definition': 'The habit of shopping as a way to improve your mood or cope with stress.'},
                    {'word': 'subscription', 'definition': 'A recurring payment for regular access to a service, like Netflix or Amazon Prime.'},
                    {'word': 'limited edition', 'definition': 'A product produced in small quantities, making it rare and often more desirable.'},
                    {'word': 'hype', 'definition': 'Intense excitement and buzz around a product, brand, or event.'},
                    {'word': 'vintage', 'definition': 'Clothing or items from a previous era, valued for their age, style, or cultural significance.'},
                    {'word': 'materialism', 'definition': 'The belief that owning material possessions is the most important goal in life.'},
                    {'word': 'budget', 'definition': 'A plan for how to spend money, setting limits on different categories of expenses.'},
                ],
                'expressions': [
                    {'expression': "Window shopping.", 'meaning': 'Looking at items in store windows or online without intending to buy anything. Done for enjoyment or to plan future purchases.'},
                    {'expression': "Splurge on something.", 'meaning': 'To spend more money than usual on something as a treat. "I splurged on a nice dinner for my birthday."'},
                    {'expression': "It was a steal.", 'meaning': 'Said when you got something for an extremely low price. "Thirty dollars for these shoes? That was a steal!"'},
                    {'expression': "Out of stock.", 'meaning': 'When a product is unavailable because all units have been sold. Common with hyped limited-edition items.'},
                    {'expression': "Add to cart.", 'meaning': 'The action of selecting an item to buy on an online shopping platform like Amazon. Also used humorously for anything desirable.'},
                    {'expression': "Shop till you drop.", 'meaning': 'A playful expression meaning to shop for so long that you become exhausted. Reflects the American enthusiasm for retail culture.'},
                ],
            },
            {
                'number': 6,
                'title': 'American Sports Fandom and Tailgating Culture',
                'outline': """LESSON OVERVIEW
At the intermediate level, sports become a lens for understanding American community, identity, and tribal loyalty. Cheering for a team in America is not just recreation — it is a way of belonging to something. Tailgating, team jerseys, rival schools, and the Super Bowl are all parts of a culture with deep emotional roots.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Do you support a sports team? What does it feel like to watch them play?
   - Have you ever been to a live sporting event? What was the atmosphere like?
   - Why do you think sports matter so much to so many people?

2. Team Loyalty and Sports Identity
   - How American families pass down team loyalties across generations
   - Rivalries: Patriots vs. Cowboys, Lakers vs. Celtics — and why they go beyond sports
   - The difference between supporting your college team and your city's professional team

3. Tailgating: The Pre-Game Ritual
   - What tailgating is: gathering in the parking lot before a game with food, drinks, and music
   - Why tailgating is as important as the game itself for many fans
   - The culture of wearing team colors and jerseys to express identity

4. Cultural Deep Dive
   Describe the most intense sports experience you have had — whether as a fan, a player, or someone watching a friend compete. Capture the emotion of a win or a devastating loss and what it meant to you.

5. Conversation Practice
   Discussion: Is it healthy to care deeply about a sports team? What happens when people take fandom too far? What can sports teach us about loyalty, community, and disappointment?

6. Wrap-Up
   - What aspect of American sports fandom seems most interesting or strange to you?
   - Is there a Peruvian sport or team you are passionate about? Describe the feeling.

TUTOR NOTE: This is a great session for genuine passion. If you love a sport, let that love show. If you are not a big sports fan, you can still speak to the cultural weight sports carry in America.""",
                'vocabulary': [
                    {'word': 'fandom', 'definition': 'The community of enthusiastic fans of a particular sports team, show, or public figure.'},
                    {'word': 'tailgate', 'definition': 'A pre-game celebration held in the parking lot outside a stadium, featuring food, drinks, and socializing.'},
                    {'word': 'rivalry', 'definition': 'A long-standing competitive relationship between two teams with a history of closely contested games.'},
                    {'word': 'jersey', 'definition': 'A sports shirt with a team name and player number, worn by fans to show their support.'},
                    {'word': 'draft', 'definition': 'The process by which professional sports teams select new players from the pool of eligible athletes.'},
                    {'word': 'trade', 'definition': 'When one professional sports team sends a player to another team in exchange for other players or picks.'},
                    {'word': 'championship', 'definition': 'The final contest of a season to determine the overall winner of a sport or league.'},
                    {'word': 'fan base', 'definition': 'The community of loyal supporters of a team or athlete.'},
                    {'word': 'stadium', 'definition': 'A large structure with tiered seating surrounding a field or court for watching sports events.'},
                    {'word': 'underdog', 'definition': 'A team or player expected to lose who fights against the odds. Americans love rooting for underdogs.'},
                    {'word': 'season ticket', 'definition': 'A ticket that gives the holder access to all home games of a team for an entire season.'},
                    {'word': 'commentator', 'definition': 'A broadcaster who describes and analyzes a sporting event as it happens on television or radio.'},
                ],
                'expressions': [
                    {'expression': "Bleed your team\'s colors.", 'meaning': 'An extreme expression of team loyalty — meaning you support your team so intensely it is part of who you are.'},
                    {'expression': "Fair-weather fan.", 'meaning': 'Someone who only supports a team when they are winning. A term of mild contempt among serious sports fans.'},
                    {'expression': "Trash talk.", 'meaning': 'Speaking dismissively or mockingly about the opposing team or its fans, a common part of American sports culture.'},
                    {'expression': "We got robbed.", 'meaning': 'A complaint that your team was treated unfairly — by a bad call from a referee or by the circumstances of the game.'},
                    {'expression': "Ride or die fan.", 'meaning': 'A fan who supports their team unconditionally through wins and losses. The highest compliment in sports fandom.'},
                    {'expression': "The big game.", 'meaning': 'Used to describe the most important game of a season or a championship matchup. Also refers specifically to the Super Bowl.'},
                ],
            },
            {
                'number': 7,
                'title': 'Student Government and School Leadership',
                'outline': """LESSON OVERVIEW
Student government is a uniquely American institution — one that teaches leadership, public speaking, and the mechanics of democracy starting in middle school. It shapes the school culture, plans events like prom and spirit week, and gives certain students significant social and institutional power. Your tutor will make it real.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Does your school have any kind of student council or student leadership body?
   - Would you ever want to run for school president? Why or why not?
   - What issues do you think students should have more power over at school?

2. How Student Government Works in America
   - Positions: student body president, vice president, treasurer, class representatives
   - Elections: campaign posters, speeches, and the democratic process at school level
   - Responsibilities: planning events, allocating budget, representing student interests to administration

3. Prom and Spirit Week: SGA in Action
   - Prom: how student government plans it, what it costs, and what the cultural weight of prom night actually is
   - Spirit week: themed dress-up days, pep rallies, and building school identity
   - Homecoming: the game, the court, the dance — a full American ritual

4. Cultural Deep Dive
   Tell the student about your own experience with school events — did you go to prom? What was it like? Was there a spirit week that you genuinely looked forward to? Share a story from a school event, not just a description.

5. Conversation Practice
   Role-play: You are running for student body president. Write and deliver a 90-second campaign speech about two things you would change at school. The student gives feedback and then tries their own version.

6. Wrap-Up
   - Do you think student government actually has real power or is it mostly symbolic?
   - What would you change about your school if you were in charge?

TUTOR NOTE: The prom and homecoming discussion is usually very engaging for international students. Lean into the details — the dress, the corsage, the limo, the after-party. It is a genuine window into American culture.""",
                'vocabulary': [
                    {'word': 'student government', 'definition': 'An elected group of students who represent their peers and help plan events and communicate with school administration.'},
                    {'word': 'campaign', 'definition': 'An organized effort to persuade people to vote for you in an election, including posters, speeches, and outreach.'},
                    {'word': 'ballot', 'definition': 'A method of secret voting used in elections, including student government elections.'},
                    {'word': 'prom', 'definition': 'A formal dance held for high school juniors and seniors, one of the most iconic American high school traditions.'},
                    {'word': 'homecoming', 'definition': 'An annual school tradition involving a football game, a dance, and the crowning of a homecoming king and queen.'},
                    {'word': 'spirit week', 'definition': 'A week of themed school events and dress-up days meant to build school pride and community.'},
                    {'word': 'pep rally', 'definition': 'A school assembly designed to build excitement and school spirit before a major athletic event.'},
                    {'word': 'treasurer', 'definition': 'The student government officer responsible for managing the organization\'s budget and funds.'},
                    {'word': 'administration', 'definition': 'The school\'s leadership team: the principal, vice principal, and other officials who run the school.'},
                    {'word': 'candidate', 'definition': 'A person who formally declares their intention to run for an elected position.'},
                    {'word': 'corsage', 'definition': 'A small bouquet of flowers worn on a dress or pinned to a suit, traditionally given at prom.'},
                    {'word': 'platform', 'definition': 'The set of goals and promises a political or student government candidate campaigns on.'},
                ],
                'expressions': [
                    {'expression': "Run for office.", 'meaning': 'To formally enter an election as a candidate. "Three seniors are running for student body president this year."'},
                    {'expression': "Cast your vote.", 'meaning': 'To officially submit your choice in an election. "Make sure you cast your vote before the polls close at 3 p.m."'},
                    {'expression': "Make your voice heard.", 'meaning': 'To speak up and express your opinion, especially through participation in democratic processes.'},
                    {'expression': "Prom night.", 'meaning': 'The evening of the prom — one of the most culturally significant nights in American high school life.'},
                    {'expression': "School spirit.", 'meaning': 'A sense of pride, enthusiasm, and loyalty toward your school, expressed through events, clothing, and support for teams.'},
                    {'expression': "Win by a landslide.", 'meaning': 'To win an election by a very large margin of votes. "She won the election by a landslide — everyone voted for her."'},
                ],
            },
            {
                'number': 8,
                'title': 'American Holidays: Deeper Cultural Meaning',
                'outline': """LESSON OVERVIEW
At the intermediate level, American holidays become a vehicle for exploring history, identity, and contradiction. Why do Americans celebrate Thanksgiving even as many question its historical narrative? Why is the Fourth of July both a joyful and complicated day? This lesson invites students into genuine cultural reflection.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Of all the American holidays you have heard about, which one makes you most curious?
   - Do you think it is possible for a holiday to be both joyful and controversial at the same time?
   - How do people in your family celebrate important holidays in Peru?

2. The Complicated History Behind American Holidays
   - Thanksgiving: the Pilgrim story, the erasure of Native perspectives, and why many Americans still love it
   - The Fourth of July: independence, patriotism, and the tension around freedom for all
   - Columbus Day vs. Indigenous Peoples' Day: the ongoing debate about whose history is honored

3. Holidays and American Identity
   - How holidays reinforce and reveal what Americans value
   - The commercialization of holidays: when companies profit from cultural celebrations
   - Regional differences: how the same holiday feels different in the South vs. New England vs. California

4. Cultural Deep Dive
   Share your own complicated relationship with a holiday — one you love but that has a history you have had to reckon with, or one that feels different now than it did when you were a child. Be honest about the complexity.

5. Conversation Practice
   Discussion: Should countries change or stop celebrating holidays that have problematic historical roots? Defend your position and listen to the student's view. Practice polite disagreement.

6. Wrap-Up
   - Did this conversation change how you think about any American holiday?
   - Are there holidays in Peru that have complicated histories as well?

TUTOR NOTE: This is a mature conversation that respects the student's intelligence. Present multiple perspectives and model intellectual humility — share openly that you grew up celebrating this holiday and are still figuring out what you think about it.""",
                'vocabulary': [
                    {'word': 'commemorate', 'definition': 'To do something special to remember and honor a person or historical event.'},
                    {'word': 'controversy', 'definition': 'A prolonged public debate or disagreement about an issue that people have strong opposing views on.'},
                    {'word': 'indigenous', 'definition': 'Originating or occurring naturally in a particular place — used to describe native peoples and their cultures.'},
                    {'word': 'colonization', 'definition': 'The process by which a foreign power takes control of a territory, imposing its culture, language, and government on the indigenous people.'},
                    {'word': 'patriotism', 'definition': 'A strong feeling of love, pride, and support for one\'s country.'},
                    {'word': 'commercialization', 'definition': 'The process of turning something cultural or meaningful into a vehicle for generating profit.'},
                    {'word': 'ritual', 'definition': 'A set of actions performed in a prescribed order, often carrying cultural, religious, or emotional significance.'},
                    {'word': 'heritage', 'definition': 'The traditions, values, and history passed down from previous generations to a group or individual.'},
                    {'word': 'amnesia', 'definition': 'In cultural terms, the deliberate or unconscious forgetting of difficult historical events by a society.'},
                    {'word': 'reconciliation', 'definition': 'The process of reestablishing a good relationship or resolving a disagreement, including acknowledging past wrongs.'},
                    {'word': 'secular', 'definition': 'Not connected to religious or spiritual matters. Many American holidays have both secular and religious versions.'},
                    {'word': 'federal holiday', 'definition': 'A holiday officially recognized by the U.S. government, on which federal employees do not work.'},
                ],
                'expressions': [
                    {'expression': "Give thanks.", 'meaning': 'To express gratitude, especially associated with Thanksgiving. "We went around the table and each person took a moment to give thanks."'},
                    {'expression': "The other side of the story.", 'meaning': 'A different perspective on an event, often one that has been left out of the dominant narrative.'},
                    {'expression': "Sit with that.", 'meaning': 'To take time to think deeply about something uncomfortable or complicated without rushing to resolve it.'},
                    {'expression': "Question the narrative.", 'meaning': 'To think critically about the accepted story or explanation of an event and consider whether it is complete or accurate.'},
                    {'expression': "Honor a tradition.", 'meaning': 'To continue and respect a long-standing custom or practice. "Our family honors the tradition of making tamales at Christmas."'},
                    {'expression': "A day off.", 'meaning': 'A day when you do not have to go to school or work. Federal holidays are legal days off for many Americans.'},
                ],
            },
            {
                'number': 9,
                'title': 'Slang and Idioms in Context',
                'outline': """LESSON OVERVIEW
Building on the beginner slang lesson, this intermediate session dives deeper — looking at idioms, expressions that are figurative rather than literal, and the way slang travels across social groups and generations. The goal is for students to not just memorize phrases but to understand how and why language works this way.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What is a piece of slang from the beginner level that you actually tried to use?
   - Is there a Spanish expression that is impossible to translate literally into English?
   - What is the funniest thing you have misunderstood because of an idiom?

2. Idioms: When English Stops Making Literal Sense
   - "Break a leg" — why wishing someone to break a leg means good luck
   - "Spill the tea" — sharing gossip or revealing a secret
   - "Hit the nail on the head" — saying something exactly correct
   - "Under the bus" — when someone blames you for something that was not your fault

3. Slang That Crosses Generations
   - Slang from the 1990s that is making a comeback: "That\'s so fetch," "as if," "talk to the hand"
   - How slang travels from Black American culture to mainstream American culture
   - Why some slang feels authentic and some feels forced when used by the wrong person

4. Cultural Deep Dive
   Share a story where you completely misunderstood an idiom and what happened as a result. Or share a slang word from your childhood that none of your current friends use anymore but that you still love.

5. Conversation Practice
   Give the student a list of 8 idioms. They must guess the meaning before you reveal it. Then use each idiom in an original sentence together.

6. Wrap-Up
   - Which idiom do you think is the most poetic or interesting and why?
   - Why do you think all languages develop slang and idioms?

TUTOR NOTE: Turn this into a game. Laughter at failed guesses is part of the learning. The goal is a love of language play, not perfection.""",
                'vocabulary': [
                    {'word': 'idiom', 'definition': 'A phrase whose meaning cannot be understood from the literal meanings of the individual words, such as "break a leg."'},
                    {'word': 'figurative', 'definition': 'Using words in a way that is not meant literally, often for creative or expressive effect.'},
                    {'word': 'literal', 'definition': 'Taking words in their most basic and direct meaning, without metaphor or exaggeration.'},
                    {'word': 'colloquial', 'definition': 'Informal language used in everyday conversation rather than in formal writing or speech.'},
                    {'word': 'jargon', 'definition': 'Specialized vocabulary used by a specific profession, group, or community that outsiders may not understand.'},
                    {'word': 'dialect', 'definition': 'A regional variety of a language with distinct vocabulary, grammar, and pronunciation.'},
                    {'word': 'phrase', 'definition': 'A group of words that function as a unit and express a single idea.'},
                    {'word': 'context', 'definition': 'The surrounding words, situation, or circumstances that help clarify the meaning of a word or phrase.'},
                    {'word': 'connotation', 'definition': 'The emotional or cultural associations that a word carries beyond its literal definition.'},
                    {'word': 'sarcasm', 'definition': 'Saying the opposite of what you mean in order to be funny or critical, often with a mocking tone.'},
                    {'word': 'euphemism', 'definition': 'A mild or indirect expression used instead of a harsh or blunt one, such as "pass away" instead of "die."'},
                    {'word': 'slang', 'definition': 'Very informal language used by specific groups, often generational, and frequently evolving.'},
                ],
                'expressions': [
                    {'expression': "Spill the tea.", 'meaning': 'To share gossip, inside information, or an interesting story. "Come on, spill the tea — what happened at the party?"'},
                    {'expression': "Throw someone under the bus.", 'meaning': 'To blame someone else for something, especially to protect yourself. "He threw me under the bus in front of the whole class."'},
                    {'expression': "Break a leg.", 'meaning': 'A theatrical idiom meaning "good luck," used especially before a performance. Never say "good luck" in a theater — it is considered bad luck.'},
                    {'expression': "Hit the nail on the head.", 'meaning': 'To describe something with perfect accuracy. "She hit the nail on the head with her analysis of the problem."'},
                    {'expression': "Beat around the bush.", 'meaning': 'To avoid saying something directly by talking about related but less important things first. "Stop beating around the bush and just tell me what happened."'},
                    {'expression': "In the same boat.", 'meaning': 'Being in the same difficult or challenging situation as someone else. "We\'re all stressed about finals — we\'re in the same boat."'},
                ],
            },
            {
                'number': 10,
                'title': 'Internet Culture: Memes, Hashtags, and Viral Trends',
                'outline': """LESSON OVERVIEW
Internet culture has become inseparable from everyday American language and social interaction. Memes, viral challenges, trending hashtags, and shared references are now part of how American teenagers bond, communicate politics, and process current events. This lesson gives students a meaningful entry point into this world.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What is the funniest meme you have seen recently?
   - Have you ever participated in an online challenge or trend?
   - Do you think the internet has made American culture more accessible to people around the world?

2. The Language of Internet Culture
   - Memes as a form of cultural commentary: how they encode shared references quickly
   - Viral challenges: Ice Bucket Challenge, TikTok dances, and why people participate
   - Trending hashtags: how a topic goes from a tweet to a global conversation

3. American Internet Humor and References
   - The structure of a meme: setup, punchline, subverted expectation
   - References that non-Americans often miss: American school tropes, holidays, politics
   - Reaction culture: the GIF, the "I\'m screaming," the "I can\'t even"

4. Cultural Deep Dive
   Share a meme or viral moment from the past year that you found genuinely funny or that says something true about American culture. Explain the reference, the context, and why it resonated.

5. Conversation Practice
   Show the student three memes and ask them to explain what they think each one means before you explain. Then reverse: the student shares a meme or internet moment from Peruvian culture.

6. Wrap-Up
   - What does internet culture reveal about American society that you would not see otherwise?
   - Do you think memes are a form of art? Why or why not?

TUTOR NOTE: This session works best when it feels like two people browsing their phones together. Keep it current — pull real examples from this week if possible. Internet culture is extremely time-sensitive.""",
                'vocabulary': [
                    {'word': 'meme', 'definition': 'An image, video, or text that is widely shared online, often with a humorous or satirical message tied to a cultural moment.'},
                    {'word': 'viral', 'definition': 'Content that spreads rapidly online and is viewed or shared by a very large number of people in a short time.'},
                    {'word': 'trend', 'definition': 'A topic, style, or behavior that is currently popular and widely discussed online.'},
                    {'word': 'hashtag', 'definition': 'The # symbol followed by a word or phrase used to categorize posts on social media and make them searchable.'},
                    {'word': 'algorithm', 'definition': 'The automated system used by platforms like TikTok or Instagram to decide what content to show each user.'},
                    {'word': 'influencer', 'definition': 'A person with a large social media following who shapes trends and opinions, often through sponsored content.'},
                    {'word': 'comment section', 'definition': 'The part of a social media post where users leave public responses and reactions.'},
                    {'word': 'thread', 'definition': 'A series of connected posts on Twitter or a forum that form a running conversation on a single topic.'},
                    {'word': 'ratio', 'definition': 'On Twitter, when a reply receives more likes than the original post, signaling widespread disagreement.'},
                    {'word': 'repost', 'definition': 'To share someone else\'s content on your own social media profile.'},
                    {'word': 'content creator', 'definition': 'A person who produces videos, photos, or writing for an online audience.'},
                    {'word': 'platform', 'definition': 'A digital service that hosts content and connects creators with audiences, such as YouTube, TikTok, or Instagram.'},
                ],
                'expressions': [
                    {'expression': "This broke the internet.", 'meaning': 'An exaggeration meaning a piece of content was so popular and widely shared that it dominated online conversation.'},
                    {'expression': "I can\'t even.", 'meaning': 'An expression of being so overwhelmed by something — usually by strong emotion or absurdity — that you cannot form a complete sentence.'},
                    {'expression': "I\'m dead.", 'meaning': 'Internet slang meaning something is so funny that you cannot stop laughing. "That meme made me dead."'},
                    {'expression': "It\'s giving main character energy.", 'meaning': 'A TikTok-era expression meaning someone is acting like the central, dramatic hero of their own story. Can be sincere or ironic.'},
                    {'expression': "Go viral.", 'meaning': 'When a video, post, or image spreads rapidly and reaches a massive audience. "Her cover went viral overnight."'},
                    {'expression': "Clout chasing.", 'meaning': 'Doing something dramatic or controversial online specifically to gain followers and attention, not out of genuine interest.'},
                ],
            },
            {
                'number': 11,
                'title': 'Friendships, Peer Pressure, and Social Belonging',
                'outline': """LESSON OVERVIEW
At the intermediate level, friendship is not just about vocabulary — it is about the real emotional landscape of being a teenager in a social world. Peer pressure, loyalty, betrayal, and the need to belong are universal experiences, but they play out differently in American culture. This lesson creates space for deep, honest conversation.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What is the most important quality in a friend for you?
   - Have you ever felt pressure to do something you did not want to do because of friends?
   - Has a friendship ever ended? How did it happen and how did it feel?

2. Peer Pressure in American Teen Life
   - What peer pressure looks like in American high school: parties, drugs, risk-taking, and conformity
   - The difference between positive peer pressure and negative peer pressure
   - Why teenagers are neurologically wired to care intensely about peer opinions

3. The Dynamics of Close Friendship
   - What it takes to go from acquaintance to true friend in America
   - The group chat: how American friend groups communicate and include or exclude
   - Friendship conflicts: passive aggression, ghosting, and how American teens handle falling out

4. Cultural Deep Dive
   Share a real friendship story — a friendship that shaped you, a betrayal that taught you something, or a moment when you chose to be loyal even when it was hard. Be vulnerable and let the story be messy and real.

5. Conversation Practice
   Discussion: What do you do when a friend asks you to do something you think is wrong? Talk through a specific scenario together and discuss how you would handle it. Practice the language of saying no while preserving a friendship.

6. Wrap-Up
   - What do you think is the hardest part of friendship at your age?
   - Is there anything about how American teenagers handle friendship that seems different from Peru?

TUTOR NOTE: This is a session about emotional intelligence as much as language. Go slow. Ask follow-up questions. The best outcome is a student who feels genuinely heard and understood.""",
                'vocabulary': [
                    {'word': 'peer pressure', 'definition': 'The social influence that causes a person to do something because their friends or peers expect or encourage it.'},
                    {'word': 'loyalty', 'definition': 'The quality of staying faithful and supportive to someone even when it is difficult or costly.'},
                    {'word': 'conflict', 'definition': 'A disagreement or struggle between two people or groups.'},
                    {'word': 'betrayal', 'definition': 'The act of breaking someone\'s trust or being disloyal to them, often causing deep emotional pain.'},
                    {'word': 'passive aggression', 'definition': 'Expressing negative feelings indirectly rather than openly, such as giving the silent treatment or making backhanded comments.'},
                    {'word': 'boundary', 'definition': 'A personal limit that defines what behavior from others you will and will not accept.'},
                    {'word': 'gossip', 'definition': 'Casual conversation that spreads unverified or personal information about others.'},
                    {'word': 'clique', 'definition': 'A small exclusive social group that makes it difficult for outsiders to join.'},
                    {'word': 'toxic', 'definition': 'Used to describe a relationship or environment that is harmful to a person\'s emotional well-being.'},
                    {'word': 'empathy', 'definition': 'The ability to understand and share the feelings of another person.'},
                    {'word': 'reconcile', 'definition': 'To restore a friendly relationship after a disagreement or conflict.'},
                    {'word': 'drift', 'definition': 'To slowly become less close to a person over time without a specific event causing the distance.'},
                ],
                'expressions': [
                    {'expression': "Have someone\'s back.", 'meaning': 'To support and protect a friend, especially when they are in a difficult situation. "No matter what, I\'ve got your back."'},
                    {'expression': "Set a boundary.", 'meaning': 'To clearly communicate what you are not comfortable with in a relationship. An important concept in American emotional health culture.'},
                    {'expression': "Talk it out.", 'meaning': 'To resolve a conflict by having an honest, direct conversation about what happened. "Instead of ignoring each other, they decided to talk it out."'},
                    {'expression': "A true friend.", 'meaning': 'Someone who remains loyal and supportive even in difficult circumstances, not just when things are easy.'},
                    {'expression': "Give in to pressure.", 'meaning': 'To do something because of social influence even when you did not originally want to. "I gave in to the pressure and skipped class with them."'},
                    {'expression': "Fall out.", 'meaning': 'When two friends have a serious disagreement and stop being close. "We fell out over something stupid and never really recovered."'},
                ],
            },
            {
                'number': 12,
                'title': 'American Family Structures and Dynamics',
                'outline': """LESSON OVERVIEW
At the intermediate level, we look at American family life with more depth and complexity. Divorce, blended families, single parents, helicopter parents, and the changing role of family in a teen's life — these are real features of the American landscape that shape everything from a student's weekend to their college application.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - How would you describe your family dynamic — close, independent, complicated?
   - What role do grandparents play in your family?
   - Do you think family shapes who you become, or do you shape yourself?

2. The Many Structures of American Families
   - The high rate of divorce in America and how it affects teenagers
   - Single-parent families: the challenges and the strengths
   - Blended families and step-parents: navigating new family relationships

3. Parenting Styles in America
   - "Helicopter parents" who hover over every decision vs. more hands-off parents
   - The pressure American parents put on children around academics and achievement
   - Generational differences: how Boomer parents differ from Millennial parents

4. Cultural Deep Dive
   Describe your relationship with your parents honestly — what they push you toward, what you rebel against, what you are grateful for, and one thing you wish they understood better about you. Be real and specific.

5. Conversation Practice
   Discussion: Compare how families in Peru and America relate to authority, independence, and obligation. When does family support become suffocating? When does independence become loneliness?

6. Wrap-Up
   - What do you think is the most important thing parents can do for their teenage children?
   - What is something about your family that you are proud of?

TUTOR NOTE: Family is deeply personal. Share genuinely and let the student lead on how much they reveal. Never push for more than they are comfortable sharing.""",
                'vocabulary': [
                    {'word': 'divorce', 'definition': 'The legal dissolution of a marriage, ending the union between two people.'},
                    {'word': 'custody', 'definition': 'The legal right to care for and make decisions about a child after parents separate or divorce.'},
                    {'word': 'stepparent', 'definition': 'A person who becomes your parent by marrying your biological mother or father after a divorce or death.'},
                    {'word': 'helicopter parent', 'definition': 'A parent who is excessively involved in their child\'s life, closely monitoring and managing every aspect of their activities and decisions.'},
                    {'word': 'authoritative', 'definition': 'A parenting style that combines clear rules with warmth and flexibility, considered by researchers to be the most effective.'},
                    {'word': 'sibling rivalry', 'definition': 'Competition and conflict between brothers and sisters, often for parental attention or resources.'},
                    {'word': 'empty nest', 'definition': 'The period when the last child leaves home for college or adulthood, often an emotional transition for parents.'},
                    {'word': 'generation', 'definition': 'A group of people born and raised during the same period, sharing similar cultural experiences.'},
                    {'word': 'obligation', 'definition': 'A duty or responsibility you feel toward someone, often a family member, whether or not you chose it.'},
                    {'word': 'boundaries', 'definition': 'Clear limits on behavior that define the line between appropriate and inappropriate in a relationship.'},
                    {'word': 'independence', 'definition': 'The freedom to make your own decisions and live without needing to rely on others.'},
                    {'word': 'support', 'definition': 'Emotional, financial, or practical help given to someone who needs it.'},
                ],
                'expressions': [
                    {'expression': "Tough love.", 'meaning': 'A parenting approach where a parent enforces strict rules and consequences out of love, believing it builds character. "My dad believes in tough love — no excuses."'},
                    {'expression': "Raised by a single parent.", 'meaning': 'Growing up in a household with only one parent. Very common in America and discussed openly without stigma in most contexts.'},
                    {'expression': "Cut the apron strings.", 'meaning': 'An idiom meaning for a child (or parent) to let go of excessive dependence. "He needs to cut the apron strings and start making his own decisions."'},
                    {'expression': "Family comes first.", 'meaning': 'The belief that obligations to family take priority over personal desires or other commitments.'},
                    {'expression': "Middle child syndrome.", 'meaning': 'A popular idea that middle children feel overlooked compared to the oldest and youngest. Used humorously in American culture.'},
                    {'expression': "Walk in someone\'s shoes.", 'meaning': 'To try to understand someone else\'s experience by imagining yourself in their situation.'},
                ],
            },
            {
                'number': 13,
                'title': 'Music Genres, Fandoms, and Concert Culture',
                'outline': """LESSON OVERVIEW
Music at the intermediate level becomes a vehicle for exploring identity, subculture, and community. Fandoms have their own language, rituals, and hierarchy. Concerts are more than performances — they are communal experiences. Your tutor will bring students inside the world of American music culture with personal depth and specificity.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - If you could see any artist in concert, who would it be and why?
   - What does music mean to you personally — entertainment, identity, comfort?
   - Have you ever been to a live concert or performance? Describe it.

2. American Music Genres and Their Subcultures
   - Country music and its loyal fan base: the culture, the fashion, the values
   - Hip-hop subculture: fashion, language, and its roots in Black American experience
   - Indie and alternative music: the culture of liking things before they are popular
   - Pop megastars: Taylor Swift, Beyonce, and the scale of their cultural influence

3. Fandom Culture in America
   - Fandom names: Swifties, BeyHive, Little Monsters — and the loyalty they represent
   - Online fandom: Twitter fan wars, streaming parties, and defending your artist
   - Fan merch, concerts, and the economics of loving an artist

4. Cultural Deep Dive
   Describe the best concert or live performance you have ever attended. What was the moment that made it unforgettable — the sound, the crowd, the setlist, the shared feeling with strangers? If you have not been to a concert, describe the one you most want to go to and why.

5. Conversation Practice
   Each person pitches an artist the other should listen to — with a 90-second passionate case for why. Then listen to 60 seconds of one of the suggested songs and share your first reaction.

6. Wrap-Up
   - What music genre do you think best represents American culture as a whole?
   - What Peruvian music would you want your tutor to understand and appreciate?

TUTOR NOTE: Play music during this session if possible. Even 30 seconds of a song being played changes the energy and makes the conversation more vivid and real.""",
                'vocabulary': [
                    {'word': 'fandom', 'definition': 'A community of dedicated fans of a particular artist, show, or cultural phenomenon.'},
                    {'word': 'setlist', 'definition': 'The list of songs an artist plans to perform at a concert, in order.'},
                    {'word': 'venue', 'definition': 'The place where a performance or event is held, ranging from small clubs to massive stadiums.'},
                    {'word': 'acoustic', 'definition': 'Describing music played with natural instruments without electronic amplification, often more intimate.'},
                    {'word': 'tour', 'definition': 'A series of concerts performed by an artist in multiple cities or countries over a period of time.'},
                    {'word': 'merch', 'definition': 'Short for merchandise — branded products sold at concerts or online that fans buy to show support.'},
                    {'word': 'opening act', 'definition': 'A lesser-known artist who performs before the main headliner at a concert.'},
                    {'word': 'headliner', 'definition': 'The main, most prominent artist at a concert or festival.'},
                    {'word': 'platinum', 'definition': 'A certification given to a song or album that has sold or been streamed above a certain threshold, indicating massive commercial success.'},
                    {'word': 'superfan', 'definition': 'An extremely dedicated fan who follows an artist closely, attends multiple shows, and knows extensive details about their work.'},
                    {'word': 'era', 'definition': 'In fan culture, a distinct period in an artist\'s career defined by a specific album or style, popularized by Taylor Swift\'s "Eras Tour."'},
                    {'word': 'stan', 'definition': 'To be an extremely dedicated, intense fan of an artist. Can be used as a noun or verb. Comes from the Eminem song "Stan."'},
                ],
                'expressions': [
                    {'expression': "Stan an artist.", 'meaning': 'To be a huge, devoted fan. "I stan Olivia Rodrigo — I know every word to every song."'},
                    {'expression': "This song hits different.", 'meaning': 'A phrase meaning a song feels especially powerful or emotional in a specific context or mood. "This song hits different at 2 a.m."'},
                    {'expression': "Front row energy.", 'meaning': 'The intense, enthusiastic feeling of being right at the front of a concert, closest to the artist.'},
                    {'expression': "Drop everything and stream.", 'meaning': 'A fandom call to action when an artist releases new music, urging fans to immediately listen to boost streaming numbers.'},
                    {'expression': "That era.", 'meaning': 'Referring to a specific period of time or mood associated with an album or moment. "I was in my sad music era last winter."'},
                    {'expression': "Music is my therapy.", 'meaning': 'The common American expression that music helps process emotions and serves as emotional relief.'},
                ],
            },
            {
                'number': 14,
                'title': 'Hollywood and Streaming Culture',
                'outline': """LESSON OVERVIEW
Hollywood shapes global culture, and at the intermediate level we can examine not just what Americans watch but how the industry works, how streaming changed everything, and what movies and TV shows say about American values. This is a lesson about media literacy and cultural analysis through entertainment.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What is a movie or show you have watched recently that made you think?
   - Do you think what a society watches on TV says something true about that society?
   - Has a movie or show ever changed how you saw something in real life?

2. How Hollywood Works
   - The studio system: how movies get made, funded, and distributed
   - The Oscars and why diversity in Hollywood has become a major conversation
   - The difference between prestige film and blockbuster entertainment

3. The Streaming Revolution
   - How Netflix, Hulu, and HBO changed viewing habits and killed traditional TV schedules
   - "Peak TV" — why there is more content than anyone can watch and what that means for quality
   - International content breaking through: Squid Game, Money Heist, and the new global entertainment landscape

4. Cultural Deep Dive
   Recommend a movie or show that you think genuinely captures something true about American life — not the most popular, but the most honest. Describe a specific scene that tells you something about American culture that no tourist could see.

5. Conversation Practice
   Discussion: Should movies and TV shows reflect the diversity of their audience? Has representation in American entertainment improved? Use specific examples.

6. Wrap-Up
   - What is one American movie or show that every Peruvian student should watch to understand American culture?
   - What has American entertainment gotten wrong about the world outside the United States?

TUTOR NOTE: Bring real critical thinking into this session. You are not a tour guide showing off American culture — you are also a critic of it. Students respect intellectual honesty.""",
                'vocabulary': [
                    {'word': 'streaming', 'definition': 'Watching content online in real time without downloading it, through services like Netflix or Disney+.'},
                    {'word': 'representation', 'definition': 'The depiction of different groups of people — racial, gender, cultural — in media and entertainment.'},
                    {'word': 'prestige', 'definition': 'Describing high-quality, critically respected content that aims for artistic rather than purely commercial success.'},
                    {'word': 'box office', 'definition': 'The total amount of money a movie earns from ticket sales, used as a measure of commercial success.'},
                    {'word': 'sequel', 'definition': 'A film or series that continues the story of a previous work.'},
                    {'word': 'franchise', 'definition': 'A series of films, shows, or media built around the same characters or universe, like Marvel or Star Wars.'},
                    {'word': 'critic', 'definition': 'A person who professionally evaluates and reviews films, music, or other art forms.'},
                    {'word': 'reboot', 'definition': 'A new version of an existing film or series that reimagines the original story with new cast or approach.'},
                    {'word': 'cameo', 'definition': 'A brief, often surprising appearance by a famous person in a film or TV show.'},
                    {'word': 'ratings', 'definition': 'Numerical scores or audience size measurements used to evaluate the popularity or success of a show or film.'},
                    {'word': 'pilot', 'definition': 'The first episode of a TV series, used to introduce characters and test the concept with audiences or networks.'},
                    {'word': 'binge', 'definition': 'To watch many episodes of a show in rapid succession, often in a single sitting.'},
                ],
                'expressions': [
                    {'expression': "Oscar-worthy.", 'meaning': 'Used to describe a performance or film that is exceptional enough to deserve an Academy Award.'},
                    {'expression': "Jump the shark.", 'meaning': 'When a TV show introduces something so ridiculous or over-the-top that it signals a permanent decline in quality.'},
                    {'expression': "Cult classic.", 'meaning': 'A movie or show that was not a mainstream hit but developed a devoted, passionate fan following over time.'},
                    {'expression': "Must-see TV.", 'meaning': 'A show so compelling or culturally important that people feel obligated to watch it.'},
                    {'expression': "On your watchlist.", 'meaning': 'A movie or show you have saved to watch later. Streaming platforms allow users to maintain lists of content they want to see.'},
                    {'expression': "Steal the show.", 'meaning': 'When one actor or performer is so good they stand out above everyone else in the production.'},
                ],
            },
            {
                'number': 15,
                'title': 'Part-Time Jobs and the American Work Ethic',
                'outline': """LESSON OVERVIEW
Getting a job as a teenager is a significant American rite of passage — one tied directly to the cultural belief that work builds character, independence, and responsibility. This lesson explores the world of teen employment in America with honesty: the pride, the exhaustion, the difficult bosses, and the first paycheck.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Have you ever earned money by doing something — a task, a favor, a small job?
   - What do you think is the most common job for American teenagers?
   - Do you think it is good or bad for teenagers to have jobs?

2. Teen Jobs in America: The Reality
   - The most common teen jobs: fast food, retail, babysitting, tutoring, lawn care
   - Why many American teens choose to work: personal spending money, saving for college, building a resume
   - The conflict between work, school, and social life when you have a part-time job

3. The American Work Ethic
   - The cultural value of "hard work" and why it is both admired and complicated
   - "Hustle culture" and the pressure on young Americans to always be productive
   - The debate: does working in high school help or hurt students academically?

4. Cultural Deep Dive
   Describe your first job or the first time you earned money. What was the job, what were your responsibilities, what was a mistake you made, and what did you learn about yourself from the experience?

5. Conversation Practice
   Role-play: Practice a job interview from start to finish — greeting, answering "Tell me about yourself," answering "What is your greatest weakness?", and closing with "Do you have any questions for me?"

6. Wrap-Up
   - What did you learn about American work culture that surprised you?
   - Do you think it is important to have a job before you finish school?

TUTOR NOTE: Be honest about the less glamorous parts of working — the hard shifts, the rude customers, the feeling of being exhausted on a school night. Authentic experience is more valuable than an idealized picture.""",
                'vocabulary': [
                    {'word': 'resume', 'definition': 'A document listing a person\'s work experience, skills, and education, submitted when applying for a job.'},
                    {'word': 'reference', 'definition': 'A person who can speak to your character and abilities to a potential employer.'},
                    {'word': 'minimum wage', 'definition': 'The legally required lowest hourly pay that employers must provide to workers.'},
                    {'word': 'work ethic', 'definition': 'A belief in the moral value of work and the importance of diligence and hard work.'},
                    {'word': 'internship', 'definition': 'A short-term work experience, often unpaid or low-paid, where a student learns professional skills.'},
                    {'word': 'networking', 'definition': 'Building professional relationships that can lead to job opportunities and career advancement.'},
                    {'word': 'hustle', 'definition': 'To work hard, often at multiple things simultaneously. In American culture, hustle is frequently used as a verb of approval.'},
                    {'word': 'payroll', 'definition': 'The system a company uses to pay employees, including calculating wages and withholding taxes.'},
                    {'word': 'commission', 'definition': 'Pay based on the amount of products sold or goals achieved, common in retail and sales jobs.'},
                    {'word': 'burnout', 'definition': 'Exhaustion and loss of motivation from working too hard for too long.'},
                    {'word': 'discipline', 'definition': 'The ability to consistently do what is required, even when it is difficult or unpleasant.'},
                    {'word': 'promotion', 'definition': 'An advancement to a higher position with more responsibility and usually higher pay.'},
                ],
                'expressions': [
                    {'expression': "Put in the work.", 'meaning': 'To make a strong, consistent effort toward a goal. A core expression of American hustle culture.'},
                    {'expression': "Work your way up.", 'meaning': 'To start at a low-level position and gradually advance to more senior roles through hard work.'},
                    {'expression': "The grind.", 'meaning': 'The daily routine of hard work and effort. "Back to the grind" means returning to your regular work schedule.'},
                    {'expression': "Clock in.", 'meaning': 'To officially start your work shift by recording your start time. The counterpart is "clock out."'},
                    {'expression': "Above and beyond.", 'meaning': 'Doing more than what is required or expected. "She always goes above and beyond — that\'s why customers love her."'},
                    {'expression': "First real job.", 'meaning': 'The first officially paid employment experience a person has. Often used nostalgically: "My first real job was at a pizza place."'},
                ],
            },
            {
                'number': 16,
                'title': 'Teen Mental Health and Wellness in America',
                'outline': """LESSON OVERVIEW
Mental health awareness has exploded in American teen culture over the past decade. Therapy, anxiety, depression, and self-care are discussed openly in ways previous generations never would have allowed. This lesson explores this shift honestly — what it means, why it happened, and how American teens navigate mental health today.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What does mental health mean to you?
   - Have you ever heard an American say they are going to therapy? How did that make you feel?
   - Do you think talking about mental health openly is a sign of strength or weakness?

2. The Mental Health Conversation in America
   - Why Gen Z talks about mental health more than any previous generation
   - The role of social media in both causing and discussing mental health struggles
   - Common struggles among American teens: anxiety, depression, eating disorders, loneliness

3. Resources and Responses
   - School counselors and how they function in American high schools
   - Therapy: what it is, why teens go, and why it is less stigmatized in America than in many countries
   - Crisis resources: the 988 Suicide and Crisis Lifeline, and why Americans build this infrastructure

4. Cultural Deep Dive
   Share honestly about a time you struggled emotionally — with school stress, a relationship, identity, or something harder. What helped? What did you wish you had known or said earlier? How did asking for help (or not asking) affect the outcome?

5. Conversation Practice
   Discussion: How do you think attitudes toward mental health differ between Peru and the United States? Is therapy seen as a sign of weakness or a tool for growth? What would it take for you to talk to someone when things get hard?

6. Wrap-Up
   - What is one thing you can do to support your mental health this week?
   - How do you feel about this topic? Was it hard or comfortable to discuss?

TUTOR NOTE: Approach with extreme care and genuine openness. This is not a clinical session — it is a human conversation. Share your own vulnerability first. If the student discloses something serious, take it seriously and gently point them toward a trusted adult.""",
                'vocabulary': [
                    {'word': 'anxiety', 'definition': 'Persistent feelings of worry, nervousness, or fear that interfere with daily life.'},
                    {'word': 'depression', 'definition': 'A mental health condition characterized by persistent low mood, loss of interest, and difficulty functioning.'},
                    {'word': 'therapy', 'definition': 'Regular sessions with a trained professional to discuss and work through emotional or psychological challenges.'},
                    {'word': 'coping mechanism', 'definition': 'A strategy a person uses to manage stress, difficult emotions, or challenging situations.'},
                    {'word': 'stigma', 'definition': 'A negative social perception or stereotype attached to a condition that causes shame or discrimination.'},
                    {'word': 'burnout', 'definition': 'Emotional and physical exhaustion caused by sustained stress, most commonly from school or work.'},
                    {'word': 'self-care', 'definition': 'Deliberate activities to maintain or improve one\'s physical, emotional, and mental well-being.'},
                    {'word': 'resilience', 'definition': 'The ability to recover from difficulty and adapt positively in the face of adversity.'},
                    {'word': 'trigger', 'definition': 'Something that sets off a strong emotional or psychological reaction, often related to a past experience.'},
                    {'word': 'mindfulness', 'definition': 'The practice of being fully present and aware in the current moment, often used as a stress-reduction technique.'},
                    {'word': 'overwhelmed', 'definition': 'Feeling like you have more to deal with than you have the emotional or physical capacity to manage.'},
                    {'word': 'support system', 'definition': 'The network of friends, family, and professionals a person relies on for emotional help and encouragement.'},
                ],
                'expressions': [
                    {'expression': "I\'m going to therapy.", 'meaning': 'A statement that has become normalized among American Gen Z and Millennials, said without shame or secrecy.'},
                    {'expression': "Take care of yourself.", 'meaning': 'A common American farewell or encouragement that now carries genuine weight, especially in mental health contexts.'},
                    {'expression': "Mental health day.", 'meaning': 'A day taken off from school or work specifically to rest and recover emotionally, increasingly accepted in American culture.'},
                    {'expression': "It\'s okay not to be okay.", 'meaning': 'A widely used American mental health phrase that normalizes struggling and validates the need for help.'},
                    {'expression': "Reach out.", 'meaning': 'To contact someone for help, support, or connection. "If you\'re struggling, please reach out to someone you trust."'},
                    {'expression': "Check in on a friend.", 'meaning': 'To contact a friend to see how they are doing, especially if you sense they may be struggling emotionally.'},
                ],
            },
            {
                'number': 17,
                'title': 'College Prep: SAT, ACT, and Applications',
                'outline': """LESSON OVERVIEW
The American college application process is one of the most intense and defining experiences of high school — and understanding it illuminates everything about American values around achievement, competition, and identity. Your tutor will bring this world to life with the weight and stress it actually carries.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Do you think about college? What do you imagine it being like?
   - Have you heard of the SAT or ACT? What do you know about them?
   - Do you think how well you do on one test should determine your future?

2. The Standardized Testing Gauntlet
   - What the SAT and ACT are, how they are scored, and what a "good" score looks like
   - Test prep culture: tutors, prep courses, Kaplan, Princeton Review — the industry around testing
   - The movement away from standardized testing and why many universities have gone test-optional

3. The College Application Process
   - Components: grades, test scores, extracurriculars, recommendations, and the personal essay
   - Early decision vs. regular decision — the strategy and pressure around application timing
   - Reach schools, match schools, and safety schools — building a balanced college list

4. Cultural Deep Dive
   Share your own college application experience — the schools you applied to, the essays you wrote, the waiting, the rejections, and how it felt to get in or not get in. Be honest about the pressure and whether you think the process was fair.

5. Conversation Practice
   Practice writing the opening of a college personal essay together. Start with: "Tell me about a challenge you have faced and what you learned from it." The student drafts 3-4 sentences and you give feedback.

6. Wrap-Up
   - Does the American college application system seem fair to you?
   - What do you want to study if you go to university?

TUTOR NOTE: Validate the absurdity of the process while preparing the student for its reality. Many American tutors have complicated feelings about the college application process — share them honestly.""",
                'vocabulary': [
                    {'word': 'standardized test', 'definition': 'An exam administered and scored in a consistent manner, used to compare students across different schools and regions.'},
                    {'word': 'application', 'definition': 'The formal process of submitting materials to a college for consideration for admission.'},
                    {'word': 'recommendation letter', 'definition': 'A letter written by a teacher, counselor, or mentor that describes a student\'s character and abilities for a college application.'},
                    {'word': 'personal essay', 'definition': 'A short written piece required by most colleges in which a student reflects on their experiences, values, or identity.'},
                    {'word': 'early decision', 'definition': 'A binding application process where a student applies early to one school and commits to attending if accepted.'},
                    {'word': 'waitlist', 'definition': 'A list of applicants who are not accepted or rejected immediately, but may be offered admission if space becomes available.'},
                    {'word': 'financial aid', 'definition': 'Money from the government, institution, or private sources given to students to help pay for their education.'},
                    {'word': 'scholarship', 'definition': 'Money awarded to a student for academic, athletic, or other merit that does not need to be repaid.'},
                    {'word': 'Ivy League', 'definition': 'A group of eight elite private universities in the northeastern U.S., including Harvard, Yale, and Princeton, known for selectivity and prestige.'},
                    {'word': 'major', 'definition': 'The primary subject area a student focuses on and specializes in during college.'},
                    {'word': 'admissions', 'definition': 'The process by which a college evaluates and accepts or rejects applicants.'},
                    {'word': 'tuition', 'definition': 'The fee charged by a college or university for instruction and academic services.'},
                ],
                'expressions': [
                    {'expression': "Get into college.", 'meaning': 'To receive acceptance from a university. "She worked so hard — she got into her dream school."'},
                    {'expression': "Reach school.", 'meaning': 'A college that is more selective than a student\'s current stats suggest they would typically be admitted to.'},
                    {'expression': "The waiting game.", 'meaning': 'The stressful period after applying to colleges but before receiving decisions. "December through March is just one long waiting game."'},
                    {'expression': "Write the essay.", 'meaning': 'To complete the personal essay portion of a college application, widely considered the most intimidating part of the process.'},
                    {'expression': "Rejection letter.", 'meaning': 'Formal notification from a college that a student has not been accepted. Receiving rejection letters is a near-universal American teen experience.'},
                    {'expression': "Dream school.", 'meaning': 'The college a student most wants to attend, often for emotional or aspirational reasons beyond just ranking.'},
                ],
            },
            {
                'number': 18,
                'title': 'Recreational Sports and Community Events',
                'outline': """LESSON OVERVIEW
Beyond organized school sports and professional leagues, Americans participate in a huge world of recreational sports — community leagues, pickup games, fun runs, and neighborhood events that bring people together. This lesson explores the social fabric of American community life through the lens of recreation and shared activity.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Do you play any sport just for fun, not competitively?
   - What does your neighborhood or community do to bring people together?
   - What recreational activity would you most want to try?

2. Recreational Sports Culture in America
   - Adult recreational leagues: soccer, softball, kickball, bowling — sports adults play just for fun
   - Community 5Ks and charity runs: why Americans run for causes
   - Youth sports: Little League, AYSO soccer, and what weekend sports culture looks like for families

3. Community Events That Bring Americans Together
   - Block parties, street fairs, and neighborhood cookouts
   - Farmer's markets as a weekly social ritual
   - Fourth of July community celebrations: parades, fireworks, and public gatherings

4. Cultural Deep Dive
   Describe a community event or recreational activity that brought you or your family together in a memorable way — a neighborhood event, a family pickup game, a charity walk with a cause close to your heart. Capture the feeling of community that came from it.

5. Conversation Practice
   Discussion: What makes a community feel strong and connected? What role does shared activity play in building community? Compare how communities gather in Peru vs. in America.

6. Wrap-Up
   - What kind of community event would you want to organize if you could?
   - What recreational sport or activity would you want to try with an American friend?

TUTOR NOTE: This session is best when it draws out both people\'s experiences of community and belonging. Let the conversation wander — stories of community are some of the most human conversations you can have.""",
                'vocabulary': [
                    {'word': 'recreational', 'definition': 'Done for enjoyment and relaxation during free time, not for professional competition.'},
                    {'word': 'league', 'definition': 'An organized group of teams that compete against each other in a structured season.'},
                    {'word': 'tournament', 'definition': 'A competition in which multiple teams or players compete in a series of games to determine a champion.'},
                    {'word': '5K', 'definition': 'A race of 5 kilometers, very popular in America as a community fundraising and fitness event.'},
                    {'word': 'nonprofit', 'definition': 'An organization that operates for a social mission rather than financial profit, often organizing community events.'},
                    {'word': 'block party', 'definition': 'A neighborhood celebration where residents of a street or block gather outside together, often with food, music, and games.'},
                    {'word': 'cookout', 'definition': 'An outdoor meal where food is grilled, typically shared with neighbors or friends as a casual social event.'},
                    {'word': 'farmer\'s market', 'definition': 'A weekly outdoor market where local farmers and vendors sell fresh produce, baked goods, and artisan products.'},
                    {'word': 'spectator', 'definition': 'A person who watches a sports event or performance without participating.'},
                    {'word': 'volunteer', 'definition': 'A person who works for a cause or organization without being paid.'},
                    {'word': 'community center', 'definition': 'A public building that offers recreational programs, classes, and social services to neighborhood residents.'},
                    {'word': 'charity', 'definition': 'An organization or event that raises money or support for people in need or for a social cause.'},
                ],
                'expressions': [
                    {'expression': "Sign up for a 5K.", 'meaning': 'To register for a community race, which in America is often tied to a charitable cause. "I signed up for the cancer awareness 5K next month."'},
                    {'expression': "Give back to the community.", 'meaning': 'To contribute time, money, or effort to benefit the neighborhood or society that has supported you.'},
                    {'expression': "Show up.", 'meaning': 'To be present and participate. In community contexts, it means making the effort to attend and support shared events.'},
                    {'expression': "Get involved.", 'meaning': 'To actively participate in your community, school, or organization rather than remaining on the sidelines.'},
                    {'expression': "Local hangout.", 'meaning': 'A specific place in a community — a park, a diner, a court — where people regularly gather socially.'},
                    {'expression': "Family-friendly.", 'meaning': 'Describing an event or place that is appropriate and enjoyable for all ages, including children.'},
                ],
            },
            {
                'number': 19,
                'title': 'Arts, Theater, and Creative Expression in Schools',
                'outline': """LESSON OVERVIEW
The arts are alive in American high schools — theater productions, visual art classes, ceramics, photography, choir, band, orchestra, and creative writing. For many students, the arts are the most meaningful part of their school experience, a space for identity and expression that academics cannot offer. Your tutor will bring this world to life.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Are you creative? What is one thing you like to make, draw, write, or perform?
   - Does your school have any arts programs — music, theater, visual art?
   - If you could be talented at any art form, what would you choose?

2. The American High School Theater Experience
   - The musical: what it is, the audition process, the rehearsal calendar, and opening night
   - Drama class vs. the school production: two very different experiences
   - The social world of theater kids: why theater creates some of the strongest friendships

3. Visual Arts and Creative Programs
   - Art class in America: painting, drawing, sculpture, and digital art
   - Photography, film, and media arts as increasingly popular electives
   - The AP Art portfolio: what serious young artists spend their senior year building

4. Cultural Deep Dive
   Share an arts experience that meant something to you — a performance you were in, a piece of art you made, a concert you played, or an art show you attended. Describe what it felt like to make something and share it with an audience.

5. Conversation Practice
   Each person shares: one art form they have tried, one they wish they had learned, and one thing they made that they were genuinely proud of. Ask each other two follow-up questions about the creative experience.

6. Wrap-Up
   - Why do you think the arts matter in a student\'s education?
   - Is creative expression valued at your school in Peru? How?

TUTOR NOTE: If you are involved in any creative pursuit, bring that energy into the room. Students who see their tutor genuinely excited about creating something find it deeply inspiring.""",
                'vocabulary': [
                    {'word': 'audition', 'definition': 'A tryout where a performer shows their skills to be selected for a role in a play, musical, or production.'},
                    {'word': 'rehearsal', 'definition': 'A practice session for a performance where the cast refines their lines, movements, and delivery.'},
                    {'word': 'portfolio', 'definition': 'A curated collection of an artist\'s work presented to demonstrate their skills and range, especially for college applications.'},
                    {'word': 'medium', 'definition': 'The material or technique an artist uses to create work, such as oil paint, clay, or digital photography.'},
                    {'word': 'monologue', 'definition': 'A long speech delivered by one person, often used in theater auditions or drama class.'},
                    {'word': 'improv', 'definition': 'Short for improvisation — unscripted performance created spontaneously in the moment.'},
                    {'word': 'exhibition', 'definition': 'A public display of artwork, where pieces are shown for an audience to view and respond to.'},
                    {'word': 'critique', 'definition': 'A structured review and analysis of a piece of artwork or performance, common in art classes.'},
                    {'word': 'cast', 'definition': 'The group of actors chosen to perform roles in a theatrical production.'},
                    {'word': 'director', 'definition': 'The person who oversees the creative vision of a performance or film.'},
                    {'word': 'backstage', 'definition': 'The area behind the stage, hidden from the audience, where actors wait and prepare for their scenes.'},
                    {'word': 'standing ovation', 'definition': 'When an audience rises to their feet and applauds, indicating an exceptional performance.'},
                ],
                'expressions': [
                    {'expression': "Break a leg.", 'meaning': 'A theater superstition meaning "good luck." Never say "good luck" backstage — say "break a leg" instead.'},
                    {'expression': "The show must go on.", 'meaning': 'A theater expression meaning that a performance continues no matter what obstacles arise. Also used generally to mean pressing forward despite difficulty.'},
                    {'expression': "Get into character.", 'meaning': 'To fully embody the role you are playing and think, move, and speak as that character.'},
                    {'expression': "Steal the show.", 'meaning': 'When one performer stands out so impressively that they overshadow everyone else in the production.'},
                    {'expression': "Creative block.", 'meaning': 'A period when an artist cannot generate new ideas or produce work, feeling stuck or uninspired.'},
                    {'expression': "Wear your heart on your sleeve.", 'meaning': 'To express your feelings openly and without hiding them, often associated with artists and performers who put emotion into their work.'},
                ],
            },
            {
                'number': 20,
                'title': 'American Politics and Social Issues for Teens',
                'outline': """LESSON OVERVIEW
American teenagers are more politically engaged than any previous generation, and understanding the landscape of American politics is essential to understanding the culture. This lesson is not about taking sides — it is about giving students the vocabulary, context, and confidence to engage with political topics in English.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Do you follow political news? What do you care about most?
   - What do you think are the biggest issues facing teenagers in America right now?
   - Is politics something you feel comfortable talking about with friends?

2. The American Political Landscape for Teens
   - Democrats and Republicans: the basics without choosing a side
   - Issues teenagers care about: climate change, gun control, college debt, racial justice
   - Youth voter registration and why 18-year-olds are increasingly seen as a powerful voting bloc

3. Social Issues Dominating the Conversation
   - Racial justice and the ongoing conversation about systemic inequality
   - LGBTQ+ rights and how they are debated differently across American states
   - Immigration: why it is personal for many students and how the debate affects real families

4. Cultural Deep Dive
   Share one political or social issue you personally care about and why — not a party talking point, but something that affects you or someone you love. Show the student what it looks like to hold a political opinion thoughtfully and with humility.

5. Conversation Practice
   Discussion: What is one social issue that matters to both Peru and America? Can you each describe the problem and a possible solution in 2 minutes? Practice using formal debate language: "I believe," "On the other hand," "Evidence suggests."

6. Wrap-Up
   - What is one thing you want to know more about after this conversation?
   - Do you think teenagers have a responsibility to be politically active?

TUTOR NOTE: Model intellectual honesty. Share your own views but make clear they are yours, not the only valid perspective. The goal is to make students feel capable of engaging with hard topics in English, not to persuade them of any position.""",
                'vocabulary': [
                    {'word': 'democracy', 'definition': 'A political system in which citizens have the right to vote and participate in the decisions that affect them.'},
                    {'word': 'policy', 'definition': 'A plan or set of rules adopted by a government or organization to guide decisions and actions.'},
                    {'word': 'legislation', 'definition': 'Laws or a set of laws proposed and enacted by a government.'},
                    {'word': 'senator', 'definition': 'An elected official who serves in the Senate, the upper chamber of the U.S. Congress.'},
                    {'word': 'amendment', 'definition': 'A change or addition to a legal document, especially the U.S. Constitution.'},
                    {'word': 'protest', 'definition': 'A public demonstration expressing opposition to a policy, decision, or injustice.'},
                    {'word': 'civil rights', 'definition': 'The rights of citizens to political and social freedom and equality under the law.'},
                    {'word': 'equity', 'definition': 'Fairness and justice in how resources and opportunities are distributed, especially to historically marginalized groups.'},
                    {'word': 'partisan', 'definition': 'Strongly supporting one political party and seeing issues primarily through that lens.'},
                    {'word': 'bipartisan', 'definition': 'Supported by or involving members of both major political parties.'},
                    {'word': 'activist', 'definition': 'A person who campaigns vigorously for or against a cause, especially social or political.'},
                    {'word': 'ballot', 'definition': 'The method of casting a vote in an election, whether on paper or electronically.'},
                ],
                'expressions': [
                    {'expression': "Across the aisle.", 'meaning': 'Working with or agreeing with members of the opposing political party. Refers to the two sides of a legislative chamber. "We need leaders who can reach across the aisle."'},
                    {'expression': "Make your voice heard.", 'meaning': 'To speak up and take action on issues that matter to you, especially through voting or advocacy.'},
                    {'expression': "On both sides of the debate.", 'meaning': 'A phrase used when presenting multiple perspectives on a controversial issue.'},
                    {'expression': "Take a stand.", 'meaning': 'To publicly declare your position on an issue and be willing to defend it. "She took a stand against the new policy at the school board meeting."'},
                    {'expression': "Change from the inside.", 'meaning': 'The belief that the best way to fix a broken system is to join it and reform it rather than opposing it from the outside.'},
                    {'expression': "Civic duty.", 'meaning': 'The responsibilities a citizen has to participate in and contribute to their society, including voting, paying taxes, and staying informed.'},
                ],
            },
        ]
    },
    {
        'level': 'advanced',
        'title': 'English with American Friends: Advanced',
        'description': 'An advanced curriculum for students with strong English foundations who are ready to engage in complex, analytical discussions about American society, culture, and identity. Lessons emphasize critical thinking, debate, and sophisticated language use.',
        'lessons': [
            {
                'number': 1,
                'title': 'Social Dynamics: Cliques, Identity, and High School Politics',
                'outline': """LESSON OVERVIEW
At the advanced level, high school social dynamics become an entry point into deeper questions about identity formation, group psychology, and the long-term effects of social hierarchies. This session moves from description to analysis — not just what cliques are, but why they exist and what they reveal about human nature and American culture.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Looking back, how would you describe your social identity in high school? Has it changed?
   - Do you think social hierarchies in high school prepare students for adult life or damage them?
   - What does it mean to "find yourself" during the teenage years?

2. The Psychology of Social Groups in American High Schools
   - Why humans naturally form in-groups and out-groups, and how high school amplifies this
   - Identity diffusion vs. identity achievement: the developmental task of adolescence
   - How the rise of social media has changed the social dynamics that previously only existed in hallways

3. Systemic Factors in Social Hierarchies
   - How race, class, and gender shape who ends up where in the social hierarchy
   - The role of school culture and administrative decisions in reinforcing or challenging social division
   - Long-term consequences: how high school social experiences shape adult confidence and relationships

4. Cultural Deep Dive
   Analyze your own high school social experience with the distance of time. What group were you in? What did you gain from it and what did it cost you? What do you understand now that you did not understand then?

5. Conversation Practice
   Structured debate: "Social hierarchies in high school are inevitable and ultimately useful." Argue one side and then switch. Practice the language of academic argument.

6. Wrap-Up
   - Has your thinking about high school social dynamics changed through this conversation?
   - What advice would you give to a 14-year-old about navigating social life?

TUTOR NOTE: This session is most powerful when it is genuinely retrospective and analytical. You are not describing high school — you are analyzing it from a position of experience and reflection.""",
                'vocabulary': [
                    {'word': 'hierarchy', 'definition': 'A system of social organization with ranks ordered from most to least powerful.'},
                    {'word': 'in-group', 'definition': 'A social group to which a person feels they belong, often leading to favoritism toward members and exclusion of outsiders.'},
                    {'word': 'out-group', 'definition': 'A social group that a person does not identify with, often perceived as different or inferior.'},
                    {'word': 'identity formation', 'definition': 'The psychological process through which a person develops a stable and coherent sense of who they are.'},
                    {'word': 'adolescence', 'definition': 'The developmental stage between childhood and adulthood, characterized by physical, cognitive, and social change.'},
                    {'word': 'conformity', 'definition': 'Adjusting one\'s behavior, attitudes, or beliefs to match the norms of a group.'},
                    {'word': 'ostracism', 'definition': 'Deliberate social exclusion of an individual from a group.'},
                    {'word': 'systemic', 'definition': 'Relating to or affecting an entire system rather than being isolated to individual cases.'},
                    {'word': 'intersectionality', 'definition': 'The way that multiple social identities — race, class, gender — overlap and interact to create compound experiences of advantage or disadvantage.'},
                    {'word': 'tribalism', 'definition': 'The tendency to form strong loyalty to one\'s own group at the expense of other groups.'},
                    {'word': 'social mobility', 'definition': 'The ability of a person to move between different levels of a social hierarchy.'},
                    {'word': 'authenticity', 'definition': 'The quality of being genuine and true to one\'s own character rather than performing for social acceptance.'},
                ],
                'expressions': [
                    {'expression': "Find your tribe.", 'meaning': 'To discover a group of people with whom you feel a genuine sense of belonging and shared identity. A popular phrase in American self-help culture.'},
                    {'expression': "Social capital.", 'meaning': 'The networks of relationships, trust, and social connections that give a person influence or access within a community.'},
                    {'expression': "Power dynamics.", 'meaning': 'The shifting patterns of power and influence between individuals or groups in any social context.'},
                    {'expression': "Internalize the hierarchy.", 'meaning': 'To unconsciously accept and believe in a social ranking system, even when it disadvantages you.'},
                    {'expression': "The pecking order.", 'meaning': 'The informal ranking of individuals within a group based on status, influence, and dominance.'},
                    {'expression': "Come into your own.", 'meaning': 'To reach full development and confidence in your identity, often used to describe maturing from adolescence to adulthood.'},
                ],
            },
            {
                'number': 2,
                'title': 'The American Education System: Structure, Gaps, and Debates',
                'outline': """LESSON OVERVIEW
At the advanced level, the American education system is not just described — it is interrogated. From the achievement gap to school funding disparities to debates over standardized testing and curriculum, this lesson invites students to think critically about what education is for and who it serves.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What do you think education is fundamentally for — jobs, citizenship, personal growth, something else?
   - Have you ever felt that the education system failed you in some way?
   - What is one thing you think should change about how your country educates its young people?

2. The Structure and Inequality of American Education
   - Public school funding through property taxes: why rich neighborhoods have better schools
   - Charter schools and private schools: the debate over school choice and public resources
   - The achievement gap: the persistent disparity in educational outcomes along racial and economic lines

3. What American Schools Teach and Do Not Teach
   - Gaps in American history education: what gets left out and why
   - The debate over sex education, critical race theory, and banned books
   - Financial literacy, mental health, and practical skills that are often absent from curricula

4. Cultural Deep Dive
   Tell the student about something you were never taught in school that you wish you had been, and something you were taught extensively that you have never used. Be specific and critical of the system you came from.

5. Conversation Practice
   Structured debate: "The American education system reinforces inequality rather than reducing it." Present evidence-based arguments on both sides and reach a nuanced conclusion together.

6. Wrap-Up
   - What would an ideal education system look like to you?
   - What does this analysis reveal about the values America says it has versus the values it actually demonstrates?

TUTOR NOTE: Model critical thinking about your own experience. Admitting the flaws of your own education makes this conversation credible and intellectually honest.""",
                'vocabulary': [
                    {'word': 'achievement gap', 'definition': 'The persistent disparity in academic performance between different groups of students, especially along racial and socioeconomic lines.'},
                    {'word': 'charter school', 'definition': 'A publicly funded but independently operated school that operates with more flexibility than traditional public schools.'},
                    {'word': 'curriculum', 'definition': 'The subjects and content taught at a school or educational institution.'},
                    {'word': 'standardization', 'definition': 'The process of making things conform to a common standard, such as using the same tests to measure all students.'},
                    {'word': 'equity', 'definition': 'The principle of fair distribution of resources based on need rather than equal distribution to all.'},
                    {'word': 'disparity', 'definition': 'A noticeable difference or inequality, especially one that is seen as unfair.'},
                    {'word': 'pedagogy', 'definition': 'The art, science, and practice of teaching.'},
                    {'word': 'socioeconomic', 'definition': 'Relating to both social and economic factors, especially the combination of income level and social class.'},
                    {'word': 'accountability', 'definition': 'The obligation of schools or officials to be responsible for their results and report on their performance.'},
                    {'word': 'merit', 'definition': 'The quality of being deserving of reward or recognition based on ability and achievement alone.'},
                    {'word': 'voucher', 'definition': 'A government-issued subsidy allowing parents to use public money to pay for private school tuition.'},
                    {'word': 'critical thinking', 'definition': 'The ability to analyze information objectively and form reasoned judgments rather than accepting claims at face value.'},
                ],
                'expressions': [
                    {'expression': "The school-to-prison pipeline.", 'meaning': 'A term describing how harsh disciplinary practices in underfunded schools push marginalized students out of education and into the criminal justice system.'},
                    {'expression': "Leave no child behind.", 'meaning': 'The title of a 2001 U.S. education law, now also used as an ironic critique when schools clearly do leave some children behind.'},
                    {'expression': "Teach to the test.", 'meaning': 'When teachers focus their instruction on what will appear on standardized tests rather than broader learning. Widely criticized.'},
                    {'expression': "Funding gap.", 'meaning': 'The significant difference in school resources between wealthy and low-income districts due to property tax-based funding.'},
                    {'expression': "Systemic inequality.", 'meaning': 'Inequality that is built into the structure of institutions and systems rather than caused solely by individual actions.'},
                    {'expression': "Access to opportunity.", 'meaning': 'The degree to which people can reach resources, education, and experiences that allow them to succeed.'},
                ],
            },
            {
                'number': 3,
                'title': 'Food Culture, Diet Trends, and the American Food Industry',
                'outline': """LESSON OVERVIEW
At the advanced level, food becomes an entry point into some of America's most complex social tensions: health and inequality, agricultural policy, the environmental cost of eating, and the cultural politics of diet. This is a lesson where food tells you everything about power, class, and American values.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Do you think about where your food comes from and how it was made?
   - Have you ever followed a diet or changed your eating habits for health or ethical reasons?
   - Why do you think America has both the world's most advanced food science and a serious obesity epidemic?

2. The American Food Industry: Scale and Consequence
   - Factory farming: the scale, efficiency, and ethical controversies of industrial food production
   - The role of corn, soy, and subsidies in shaping what Americans eat
   - Fast food and food deserts: why healthy food is a class privilege in many American communities

3. Diet Culture and Its Contradictions
   - The billion-dollar American diet industry: Keto, Paleo, Whole30, and endless cycles
   - Orthorexia and the culture of "clean eating" taken to an extreme
   - The body positivity movement as a pushback against diet culture

4. Cultural Deep Dive
   Share your own complicated relationship with food — not just what you eat but how you think about it, what your parents taught you about eating, and whether you have ever felt guilt around food. This humanizes the systemic analysis.

5. Conversation Practice
   Structured discussion: "Access to healthy food is a human rights issue, not a personal responsibility issue." Argue your position using examples from the American food system.

6. Wrap-Up
   - What does the way a society feeds itself reveal about its values?
   - How does Peru\'s food culture compare to America\'s in terms of health and sustainability?

TUTOR NOTE: This topic can touch on eating disorders and body image. Be sensitive and watch for signs that this is hitting close to home for the student. Lead with systemic analysis before getting personal.""",
                'vocabulary': [
                    {'word': 'food desert', 'definition': 'An area, typically in a low-income community, where residents have limited access to affordable, nutritious food.'},
                    {'word': 'processed food', 'definition': 'Food that has been altered from its natural state through industrial methods, often containing added chemicals, sugar, and preservatives.'},
                    {'word': 'subsidy', 'definition': 'Money given by a government to support a business or industry, which in America includes large payments to corn and soy farmers.'},
                    {'word': 'sustainability', 'definition': 'The ability to meet current needs without depleting resources or damaging systems that future generations will depend on.'},
                    {'word': 'diet culture', 'definition': 'A social system that values thinness and specific eating patterns as moral virtues and conflates body size with health and worth.'},
                    {'word': 'food security', 'definition': 'The state of having reliable access to a sufficient quantity of affordable, nutritious food.'},
                    {'word': 'organic', 'definition': 'Food produced without synthetic pesticides, fertilizers, or genetically modified organisms.'},
                    {'word': 'GMO', 'definition': 'Genetically Modified Organism — a plant or animal whose DNA has been altered using genetic engineering for desired traits.'},
                    {'word': 'obesity', 'definition': 'A medical condition where excess body fat has accumulated to the extent that it may harm health.'},
                    {'word': 'microbiome', 'definition': 'The complex community of microorganisms living in and on the human body, especially the gut, which affects overall health.'},
                    {'word': 'inflammation', 'definition': 'A biological response associated with poor diet and linked to chronic diseases like diabetes and heart disease.'},
                    {'word': 'food sovereignty', 'definition': 'The right of peoples to define their own food systems according to their cultural and environmental needs.'},
                ],
                'expressions': [
                    {'expression': "You are what you eat.", 'meaning': 'The idea that your health and character are shaped by what you consume. A common American saying with increasingly complex implications.'},
                    {'expression': "Eat clean.", 'meaning': 'A popular American wellness philosophy emphasizing whole, unprocessed foods. Often adopted as a complete lifestyle rather than just a diet.'},
                    {'expression': "Food for thought.", 'meaning': 'An idiom meaning something worth considering or thinking about. "That documentary gave me a lot of food for thought about where my food comes from."'},
                    {'expression': "Vote with your fork.", 'meaning': 'The idea that food purchasing decisions are a form of political and ethical action that shapes the market.'},
                    {'expression': "The table is set.", 'meaning': 'Figuratively, that conditions are in place for something to happen. Also literally used in dining contexts.'},
                    {'expression': "Hunger is a policy choice.", 'meaning': 'A political argument that food insecurity is not inevitable but is the result of specific government decisions and economic structures.'},
                ],
            },
            {
                'number': 4,
                'title': 'Urban Life, Public Transit, and City Culture',
                'outline': """LESSON OVERVIEW
American cities are profoundly unequal places — shaped by historical decisions about housing, transportation, and investment that still define who lives where, who gets around how, and who belongs in which neighborhoods. This advanced lesson uses city culture as a lens for class, race, and the American urban experience.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Would you rather live in a dense city or a quiet suburb? Why?
   - What do you think of when you imagine life in New York City?
   - Do you think where you grow up shapes who you become?

2. The American Urban Landscape
   - Redlining and its legacy: how government-sanctioned housing discrimination shaped American cities
   - Gentrification: when wealthier people move into poorer neighborhoods and transform them
   - The debate over urban density: why some cities encourage apartments and transit while others resist it

3. Public Transit and Class in American Cities
   - Who rides the subway and who drives — and what that division reveals about class
   - The underfunding of American transit systems compared to international peers
   - The vision of walkable, transit-rich cities and why it is politically contested

4. Cultural Deep Dive
   Describe the neighborhood you grew up in or live in now — its character, its people, the places that matter to it, and anything about it that has changed over your lifetime. What does your neighborhood reveal about class and culture?

5. Conversation Practice
   Discussion: Should cities be designed primarily for cars or for people? Argue for one vision of urban design and defend it using examples from American and international cities.

6. Wrap-Up
   - What is the most important thing that shapes a city\'s character?
   - How does Lima\'s urban geography compare to what you have learned about American cities?

TUTOR NOTE: Urban inequality is deeply political. You do not have to have all the answers — model intellectual curiosity and the willingness to sit with complex problems without simple solutions.""",
                'vocabulary': [
                    {'word': 'gentrification', 'definition': 'The process of renovating a lower-income neighborhood in a way that raises property values and displaces longtime residents.'},
                    {'word': 'redlining', 'definition': 'The discriminatory practice of denying services or loans to residents of certain neighborhoods based on race, systematically in mid-20th century America.'},
                    {'word': 'zoning', 'definition': 'Local government regulations that dictate what types of buildings and activities are permitted in different areas of a city.'},
                    {'word': 'urban planning', 'definition': 'The technical and political process of designing cities, including decisions about land use, transportation, and infrastructure.'},
                    {'word': 'infrastructure', 'definition': 'The physical systems a society requires to function, including roads, bridges, transit systems, and utilities.'},
                    {'word': 'displacement', 'definition': 'When longtime residents are forced out of their homes and neighborhoods due to rising costs or redevelopment.'},
                    {'word': 'walkability', 'definition': 'A measure of how friendly an area is to pedestrians in terms of sidewalks, density, and accessibility of services on foot.'},
                    {'word': 'commuter', 'definition': 'A person who travels regularly between home and work or school, often a long distance.'},
                    {'word': 'metropolitan area', 'definition': 'A city and the surrounding communities that are economically and socially connected to it.'},
                    {'word': 'segregation', 'definition': 'The enforced separation of different groups, especially by race, in housing, schools, or public spaces.'},
                    {'word': 'equity', 'definition': 'Fairness in the distribution of resources and opportunities across a population.'},
                    {'word': 'density', 'definition': 'The number of people or structures per unit of area in a city or neighborhood.'},
                ],
                'expressions': [
                    {'expression': "Neighborhood character.", 'meaning': 'The distinctive identity, culture, and community feel of a specific urban neighborhood.'},
                    {'expression': "Price out of the market.", 'meaning': 'When rising costs make it impossible for people — usually longtime residents — to afford to stay in a neighborhood.'},
                    {'expression': "Urban sprawl.", 'meaning': 'The uncontrolled outward expansion of a city into surrounding rural land, typically driven by car-dependent development.'},
                    {'expression': "Not in my backyard.", 'meaning': 'The attitude of opposing new development in one\'s own neighborhood even while supporting it in principle elsewhere. Often abbreviated as NIMBY.'},
                    {'expression': "Transit desert.", 'meaning': 'An area, often low-income, that has inadequate access to public transportation, forcing residents to depend on expensive private vehicles.'},
                    {'expression': "Community fabric.", 'meaning': 'The social connections, trust, and shared identity that bind a neighborhood or community together.'},
                ],
            },
            {
                'number': 5,
                'title': 'Consumer Culture, Advertising, and Financial Literacy',
                'outline': """LESSON OVERVIEW
Americans are bombarded with advertising from birth, and consumer culture shapes identity in ways that are largely invisible. At the advanced level, this lesson examines advertising psychology, the economics of consumerism, and why financial literacy is almost entirely absent from American schools — with serious consequences.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Have you ever bought something because of advertising and later regretted it?
   - Do you know how credit cards, interest, or savings accounts work?
   - Why do you think financial literacy is not taught in most American schools?

2. The Psychology of Advertising
   - How advertisers create desire: scarcity, social proof, fear of missing out (FOMO)
   - Targeted advertising: how your phone knows what to sell you before you do
   - The influencer economy: when friendship becomes a marketing channel

3. The True Cost of Consumer Culture
   - Debt culture: credit cards, student loans, and buy-now-pay-later schemes
   - The environmental cost of fast fashion and disposable goods
   - Planned obsolescence: why your phone is designed to stop working

4. Financial Literacy: What American Schools Do Not Teach
   - The basics: budgeting, compound interest, credit scores, taxes, and investing
   - Why financial literacy is unevenly distributed by class and race
   - What a young person should know by the time they leave high school

5. Conversation Practice
   Discussion: "Advertising exploits psychological vulnerabilities rather than informing choices." Is advertising fundamentally manipulative or fundamentally informative? Support your position with examples.

6. Wrap-Up
   - What is one financial concept you now understand better after this conversation?
   - How does consumer culture in Peru compare to what you have learned about America?

TUTOR NOTE: If you have personal experience with financial stress, debt, or a formative lesson about money, share it. This is one area where personal honesty from a tutor is incredibly valuable.""",
                'vocabulary': [
                    {'word': 'consumerism', 'definition': 'The cultural and economic system that encourages the purchase of goods and services in ever-increasing quantities.'},
                    {'word': 'credit score', 'definition': 'A numerical rating based on your financial history that lenders use to determine your creditworthiness.'},
                    {'word': 'compound interest', 'definition': 'Interest calculated on both the initial principal and the accumulated interest, causing debt or savings to grow exponentially.'},
                    {'word': 'inflation', 'definition': 'The rate at which the general level of prices for goods and services rises, reducing the purchasing power of money.'},
                    {'word': 'debt', 'definition': 'Money borrowed from a lender that must be repaid, usually with interest.'},
                    {'word': 'FOMO', 'definition': 'Fear Of Missing Out — the anxiety that others are having rewarding experiences that you are not, often exploited by advertisers.'},
                    {'word': 'targeted advertising', 'definition': 'Advertising that uses personal data — browsing habits, location, social media activity — to show users content specifically relevant to their interests.'},
                    {'word': 'disposable income', 'definition': 'Money left after taxes and essential expenses, available for discretionary spending or saving.'},
                    {'word': 'budget', 'definition': 'A plan for managing income and expenses over a specific period of time.'},
                    {'word': 'investment', 'definition': 'Allocating money with the expectation of generating a return or profit over time.'},
                    {'word': 'obsolescence', 'definition': 'The process of becoming outdated or no longer useful, sometimes deliberately designed into products to drive new purchases.'},
                    {'word': 'algorithm', 'definition': 'A set of computational rules that determines what content is shown to users on digital platforms, used by advertisers to target audiences.'},
                ],
                'expressions': [
                    {'expression': "Keep up with the Joneses.", 'meaning': 'The pressure to match the lifestyle and possessions of your neighbors or social peers, a cornerstone of American consumer culture.'},
                    {'expression': "Living paycheck to paycheck.", 'meaning': 'Having no financial cushion — spending everything you earn before the next payment arrives. A reality for many Americans.'},
                    {'expression': "In debt up to your eyeballs.", 'meaning': 'An expression meaning deeply and overwhelmingly in debt. "After college, she was in debt up to her eyeballs."'},
                    {'expression': "Buy now, pay later.", 'meaning': 'A payment model that allows consumers to purchase immediately and defer payment, often at high interest rates.'},
                    {'expression': "Financial freedom.", 'meaning': 'The state of having enough wealth that you no longer have to work for basic survival — a widely marketed goal in American personal finance culture.'},
                    {'expression': "Vote with your wallet.", 'meaning': 'The idea that where you choose to spend money is a form of political action that shapes which businesses and values thrive.'},
                ],
            },
            {
                'number': 6,
                'title': 'Sports as American Identity and Community',
                'outline': """LESSON OVERVIEW
At the advanced level, sports become a vehicle for examining American identity, nationalism, inequality, and social change. From Colin Kaepernick's kneeling to the business of the NFL, to the way cities define themselves through their teams, sports in America carry enormous cultural and political weight.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Do you think athletes have a responsibility to use their platform for social causes?
   - Why do you think cities and nations care so deeply about sports outcomes?
   - Has a sports moment ever moved you emotionally or politically?

2. Sports as National Identity
   - The Super Bowl as America's unofficial national holiday
   - How Olympic success becomes a narrative of national pride and cultural superiority
   - The economics of sports: who owns teams, who profits, and who plays

3. Athletes as Political Figures
   - Colin Kaepernick and the national anthem debate: free speech, patriotism, and protest
   - LeBron James, Megan Rapinoe, and the tradition of athlete activism
   - The debate over whether athletes should "stick to sports" — and why that phrase is itself political

4. Sports and Social Inequality
   - The racial dynamics of American sports: disproportionate Black athletes in profit-generating sports
   - The debate over college athlete compensation and the NCAA's exploitation model
   - How gender disparities in sports funding and visibility reflect broader inequality

5. Conversation Practice
   Structured debate: "Professional athletes have both the right and the responsibility to take political stands." Argue a nuanced position and engage with the strongest counterargument.

6. Wrap-Up
   - What does America's relationship with sports reveal about its deeper values?
   - Is there a sports figure from Peru or Latin America who carries similar cultural and political weight?

TUTOR NOTE: This session requires intellectual courage. Take clear positions and defend them. The student will learn more from your genuine engagement with hard questions than from a balanced presentation of all sides.""",
                'vocabulary': [
                    {'word': 'activism', 'definition': 'Vigorous campaigning for or against a cause, especially social or political change.'},
                    {'word': 'exploitation', 'definition': 'Treating someone unfairly in order to benefit from their work or situation.'},
                    {'word': 'commercialization', 'definition': 'The process of making something primarily focused on generating profit rather than its original purpose.'},
                    {'word': 'nationalism', 'definition': 'Intense pride in one\'s nation, often expressed through cultural events like sports.'},
                    {'word': 'revenue', 'definition': 'Income generated by an organization from its activities, especially ticket sales and media rights in sports.'},
                    {'word': 'boycott', 'definition': 'A collective refusal to purchase from or participate in something as a form of protest.'},
                    {'word': 'franchise', 'definition': 'A professional sports team that is part of a larger league organization.'},
                    {'word': 'endorsement', 'definition': 'A commercial agreement where an athlete promotes a product in exchange for payment.'},
                    {'word': 'concussion', 'definition': 'A brain injury caused by a blow to the head, now a major public health issue in American football.'},
                    {'word': 'draft', 'definition': 'The annual selection process by which professional sports leagues choose new players from a pool of eligible athletes.'},
                    {'word': 'union', 'definition': 'An organized group of workers that negotiates collectively with employers for wages and conditions.'},
                    {'word': 'protest', 'definition': 'A public demonstration expressing opposition to a policy or injustice.'},
                ],
                'expressions': [
                    {'expression': "Take a knee.", 'meaning': 'To kneel in protest — made famous by Colin Kaepernick\'s protest during the national anthem before NFL games, opposing police brutality.'},
                    {'expression': "Stick to sports.", 'meaning': 'A phrase used to silence athletes who speak on political issues, arguing they should limit themselves to their sport. Widely debated.'},
                    {'expression': "The games people play.", 'meaning': 'Both literal and figurative — referring to manipulative or political behavior hidden beneath the surface of competition.'},
                    {'expression': "Level the playing field.", 'meaning': 'To create equal conditions for all competitors or participants, removing structural advantages or disadvantages.'},
                    {'expression': "Blood sport.", 'meaning': 'A sport involving injury or death, used also metaphorically to describe any arena of brutal competition.'},
                    {'expression': "Win at all costs.", 'meaning': 'A mindset that prioritizes victory above ethics, fairness, or well-being. A common critique of American competitive culture.'},
                ],
            },
            {
                'number': 7,
                'title': 'Student Activism, Civic Engagement, and Social Change',
                'outline': """LESSON OVERVIEW
American student activism has a long and powerful history — from the civil rights sit-ins of the 1960s to the March for Our Lives walkouts of 2018. Today's American students are more engaged and more organized than any generation in recent memory. This lesson examines the history, the mechanics, and the possibilities of student-led social change.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Is there a social issue you feel strongly enough about to publicly protest?
   - Have you ever taken any action — even small — to try to change something unfair?
   - Do you think students have real power to change the world?

2. The History of American Student Activism
   - Civil rights sit-ins: how Black college students desegregated lunch counters through organized nonviolent resistance
   - Vietnam War protests and Kent State: when student protest met deadly state violence
   - March for Our Lives: Parkland students organizing a nationwide gun control movement within weeks of a massacre

3. The Mechanics of Effective Activism
   - The difference between protest and organizing: why showing up is not enough
   - Coalition building, social media mobilization, and policy targeting
   - How students have successfully changed school policies, local legislation, and national conversation

4. Cultural Deep Dive
   Share an issue that you feel passionately about — something that makes you angry enough to want to do something. What would you do if you had no constraints? What has stopped you from acting?

5. Conversation Practice
   Action planning: Together, design a hypothetical campaign around one issue the student cares about. What is the goal? Who needs to be persuaded? What tactics would work? Practice the language of organizing.

6. Wrap-Up
   - What is the most important thing a young person can do to create change in their society?
   - How does civic engagement look different in Peru compared to what you have described about America?

TUTOR NOTE: This is a session designed to build genuine political confidence. Do not be afraid of controversy. The student should leave feeling that their voice matters and that they have the language to use it.""",
                'vocabulary': [
                    {'word': 'activism', 'definition': 'The policy or action of using vigorous campaigning to bring about political or social change.'},
                    {'word': 'civil disobedience', 'definition': 'The refusal to comply with certain laws as a form of peaceful political protest.'},
                    {'word': 'coalition', 'definition': 'A temporary alliance of distinct parties, persons, or states for joint action around a common cause.'},
                    {'word': 'mobilization', 'definition': 'The process of organizing and motivating people to take collective action.'},
                    {'word': 'advocacy', 'definition': 'Public support for or recommendation of a particular cause or policy.'},
                    {'word': 'petition', 'definition': 'A formal written request signed by many people and submitted to an authority to demand a specific action.'},
                    {'word': 'boycott', 'definition': 'A collective refusal to buy from or engage with a company or institution as a form of protest.'},
                    {'word': 'strike', 'definition': 'A refusal to work or participate in normal activities as a protest, used by both workers and students.'},
                    {'word': 'solidarity', 'definition': 'Unity and mutual support within a group, especially in the face of opposition.'},
                    {'word': 'systemic change', 'definition': 'Transformation of the underlying structures of society rather than surface-level adjustments.'},
                    {'word': 'nonviolent resistance', 'definition': 'Opposition to a power or policy through peaceful means rather than armed conflict.'},
                    {'word': 'grassroots', 'definition': 'Originating from or directed at the common people rather than being driven by established leadership or institutions.'},
                ],
                'expressions': [
                    {'expression': "Speak truth to power.", 'meaning': 'To confront authority with honest, uncomfortable truths. A cornerstone phrase of American activist culture.'},
                    {'expression': "Be the change.", 'meaning': 'From Gandhi\'s quote: embody in your own behavior the change you want to see in the world.'},
                    {'expression': "Show up.", 'meaning': 'In activist contexts, to actually attend protests, meetings, and events rather than just expressing support online.'},
                    {'expression': "Hold power accountable.", 'meaning': 'To demand that those in authority answer for their actions and decisions.'},
                    {'expression': "Change from the ground up.", 'meaning': 'Transforming systems by starting with the most affected communities rather than waiting for leadership to act.'},
                    {'expression': "Your silence is complicity.", 'meaning': 'The argument that failing to speak out against injustice makes you morally responsible for it.'},
                ],
            },
            {
                'number': 8,
                'title': 'Cultural Traditions and Their Evolution in Modern America',
                'outline': """LESSON OVERVIEW
American culture is not static — it is constantly evolving, negotiating, and being contested. Traditions that once seemed permanent are being questioned, revised, or abandoned, while new traditions emerge. This advanced lesson examines how cultures change, who drives that change, and what is gained and lost in the process.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What is a tradition in your family or culture that you hope never disappears?
   - What is a tradition that you think should change or has already changed for the better?
   - Can a culture change too fast? What happens when it does?

2. How American Cultural Traditions Have Evolved
   - Thanksgiving: the ongoing negotiation between celebration and historical reckoning
   - Wedding and family traditions: how they have shifted across generations with changing family structures
   - Holiday commercialization: when tradition becomes marketing

3. New American Traditions and Cultural Hybridity
   - How immigration has transformed American food, music, language, and celebration
   - The blending of cultures in immigrant families: what is kept, what is adapted, what is lost
   - American traditions exported globally: Halloween in Japan, the Super Bowl in London

4. Cultural Deep Dive
   Describe a tradition from your own family or culture that has evolved over your lifetime — something your grandparents did that your parents do differently, and something you yourself might do differently. What drove those changes?

5. Conversation Practice
   Discussion: When a dominant culture adopts elements of a marginalized culture without credit or understanding, is that appreciation or appropriation? Use specific American examples.

6. Wrap-Up
   - What do you think is the core of American cultural identity beneath all its changes?
   - What Peruvian tradition do you most hope survives and evolves into the next generation?

TUTOR NOTE: This session requires cultural self-awareness and intellectual honesty about the complexity of cultural change. It is one of the richest possible conversations you can have.""",
                'vocabulary': [
                    {'word': 'cultural appropriation', 'definition': 'The adoption of elements from a marginalized culture by members of a dominant culture, often without proper understanding or credit.'},
                    {'word': 'cultural hybridity', 'definition': 'The blending of two or more cultural traditions to create something new.'},
                    {'word': 'assimilation', 'definition': 'The process by which a minority group adopts the customs and culture of the dominant group.'},
                    {'word': 'preservation', 'definition': 'The effort to maintain traditional practices, languages, and cultural expressions.'},
                    {'word': 'heritage', 'definition': 'The traditions, values, and cultural practices inherited from previous generations.'},
                    {'word': 'nostalgia', 'definition': 'A sentimental longing for a past that is remembered as better than the present.'},
                    {'word': 'globalization', 'definition': 'The process by which cultures, economies, and societies become increasingly interconnected.'},
                    {'word': 'diaspora', 'definition': 'A community of people who live outside their ancestral homeland, maintaining their cultural identity.'},
                    {'word': 'ritual', 'definition': 'A set of actions performed in a specific order with cultural or symbolic meaning.'},
                    {'word': 'indigenous', 'definition': 'Originating and occurring naturally in a specific place, used to describe native peoples and their cultures.'},
                    {'word': 'commodify', 'definition': 'To turn something into a commodity for commercial use, often stripping it of its original cultural meaning.'},
                    {'word': 'reclaim', 'definition': 'To take back something — a word, a symbol, a practice — that was taken from or used against a group.'},
                ],
                'expressions': [
                    {'expression': "Honor your roots.", 'meaning': 'To maintain connection to and respect for the cultural traditions and community you come from.'},
                    {'expression': "Lost in translation.", 'meaning': 'When meaning, nuance, or cultural significance is lost when something moves from one cultural context to another.'},
                    {'expression': "A living tradition.", 'meaning': 'A cultural practice that continues to evolve and adapt rather than remaining frozen in historical form.'},
                    {'expression': "Cultural exchange.", 'meaning': 'The mutual sharing of customs, values, and ideas between different groups, ideally on equal terms.'},
                    {'expression': "Carry it forward.", 'meaning': 'To continue and pass on a tradition or value to future generations.'},
                    {'expression': "Draw the line.", 'meaning': 'To establish a boundary beyond which something is no longer acceptable — used in debates about appropriation vs. appreciation.'},
                ],
            },
            {
                'number': 9,
                'title': 'Language and Identity: Slang, Dialects, and Code-Switching',
                'outline': """LESSON OVERVIEW
Language is never neutral. Who speaks what, how they speak it, and when they choose to shift registers is deeply tied to power, identity, and belonging. At the advanced level, this lesson examines code-switching, African American Vernacular English (AAVE), regional dialects, and the politics of language in America.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Do you speak differently to your friends than to your parents or teachers? How?
   - Have you ever changed how you speak based on who you were with?
   - Do you think the way someone speaks affects how they are judged?

2. Code-Switching: The Daily Work of Marginalized Americans
   - What code-switching is and why it is a survival skill for many Black, Latino, and immigrant Americans
   - The emotional and cognitive cost of constantly shifting between linguistic registers
   - The debate: should anyone have to change how they speak to be taken seriously?

3. AAVE and the Politics of Language Legitimacy
   - African American Vernacular English as a complete, rule-governed language system — not "broken" English
   - How slang from AAVE enters mainstream American culture and is often stripped of its origins
   - The ongoing debate about teaching AAVE in schools

4. Regional American Dialects
   - Southern drawl, Boston accent, New York speech, Appalachian dialect — and how they are perceived
   - How accents signal class, education, and geography to American ears
   - Accent discrimination: the legal gray zone and its real effects

5. Conversation Practice
   Discussion: "Standard American English" is a dialect of the powerful, not a neutral baseline. Do you agree? Defend a position on whether schools should teach "standard English" exclusively.

6. Wrap-Up
   - How does this analysis of language in America change how you think about your own English learning?
   - How does Spanish-speaking identity navigate similar dynamics in Peru?

TUTOR NOTE: This is a session that requires significant intellectual humility, especially for a native English speaker. Listen as much as you speak. The student\'s outsider perspective on American linguistic politics is genuinely valuable.""",
                'vocabulary': [
                    {'word': 'code-switching', 'definition': 'The practice of alternating between two or more languages or registers in conversation, often based on the social context.'},
                    {'word': 'dialect', 'definition': 'A regional or social variety of a language with distinct vocabulary, grammar, and pronunciation.'},
                    {'word': 'vernacular', 'definition': 'The language or dialect spoken by the ordinary people of a particular region or group.'},
                    {'word': 'register', 'definition': 'A variety of language used in a specific social situation, ranging from formal to informal.'},
                    {'word': 'Standard American English', 'definition': 'A widely accepted variety of English used in formal contexts, often treated as a neutral norm but actually reflecting the dialect of educated white Americans.'},
                    {'word': 'linguistic discrimination', 'definition': 'Prejudice or differential treatment based on how a person speaks, including accent and dialect.'},
                    {'word': 'pidgin', 'definition': 'A simplified form of language developed for communication between groups with no common language.'},
                    {'word': 'creole', 'definition': 'A language that has developed from a pidgin and has become the native tongue of a community.'},
                    {'word': 'accent', 'definition': 'A distinctive way of pronouncing a language, associated with a particular country, region, or social class.'},
                    {'word': 'legitimacy', 'definition': 'The quality of being recognized as valid, acceptable, or authoritative.'},
                    {'word': 'assimilation', 'definition': 'The process of adopting the culture and language of a dominant group, often at the expense of one\'s own.'},
                    {'word': 'bilingualism', 'definition': 'The ability to use two languages with equal or near-equal fluency.'},
                ],
                'expressions': [
                    {'expression': "Switch registers.", 'meaning': 'To change the level of formality in your speech based on the social context — speaking differently at home than at a job interview.'},
                    {'expression': "Talk the talk.", 'meaning': 'To use the language and terminology of a particular group or field fluently. Can imply that someone speaks well but does not act accordingly.'},
                    {'expression': "Speak the language of power.", 'meaning': 'To communicate in the dominant, prestigious variety of a language that grants access to institutional resources.'},
                    {'expression': "Find your voice.", 'meaning': 'To develop confidence in expressing your own perspective and identity, often used in the context of marginalized people claiming linguistic space.'},
                    {'expression': "Lost in translation.", 'meaning': 'When meaning or nuance is lost in the process of translating between languages or cultural contexts.'},
                    {'expression': "My people say it this way.", 'meaning': 'An expression of linguistic identity and solidarity — the assertion that one\'s own community\'s language is valid and worth preserving.'},
                ],
            },
            {
                'number': 10,
                'title': 'Social Media: Mental Health, Cancel Culture, and Echo Chambers',
                'outline': """LESSON OVERVIEW
Social media is simultaneously the most powerful communication tool in human history and one of the most significant threats to adolescent mental health and democratic discourse. This advanced lesson examines the complex, contradictory nature of social media with rigor and personal honesty.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - How many hours a day do you spend on social media? Do you think that is too much?
   - Has social media ever made you feel worse about yourself? Better?
   - What is one thing you genuinely love about social media and one thing you genuinely fear?

2. Social Media and Mental Health: The Research
   - Longitudinal studies linking heavy social media use to increased rates of teen anxiety and depression
   - The comparison trap: how curated content creates unrealistic standards
   - Why girls and boys are affected differently — and what the algorithm has to do with it

3. Cancel Culture: Power, Accountability, and Mob Justice
   - What cancel culture is and the debate about whether it is accountability or censorship
   - High-profile cases: when cancellation was justified vs. when it seemed disproportionate
   - The question of redemption: can someone come back from being cancelled?

4. Echo Chambers and the Death of Shared Reality
   - How algorithms reinforce existing beliefs rather than exposing users to new perspectives
   - The role of social media in political polarization in America
   - What media literacy means in the age of deepfakes and coordinated misinformation

5. Conversation Practice
   Structured debate: "Social media does more harm than good for society." Present the most compelling version of both sides before reaching your own nuanced conclusion.

6. Wrap-Up
   - What is one specific change you want to make in your own social media use after this conversation?
   - How does social media\'s effect on society look different in Peru than in America?

TUTOR NOTE: This session will be most powerful if you bring personal honesty about your own complicated relationship with social media. Refusing to be preachy and acknowledging the genuine appeal of these platforms makes the critique credible.""",
                'vocabulary': [
                    {'word': 'algorithm', 'definition': 'A set of computational rules that determines what content a platform shows each user, designed to maximize engagement.'},
                    {'word': 'echo chamber', 'definition': 'An environment where a person only encounters information and opinions that confirm their existing beliefs.'},
                    {'word': 'polarization', 'definition': 'The division of a society into two sharply contrasting groups with little common ground between them.'},
                    {'word': 'cancel culture', 'definition': 'The practice of withdrawing support from a public figure or company deemed to have done something offensive, often through social media.'},
                    {'word': 'disinformation', 'definition': 'False information deliberately created and spread to deceive people.'},
                    {'word': 'misinformation', 'definition': 'False information spread without necessarily intending to deceive.'},
                    {'word': 'dopamine', 'definition': 'A neurotransmitter associated with pleasure and reward, activated by social media notifications and likes.'},
                    {'word': 'parasocial relationship', 'definition': 'A one-sided relationship where a person feels a strong emotional connection to a media figure who does not know they exist.'},
                    {'word': 'curated', 'definition': 'Carefully selected and presented to show only the most appealing or favorable aspects.'},
                    {'word': 'engagement', 'definition': 'Interactions with content — likes, comments, shares — that platforms use to measure and maximize attention.'},
                    {'word': 'deepfake', 'definition': 'Synthetic media created using AI that manipulates video or audio to make someone appear to say or do something they did not.'},
                    {'word': 'media literacy', 'definition': 'The ability to access, analyze, evaluate, and create media in a variety of forms.'},
                ],
                'expressions': [
                    {'expression': "Down the rabbit hole.", 'meaning': 'To follow an increasingly strange sequence of linked content online that takes you far from where you started. "I went down a rabbit hole of conspiracy theory videos."'},
                    {'expression': "Doomscrolling.", 'meaning': 'Compulsively scrolling through negative news and social media content, unable to stop despite the distress it causes.'},
                    {'expression': "Call someone out.", 'meaning': 'To publicly identify and criticize someone\'s problematic behavior, often on social media.'},
                    {'expression': "The court of public opinion.", 'meaning': 'The informal judgment of the general public on a person\'s behavior, which can be swift, severe, and without due process.'},
                    {'expression': "Curate your feed.", 'meaning': 'To deliberately select who and what you follow on social media to shape the content you see.'},
                    {'expression': "Cancel someone.", 'meaning': 'To withdraw support and publicly condemn a person for offensive behavior, resulting in social and professional consequences.'},
                ],
            },
            {
                'number': 11,
                'title': 'The American Dream: Opportunity, Privilege, and Reality',
                'outline': """LESSON OVERVIEW
The American Dream is the most powerful and contested idea in American culture. Is it a genuine promise or a myth that keeps people from questioning inequality? At the advanced level, this conversation moves between aspiration and analysis, examining what the Dream means to different Americans and why it continues to shape national identity even as its contradictions multiply.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What does "the American Dream" mean to you?
   - Do you believe that in America, anyone can make it if they work hard enough?
   - Who has told you the story of the American Dream, and why might they have done so?

2. The American Dream as Promise and Ideology
   - The historical origins: from Horatio Alger novels to 20th century immigrant success stories
   - What the Dream promises: meritocracy, upward mobility, and the idea that birthplace is not destiny
   - How the Dream is used politically to justify inequality: if you work hard and fail, it must be your fault

3. The Reality: Structural Barriers to the Dream
   - Social mobility in America compared to other wealthy nations — where does it actually rank?
   - Wealth transfer across generations: how money, networks, and opportunity are inherited
   - The Dream for whom: how race, gender, and class shape who can access opportunity

4. Cultural Deep Dive
   Tell the student about someone in your life or community whose story challenges or complicates the American Dream narrative — someone who worked extraordinarily hard and still struggled, or someone who succeeded with significant structural advantages they did not fully acknowledge.

5. Conversation Practice
   Structured debate: "The American Dream is a myth that serves the powerful more than the poor." Present nuanced arguments on both sides and land on your own considered position.

6. Wrap-Up
   - Has your understanding of the American Dream changed through this conversation?
   - Is there an equivalent national myth in Peru? What is it, and how does it hold up under scrutiny?

TUTOR NOTE: This session asks you to be honest about privilege and structural inequality. That honesty — from an American teenager — is one of the most powerful things you can offer a student trying to understand America.""",
                'vocabulary': [
                    {'word': 'meritocracy', 'definition': 'A system in which advancement is based on individual ability and effort rather than wealth or social class.'},
                    {'word': 'social mobility', 'definition': 'The ability of individuals or families to move between different economic classes.'},
                    {'word': 'privilege', 'definition': 'Unearned advantages granted to certain groups based on their social identity, often invisible to those who have them.'},
                    {'word': 'structural inequality', 'definition': 'Inequality that is embedded in the rules and norms of society rather than caused solely by individual choices.'},
                    {'word': 'wealth gap', 'definition': 'The difference in financial assets between different groups, especially between racial and economic groups in America.'},
                    {'word': 'ideology', 'definition': 'A system of beliefs and values that shapes how a society understands itself and justifies its arrangements.'},
                    {'word': 'bootstrapping', 'definition': 'The idea of achieving success entirely through one\'s own efforts without external help — a central American cultural value.'},
                    {'word': 'generational wealth', 'definition': 'Assets — money, property, business — passed from one generation to the next, compounding advantage over time.'},
                    {'word': 'upward mobility', 'definition': 'The movement of individuals from lower to higher economic or social positions.'},
                    {'word': 'aspiration', 'definition': 'A strong desire to achieve something, especially something requiring sustained effort.'},
                    {'word': 'narrative', 'definition': 'A story or account that shapes how people understand events, identities, and possibilities.'},
                    {'word': 'disillusionment', 'definition': 'The feeling of disappointment when something turns out to be less good or true than you believed.'},
                ],
                'expressions': [
                    {'expression': "Pull yourself up by your bootstraps.", 'meaning': 'The American ideal of achieving success entirely through personal effort. Critics note the phrase was originally satirical — it is physically impossible to pull yourself up by your own bootstraps.'},
                    {'expression': "Born with a silver spoon.", 'meaning': 'To be born into wealth and privilege. The counterpoint to the bootstrap narrative.'},
                    {'expression': "The deck is stacked against you.", 'meaning': 'When systemic forces make it very difficult for certain people to succeed, regardless of their effort.'},
                    {'expression': "Make it in America.", 'meaning': 'To achieve success in America, implying that American opportunity is uniquely expansive. The phrase itself is contested.'},
                    {'expression': "Level the playing field.", 'meaning': 'To create equal conditions for all participants, removing structural advantages that unfairly favor some.'},
                    {'expression': "The ladder of success.", 'meaning': 'A metaphor for upward mobility, imagining success as something climbed step by step. Critics ask who made the ladder and who can reach the first rung.'},
                ],
            },
            {
                'number': 12,
                'title': 'Generational Gaps: Boomers, Gen X, Millennials, and Gen Z',
                'outline': """LESSON OVERVIEW
Each American generation has a distinct relationship to culture, technology, work, and values — shaped by the historical events that defined their coming-of-age years. Understanding generational differences helps explain American cultural tensions and offers students sophisticated vocabulary for discussing identity over time.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What generation do your parents belong to? What are their values around work, family, and technology?
   - Do you think your generation is fundamentally different from your parents' generation?
   - Is "OK Boomer" funny or disrespectful? What does it reveal?

2. Defining the Generations
   - Baby Boomers (1946-1964): post-war prosperity, work ethic, skepticism of authority, and later political conservatism
   - Gen X (1965-1980): latchkey kids, cynicism, independence, and the first generation to face economic uncertainty
   - Millennials (1981-1996): shaped by 9/11, the 2008 recession, and digital technology
   - Gen Z (1997-2012): the first true digital natives, shaped by smartphones and social media from childhood

3. Where the Generations Clash
   - Work culture: Boomers value sacrifice and loyalty; Gen Z values boundaries and work-life balance
   - Homeownership: why Millennials and Gen Z are the first generations expected to be worse off than their parents
   - Political values: how each generation\'s political leanings were shaped by the crises they lived through

4. Cultural Deep Dive
   Where do you fall in generational culture? What values do you hold that are generationally typical, and what feels more personal? What do you genuinely appreciate about an older or younger generation that is different from your own?

5. Conversation Practice
   Discussion: "Gen Z is the most stressed but most socially conscious generation in American history." Do you agree? What evidence supports or challenges this claim?

6. Wrap-Up
   - What is the most important thing older generations should understand about yours?
   - How do generational gaps in Peru compare to those in America?

TUTOR NOTE: This session can get surprisingly personal when it touches on family dynamics across generations. Follow that energy — it is where the best conversations live.""",
                'vocabulary': [
                    {'word': 'cohort', 'definition': 'A group of people sharing a defining characteristic, especially those born in the same period.'},
                    {'word': 'digital native', 'definition': 'A person who has grown up with digital technology as a fundamental part of life from childhood.'},
                    {'word': 'work-life balance', 'definition': 'The equilibrium between professional responsibilities and personal life, a major value divide between generations.'},
                    {'word': 'austerity', 'definition': 'Difficult economic conditions characterized by reduced government spending and decreased prosperity.'},
                    {'word': 'cultural memory', 'definition': 'The shared experiences and events that shape the collective identity of a generation.'},
                    {'word': 'entitlement', 'definition': 'The belief that one deserves certain privileges, often used critically about younger generations by older ones.'},
                    {'word': 'latchkey kid', 'definition': 'A Gen X term for children who came home to an empty house because both parents worked, fostering independence.'},
                    {'word': 'recession', 'definition': 'A significant decline in economic activity lasting more than a few months, affecting employment and wealth.'},
                    {'word': 'prosperity', 'definition': 'The condition of being successful, especially in financial terms.'},
                    {'word': 'cynicism', 'definition': 'A disposition to distrust or discount the motives of others, often associated with Gen X.'},
                    {'word': 'burnout', 'definition': 'Exhaustion from sustained overwork, increasingly common in Millennial and Gen Z work discourse.'},
                    {'word': 'nostalgia', 'definition': 'Sentimental longing for a past that is idealized as better than the present.'},
                ],
                'expressions': [
                    {'expression': "OK Boomer.", 'meaning': 'A dismissive response used by younger generations toward older people perceived as out of touch. Reflects genuine generational tension.'},
                    {'expression': "Back in my day.", 'meaning': 'A phrase older people use to compare current life unfavorably with the past. Carries nostalgia and sometimes condescension.'},
                    {'expression': "Set boundaries.", 'meaning': 'A Gen Z and Millennial workplace concept emphasizing the importance of limiting professional obligations in favor of personal well-being.'},
                    {'expression': "Quiet quitting.", 'meaning': 'Doing the minimum required at work without formally resigning — a Gen Z rejection of hustle culture.'},
                    {'expression': "Generational divide.", 'meaning': 'The significant difference in values, perspectives, and experiences between people of different generations.'},
                    {'expression': "Times have changed.", 'meaning': 'An acknowledgment that current norms and conditions differ significantly from the past — used across all generations.'},
                ],
            },
            {
                'number': 13,
                'title': 'Music as Cultural Commentary and Political Voice',
                'outline': """LESSON OVERVIEW
American music has always been political — from slave spirituals to protest folk to hip-hop to punk. At the advanced level, this lesson examines music not just as entertainment but as a primary vehicle for cultural resistance, political critique, and identity affirmation. Music is how America argues with itself.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What song has made you feel something political or social, not just emotional?
   - Do you think musicians have a responsibility to use their platform for social commentary?
   - Is there music from Peru that carries political meaning?

2. A History of Political Music in America
   - Folk and protest music: Woody Guthrie, Bob Dylan, and the civil rights era
   - Hip-hop as political voice: N.W.A., Public Enemy, Kendrick Lamar, and systemic critique
   - Punk as rejection: The Clash, Dead Kennedys, and anti-establishment rage
   - Country music and working-class identity: from Merle Haggard to Beyonce\'s "Cowboy Carter"

3. How Music Shapes and Reflects Social Movements
   - "We Shall Overcome" as the anthem of the civil rights movement
   - "This is America" by Childish Gambino as visual and musical political statement
   - How streaming has democratized political music but also fragmented its audience

4. Cultural Deep Dive
   Share a song that has a political or social dimension that matters to you — not the most famous one, but the one that feels most honest about something. Explain the context and why it resonates.

5. Conversation Practice
   Listen to 90 seconds of a politically significant song and analyze it together: What is the message? Who is the audience? What emotions does it use? What does it ask the listener to do or feel?

6. Wrap-Up
   - Can music actually change political reality, or does it just document it?
   - What Peruvian music carries the weight of history or political identity?

TUTOR NOTE: Play the music in this session. 90 seconds of Kendrick Lamar or a civil rights spiritual changes the entire texture of the conversation and models music as a primary text.""",
                'vocabulary': [
                    {'word': 'protest music', 'definition': 'Music created to express opposition to social or political conditions, designed to inspire action or consciousness.'},
                    {'word': 'anthem', 'definition': 'A song adopted by a group as representative of their values or struggle.'},
                    {'word': 'subversion', 'definition': 'The undermining of an established system or institution through indirect, often artistic means.'},
                    {'word': 'counterculture', 'definition': 'A culture whose values and norms differ substantially from those of mainstream society.'},
                    {'word': 'commentary', 'definition': 'Analysis or criticism of society, politics, or culture offered through an artistic work.'},
                    {'word': 'censorship', 'definition': 'The suppression of speech, media, or other expression deemed offensive or dangerous by those in power.'},
                    {'word': 'genre', 'definition': 'A category of music defined by shared style, themes, and cultural context.'},
                    {'word': 'lyric', 'definition': 'The words of a song, especially when considered as poetry or political statement.'},
                    {'word': 'resonance', 'definition': 'The quality of a piece of art that makes it feel deeply meaningful and relevant to a listener\'s experience.'},
                    {'word': 'appropriation', 'definition': 'Taking cultural elements from a marginalized group without permission or credit.'},
                    {'word': 'legacy', 'definition': 'The enduring impact a piece of work or an artist leaves on culture and history.'},
                    {'word': 'diaspora', 'definition': 'A community dispersed from its original homeland, whose music often carries the weight of displacement and identity.'},
                ],
                'expressions': [
                    {'expression': "Speak to a generation.", 'meaning': 'When a piece of music or art captures the experience and feeling of an entire generation so powerfully that it becomes definitive.'},
                    {'expression': "The soundtrack of a movement.", 'meaning': 'Music that becomes inseparable from a social or political movement, giving it rhythm and emotional power.'},
                    {'expression': "Banned from the airwaves.", 'meaning': 'When music is prohibited from being played on radio stations due to its political content or language.'},
                    {'expression': "Sell out.", 'meaning': 'When an artist abandons their artistic principles in favor of commercial success, losing credibility with their original audience.'},
                    {'expression': "Hit a nerve.", 'meaning': 'When a song or statement provokes a strong emotional or political reaction because it touches something true and uncomfortable.'},
                    {'expression': "Change the conversation.", 'meaning': 'To shift cultural discourse by introducing a new perspective or forcing attention on a previously ignored issue.'},
                ],
            },
            {
                'number': 14,
                'title': 'Media Literacy: Film, TV, and Critical Analysis',
                'outline': """LESSON OVERVIEW
Advanced media literacy means not just consuming film and TV but analyzing them as cultural texts that encode values, ideologies, and representations. This session teaches students to look at what is in a frame, what is absent, who made it and why, and what effect it has on audiences.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What is a movie or show that you think portrays a group of people unfairly?
   - Have you ever watched something and thought "that is not what real life looks like"?
   - Who has the power to decide whose stories get told in Hollywood?

2. How to Read a Film: The Tools of Criticism
   - Representation and the male gaze: who is centered and whose perspective is assumed
   - The Bechdel test and other quick diagnostic tools for bias in film
   - Genre as ideology: what action films, rom-coms, and police procedurals tell us about American values

3. Hollywood and Power: Who Tells the Stories
   - The dominance of white male directors and producers and how it shapes what gets made
   - The rise of Black and Latino creators: Ryan Coogler, Ava DuVernay, and the fight for representation
   - How streaming has opened new doors — and how algorithms still shape what gets seen

4. Cultural Deep Dive
   Analyze a specific scene from a film or show — something you love or something that troubled you. Walk through it: camera angles, what is said vs. unsaid, who is in the scene vs. who is absent, and what it assumes about its audience.

5. Conversation Practice
   Apply media literacy to a mutual piece of media: agree on a film or show you have both seen. Take turns identifying one thing each of you noticed about its representation, its ideology, or its blind spots.

6. Wrap-Up
   - How has this lesson changed how you will watch film or TV in the future?
   - What would the film or TV landscape look like if it truly reflected the diversity of America?

TUTOR NOTE: Bring one specific film clip or show scene to this session. The analysis works best with a concrete shared reference point.""",
                'vocabulary': [
                    {'word': 'representation', 'definition': 'The depiction of different groups of people in media, and whether those depictions are accurate, complex, and proportionate.'},
                    {'word': 'trope', 'definition': 'A common or overused theme, character type, or narrative device in film and television.'},
                    {'word': 'ideology', 'definition': 'A set of values and beliefs embedded in a cultural product, often invisible to its creators and audience.'},
                    {'word': 'subtext', 'definition': 'The underlying meaning or theme of a work that is not explicitly stated but is implied.'},
                    {'word': 'framing', 'definition': 'The way a scene, issue, or character is presented through camera angle, language, and context to guide the viewer\'s interpretation.'},
                    {'word': 'auteur', 'definition': 'A filmmaker with a distinctive personal style and artistic vision that marks all their work.'},
                    {'word': 'gatekeeping', 'definition': 'The control over who or what gets access to a platform, audience, or opportunity.'},
                    {'word': 'cinematography', 'definition': 'The art and technique of making motion pictures, including camera work, lighting, and visual composition.'},
                    {'word': 'narrative', 'definition': 'The story and structure of a film or show, and whose perspective it centers.'},
                    {'word': 'stereotype', 'definition': 'An oversimplified and often inaccurate image or idea of a particular group of people.'},
                    {'word': 'archetype', 'definition': 'A recurring character type or story pattern that appears across different cultures and time periods.'},
                    {'word': 'intertextuality', 'definition': 'The relationship between different texts, where one work references or responds to another.'},
                ],
                'expressions': [
                    {'expression': "Read between the lines.", 'meaning': 'To look for hidden or unstated meanings in a text, film, or conversation.'},
                    {'expression': "The male gaze.", 'meaning': 'A critical concept describing the way film and media typically present the world from a heterosexual male perspective, objectifying women.'},
                    {'expression': "Pass the Bechdel test.", 'meaning': 'A film passes if it has at least two women who talk to each other about something other than a man. Many films fail. Used as a quick measure of gender representation.'},
                    {'expression': "Whose story is it?", 'meaning': 'The critical question of which perspective a narrative centers — and whose experience is marginalized or absent.'},
                    {'expression': "Unpack that.", 'meaning': 'To analyze something carefully and examine all of its layers and implications.'},
                    {'expression': "Critical lens.", 'meaning': 'A framework or perspective used to analyze a text or cultural product, such as a feminist lens, racial lens, or class lens.'},
                ],
            },
            {
                'number': 15,
                'title': 'Career Planning, Internships, and Professional Networking',
                'outline': """LESSON OVERVIEW
The transition from student to professional is one of the most anxiety-inducing experiences in American life — and the process is largely hidden from people who do not already know how it works. This lesson demystifies career planning, the internship economy, and the role of networking in American professional culture.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What career do you want to have? Has that changed over time?
   - Have you heard the expression "It is not what you know, it is who you know"? Do you believe it?
   - What do you think a professional network is?

2. Career Planning in America
   - The difference between a job and a career: building a professional identity over time
   - How Americans choose careers: passion vs. practicality, the pressure to choose a major early
   - The reality of career pivots: why most Americans do not stay in their first career

3. The Internship Economy
   - How internships function as a gateway to professional careers
   - The controversy over unpaid internships and who can afford them
   - How to find, apply for, and succeed in an internship as a student

4. Networking: The Invisible Architecture of Career Success
   - What networking actually looks like: informational interviews, LinkedIn, alumni networks
   - Why networking feels uncomfortable and why it matters anyway
   - How to network authentically — without feeling like you are using people

5. Conversation Practice
   Practice: Deliver a 60-second professional self-introduction — your "elevator pitch." Who are you, what are you studying or interested in, and what are you looking for? Then give each other feedback.

6. Wrap-Up
   - What is one specific career goal you have after this conversation?
   - How does the role of networking in professional life compare between Peru and America?

TUTOR NOTE: This session has real stakes for the student. Practical career advice from an American peer who navigates this system is genuinely valuable. Be specific, honest, and realistic.""",
                'vocabulary': [
                    {'word': 'networking', 'definition': 'Building and maintaining professional relationships that can lead to opportunities, advice, and career connections.'},
                    {'word': 'internship', 'definition': 'A temporary supervised work experience, often for students, that provides practical professional training.'},
                    {'word': 'elevator pitch', 'definition': 'A brief, persuasive speech — about 60 seconds — summarizing who you are and what you offer professionally.'},
                    {'word': 'LinkedIn', 'definition': 'A professional social networking platform widely used in America to connect with colleagues, find jobs, and build a professional profile.'},
                    {'word': 'cover letter', 'definition': 'A written document sent with a resume that explains why you are applying for a position and why you are a strong candidate.'},
                    {'word': 'portfolio', 'definition': 'A curated collection of your best work used to demonstrate skills and experience to potential employers.'},
                    {'word': 'mentor', 'definition': 'An experienced professional who provides guidance, advice, and support to a less experienced person.'},
                    {'word': 'career pivot', 'definition': 'A significant shift in a person\'s professional direction, often between different industries or roles.'},
                    {'word': 'alumni', 'definition': 'Former students of a school, who form a network that can be valuable for career opportunities.'},
                    {'word': 'job market', 'definition': 'The availability of employment in a specific field or economy at a given time.'},
                    {'word': 'soft skills', 'definition': 'Interpersonal and communication abilities — like teamwork and problem-solving — as distinct from technical expertise.'},
                    {'word': 'hard skills', 'definition': 'Specific, teachable abilities that can be defined and measured, such as coding, data analysis, or foreign language fluency.'},
                ],
                'expressions': [
                    {'expression': "Work your network.", 'meaning': 'To actively leverage your professional relationships to find opportunities, advice, or introductions.'},
                    {'expression': "Informational interview.", 'meaning': 'A conversation with someone in a field you are interested in, conducted to learn about their work rather than to apply for a job.'},
                    {'expression': "It\'s who you know.", 'meaning': 'The widely recognized reality that personal connections often determine career opportunities more than qualifications alone.'},
                    {'expression': "Get your foot in the door.", 'meaning': 'To gain initial entry to an organization or industry, even in a small role, that can lead to greater opportunities.'},
                    {'expression': "Stand out from the crowd.", 'meaning': 'To distinguish yourself from other candidates by highlighting unique qualities, experiences, or perspectives.'},
                    {'expression': "Put yourself out there.", 'meaning': 'To actively seek opportunities, make connections, and take risks in professional or social contexts despite discomfort.'},
                ],
            },
            {
                'number': 16,
                'title': 'The American Healthcare System: Costs, Access, and Disparities',
                'outline': """LESSON OVERVIEW
The American healthcare system is one of the most expensive, complex, and unequal in the developed world — and it is central to understanding American politics and daily life. For an advanced student, this is a lesson in systemic analysis, personal consequence, and why a society's healthcare choices are deeply moral.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Have you ever been unable to see a doctor because of cost or access?
   - Do you think healthcare is a right or a privilege?
   - What do you know about how healthcare works in the United States?

2. How the American Healthcare System Works
   - Insurance: employer-sponsored, government programs (Medicaid, Medicare), and uninsured Americans
   - The ACA (Affordable Care Act): what changed and what was left unresolved
   - The role of pharmaceutical companies and hospital systems in driving costs

3. The Inequality of American Healthcare
   - Racial and economic disparities in health outcomes: who lives longer, who dies earlier, and why
   - Medical debt as the leading cause of bankruptcy in America
   - Rural healthcare deserts: where hospitals have closed and communities have no access

4. Cultural Deep Dive
   Share a personal experience with the American healthcare system — either your own or from someone in your family. What was the financial cost, the emotional experience, and what would have happened if you had been uninsured?

5. Conversation Practice
   Structured debate: "Healthcare is a fundamental human right that the government is obligated to provide." Defend a nuanced position and anticipate the strongest counterargument.

6. Wrap-Up
   - What does America's healthcare system reveal about its values as a nation?
   - How does Peru's healthcare system compare in terms of access and quality?

TUTOR NOTE: This topic can be deeply personal. If you have experiences with medical debt, uninsurance, or healthcare inequality, they are among the most powerful things you can share in this session.""",
                'vocabulary': [
                    {'word': 'premium', 'definition': 'The monthly amount paid for health insurance coverage, regardless of whether you use medical services.'},
                    {'word': 'deductible', 'definition': 'The amount you must pay out of pocket for medical services before your insurance begins to cover costs.'},
                    {'word': 'copay', 'definition': 'A fixed amount you pay for a healthcare service at the time of the visit, after meeting your deductible.'},
                    {'word': 'uninsured', 'definition': 'Without health insurance coverage, meaning all medical costs must be paid directly by the individual.'},
                    {'word': 'Medicaid', 'definition': 'A U.S. government health insurance program for low-income individuals and families.'},
                    {'word': 'Medicare', 'definition': 'A U.S. federal health insurance program primarily for people 65 and older.'},
                    {'word': 'pharmaceutical', 'definition': 'Relating to the manufacturing and sale of medicinal drugs.'},
                    {'word': 'disparity', 'definition': 'A noticeable, often unfair difference between groups — in healthcare, referring to gaps in access and outcomes by race, income, or geography.'},
                    {'word': 'universal healthcare', 'definition': 'A system in which all residents of a country have access to health services without suffering financial hardship.'},
                    {'word': 'medical debt', 'definition': 'Money owed for healthcare services, the leading cause of personal bankruptcy in the United States.'},
                    {'word': 'preventive care', 'definition': 'Health services focused on preventing illness before it occurs, such as vaccinations, screenings, and checkups.'},
                    {'word': 'out-of-pocket', 'definition': 'Medical costs paid directly by the patient, not covered by insurance.'},
                ],
                'expressions': [
                    {'expression': "Fall through the cracks.", 'meaning': 'When someone is missed or not helped by a system that is supposed to serve them, due to gaps in coverage or bureaucracy.'},
                    {'expression': "Medical bankruptcy.", 'meaning': 'Filing for bankruptcy specifically because of overwhelming medical debt — a situation unique in scale to the United States among wealthy nations.'},
                    {'expression': "Healthcare is broken.", 'meaning': 'A common American expression of frustration with the dysfunction of the healthcare system, used across the political spectrum.'},
                    {'expression': "Afford to get sick.", 'meaning': 'Used in the negative — "I can\'t afford to get sick" — meaning the cost of medical care is prohibitive. A darkly ironic American expression.'},
                    {'expression': "In network.", 'meaning': 'Doctors and hospitals that have agreements with your insurance company to provide services at covered rates. Going "out of network" costs significantly more.'},
                    {'expression': "Access to care.", 'meaning': 'The ability to receive needed medical services, affected by factors including insurance, geography, income, and race.'},
                ],
            },
            {
                'number': 17,
                'title': 'The College Admissions Race: Strategy, Stress, and Alternatives',
                'outline': """LESSON OVERVIEW
The American college admissions process has become a high-stakes, high-anxiety industry that shapes the senior year of every aspiring student — and raises profound questions about fairness, meritocracy, and what education is actually for. This advanced session dissects the system with analytical honesty.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - What is the most stressful part of preparing for higher education in your experience?
   - Do you think it is fair that where someone goes to college shapes so much of their future?
   - What would you change about how universities select their students?

2. The Anatomy of the Admissions Race
   - The essay industrial complex: college consultants, essay coaches, and the commodification of authenticity
   - Legacy admissions and donor preferences: how wealth buys access to elite schools
   - Affirmative action: its purpose, its legal history, and the 2023 Supreme Court ruling that ended race-conscious admissions

3. The Mental Health Cost of Elite Admissions Culture
   - The anxiety epidemic among American high school juniors and seniors
   - "Prestige chasing" and why students choose schools for name rather than fit
   - The culture of shame around rejection and how it distorts self-worth

4. Alternatives to the Traditional Path
   - Community college and transfer pathways to four-year degrees
   - Trade schools and vocational training: the case for learning a skilled trade
   - Gap years: how and why some students choose to delay college and what they gain

5. Conversation Practice
   Discussion: "A degree from an elite university is not worth the cost — financial, emotional, or social — for most students." Argue a nuanced position and engage with evidence on both sides.

6. Wrap-Up
   - What advice would you give a 16-year-old in Peru who wants to pursue higher education in America?
   - How does the pressure around university admissions in Peru compare to what you have described?

TUTOR NOTE: Be honest about your own application experience — the parts that felt unfair, the advantages you had that others did not, and what you would do differently if you could.""",
                'vocabulary': [
                    {'word': 'legacy admission', 'definition': 'Preferential treatment in college admissions given to applicants whose parents or relatives attended the same school.'},
                    {'word': 'affirmative action', 'definition': 'Policies that aim to increase the representation of underrepresented groups in institutions, including race-conscious admissions.'},
                    {'word': 'holistic review', 'definition': 'An admissions process that considers the whole applicant — not just grades and test scores — including essays, activities, and background.'},
                    {'word': 'yield rate', 'definition': 'The percentage of admitted students who choose to enroll at a given college.'},
                    {'word': 'waitlist', 'definition': 'A pool of applicants who are not accepted or rejected outright but may be offered admission later.'},
                    {'word': 'financial aid package', 'definition': 'The combination of grants, loans, and work-study offered by a college to help a student pay for attendance.'},
                    {'word': 'gap year', 'definition': 'A year taken off between high school and college, often used for travel, work, or service.'},
                    {'word': 'vocational training', 'definition': 'Education that prepares a person for a specific trade or occupation, such as plumbing, electrical work, or healthcare technology.'},
                    {'word': 'prestige', 'definition': 'The widespread respect and admiration felt for an institution based on its reputation.'},
                    {'word': 'meritocracy', 'definition': 'A system in which advancement is based on individual talent and effort — an ideal that the admissions system is supposed to embody but often does not.'},
                    {'word': 'demonstrated interest', 'definition': 'A student\'s evidence of interest in a specific college, such as campus visits, emails to admissions officers, or interviews.'},
                    {'word': 'yield', 'definition': 'In admissions, the rate at which accepted students choose to enroll, which schools try to manage through early decision programs.'},
                ],
                'expressions': [
                    {'expression': "Admissions game.", 'meaning': 'The strategic, often cynical process of packaging oneself as an ideal candidate for college admission.'},
                    {'expression': "Reach, match, safety.", 'meaning': 'The standard American framework for building a college list: apply to schools that are long shots (reach), appropriate fits (match), and near-certain acceptances (safety).'},
                    {'expression': "The essay that got me in.", 'meaning': 'The college personal essay, often spoken of as the decisive factor in a successful application.'},
                    {'expression': "Decision day.", 'meaning': 'May 1st — the national deadline by which college-bound American seniors must commit to one school.'},
                    {'expression': "Worth the debt.", 'meaning': 'The question every American college student must answer: will the education and degree justify the financial burden of student loans.'},
                    {'expression': "College is not for everyone.", 'meaning': 'The increasingly mainstream American sentiment that a four-year degree is not the only valid or valuable post-secondary path.'},
                ],
            },
            {
                'number': 18,
                'title': 'College Athletics: Scholarships, Recruitment, and NCAA Culture',
                'outline': """LESSON OVERVIEW
College athletics in America is a multi-billion dollar industry built on the unpaid labor of student athletes — until recently. The world of recruitment, scholarships, NIL deals, and the unique social status of the college athlete reveals deep truths about American capitalism, race, and the mythology of the student-athlete.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Did you know that going to college in America can be free if you are a good enough athlete?
   - Do you think athletes who generate millions of dollars for universities should be paid?
   - What sport do you think would most likely earn someone a college scholarship?

2. The World of Athletic Recruitment
   - How high school athletes get recruited: showcases, camps, highlight videos, and coaches' visits
   - Division I, II, and III: the different levels of college athletics and what each means for the student
   - The scholarship: full ride vs. partial scholarship, and what "letter of intent" means

3. The NCAA and Its Contradictions
   - How the NCAA works as a governing body for college sports
   - The amateur athlete rule and the decades-long debate over compensating players
   - The 2021 NIL ruling: why athletes can now profit from their name, image, and likeness

4. Cultural Deep Dive
   Tell the student about a college athlete you know personally or know of — someone whose story complicates the neat narrative of athletic success. Maybe someone who gave up everything for their sport and it was worth it, or was not.

5. Conversation Practice
   Discussion: "College athletes who generate revenue for their schools should receive salaries, not just scholarships." Build an argument from multiple angles — economic, ethical, and racial.

6. Wrap-Up
   - What does the business of college athletics reveal about American values?
   - Is there anything comparable to the college athletic culture in Peru?

TUTOR NOTE: This is a topic with genuine moral complexity. Do not smooth out the contradictions — the exploitation of Black athletes by predominantly white institutions is real and worth naming directly.""",
                'vocabulary': [
                    {'word': 'scholarship', 'definition': 'Financial support awarded to a student for academic or athletic achievement that does not need to be repaid.'},
                    {'word': 'recruitment', 'definition': 'The process by which college coaches identify, evaluate, and attract high school athletes to their programs.'},
                    {'word': 'NCAA', 'definition': 'The National Collegiate Athletic Association — the governing body that regulates college athletics in the United States.'},
                    {'word': 'NIL', 'definition': 'Name, Image, and Likeness — the rights of college athletes to earn money through endorsements, appearances, and social media since 2021.'},
                    {'word': 'redshirt', 'definition': 'When a college athlete sits out a competitive season to preserve a year of eligibility while practicing with the team.'},
                    {'word': 'letter of intent', 'definition': 'A binding document signed by a recruited athlete committing to attend a specific college.'},
                    {'word': 'full ride', 'definition': 'A scholarship that covers all costs of attendance — tuition, room, board, and fees.'},
                    {'word': 'walk-on', 'definition': 'A college athlete who joins a team without a scholarship, typically by impressing coaches in open tryouts.'},
                    {'word': 'eligibility', 'definition': 'The right to participate in college athletics, governed by academic standing and NCAA rules.'},
                    {'word': 'amateur', 'definition': 'A person who engages in a sport without being paid — the legal fiction the NCAA maintained for decades.'},
                    {'word': 'transfer portal', 'definition': 'The system that allows college athletes to switch schools while maintaining their eligibility.'},
                    {'word': 'bowl game', 'definition': 'A post-season college football game, held in a stadium, between two teams from different conferences.'},
                ],
                'expressions': [
                    {'expression': "Full ride.", 'meaning': 'A complete athletic scholarship covering all college expenses. Receiving a full ride is a major achievement and a common American dream for athletic families.'},
                    {'expression': "Going pro.", 'meaning': 'The dream of transitioning from college athletics to a professional career. Statistically, it happens to a very small percentage of college athletes.'},
                    {'expression': "Blow up a program.", 'meaning': 'In college sports, to rapidly build a winning culture. Coaches are hired to "blow up" struggling programs.'},
                    {'expression': "Student-athlete.", 'meaning': 'The NCAA\'s official term for college athletes, emphasizing academics over athletics. Critics argue the term is a legal fiction that masks exploitation.'},
                    {'expression': "Name, image, and likeness.", 'meaning': 'The three components of an athlete\'s identity that can now be commercially exploited — a revolution in college sports since the 2021 NIL ruling.'},
                    {'expression': "Ride the bench.", 'meaning': 'To be a player who rarely gets playing time, sitting on the bench during games. Can refer to anyone who is overlooked or underutilized.'},
                ],
            },
            {
                'number': 19,
                'title': 'Arts in America: Funding, Access, and Expression',
                'outline': """LESSON OVERVIEW
The arts in America are a site of ongoing political struggle — over funding, access, censorship, and the question of whose creativity the culture chooses to support. At the advanced level, this lesson examines the arts not just as personal expression but as a reflection of power, inequality, and cultural values.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - Do you think art is a luxury or a necessity?
   - Have you ever felt that a creative work — a book, a song, a painting — changed how you thought about something?
   - Should governments fund the arts? Why or why not?

2. The Economics of Art in America
   - The National Endowment for the Arts: its budget, its purpose, and the political battle over its existence
   - The privatization of arts funding: how wealthy donors and corporations shape what gets made
   - The struggle of working artists: why most professional artists in America cannot live on their art alone

3. Access and Representation in the Arts
   - Why arts programs are consistently the first cut when schools face budget shortfalls
   - The relationship between socioeconomic status and access to arts education and experience
   - The rise of community arts organizations filling the gaps left by public disinvestment

4. Cultural Deep Dive
   Share your relationship to a specific art form — not what you think you should say but something honest: an art form you love and why, an art form you tried and abandoned, or a creative work that genuinely changed you.

5. Conversation Practice
   Discussion: "A society that defunds arts education is making a choice about which voices it wants to cultivate and which it wants to silence." Engage with the full implications of this argument.

6. Wrap-Up
   - If you had one million dollars to invest in the arts, what would you do with it?
   - How does Peru support its artists and cultural traditions, and is it enough?

TUTOR NOTE: This session is rich when the tutor shares genuine creative enthusiasm. Whatever art form matters most to you is the right one to start with. Passion about the arts is itself the lesson.""",
                'vocabulary': [
                    {'word': 'endowment', 'definition': 'A permanent fund of financial assets that an institution uses to sustain itself, with investment income supporting operations.'},
                    {'word': 'subsidy', 'definition': 'Financial support given by a government or institution to help sustain an activity considered valuable but not commercially self-sufficient.'},
                    {'word': 'censorship', 'definition': 'The suppression of speech or artistic expression deemed offensive or dangerous by an authority.'},
                    {'word': 'patronage', 'definition': 'Financial support given to an artist by a wealthy individual or institution, historically in exchange for dedicated work.'},
                    {'word': 'public art', 'definition': 'Artwork created for and displayed in public spaces, accessible to all rather than confined to galleries or museums.'},
                    {'word': 'grant', 'definition': 'Money given to an individual or organization for a specific purpose, not requiring repayment.'},
                    {'word': 'nonprofit arts organization', 'definition': 'An entity that produces or supports artistic work without the primary goal of making a profit.'},
                    {'word': 'cultural institution', 'definition': 'A museum, theater, library, or other organization that preserves, interprets, and presents cultural heritage.'},
                    {'word': 'defunding', 'definition': 'Reducing or eliminating financial support for a program or institution.'},
                    {'word': 'commercialization', 'definition': 'The transformation of art into a commodity primarily designed to generate profit.'},
                    {'word': 'community arts', 'definition': 'Artistic practices that engage communities in the creation process, often in underserved areas.'},
                    {'word': 'avant-garde', 'definition': 'Art that is experimental, innovative, or ahead of its time, often challenging conventional expectations.'},
                ],
                'expressions': [
                    {'expression': "Art for art\'s sake.", 'meaning': 'The philosophy that art has intrinsic value independent of any practical use or social message.'},
                    {'expression': "Cut the arts budget.", 'meaning': 'The unfortunately common decision by school districts or governments to reduce or eliminate arts funding when resources are scarce.'},
                    {'expression': "A blank canvas.", 'meaning': 'Literally, an unstarted painting — figuratively, an opportunity to create something entirely new without constraint.'},
                    {'expression': "Starving artist.", 'meaning': 'The cliche of the financially struggling creative who sacrifices economic comfort for artistic integrity. Reflects the real economic precarity of most American artists.'},
                    {'expression': "Push the envelope.", 'meaning': 'To challenge boundaries and attempt something more daring or experimental than what has been done before.'},
                    {'expression': "Creative freedom.", 'meaning': 'The ability to create without censorship, commercial pressure, or ideological constraint — and the ongoing fight to protect it.'},
                ],
            },
            {
                'number': 20,
                'title': 'American Politics: Youth Engagement, Key Issues, and Civic Duty',
                'outline': """LESSON OVERVIEW
This final advanced lesson brings everything together through the lens of political engagement — what it means to be a young citizen in a democracy, what the most pressing issues in American politics are, and how students can find their political voice in English. The goal is not to prescribe ideology but to build the confidence and vocabulary to engage with democracy.

TUTOR GUIDE (30-60 minutes)

1. Opening Warm-Up (5 min)
   - When you turn 18, do you plan to vote? Why or why not?
   - What is the single issue you care most about in politics?
   - Do you think young people have real political power, or does power belong to the old?

2. The State of Youth Political Engagement in America
   - Gen Z voter turnout in recent elections: higher than predicted and increasingly influential
   - Issues driving young voters: climate change, student debt, gun control, racial justice, reproductive rights
   - The tension between cynicism ("politics is corrupt") and engagement ("if you don't vote, nothing changes")

3. Key Political Issues for Young Americans
   - Climate change: the intergenerational equity argument and the Green New Deal debate
   - Student debt: a generation saddled with loans and the political fight over cancellation
   - Gun violence: the uniquely American crisis and the generational demand for legislative change

4. How American Democracy Actually Works
   - The role of Congress, the President, and the Supreme Court
   - Local vs. federal: why local elections often affect daily life more than national ones
   - How to make your voice heard beyond voting: activism, organizing, running for office

5. Conversation Practice
   Capstone discussion: Each person shares the one political issue they would fight hardest for and makes the strongest case they can for why it matters. Then ask: what would you actually do about it?

6. Wrap-Up
   - What is the most important political lesson from this entire advanced curriculum?
   - What does civic engagement look like in Peru, and what would you want to change about it?

TUTOR NOTE: This final session should feel like a culmination. You have spent significant time building a genuine relationship with this student. Trust that relationship enough to share what you actually believe and care about. The most powerful thing you can model is an engaged, thoughtful, imperfect citizen who keeps trying anyway.""",
                'vocabulary': [
                    {'word': 'civic engagement', 'definition': 'Active participation in the democratic life of one\'s community and country through voting, advocacy, and public service.'},
                    {'word': 'electorate', 'definition': 'All the people in a country who are entitled to vote in an election.'},
                    {'word': 'bipartisan', 'definition': 'Supported by or involving both major political parties, indicating broad consensus.'},
                    {'word': 'filibuster', 'definition': 'A procedural tactic in the U.S. Senate where a senator can delay a vote by speaking indefinitely.'},
                    {'word': 'lobbying', 'definition': 'The practice of attempting to influence legislators on behalf of a particular interest group.'},
                    {'word': 'redistricting', 'definition': 'The process of redrawing electoral district boundaries, often politically manipulated in a practice called gerrymandering.'},
                    {'word': 'grassroots', 'definition': 'Political activity originating from ordinary citizens rather than political parties or organizations.'},
                    {'word': 'disenfranchisement', 'definition': 'The removal of the right to vote, or barriers that effectively prevent certain groups from exercising it.'},
                    {'word': 'referendum', 'definition': 'A direct vote in which the electorate is asked to decide on a specific political question.'},
                    {'word': 'incumbent', 'definition': 'The current holder of a political office who is running for re-election.'},
                    {'word': 'polarization', 'definition': 'The increasing division of society into two opposed ideological camps with little common ground.'},
                    {'word': 'amendment', 'definition': 'A change or addition to the U.S. Constitution, requiring broad consensus to pass.'},
                ],
                'expressions': [
                    {'expression': "Get out the vote.", 'meaning': 'Efforts to encourage and assist eligible citizens to register and vote in elections. A common phrase in American political organizing.'},
                    {'expression': "Your vote matters.", 'meaning': 'The core argument for civic participation — that individual votes aggregate into outcomes that affect real lives.'},
                    {'expression': "Across the aisle.", 'meaning': 'Working with or reaching agreement with members of the opposing political party.'},
                    {'expression': "Hold office.", 'meaning': 'To occupy an elected or appointed government position. "She became the first woman to hold that office."'},
                    {'expression': "Change from within.", 'meaning': 'The strategy of entering existing political institutions to reform them rather than opposing them from outside.'},
                    {'expression': "Be the change.", 'meaning': 'From Gandhi\'s principle — to embody in your own actions the change you want to see in the world. A fitting phrase to close a curriculum about cultural exchange and human connection.'},
                ],
            },
        ]
    },
]


def seed_curriculum(db):
    for curr_data in CURRICULUM_DATA:
        existing = db.query(models.VPCurriculum).filter(models.VPCurriculum.level == curr_data['level']).first()
        if existing:
            continue
        curriculum = models.VPCurriculum(
            title=curr_data['title'],
            level=curr_data['level'],
            description=curr_data['description'],
        )
        db.add(curriculum)
        db.flush()
        for lesson_data in curr_data['lessons']:
            lesson = models.VPCurriculumLesson(
                curriculum_id=curriculum.id,
                lesson_number=lesson_data['number'],
                title=lesson_data['title'],
                outline=lesson_data['outline'],
            )
            db.add(lesson)
            db.flush()
            hw = models.VPHomeworkAssignment(
                lesson_id=lesson.id,
                vocabulary=json.dumps(lesson_data['vocabulary']),
                expressions=json.dumps(lesson_data['expressions']),
            )
            db.add(hw)
        db.commit()
