/**
 * Rellena la base MongoDB usada por Server/mongoDB.js (db: mathGameMongo).
 *
 * Ejecutar desde el directorio Server (para resolver el paquete mongodb):
 *   npm run seed:mongo
 *
 * Variables opcionales:
 *   MONGODB_URI  (por defecto mongodb://127.0.0.1:27017)
 *   MONGO_DB_NAME (por defecto mathGameMongo)
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.MONGO_DB_NAME || 'mathGameMongo';

const themes = [
  { id: 1, nombre: 'Àlgebra' },
  { id: 2, nombre: 'Geometria' },
];

const questions = [
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
    pregunta: "Escriu el resultat de 12 − 4 (només el número).",
    formato: 'Respuesta',
    correcta: ['8'],
    experiencia: 15,
    respuestas: [],
  },
  {
    id: 3,
    pregunta: 'Ordena: 2 + 3 × 4',
    formato: 'Ordenar valores',
    operacion: true,
    correcta: 14,
    experiencia: 20,
    muestra: ['2', '+', '3', '×', '4'],
    respuestas: [],
    componentes: ['2', '+', '3', '×', '4'],
  },
];

const activities = [
  {
    id: 1,
    id_tema: 1,
    nombre: 'Operacions bàsiques',
    tipo: 'Seleccionar',
    img: 'https://picsum.photos/seed/math1/640/360',
    preguntas: [1, 2],
  },
  {
    id: 2,
    id_tema: 2,
    nombre: 'Ordre d’operacions',
    tipo: 'Ordenar valors',
    img: 'https://picsum.photos/seed/math2/640/360',
    preguntas: [3],
  },
];

/** Document de batalla compatible amb /historial (ganador, equipo1, equipo2) */
const sampleBattles = [
  {
    battle: 'Sala prova',
    ganador: 1,
    equipo1: [
      {
        email: 'alumne@test.cat',
        preguntas: [{ pregunta: 1, correcta: true }],
      },
    ],
    equipo2: [
      {
        email: 'rival@test.cat',
        preguntas: [{ pregunta: 1, correcta: false }],
      },
    ],
    matchsize: 2,
    experiencia: 10,
    time: '2026/05/01 10:00:00',
    duration: '0:03:00',
  },
];

const sampleResults = [
  {
    idUsuario: 1,
    idEjercicio: 1,
    idPregunta: 1,
    respuesta: '8',
    correcta: true,
    time: '2026/05/07 12:00:00',
  },
];

const sampleHistory = [
  {
    idUsuario: 1,
    idEjercicio: 1,
    idPregunta: 2,
    respuesta: '8',
    correcta: true,
    time: '2026/05/07 12:01:00',
  },
];

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const cols = ['theme', 'activity', 'question', 'result', 'history', 'Battles'];
  for (const c of cols) {
    await db.collection(c).deleteMany({});
  }

  await db.collection('theme').insertMany(themes);
  await db.collection('question').insertMany(questions);
  await db.collection('activity').insertMany(activities);
  await db.collection('result').insertMany(sampleResults);
  await db.collection('history').insertMany(sampleHistory);
  await db.collection('Battles').insertMany(sampleBattles);

  await client.close();
  console.log(`MongoDB sembrado: ${dbName} en ${uri}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
