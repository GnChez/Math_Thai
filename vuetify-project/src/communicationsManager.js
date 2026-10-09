import * as demoApi from './demo/api';

/** VITE_DEMO=true responde en el navegador, sin Express ni bases de datos (despliegue en Vercel). */
export const DEMO = import.meta.env.VITE_DEMO === 'true';

function demoResponse(data, status = 200) {
  return {
    ok: status < 400,
    status,
    json: async () => data,
    text: async () => (typeof data === 'string' ? data : JSON.stringify(data ?? '')),
  };
}

/** En dev, por defecto HTTP (junto a USE_HTTP=true en Server) evita certificado autofirmado en https://localhost:3450 */
export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  (import.meta.env.PROD
    ? 'https://math-thai.dam.inspedralbes.cat:3450'
    : 'http://localhost:3450');

export async function descargarImagen(formData) {
  if (DEMO) return demoApi.descargarImagen();
  const response = await fetch(`${SERVER_URL}/descargar`, {
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          body: formData,
        });
  const imagen = await response.json();
  return imagen;
}
export async function joinAula(aula) {
  if (DEMO) return demoResponse('Registro exitoso');
  return fetch(`${SERVER_URL}/joinAula`,
    {
      method: 'POST',
      credentials: 'include', mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aula)
    });

}

export async function getAula(aulaId) {
  if (DEMO) return demoApi.getAula(aulaId);
  const response = await fetch(`${SERVER_URL}/getAula/${aulaId}`, { method: 'GET', credentials: 'include', mode: 'cors' });
  const aula = await response.json();
  return aula
}

export async function getAulaById(aulaId) {
  if (DEMO) return demoApi.getAulaById(aulaId);
  const response = await fetch(`${SERVER_URL}/getAulaById/${aulaId}`, { method: 'GET', credentials: 'include', mode: 'cors' });
  const aula = await response.json();
  return aula
}

export async function getEjercicios(id) {
  if (DEMO) return demoApi.getEjercicio(id);
  const response = await fetch(`${SERVER_URL}/getEjercicio/${id}`, { method: 'GET', credentials: 'include', mode: 'cors' });
  const ejercicios = await response.json();
  return ejercicios;
}

export async function getRooms(page, itemsPerPage, sortBy, search) {
  if (DEMO) return demoApi.getRooms(page, itemsPerPage, search);
  const response = await fetch(`${SERVER_URL}/getRooms?page=${page}
  &itemsPerPage=${itemsPerPage}
  &sortBy=${sortBy[0]?.key}
  &order=${sortBy[0]?.order}
  &search=${search}`,
    { method: 'GET', credentials: 'include', mode: 'cors' });
  const rooms = await response.json();
  return rooms;
}

export async function getExpEjer(datos) {
  if (DEMO) return demoApi.getExpEjer(datos);
  const response = await fetch(`${SERVER_URL}/getExpEjer`,
    {
      method: 'POST', headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
      credentials: 'include', mode: "cors"
    },);
  const experiencia = await response.json();
  console.log("Experiencia:", experiencia)
  return experiencia;
}
export async function comprobarRespuesta(respuesta, id) {
  if (DEMO) return demoApi.comprobarPregunta(id, respuesta);
  console.log("respuesta" + respuesta + "id" + id);
  console.log(respuesta);
  
  const response = await fetch(`${SERVER_URL}/comprobarPregunta/${id}`,
    {
      method: 'POST', headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(respuesta),
      credentials: 'include', mode: "cors"
    },);
  const correcto = await response.json();
  return correcto;

}

export async function updateExperienciaUsuario() {
  if (DEMO) return demoApi.totalExperiencia();
  const response = await fetch(`${SERVER_URL}/totalExperiencia`,
  { method: 'GET', credentials: 'include', mode: 'cors' });
  const datos = await response.json();
  return datos;
}

export async function GetTotalesEjercicios() {
  if (DEMO) return demoApi.getEjercicios();
  const response = await fetch(`${SERVER_URL}/getEjercicios`,
  { method: 'GET', credentials: 'include', mode: 'cors' });
  const datos = await response.json();
  return datos;
}

