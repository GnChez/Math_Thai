const USER_KEY = 'mathThaiDemoUser';
const RESULTS_KEY = 'mathThaiDemoResults';
const HISTORY_KEY = 'mathThaiDemoHistory';

export function loadUser() {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUser(user) {
  if (!user || !user.email) {
    sessionStorage.removeItem(USER_KEY);
    return;
  }
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearUser() {
  sessionStorage.removeItem(USER_KEY);
}

export function loadResults() {
  try {
    const raw = sessionStorage.getItem(RESULTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveResult(entry) {
  const all = loadResults();
  const index = all.findIndex(
    (item) =>
      item.idUsuario === entry.idUsuario &&
      item.idEjercicio === entry.idEjercicio &&
      item.idPregunta === entry.idPregunta
  );
  if (index >= 0) {
    if (!all[index].correcta && entry.correcta) all[index] = entry;
  } else {
    all.push(entry);
  }
  sessionStorage.setItem(RESULTS_KEY, JSON.stringify(all));
}

export function loadExtraHistory() {
  try {
    const raw = sessionStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function pushHistory(entry) {
  const all = loadExtraHistory();
  all.unshift(entry);
  sessionStorage.setItem(HISTORY_KEY, JSON.stringify(all));
}

/** Sala de la pestaña. Se pierde al recargar, igual que Pinia. */
export const battle = {
  room: null,
  botTimer: null,
};
