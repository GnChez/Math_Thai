/**
 * Rellena la base MongoDB usada por Server/mongoDB.js (db: mathGameMongo).
 *
 * Ejecutar desde el directorio Server (para resolver el paquete mongodb):
 * npm run seed:mongo
 *
 * Variables opcionales:
 * MONGODB_URI (por defecto mongodb://127.0.0.1:27017)
 * MONGO_DB_NAME (por defecto mathGameMongo)
 */

require('dotenv').config();

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';

const dbName = process.env.MONGO_DB_NAME || 'mathGameMongo';

const themes =[
        {
            "id": 1,
            "nombre": "Números y operaciones"
        },
        {
            "id": 2,
            "nombre": "Ecuaciones"
        },
        {
            "id": 3,
            "nombre": "Funciones"
        },
        {
            "id": 4,
            "nombre": "Medidas"
        },
        {
            "id": 5,
            "nombre": "Geometría"
        },
        {
            "id": 6,
            "nombre": "Estadística"
        }
    
];

const questions = [{
  "id": 3,
  "pregunta": "Representa la función y = 3x + 2 en un gráfico",
  "correcta": {
    "tipo": "lineal",
    "m": 3,
    "b": 2
  },
  "idTema": "3",
  "formato": "Grafica"
},{
  "id": 1,
  "pregunta": "¿Cuál es el resultado de 5 + 3 * 2?",
  "respuestas": [
    {
      "respuesta": "11"
    },
    {
      "respuesta": "16"
    },
    {
      "respuesta": "13"
    },
    {
      "respuesta": "10"
    }
  ],
  "correcta": "11",
  "idTema": 1,
  "formato": "Seleccionar"
},{
  "id": 6,
  "pregunta": "¿Cuál es el resultado de 3^4 - 5 * (7 - 4)?",
  "respuestas": [
    {
      "respuesta": "58"
    },
    {
      "respuesta": "45"
    },
    {
      "respuesta": "33"
    },
    {
      "respuesta": "60"
    }
  ],
  "correcta": "58",
  "idTema": 1,
  "formato": "Seleccionar"
},{
  "id": 22,
  "pregunta": "Calcula el perímetro de un cuadrado con lado de longitud 10 unidades",
  "correcta": [
    "40 unidades",
    "40",
    "40 u"
  ],
  "idTema": 5,
  "formato": "Respuesta"
},{
  "id": 39,
  "pregunta": "Ordena los siguientes valores para obtener un resultado de 36.",
  "componentes": [
    "10",
    "*",
    "3",
    "/",
    "2"
  ],
  "correcta": [
    "10",
    "*",
    "3",
    "/",
    "2"
  ],
  "idTema": 2,
  "formato": "Ordenar valores"
},{
  "id": 2,
  "pregunta": "Resuelve la ecuación: 2x + 5 = 17",
  "correcta": [
    "6",
    "x=6"
  ],
  "idTema": 2,
  "formato": "Respuesta"
},{
  "id": 5,
  "pregunta": "Calcula el área de un triángulo con base de 6 unidades y altura de 8 unidades",
  "respuestas": [
    {
      "respuesta": "24 u²"
    },
    {
      "respuesta": "30 u²"
    },
    {
      "respuesta": "40 u²"
    },
    {
      "respuesta": "12 u²"
    }
  ],
  "correcta": "24 u²",
  "idTema": "5",
  "formato": "Seleccionar"
},{
  "id": 7,
  "pregunta": "Resuelve la ecuación: 4x - 7 = 25",
  "correcta": [
    "x = 8",
    "x=8",
    "x= 8",
    "x =8"
  ],
  "idTema": 2,
  "formato": "Respuesta"
},{
  "id": 8,
  "pregunta": "Dada la función y = -2x + 4, ¿cuál es el valor de y cuando x = -3?",
  "respuestas": [
    {
      "respuesta": "10"
    },
    {
      "respuesta": "8"
    },
    {
      "respuesta": "6"
    },
    {
      "respuesta": "12"
    }
  ],
  "correcta": "10",
  "idTema": 3,
  "formato": "Seleccionar"
},{
  "id": 11,
  "pregunta": "Ordena los siguientes valores para obtener un resultado de 18.",
  "componentes": [
    "20",
    "-",
    "4",
    "/",
    "2"
  ],
  "correcta": [
    "20",
    "-",
    "4",
    "/",
    "2"
  ],
  "idTema": 2,
  "formato": "Ordenar valores"
},{
  "id": 12,
  "pregunta": "Organiza los siguientes elementos para obtener un resultado de 24.",
  "componentes": [
    "4",
    "*",
    "3",
    "+",
    "12"
  ],
  "correcta": [
    "4",
    "*",
    "3",
    "+",
    "12"
  ],
  "idTema": 3,
  "formato": "Ordenar valores"
},{
  "id": 17,
  "pregunta": "2 5 5 7 9 10",
  "muestra": [
    [
      "Media",
      "5"
    ],
    [
      "Mediana",
      "6.33"
    ],
    [
      "Moda",
      "6"
    ]
  ],
  "idTema": 6,
  "formato": "Unir valores",
  "correcta": [
    [
      "Media",
      "6.33"
    ],
    [
      "Mediana",
      "6"
    ],
    [
      "Moda",
      "5"
    ]
  ]
},{
  "id": 18,
  "pregunta": "¿Cuál es la fórmula para calcular el volumen de una esfera?",
  "respuestas": [
    {
      "respuesta": "V = (4/3) * π * r³"
    },
    {
      "respuesta": "V = π * r³"
    },
    {
      "respuesta": "V = 2 * π * r³"
    },
    {
      "respuesta": "V = (4/3) * π * r²"
    }
  ],
  "correcta": "V = (4/3) * π * r³",
  "idTema": 5,
  "formato": "Seleccionar"
},{
    "id": 19,
  "pregunta": "¿Cuál es el resultado de (7 - 3) * (4 + 2)?",
  "respuestas": [
    {
      "respuesta": "24"
    },
    {
      "respuesta": "18"
    },
    {
      "respuesta": "28"
    },
    {
      "respuesta": "30"
    }
  ],
  "correcta": "24",
  "idTema": 1,
  "formato": "Seleccionar"
},{
  "id": 20,
  "pregunta": "Resuelve la ecuación: 3(x - 2) = 15",
  "correcta": [
    "x=7",
    "7"
  ],
  "idTema": 2,
  "formato": "Respuesta"
},{
  "id": 23,
  "pregunta": "¿Cómo se llaman los triángulos de diferentes ángulos?",
  "correcta": [
    "escaleno"
  ],
  "idTema": 5,
  "formato": "Respuesta"
},{
  "id": 24,
  "pregunta": "¿Cuál de los siguientes triángulos es isósceles?",
  "respuestas": [
    {
      "respuesta": "Escaleno",
      "imagen": "images/Escaleno.jpg"
    },
    {
      "respuesta": "Isósceles",
      "imagen": "images/isosceles.jpg"
    },
    {
      "respuesta": "Equilatero",
      "imagen": "images/equilatero.jpg"
    },
    {
      "respuesta": "Trapecio",
      "imagen": "images/trapecio.jpg"
    }
  ],
  "correcta": "Isósceles",
  "idTema": 5,
  "formato": "Imagen"
},{
  "id": 27,
  "pregunta": "Escribe la fórmula para calcular el área de un círculo.",
  "respuestas": [
    {
      "respuesta": "A = π * r²"
    },
    {
      "respuesta": "A = π * d"
    },
    {
      "respuesta": "A = 2 * π * r"
    },
    {
      "respuesta": "A = π * (r + d)"
    }
  ],
  "correcta": "A = π * r²",
  "idTema": 5,
  "formato": "Seleccionar"
},{
  "id": 32,
  "pregunta": "Resuelve la siguiente operación: (8 + 5) * 3 - 7",
  "respuestas": [
    {
      "respuesta": "32"
    },
    {
      "respuesta": "42"
    },
    {
      "respuesta": "26"
    },
    {
      "respuesta": "48"
    }
  ],
  "correcta": "32",
  "idTema": 1,
  "formato": "Seleccionar"
},{
  "id": 4,
  "pregunta": "Convierte a metros las siguientes unidades",
  "muestra": [
    [
      "50 kilómetros",
      "0.005 metros"
    ],
    [
      "5 decimetros",
      "50000 metros"
    ],
    [
      "5 milímetros",
      "0.5 metros"
    ],
    [
      "50 hectómetros",
      "5000 metros"
    ]
  ],
  "idTema": "4",
  "formato": "Unir valores",
  "correcta": [
    [
      "50 kilómetros",
      "50000 metros"
    ],
    [
      "5 decimetros",
      "0.5 metros"
    ],
    [
      "50 hectómetros",
      "5000 metros"
    ],
    [
      "5 milímetros",
      "0.005 metros"
    ]
  ]
},{
  "id": 21,
  "pregunta": "Dada la función y = -2x + 4, ¿cuál es el valor de y cuando x = -3?",
  "respuestas": [
    {
      "respuesta": "10"
    },
    {
      "respuesta": "8"
    },
    {
      "respuesta": "6"
    },
    {
      "respuesta": "12"
    }
  ],
  "correcta": "10",
  "idTema": 3,
  "formato": "Seleccionar"
},{
  "id": 26,
  "pregunta": "¿Con qué letra se representa el conjunto de números naturales?",
  "respuestas": [
    {
      "respuesta": "R"
    },
    {
      "respuesta": "Q"
    },
    {
      "respuesta": "Z"
    },
    {
      "respuesta": "N"
    }
  ],
  "correcta": "N",
  "idTema": 1,
  "formato": "Seleccionar"
},{
  "id": 28,
  "pregunta": "¿Cuál es la relación entre una fracción y un número decimal?",
  "respuestas": [
    {
      "respuesta": "Una fracción siempre es mayor que un número decimal."
    },
    {
      "respuesta": "Un número decimal siempre es mayor que una fracción."
    },
    {
      "respuesta": "Una fracción y un número decimal pueden ser equivalentes."
    },
    {
      "respuesta": "Una fracción y un número decimal son siempre iguales."
    }
  ],
  "correcta": "Una fracción y un número decimal pueden ser equivalentes.",
  "idTema": 1,
  "formato": "Seleccionar"
},{
  "id": 29,
  "pregunta": "Resuelve la ecuación: 3x + 7 = 22",
  "correcta": [
    "x = 5",
    "x= 5",
    "x =5",
    "x=5"
  ],
  "idTema": 2,
  "formato": "Respuesta"
},{
  "id": 30,
  "pregunta": "Representa la función y = 2x + 1 en un gráfico.",
  "correcta": {
    "tipo": "lineal",
    "m": 2,
    "b": 1
  },
  "idTema": "3",
  "formato": "Grafica"
},{
  "id": 31,
  "pregunta": "¿Cuántos grados tiene un ángulo llano?",
  "respuestas": [
    {
      "respuesta": "180°"
    },
    {
      "respuesta": "90°"
    },
    {
      "respuesta": "360°"
    },
    {
      "respuesta": "45°"
    }
  ],
  "correcta": "180°",
  "idTema": 5,
  "formato": "Seleccionar"
},{
  "id": 33,
  "pregunta": "Calcula el valor de 'x' en la ecuación: 4x - 10 = 26",
  "correcta": [
    "x=9",
    "9"
  ],
  "idTema": 2,
  "formato": "Respuesta"
},{
  "id": 36,
  "pregunta": "Cuál es el área de un círculo con radio de 5 unidades",
  "respuestas": [
    {
      "respuesta": "25π u²"
    },
    {
      "respuesta": "100 u²"
    },
    {
      "respuesta": "15π u²"
    },
    {
      "respuesta": "20 u²"
    }
  ],
  "correcta": "25π u²",
  "idTema": 5,
  "formato": "Seleccionar"
},{
  "id": 16,
  "pregunta": "Empareja con el valor de conversión correcto",
  "muestra": [
    [
      "2000 gramos",
      "1000 miligramo"
    ],
    [
      "250 gramos",
      "1.5 kilogramos"
    ],
    [
      "1500 gramos",
      "2 kilogramos"
    ],
    [
      "1 gramo",
      "0.25 kilogramos"
    ]
  ],
  "idTema": "4",
  "formato": "Unir valores",
  "correcta": [
    [
      "2000 gramos",
      "2 kilogramos"
    ],
    [
      "250 gramos",
      "0.25 kilogramos"
    ],
    [
      "1500 gramos",
      "1.5 kilogramos"
    ],
    [
      "1 gramo",
      "1000 miligramo"
    ]
  ]
},{
  "id": 25,
  "pregunta": "Alberto, Benjamín y Carlota hicieron un total de 20 sándwiches. Benjamín hizo 3 veces más que Alberto, y Carlota hizo el doble que Benjamín. ¿Cuántos sándwiches hizo Alberto?",
  "respuestas": [
    {
      "respuesta": "4"
    },
    {
      "respuesta": "2"
    },
    {
      "respuesta": "5"
    },
    {
      "respuesta": "6"
    }
  ],
  "correcta": "2",
  "idTema": 1,
  "formato": "Seleccionar"
},{
  "id": 34,
  "pregunta": "¿Qué figura geométrica es un octógono?",
  "respuestas": [
    {
      "respuesta": "Pentagon",
      "imagen": "images/Pentagon.jpg"
    },
    {
      "respuesta": "Hexagon",
      "imagen": "images/Hexagon.jpg"
    },
    {
      "respuesta": "Octógono",
      "imagen": "images/Octagon.jpg"
    },
    {
      "respuesta": "Triangle",
      "imagen": "images/Triangle.jpg"
    }
  ],
  "correcta": "Octógono",
  "idTema": 5,
  "formato": "Imagen"
},{
  "id": 35,
  "pregunta": "Convierte a kilómetros las siguientes unidades:",
  "muestra": [
    [
      "3500 metros",
      "0.8 kilómetros"
    ],
    [
      "25 decámetros",
      "3.5 kilómetros"
    ],
    [
      "120 hectómetros",
      "12 kilómetros"
    ],
    [
      "800 milímetros",
      "0.25 kilómetros"
    ]
  ],
  "idTema": 4,
  "formato": "Unir valores",
  "correcta": [
    [
      "3500 metros",
      "3.5 kilómetros"
    ],
    [
      "25 decámetros",
      "0.25 kilómetros"
    ],
    [
      "120 hectómetros",
      "12 kilómetros"
    ],
    [
      "800 milímetros",
      "0.8 kilómetros"
    ]
  ]
},{
  "id": 37,
  "pregunta": "Resuelve la ecuación: 2(x + 3) = 20",
  "correcta": [
    "7",
    "x=7"
  ],
  "idTema": 2,
  "formato": "Respuesta"
},{
  "id": 38,
  "pregunta": "¿Cuál es el área de un cuadrado con lado de longitud 12 unidades?",
  "correcta": [
    "144 unidades cuadradas",
    "144",
    "144u",
    "144u2",
    "144u^2"
  ],
  "idTema": 5,
  "formato": "Respuesta"
}]

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
    nombre: "Ordre d'operacions",
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
