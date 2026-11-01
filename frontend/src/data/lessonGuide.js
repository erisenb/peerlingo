// At-a-glance tutor guide for all 20 Foundational English lessons, shown at
// the top of the public curriculum page. Each lesson names its main
// skill, what it covers, and how to flex for a student who is strong or weak
// at that skill. Advice condenses the per-section if_struggling /
// if_finishes_early guidance in backend/vp_lessons_foundational.py; keep the
// two in sync when a lesson changes.

export const LESSON_GUIDE = [
  {
    n: 1,
    skill: { en: 'Vocabulary', es: 'Vocabulario' },
    title: { en: 'Emotions & Feelings', es: 'Emociones y Sentimientos' },
    contains: {
      en: ['15 emotion words', 'I am / I feel', 'Letter sounds gh, ph, th, ch'],
      es: ['15 palabras de emociones', 'I am / I feel', 'Sonidos gh, ph, th, ch'],
    },
    strong: {
      en: 'Have them sort all 15 words into good and not-so-good feelings, then add a reason: "I am tired because…"',
      es: 'Pídele que clasifique las 15 palabras en emociones buenas y no tan buenas, y que agregue una razón: "I am tired because…"',
    },
    weak: {
      en: 'Teach 5 words (happy, sad, angry, tired, excited) with a face or gesture for each, and only "I am ___". Save the rest for Lesson 2.',
      es: 'Enseña 5 palabras (happy, sad, angry, tired, excited) con un gesto para cada una, y solo "I am ___". Deja el resto para la Lección 2.',
    },
  },
  {
    n: 2,
    skill: { en: 'Grammar', es: 'Gramática' },
    title: { en: 'Am / Is / Are', es: 'Am / Is / Are' },
    contains: {
      en: ['Emotion word review', 'am / is / are with every pronoun', 'she likes · he eats', 'was / were and -ing'],
      es: ['Repaso de emociones', 'am / is / are con cada pronombre', 'she likes · he eats', 'was / were y -ing'],
    },
    strong: {
      en: 'Mix tenses: "I was tired, but now I am playing." Let them invent a mini-story about a friend for you to respond to.',
      es: 'Combina tiempos: "I was tired, but now I am playing." Deja que invente una mini historia sobre un amigo.',
    },
    weak: {
      en: 'Master I / you / he / she before adding we / they, and teach only "was" today. Give fill-in starters: "She ___ nervous."',
      es: 'Domina I / you / he / she antes de agregar we / they, y enseña solo "was" hoy. Da frases para completar: "She ___ nervous."',
    },
    milestone: { en: 'Cambridge Volume 1 next', es: 'Luego: Cambridge Volumen 1' },
  },
  {
    n: 3,
    skill: { en: 'Vocabulary', es: 'Vocabulario' },
    title: { en: 'Animals', es: 'Animales' },
    contains: {
      en: ['12 animal words', 'It is a ___ / I can see a ___', 'Volume 1 debrief'],
      es: ['12 palabras de animales', 'It is a ___ / I can see a ___', 'Repaso del Volumen 1'],
    },
    strong: {
      en: 'Have them sort the animals into home vs. farm or wild, describing each with "I can see a ___."',
      es: 'Pídele que separe los animales en casa vs. granja o salvajes, describiendo cada uno con "I can see a ___."',
    },
    weak: {
      en: 'Teach 8 animals (cat, dog, bird, fish, horse, cow, duck, rabbit). Reassure them Volume 1 was a starting point, not a grade.',
      es: 'Enseña 8 animales (cat, dog, bird, fish, horse, cow, duck, rabbit). Recuérdale que el Volumen 1 fue un punto de partida, no una nota.',
    },
  },
  {
    n: 4,
    skill: { en: 'Grammar', es: 'Gramática' },
    title: { en: 'Singular, Plural, This / These', es: 'Singular, Plural, This / These' },
    contains: {
      en: ['Plural -s', 'a + singular noun', 'This is / These are', 'fish & sheep exceptions'],
      es: ['Plural con -s', 'a + sustantivo singular', 'This is / These are', 'Excepciones fish y sheep'],
    },
    strong: {
      en: 'Invent a made-up word together and ask for its plural to test the rule. Add a trick true/false picture sentence.',
      es: 'Inventen juntos una palabra nueva y pide su plural para probar la regla. Agrega una oración de verdadero/falso con trampa.',
    },
    weak: {
      en: 'Stick to regular plurals (cat → cats) and "This is a ___" only. Hold up one finger vs. two as a visual cue.',
      es: 'Usa solo plurales regulares (cat → cats) y "This is a ___". Muestra un dedo vs. dos como apoyo visual.',
    },
  },
  {
    n: 5,
    skill: { en: 'Vocabulary', es: 'Vocabulario' },
    title: { en: 'Colors, Clothes & Descriptions', es: 'Colores, Ropa y Descripciones' },
    contains: {
      en: ['8 colors', 'big · small · long · short', '5 clothing words', 'Full describing sentences'],
      es: ['8 colores', 'big · small · long · short', '5 palabras de ropa', 'Oraciones descriptivas completas'],
    },
    strong: {
      en: 'Combine words in one sentence: "This is a small, red box." Have them describe what a family member is wearing.',
      es: 'Combina palabras en una oración: "This is a small, red box." Pídele que describa lo que lleva puesto un familiar.',
    },
    weak: {
      en: 'Teach 5 colors, big / small, and 3 clothes (hat, shirt, shoes). Point to real objects in the room.',
      es: 'Enseña 5 colores, big / small y 3 prendas (hat, shirt, shoes). Señala objetos reales en la habitación.',
    },
  },
  {
    n: 6,
    skill: { en: 'Reading detail', es: 'Lectura de detalles' },
    title: { en: 'Careful Picture Reading', es: 'Lectura Atenta de Imágenes' },
    contains: {
      en: ['5-point checklist: object, number, color, place, action', 'True/false and yes/no practice'],
      es: ['Lista de 5 puntos: objeto, número, color, lugar, acción', 'Práctica de verdadero/falso y sí/no'],
    },
    strong: {
      en: 'Have them write a false sentence about a picture and challenge you to find the wrong detail.',
      es: 'Pídele que escriba una oración falsa sobre una imagen y te rete a encontrar el detalle incorrecto.',
    },
    weak: {
      en: 'Use a 3-point checklist (object, number, color) and walk through it out loud on every example.',
      es: 'Usa una lista de 3 puntos (objeto, número, color) y recórrela en voz alta en cada ejemplo.',
    },
  },
  {
    n: 7,
    skill: { en: 'Position words', es: 'Palabras de lugar' },
    title: { en: 'Prepositions of Place', es: 'Preposiciones de Lugar' },
    contains: {
      en: ['in · on · under · next to', 'behind · in front of · between · near', 'school · house · park · store'],
      es: ['in · on · under · next to', 'behind · in front of · between · near', 'school · house · park · store'],
    },
    strong: {
      en: 'Hide an object and have them describe where it is using 2 different prepositions.',
      es: 'Esconde un objeto y pídele que diga dónde está usando 2 preposiciones distintas.',
    },
    weak: {
      en: 'Teach in, on, under, next to by physically moving an object. Save the other four for Lesson 8.',
      es: 'Enseña in, on, under, next to moviendo un objeto de verdad. Deja las otras cuatro para la Lección 8.',
    },
  },
  {
    n: 8,
    skill: { en: 'Spelling', es: 'Ortografía' },
    title: { en: 'Spelling & Jumbled Letters', es: 'Ortografía y Letras Revueltas' },
    contains: {
      en: ['4-step spelling strategy', 'Unscrambling 12 familiar words', 'Cambridge Part 3 practice'],
      es: ['Estrategia de 4 pasos', 'Ordenar 12 palabras conocidas', 'Práctica de la Parte 3 de Cambridge'],
    },
    strong: {
      en: 'Give longer words from earlier lessons (green, small) to spell and unscramble.',
      es: 'Da palabras más largas de lecciones anteriores (green, small) para deletrear y ordenar.',
    },
    weak: {
      en: 'Use just two steps: sound it out, then find the first and last letter. Practice plain spelling of 6–8 words; skip jumbles for now.',
      es: 'Usa solo dos pasos: pronunciarla y buscar la primera y última letra. Practica 6–8 palabras sin revolver por ahora.',
    },
  },
  {
    n: 9,
    skill: { en: 'Vocabulary', es: 'Vocabulario' },
    title: { en: 'Family, Body Parts & Has', es: 'Familia, Cuerpo y Has' },
    contains: {
      en: ['8 people & family words', '9 body parts', 'has / has got'],
      es: ['8 palabras de personas y familia', '9 partes del cuerpo', 'has / has got'],
    },
    strong: {
      en: 'Combine a body part and a color: "The cat has got green eyes." Have them describe a family member.',
      es: 'Combina una parte del cuerpo y un color: "The cat has got green eyes." Pídele que describa a un familiar.',
    },
    weak: {
      en: 'Teach 8 words (boy, girl, mother, father, head, hand, eye, mouth) and only "has". Point to your own face and hands.',
      es: 'Enseña 8 palabras (boy, girl, mother, father, head, hand, eye, mouth) y solo "has". Señala tu propia cara y manos.',
    },
  },
  {
    n: 10,
    skill: { en: 'Grammar', es: 'Gramática' },
    title: { en: 'Actions & Present Continuous', es: 'Acciones y Presente Continuo' },
    contains: {
      en: ['12 action verbs', '4 toy words', 'am / is / are + -ing'],
      es: ['12 verbos de acción', '4 juguetes', 'am / is / are + -ing'],
    },
    strong: {
      en: 'Add a place: "The cat is sleeping under the table." Match each action to an animal from earlier lessons.',
      es: 'Agrega un lugar: "The cat is sleeping under the table." Relaciona cada acción con un animal de lecciones anteriores.',
    },
    weak: {
      en: 'Teach 8 verbs by miming them, and practice only "is + -ing": "She is running."',
      es: 'Enseña 8 verbos actuándolos, y practica solo "is + -ing": "She is running."',
    },
  },
  {
    n: 11,
    skill: { en: 'Questions', es: 'Preguntas' },
    title: { en: 'Question Words & One-Word Answers', es: 'Palabras Interrogativas y Respuestas Cortas' },
    contains: {
      en: ['who · what · where · how many', 'what is ___ doing? · what has ___ got?', 'Short, spelled answers'],
      es: ['who · what · where · how many', 'what is ___ doing? · what has ___ got?', 'Respuestas cortas bien escritas'],
    },
    strong: {
      en: 'Have them build a scene and write 2 questions, with answers, for you to solve.',
      es: 'Pídele que cree una escena y escriba 2 preguntas, con respuestas, para que tú las resuelvas.',
    },
    weak: {
      en: 'Start with who, what, where. Accept a full sentence first, then help them trim it down to the key word.',
      es: 'Empieza con who, what, where. Acepta primero una oración completa y luego ayúdale a reducirla a la palabra clave.',
    },
  },
  {
    n: 12,
    skill: { en: 'Numbers', es: 'Números' },
    title: { en: 'Numbers, Food & Facts', es: 'Números, Comida y Datos' },
    contains: {
      en: ['Numbers 1–20', 'many · some', '5 food words', 'How many ___ are there?'],
      es: ['Números 1–20', 'many · some', '5 palabras de comida', 'How many ___ are there?'],
    },
    strong: {
      en: 'Have them guess the 11–20 pattern before you teach it, then count by twos to 20.',
      es: 'Pídele que adivine el patrón del 11 al 20 antes de enseñarlo, y luego que cuente de dos en dos hasta 20.',
    },
    weak: {
      en: 'Focus on 1–5, then 11–15, and 3 foods (apple, banana, egg). Count on fingers or real objects.',
      es: 'Enfócate en 1–5, luego 11–15, y 3 comidas (apple, banana, egg). Cuenta con los dedos u objetos reales.',
    },
  },
  {
    n: 13,
    skill: { en: 'Reading', es: 'Lectura' },
    title: { en: 'Factual Reading & Weather', es: 'Lectura de Datos y Clima' },
    contains: {
      en: ['Missing-word strategy', 'Context clues', 'sun · rain · hot · cold', 'Short factual texts'],
      es: ['Estrategia de la palabra faltante', 'Pistas de contexto', 'sun · rain · hot · cold', 'Textos cortos de datos'],
    },
    strong: {
      en: 'Have them write their own factual sentence with a gap for you to solve.',
      es: 'Pídele que escriba su propia oración con un espacio en blanco para que tú la resuelvas.',
    },
    weak: {
      en: 'Offer 2 choices for each gap ("legs or eyes?") and use 3 steps: read, guess the word type, check the spelling.',
      es: 'Ofrece 2 opciones por espacio ("legs or eyes?") y usa 3 pasos: leer, adivinar el tipo de palabra, revisar la ortografía.',
    },
  },
  {
    n: 14,
    skill: { en: 'Reading', es: 'Lectura' },
    title: { en: 'Picture Stories', es: 'Historias con Imágenes' },
    contains: {
      en: ['Reading a 3-picture story', 'Spotting what changes', 'Cambridge Part 4 answers'],
      es: ['Leer una historia de 3 imágenes', 'Detectar qué cambia', 'Respuestas de la Parte 4 de Cambridge'],
    },
    strong: {
      en: 'Have them describe a 4th picture that continues the story and write a question about it.',
      es: 'Pídele que describa una 4.ª imagen que continúe la historia y escriba una pregunta sobre ella.',
    },
    weak: {
      en: 'Use 2 pictures with one clear change, and re-describe the picture before each question.',
      es: 'Usa 2 imágenes con un cambio claro, y vuelve a describir la imagen antes de cada pregunta.',
    },
  },
  {
    n: 15,
    skill: { en: 'Test readiness', es: 'Preparación para el examen' },
    title: { en: 'Final Volume 2 Preparation', es: 'Preparación Final para el Volumen 2' },
    contains: {
      en: ['Cumulative diagnostic', 'Practice for all 5 Cambridge parts', 'Volume 2 benchmark'],
      es: ['Diagnóstico acumulativo', 'Práctica de las 5 partes de Cambridge', 'Evaluación del Volumen 2'],
    },
    strong: {
      en: 'Ask which area they feel least sure about and target it. Have them build their own practice questions.',
      es: 'Pregúntale en qué área se siente menos seguro y enfócate ahí. Pídele que cree sus propias preguntas de práctica.',
    },
    weak: {
      en: 'Prioritize the most-tested areas: plurals, colors and clothes, prepositions, spelling. Slow down and use the checklists step by step.',
      es: 'Prioriza lo más evaluado: plurales, colores y ropa, preposiciones y ortografía. Ve despacio y usa las listas paso a paso.',
    },
    milestone: { en: 'Cambridge Volume 2 next', es: 'Luego: Cambridge Volumen 2' },
  },
  {
    n: 16,
    skill: { en: 'Grammar', es: 'Gramática' },
    title: { en: 'Volume 2 Debrief & Past Tense', es: 'Repaso del Volumen 2 y Pasado' },
    contains: {
      en: ['Volume 2 results review', 'Regular past -ed + 3 spelling rules', '6 irregular verbs', 'My Real Story'],
      es: ['Repaso de resultados del Volumen 2', 'Pasado regular -ed + 3 reglas', '6 verbos irregulares', 'Mi historia real'],
    },
    strong: {
      en: 'Combine two irregular verbs in one sentence: "I went to the store and got some milk." Add how they felt, using Lesson 1 emotions.',
      es: 'Combina dos verbos irregulares en una oración: "I went to the store and got some milk." Agrega cómo se sintió, con emociones de la Lección 1.',
    },
    weak: {
      en: 'Teach only "add -ed" with play, walk, watch, plus 3 irregulars (went, had, ate). Build their story one sentence at a time.',
      es: 'Enseña solo "agregar -ed" con play, walk, watch, más 3 irregulares (went, had, ate). Construye su historia una oración a la vez.',
    },
  },
  {
    n: 17,
    skill: { en: 'Grammar', es: 'Gramática' },
    title: { en: 'Future: Going To / Will', es: 'Futuro: Going To / Will' },
    contains: {
      en: ['going to for plans', 'will for decisions & predictions', 'Future plans with emotions'],
      es: ['going to para planes', 'will para decisiones y predicciones', 'Planes futuros con emociones'],
    },
    strong: {
      en: 'Have them describe a family member\'s plan ("She is going to visit her grandmother") and make a "will" prediction about you.',
      es: 'Pídele que describa el plan de un familiar ("She is going to visit her grandmother") y haga una predicción con "will" sobre ti.',
    },
    weak: {
      en: 'Teach only "going to" with "I", using a frame: "This weekend, I am going to ___." Save "will" for Lesson 18.',
      es: 'Enseña solo "going to" con "I", usando un marco: "This weekend, I am going to ___." Deja "will" para la Lección 18.',
    },
  },
  {
    n: 18,
    skill: { en: 'Sentence building', es: 'Construcción de oraciones' },
    title: { en: 'And, But, Because, So', es: 'And, But, Because, So' },
    contains: {
      en: ['4 connecting words', 'Joining two sentences', 'Sentences using the whole course'],
      es: ['4 palabras de enlace', 'Unir dos oraciones', 'Oraciones con todo el curso'],
    },
    strong: {
      en: 'Have them build one long sentence with 2 connectors: "I am tired because I ran, so I am going to sleep."',
      es: 'Pídele que forme una oración larga con 2 conectores: "I am tired because I ran, so I am going to sleep."',
    },
    weak: {
      en: 'Focus on "and" and "but" first, then use a starter for "because": "I am ___ because ___."',
      es: 'Empieza con "and" y "but", y luego usa un inicio para "because": "I am ___ because ___."',
    },
  },
  {
    n: 19,
    skill: { en: 'Reading', es: 'Lectura' },
    title: { en: 'Reading: Putting It All Together', es: 'Lectura: Todo en Conjunto' },
    contains: {
      en: ['Connected passage: Maria\'s Day', 'Comprehension questions', 'Spotting course grammar in real text'],
      es: ['Texto: Maria\'s Day', 'Preguntas de comprensión', 'Encontrar la gramática del curso en un texto real'],
    },
    strong: {
      en: 'Have them retell the story in their own words in 3–4 sentences, pointing out tenses they used.',
      es: 'Pídele que vuelva a contar la historia con sus propias palabras en 3–4 oraciones, señalando los tiempos que usó.',
    },
    weak: {
      en: 'Read 2 sentences at a time and check understanding after each chunk instead of reading it all at once.',
      es: 'Lean 2 oraciones a la vez y revisa la comprensión después de cada parte en lugar de leer todo de una vez.',
    },
  },
  {
    n: 20,
    skill: { en: 'Conversation', es: 'Conversación' },
    title: { en: 'Final Conversation', es: 'Conversación Final' },
    contains: {
      en: ['Quick-fire course review', 'Free, unscripted conversation', 'Celebrating the full course'],
      es: ['Repaso rápido del curso', 'Conversación libre', 'Celebración del curso completo'],
    },
    strong: {
      en: 'Let them lead the conversation and ask real follow-up questions about anything they say.',
      es: 'Deja que dirija la conversación y haz preguntas de seguimiento reales sobre lo que diga.',
    },
    weak: {
      en: 'Slow the review to 5–10 seconds per prompt, model your own answer first, and accept short answers. Participation over perfection.',
      es: 'Da 5–10 segundos por pregunta en el repaso, responde tú primero como ejemplo y acepta respuestas cortas. Participar importa más que la perfección.',
    },
    milestone: { en: 'Course complete! 🎓', es: '¡Curso completo! 🎓' },
  },
]
