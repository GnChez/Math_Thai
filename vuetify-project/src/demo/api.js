import {
  activities,
  battleQuestions,
  classroom,
  professor,
  questions,
  seedHistory,
  themes,
  users,
} from './data';
import {
  battle,
  clearUser,
  loadExtraHistory,
  loadResults,
  loadUser,
  pushHistory,
  saveResult,
  saveUser,
} from './store';

function nowStamp() {
  const ahora = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${ahora.getFullYear()}/${pad(ahora.getMonth() + 1)}/${pad(ahora.getDate())} ${pad(ahora.getHours())}:${pad(ahora.getMinutes())}:${pad(ahora.getSeconds())}`;
}

function publicUser(user) {
  if (!user) return { email: '' };
  return { ...user, sessionId: 'demo-session' };
}

function questionById(id) {
  return questions.find((q) => q.id === Number(id))
    || battleQuestions.find((q) => q.id === Number(id));
}

function activityById(id) {
  return activities.find((a) => a.id === Number(id));
}

/** Copia sin la respuesta correcta, como hace GET /getEjercicio. */
function questionForClient(question) {
  const copy = JSON.parse(JSON.stringify(question));
  delete copy.correcta;
  return copy;
}

function lineFromPoints(punto1, punto2) {
  if (punto1.x === punto2.x) return { tipo: 'vertical', x: punto1.x };
  if (punto1.y === punto2.y) return { tipo: 'horizontal', y: punto1.y };
  const m = (punto2.y - punto1.y) / (punto2.x - punto1.x);
  const b = punto1.y - m * punto1.x;
  return { tipo: 'lineal', m, b };
}

function samePair(pair, expected) {
  return (pair[0] === expected[0] && pair[1] === expected[1])
    || (pair[0] === expected[1] && pair[1] === expected[0]);
}

export function isCorrect(question, respuesta) {
  if (!question || respuesta == null || respuesta === '') return false;
  if (question.formato === 'Seleccionar' || question.formato === 'Imagen') {
    return respuesta === question.correcta;
  }
  if (question.formato === 'Respuesta') {
    const normal = String(respuesta).replace(/\s/g, '').toLowerCase();
    return question.correcta.map((item) => String(item).replace(/\s/g, '').toLowerCase()).includes(normal);
  }
  if (question.formato === 'Ordenar valores') {
    return Array.isArray(respuesta) && JSON.stringify(respuesta) === JSON.stringify(question.correcta);
  }
  if (question.formato === 'Unir valores') {
    return Array.isArray(respuesta)
      && respuesta.length === question.correcta.length
      && respuesta.every((pair) => question.correcta.some((expected) => samePair(pair, expected)));
  }
  if (question.formato === 'Grafica' && Array.isArray(respuesta) && respuesta.length === 2) {
    const drawn = lineFromPoints(respuesta[0], respuesta[1]);
    const expected = question.correcta;
    if (drawn.tipo !== expected.tipo) return false;
    if (drawn.tipo === 'horizontal') return drawn.y === expected.y;
    if (drawn.tipo === 'vertical') return drawn.x === expected.x;
    return drawn.m === expected.m && drawn.b === expected.b;
  }
  return false;
}

function xpFromResults() {
  return loadResults()
    .filter((item) => item.correcta)
    .reduce((sum, item) => {
      const question = questionById(item.idPregunta);
      return sum + (question?.experiencia || 0);
    }, 0);
}

export function login(body) {
  const found = users.find(
    (user) => user.email === body?.email && user.contrasena === body?.contrasena && body?.contrasena
  );
  if (!found) return { email: '' };
  const sessionUser = publicUser(found);
  saveUser(sessionUser);
  return sessionUser;
}

export function loginGoogle(body) {
  const found = users.find((user) => user.email === body?.email);
  if (!found) return { email: '' };
  const sessionUser = publicUser({ ...found, image: body.image || found.image });
  saveUser(sessionUser);
  return sessionUser;
}

export function getLogin() {
  return publicUser(loadUser());
}

export function logout() {
  clearUser();
}

export function registrarUsuari() {
  return {
    success: false,
    message: 'El registre està desactivat a la demo. Entra amb alumne@test.cat / alumne123.',
  };
}

export function getCategorias() {
  return themes;
}

export function getActivities(nombre) {
  const theme = themes.find((item) => item.nombre === nombre);
  if (!theme) return [];
  return activities.filter((item) => item.id_tema === theme.id);
}

export function getEjercicio(id) {
  const activity = activityById(id);
  if (!activity) return null;
  return {
    id: activity.id,
    nombre: activity.nombre,
    tipo: activity.tipo,
    preguntas: activity.preguntas
      .map((qid) => questionById(qid))
      .filter(Boolean)
      .map(questionForClient),
  };
}

export function getEjercicios() {
  return questions.map(questionForClient);
}

export function getResueltas(dato) {
  const all = loadResults();
  if (!dato || dato.ejercicioid == null) return all;
  return all.filter((item) => item.idEjercicio === dato.ejercicioid);
}

export function getExpEjer(dato) {
  const rows = getResueltas(dato).filter((item) => item.correcta);
  const xp = rows.reduce((sum, item) => sum + (questionById(item.idPregunta)?.experiencia || 0), 0);
  return { xp };
}

export function totalExperiencia() {
  const xp = xpFromResults();
  const levels = [
    { lvl: 1, required: 0, health: 100 },
    { lvl: 2, required: 150, health: 115 },
    { lvl: 3, required: 400, health: 130 },
  ];
  let current = levels[0];
  let next = levels[1];
  levels.forEach((level, index) => {
    if (xp >= level.required) {
      current = level;
      next = levels[index + 1] || null;
    }
  });
  return {
    experiencia: xp,
    nivel: current.lvl,
    vida: current.health,
    experienciaRestante: next ? Math.max(next.required - xp, 0) : 0,
  };
}

export function comprobarPregunta(id, body) {
  const user = loadUser();
  const question = questionById(id);
  const correcto = isCorrect(question, body?.respuesta);
  if (user && question) {
    const entry = {
      idUsuario: user.id,
      idEjercicio: body?.ejercicioid,
      idPregunta: question.id,
      respuesta: body?.respuesta,
      correcta: correcto,
      time: nowStamp(),
    };
    saveResult(entry);
    const activity = activityById(body?.ejercicioid);
    pushHistory({
      historial: `Has resolt ${correcto ? 'bé' : 'malament'} l'activitat ${question.id} de l'exercici ${activity?.nombre || 'activitat'}`,
      hora: entry.time,
    });
  }
  return { correct: correcto };
}

export function getPreguntaRandom() {
  const pool = [...questions, ...battleQuestions];
  const picked = pool[Math.floor(Math.random() * pool.length)];
  return questionForClient(picked);
}

/** La batalla califica con la correcta que viaja en la pregunta, como el servidor real. */
export function getPreguntaBatalla() {
  const picked = battleQuestions[Math.floor(Math.random() * battleQuestions.length)];
  const copy = JSON.parse(JSON.stringify(picked));
  copy.respuestas.sort(() => Math.random() - 0.5);
  return copy;
}

export function getAula(codeOrId) {
  const value = String(codeOrId || '').toUpperCase();
  if (value === 'TEST01' || value === '1') return [classroom];
  return null;
}

export function getAulaById(id) {
  if (Number(id) === classroom.id) return [classroom];
  return null;
}

export function datosPerfil() {
  return {
    totalUsers: 2,
    professors: [professor],
  };
}

export function historial() {
  return [...loadExtraHistory(), ...seedHistory];
}

export function getBatallas() {
  return [
    {
      battle: 'Sala prova',
      ganador: 1,
      equipo1: [{ email: 'alumne@test.cat', preguntas: [{ pregunta: 1, correcta: true }] }],
      equipo2: [{ email: 'rival@test.cat', preguntas: [{ pregunta: 1, correcta: false }] }],
      experiencia: 10,
      time: '2026/05/01 10:00:00',
    },
  ];
}

export function getRooms(page = 1, itemsPerPage = 10, search = '') {
  const list = battle.room ? [battle.room] : [];
  const term = String(search || '').toLowerCase();
  const filtered = term
    ? list.filter((room) => String(room.name || '').toLowerCase().includes(term))
    : list;
  const start = (Number(page) - 1) * Number(itemsPerPage || 10);
  return {
    rooms: filtered.slice(start, start + Number(itemsPerPage || 10)),
    totalRooms: filtered.length,
  };
}

export function descargarImagen() {
  const user = loadUser();
  return { imagen: user?.image || '' };
}
