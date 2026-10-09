
export const DEMO_PASSWORD_HINT = 'alumne123';

const AVATAR =
  'https://picsum.photos/seed/maththai-anna/200/200';
const BOT_AVATAR =
  'https://picsum.photos/seed/maththai-rival/200/200';

export const users = [
  {
    id: 1,
    name: 'Anna',
    surname: 'Alumne',
    email: 'alumne@test.cat',
    contrasena: '160671C4CFD23AEDC40F5A21382E25CC',
    rank: 'apprenent',
    lvl: 1,
    image: AVATAR,
    id_classroom: 1,
    classroom_code: 'TEST01',
  },
  {
    id: 2,
    name: 'Pere',
    surname: 'Senseaula',
    email: 'pere@test.cat',
    contrasena: 'FC86B6A71388087CB292ACE4E567301B',
    rank: 'apprenent',
    lvl: 1,
    image: 'https://picsum.photos/seed/maththai-pere/200/200',
    id_classroom: null,
    classroom_code: null,
  },
];

export const botUser = {
  id: 'bot',
  email: 'rival@test.cat',
  image: BOT_AVATAR,
  level: 1,
  team: 2,
  preguntas: [],
};

export const classroom = {
  id: 1,
  professor_id: 1,
  name: 'Aula Alpha',
  access_code: 'TEST01',
};

export const professor = {
  id: 1,
  name: 'Kru',
  surname: 'Prova',
  email: 'prof@test.cat',
};

export const themes = [
  { id: 1, nombre: 'Formats' },
];

export const questions = [
  {
    id: 1,
    pregunta: 'Quant fan 3 + 5?',
    formato: 'Seleccionar',
    correcta: '8',
    experiencia: 10,
    respuestas: [
      { respuesta: '6' },
      { respuesta: '7' },
      { respuesta: '8' },
      { respuesta: '9' },
    ],
  },
  {
    id: 2,
    pregunta: 'Uneix cada operació amb el seu resultat.',
    formato: 'Unir valores',
    experiencia: 15,
    respuestas: [
      ['2 + 2', '3 × 3', '10 − 7', '5 + 1'],
      ['9', '4', '6', '3'],
    ],
    correcta: [
      ['2 + 2', '4'],
      ['3 × 3', '9'],
      ['10 − 7', '3'],
      ['5 + 1', '6'],
    ],
  },
  {
    id: 3,
    pregunta: 'Escriu el resultat de 12 − 4 (només el número).',
    formato: 'Respuesta',
    correcta: ['8'],
    experiencia: 10,
    respuestas: [],
  },
  {
    id: 4,
    pregunta: 'Quina figura és un triangle?',
    formato: 'Imagen',
    correcta: 'Triangle',
    experiencia: 10,
    respuestas: [
      { respuesta: 'Quadrat', imagen: '/demo/square.svg' },
      { respuesta: 'Cercle', imagen: '/demo/circle.svg' },
      { respuesta: 'Triangle', imagen: '/demo/triangle.svg' },
      { respuesta: 'Pentàgon', imagen: '/demo/pentagon.svg' },
    ],
  },
  {
    id: 5,
    pregunta: 'Ordena aquests nombres de menor a major.',
    formato: 'Ordenar valores',
    experiencia: 15,
    componentes: ['9', '2', '5', '1'],
    correcta: ['1', '2', '5', '9'],
  },
  {
    id: 6,
    pregunta: 'Representa la recta y = 2x + 1. Marca dos punts de la recta.',
    formato: 'Grafica',
    experiencia: 20,
    correcta: { tipo: 'lineal', m: 2, b: 1 },
  },
];

export const battleQuestions = [
  {
    id: 101,
    pregunta: 'Quant fan 9 + 6?',
    formato: 'Seleccionar',
    correcta: '15',
    experiencia: 10,
    respuestas: [
      { respuesta: '14' },
      { respuesta: '15' },
      { respuesta: '16' },
      { respuesta: '13' },
    ],
  },
  {
    id: 102,
    pregunta: 'Quant fan 8 × 3?',
    formato: 'Seleccionar',
    correcta: '24',
    experiencia: 10,
    respuestas: [
      { respuesta: '21' },
      { respuesta: '24' },
      { respuesta: '18' },
      { respuesta: '32' },
    ],
  },
  {
    id: 103,
    pregunta: 'Quant fan 20 − 7?',
    formato: 'Seleccionar',
    correcta: '13',
    experiencia: 10,
    respuestas: [
      { respuesta: '12' },
      { respuesta: '13' },
      { respuesta: '14' },
      { respuesta: '27' },
    ],
  },
  {
    id: 104,
    pregunta: 'Quant fan 4 × 4?',
    formato: 'Seleccionar',
    correcta: '16',
    experiencia: 10,
    respuestas: [
      { respuesta: '8' },
      { respuesta: '12' },
      { respuesta: '16' },
      { respuesta: '20' },
    ],
  },
];

export const activities = [
  {
    id: 1,
    id_tema: 1,
    nombre: 'Els sis formats',
    tipo: 'Mixt',
    img: 'https://picsum.photos/seed/math-formats/640/360',
    preguntas: [1, 2, 3, 4, 5, 6],
  },
];

export const seedHistory = [
  {
    historial: "Has resolt bé l'activitat 1 de l'exercici Els sis formats",
    hora: '2026/05/07 12:00:00',
  },
  {
    historial: 'Has guanyat la batalla Sala prova',
    hora: '2026/05/01 10:00:00',
  },
];