export async function GetResueltas(dato) {
  if (DEMO) return demoApi.getResueltas(dato);
  const response = await fetch(`${SERVER_URL}/getResueltas`,
    {
      method: 'POST', headers: {
        'Content-Type': 'application/json',
      }, body:JSON.stringify(dato), mode: 'cors', credentials: 'include'
    });
  const resueltas = await response.json();
  return resueltas;
}

export async function loginGoogle(usuario) {
  if (DEMO) return demoResponse(demoApi.loginGoogle(usuario));
  return fetch(`${SERVER_URL}/loginGoogle`,
    {
      method: 'POST',
      credentials: 'include', mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario)
    });

}
export async function login(usuario) {
  if (DEMO) return demoResponse(demoApi.login(usuario));
  return fetch(`${SERVER_URL}/login`,
    {
      method: 'POST',
      credentials: 'include', mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario)
    });

}

export async function registrarUsuari(infoUsuario) {
  if (DEMO) return demoApi.registrarUsuari(infoUsuario);
  const response = await fetch(`${SERVER_URL}/registrarUsuari`,
    {
      method: 'POST',
      credentials: 'include', mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(infoUsuario)
    });
  if (response.status === 200) {
    console.log('Registration successful!');
    const messages = await response.text()
    return { success: true, message: messages };
  } else {
    console.log('Registration failed.');
    const messages = await response.text()
    return { success: false, message: messages };
  }
}

export async function getLogin() {
  if (DEMO) return demoResponse(demoApi.getLogin());
  return fetch(`${SERVER_URL}/getLogin`, { method: 'GET', credentials: 'include', mode: 'cors' });
}
export async function getAvatar(imagen) {
  const resp = fetch(`${SERVER_URL}/imagen/${imagen}`, { method: 'GET', credentials: 'include', mode: 'cors' });
  console.log(resp);
  return resp;
}
export async function getAnswerImage(imagen) {
  try {
    const response = await fetch(`${SERVER_URL}/imagenPregunta/${imagen}`, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    });

    const imagen = await response.json();
    return imagen;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
}
export async function endSession() {
  if (DEMO) {
    demoApi.logout();
    return demoResponse('');
  }
  return fetch(`${SERVER_URL}/logout`, { method: 'GET', credentials: 'include', mode: 'cors' });
}

export async function getCategorias() {
  if (DEMO) return demoApi.getCategorias();
  const response = await fetch(`${SERVER_URL}/getCategorias`);
  const categorias = await response.json();
  return categorias;
}

export async function getEjerciciosByCat(nombre) {
  if (DEMO) return demoApi.getActivities(nombre);
  const response = await fetch(`${SERVER_URL}/getActivities/${nombre}`,
    {
      method: 'GET',
      credentials: 'include', mode: 'cors'
    })
  const actividades = await response.json();
  return actividades;
}

export async function getPreguntaRandom() {
  if (DEMO) return demoApi.getPreguntaRandom();
  const response = await fetch(`${SERVER_URL}/getPreguntaRandom`);
  const pregunta = await response.json();
  return pregunta;
}

export async function getPreguntaBatalla(ids) {
  if (DEMO) return demoApi.getPreguntaBatalla(ids);
  const response = await fetch(`${SERVER_URL}/getpreguntarandom2`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    body: JSON.stringify(ids),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const pregunta = await response.json();
  return pregunta;
}

export async function getBatallas() {
  if (DEMO) return demoApi.getBatallas();
  const response = await fetch(`${SERVER_URL}/getbatalla`, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    }
  })

  const pregunta = await response.json();
  return pregunta;
}

export async function historial() {
  if (DEMO) return demoApi.historial();
  const response = await fetch(`${SERVER_URL}/historial`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    }
  })

  const pregunta = await response.json();
  return pregunta;
}

export async function PostBatallas(datos) {
  if (DEMO) return { Estado: 'Todo bien' };
  const response = await fetch(`${SERVER_URL}/guardarbatalla`,
    {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      body: datos,
      headers: {
        'Content-Type': 'application/json',
      }
    })

}
export async function GetDatosPerfil(datos) {
  if (DEMO) return demoApi.datosPerfil(datos);
  const response = await fetch(`${SERVER_URL}/datosPerfil`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
    mode: 'cors',
    credentials: 'include',
  });
  const resueltas = await response.json();
  return resueltas;
}