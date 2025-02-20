const express = require('express');
const http = require('http')
const bodyParser = require('body-parser');
const cors = require("cors");
const fs = require('fs');
require('dotenv').config();
const path = require('path');
const cookieParser = require('cookie-parser');
const mysqlConnection = require('./mySQL.js');
const { v4: uuidv4 } = require('uuid');
const { spawn } = require('child_process');
const https = require('https');
const corsOptions = {
    origin: ["http://localhost:3000", "https://math-thai.dam.inspedralbes.cat"],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE'],
    exposedHeaders: ['set-cookie', 'ajax-redirect'],
    preflightContinue: true,
    optionsSuccessStatus: 200,
};
const app = express();
const server = https.createServer({cert: fs.readFileSync('cert.crt'),key: fs.readFileSync('key.key')},app);
const port = process.env.PORT || 3450;
const SERVER_URL = process.env.SERVER || "http://localhost"; //"https://math-thai.dam.inspedralbes.cat"

const { getDocument, getCategorias, getPreguntas, getPregunta, insertInCollection, findRegisteredResult, findRegisteredResults, findRegisteredHistory, updateCollection, findRegisteredBattles, getActivities, getPreguntaRandom } = require("./mongoDB.js");
const { requireLogin, shuffleArray, checkQuestion, generarPassword, obtenerFechaYHoraActual } = require("./utils.js");
const { initializeSocket, filterRooms, getIo } = require("./socket.js");
initializeSocket(server, { cors: corsOptions });
const sessionMiddleware = require('./sessionMiddleware.js');

app.use(cors(corsOptions));
app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(cookieParser("mySecretKey"));
app.use(express.json())


server.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});

app.get('/getPreguntaRandom', async (req, res) => {
    try {
        const pregunta = (await getPreguntaRandom())[0];
        if (pregunta.muestra) {
            shuffleArray(pregunta.muestra);
        }
        if (pregunta.componentes) {
            shuffleArray(pregunta.componentes);
        }
        if (pregunta.respuestas) {
            shuffleArray(pregunta.respuestas);
        }
        delete pregunta.correcta;
        res.json(pregunta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/getRooms', (req, res) => {
    var page = req.query.page || 1;
    var itemsPerPage = req.query.itemsPerPage || 10;
    var sortBy = req.query.sortBy.replace(/\s/g, "") || "";
    var order = req.query.order.replace(/\s/g, "") || "";
    var search = req.query.search.replace(/\s/g, "") || "";

    roomsFilter = filterRooms(search, sortBy, order);

    var roomsToSend = roomsFilter.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    var response = {
        rooms: roomsToSend,
        totalRooms: roomsFilter.length
    }
    res.json(response);
});
app.get('/getEjercicio/:id', (req, res) => {
    let id = parseInt(req.params.id)
    //console.log("Inside Call:", id)
    getDocument(id).then((document) => {
        //console.log("Inside Call:", document)
        getPreguntas(document.preguntas).then((preguntas) => {
            var ejercicio = {
                "id": document.id,
                "nombre": document.nombre,
                "tipo": document.tipo,
                "preguntas": []
            }
            for (var i = 0; i < preguntas.length; i++) {

                if (preguntas[i].muestra) {
                    shuffleArray(preguntas[i].muestra);
                }
                if (preguntas[i].componentes) {
                    shuffleArray(preguntas[i].componentes);
                }
                if (preguntas[i].respuestas) {
                    shuffleArray(preguntas[i].respuestas);
                }

                // Remove ejercicio.preguntas[i].correcta
                delete preguntas[i].correcta;

                ejercicio.preguntas.push(preguntas[i]);
            }
            //console.log(ejercicio);

            res.json(ejercicio);
        });

    });



});
app.get('/totalExperiencia', requireLogin, async (req, res) => {
    let xp = 0
    let user = req.session.user

    try {
        let questionsResults = await findRegisteredResults(parseInt(user.id))
        questionResults = questionsResults.filter(element => element.correcta === true);
        let questionsBattles = await findRegisteredBattles(user.email);

        const promises = questionsResults.map(async visual => {
            const idPregunta = visual.idPregunta
            const document = await getPregunta(idPregunta);
            xp += document.experiencia;
        });

        await Promise.all(promises);
        //console.log(xp);
        questionsBattles.forEach(element => {
            if(element.experiencia)
                xp += element.experiencia;
        });
        //console.log("Experiencia: ", xp)
        mysqlConnection.getLevelData(xp, (nivelDatos) => {
            //console.log("User ID:", user.id)
            mysqlConnection.updateLevelData(user.id, nivelDatos.currentLevel.lvl, (successMessage) => {
                const datos = { experiencia: xp, nivel: nivelDatos.currentLevel.lvl, vida: nivelDatos.currentLevel.health, experienciaRestante: nivelDatos.nextLevelRequiredXP }
                res.json(datos);
            })

        })

    } catch (error) {
        console.error(error);
    }
})
app.get('/getCategorias', async (req, res) => {
    let categorias = await getCategorias();
    res.json(categorias)
})

app.get('/getActivities/:tema', async (req, res) => {
    let tema = (req.params.tema).toString();
    //console.log(tema)
    ejercicios = await getActivities(tema)
    //console.log(ejercicios)
    res.json(ejercicios);
})

app.get("/imagen/:nombreArchivo", (req, res) => {
    const fileName = req.params.nombreArchivo;
    const filePath = path.join(__dirname, 'avatars', fileName);

    res.sendFile(filePath);
});

const multer = require('multer');
const { to } = require('mathjs');
const upload = multer({ dest: 'avatars/' });

app.post('/descargar', requireLogin, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Por favor, selecciona una imagen.' });
    }

    const uploadedFile = req.file;

    // Hacer lo que necesites con el archivo cargado, como moverlo a un directorio específico.
    const fileName = uploadedFile.originalname;
    const uniqueFileName = uuidv4() + path.extname(fileName); // Añade la extensión original

    // Ruta de destino para guardar el archivo
    const uploadPath = path.join(__dirname, 'avatars', uniqueFileName + ".jpg");
    // Mover el archivo a la ubicación deseada
    fs.rename(uploadedFile.path, uploadPath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al subir el archivo.' });
        }

        mysqlConnection.UpdateImage([uniqueFileName + '.jpg', req.session.user.id], (successMessage) => { console.log(successMessage); })
        req.session.user.image = SERVER_URL + ":" + port + "/imagen/" + uniqueFileName + ".jpg";
        res.json({ imagen: SERVER_URL + ":" + port + "/imagen/" + uniqueFileName + ".jpg" });
    });
});

app.get("/imagenPregunta/:nombreArchivo", (req, res) => {
    const nombreArchivo = req.params.nombreArchivo;
    const rutaImagen = path.join(__dirname, "image_preguntas", nombreArchivo);
    //console.log(rutaImagen);
    res.sendFile(rutaImagen);
})

//Coger ejercicios respondidos
app.post('/getResueltas', requireLogin, async (req, res) => {
    let idUsuario = req.session.user.id
    let idEjercicio = req.body.ejercicioid
    let result;
    if (idEjercicio == null) {
        result = await findRegisteredResults(idUsuario);
        //console.log(idUsuario, " sin ejercicio");
    } else {
        result = await findRegisteredResults(idUsuario, idEjercicio);
        //console.log(idUsuario, idEjercicio);
    }
    res.json(result);
})
app.post('/getExpEjer', requireLogin, async (req, res) => {
    try {
        let idUsuario = req.session.user.id
        let idEjercicio = req.body.ejercicioid;
        let xp = 0;
        let result;
        if (idEjercicio == null) {
            result = await findRegisteredResults(idUsuario);
        } else {
            result = await findRegisteredResults(idUsuario, idEjercicio);
        }
        const ejercicios = result.filter(element => element.correcta === true);

        const promises = ejercicios.map(async visual => {
            const document = await getPregunta(visual.idPregunta);
            xp += document.experiencia;
        });


        await Promise.all(promises);
        const exp = {
            xp: xp
        };

        res.json(exp);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la experiencia.' });
    }
});

app.get('/getbatalla', requireLogin, async (req, res) => {
    findRegisteredBattles(req.session.user.email).then((result) => {
        res.json(result)
    })
})
//Comprobar si pregunta respondida es correcta o no
app.post('/comprobarPregunta/:id', requireLogin, async (req, res) => {
    try {
        //console.log(req.body);
        //console.log(req.session);
        let idUser = req.session.user.id;
        respuesta = req.body.respuesta;
        let correcto = false;
        let preguntaid = 0;
        let pregunta = await getPregunta(parseInt(req.params.id));

        //console.log("Formato recibido: ", pregunta.formato);
        preguntaid = pregunta.id;
        correcto = checkQuestion(pregunta, respuesta);

        findRegisteredResult(idUser, req.body.ejercicioid, preguntaid).then((result) => {
            if (result != null) {
                if (!result.correcta && correcto) {
                    updateCollection(
                        { "idUsuario": idUser, "idPregunta": preguntaid, "idEjercicio": req.body.ejercicioid }, // Filtro para encontrar el usuario por su ID
                        {
                            "$set": {
                                "correcta": correcto,
                                "respuesta": req.body.respuesta,
                                "time": obtenerFechaYHoraActual()
                            }
                        }, 'result')
                }
            } else {
                insertInCollection({ "idUsuario": idUser, "idPregunta": preguntaid, "idEjercicio": req.body.ejercicioid, "respuesta": req.body.respuesta, "correcta": correcto, "time": obtenerFechaYHoraActual() }, 'result')
            }
        })
        insertInCollection({ "idUsuario": idUser, "idPregunta": preguntaid, "idEjercicio": req.body.ejercicioid, "respuesta": req.body.respuesta, "correcta": correcto, "time": obtenerFechaYHoraActual() }, 'history')
        res.json({ "correct": correcto });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post('/guardadobatalla', (req, res) => {
    let batalla = req.body //nombre - ganador - tamaño - exp
    try {
        insertInCollection({ "battle": batalla.name, "winners": batalla.winner, "matchsize": batalla.size, "xp": batalla.xp, time: obtenerFechaYHoraActual() }, 'Battles')
        res.json({ Estado: 'Todo bien' })
    } catch (err) {
        res.status(500).json({ Estado: err.message });
    }
})





//------------------------------LOGIN SECTION----------------------------------//


app.get('/getLogin', (req, res) => {

    if (req.session.user?.email) {
        res.json(req.session.user);
    } else {
        usuariIndividual = { email: "" };
        res.json(usuariIndividual);
    }
});

//LOGIN VUE
app.post('/login', async (req, res) => {
    try {
        //console.log("Login:id-session", req.session.id);

        req.session.user = {};
        const login = req.body;
        let usuariIndividual = {};
        let comprovacio = false;

        mysqlConnection.SelectUsers((usuaris) => {
            usuaris.forEach(usuari => {
                if (usuari.email == login.email) {
                    if (usuari.contrasena != login.contrasena || login.contrasena == '') {
                        //console.log("Usuari o contrasenya incorrectes");
                        //console.log("Contraseña Incorrecta: ", login.contrasena)
                        usuariIndividual = { email: "" };
                    } else {
                        usuariIndividual = {
                            sessionId: req.session.id,
                            id: usuari.id,
                            name: usuari.name,
                            contrasena: usuari.contrasena,
                            surname: usuari.surname,
                            email: usuari.email,
                            rank: usuari.rank,
                            lvl: usuari.lvl,
                            image: `${SERVER_URL}:${port}/imagen/${usuari.image}`,
                            id_classroom: usuari.id_classroom,
                            classroom_code: usuari.id_classroom_code
                        };
                        req.session.user = usuariIndividual;
                        comprovacio = true;
                        //console.log("login", usuariIndividual);
                        res.json(usuariIndividual);
                        return; // Exit the loop if user found
                    }
                }
            });

            if (!comprovacio) {
                usuariIndividual = { email: "" };
                res.json(usuariIndividual);
            }
        })
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Login fallido");
    }
});

app.post('/loginGoogle', async (req, res) => {
    try {
        //console.log("Login:id-session", req.session.id);

        req.session.user = {};
        const login = req.body;
        let usuariIndividual = {};
        let comprovacio = false;
        mysqlConnection.SelectUsers((usuaris) => {
            usuaris.forEach(usuari => {
                if (usuari.email == login.email) {
                    if (usuari.contrasena != login.contrasena) {
                        //console.log("Usuari o contrasenya incorrectes");
                        //console.log("Contraseña Incorrecta: ", login.contrasena)
                        usuariIndividual = { email: "" };
                    } else {
                        usuariIndividual = {
                            sessionId: req.session.id,
                            id: usuari.id,
                            name: usuari.name,
                            contrasena: usuari.contrasena,
                            surname: usuari.surname,
                            email: usuari.email,
                            rank: usuari.rank,
                            lvl: usuari.lvl,
                            image: login.image,
                            id_classroom: usuari.id_classroom,
                            classroom_code: usuari.id_classroom_code
                        };
                        req.session.user = usuariIndividual;
                        comprovacio = true;
                        //console.log("login", usuariIndividual);
                        res.json(usuariIndividual);
                        return; // Exit the loop if user found
                    }
                }
            });

            if (!comprovacio) {
                usuariIndividual = { email: "" };
                res.json(usuariIndividual);
            }
        })
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Login fallido");
    }
});

//LOGIN ANDROID
app.post('/loginprofesor', async (req, res) => {
    try {
        //console.log("Login:id-session", req.session.id);

        req.session.user = {};
        const login = req.body;
        let usuariIndividual = {};
        let comprovacio = false;

        mysqlConnection.SelectProfessors((profesors) => {
            profesors.forEach(profesor => {
                //console.log(profesor.email);
                //console.log(login.email);
                //console.log(profesor.contrasena);
                //console.log(login.contrasena);
                if (profesor.email == login.email) {
                    if (profesor.contrasena != login.contrasena) {
                        console.log("Usuari o contrasenya incorrectes");
                        usuariIndividual = { email: "" };
                    } else {
                        usuariIndividual = {
                            sessionId: req.session.id,
                            id: profesor.id,
                            name: profesor.name,
                            surname: profesor.surname,
                            email: profesor.email,
                            image: profesor.image,
                            contrasena: profesor.contrasena
                        };
                        req.session.user = usuariIndividual;
                        comprovacio = true;
                        console.log("login", usuariIndividual);
                        res.json(usuariIndividual);
                        return; // Exit the loop if user found
                    }
                }
            });

            if (!comprovacio) {
                usuariIndividual = { email: "" };
                res.json(usuariIndividual);
            }
        })
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Login fallido");
    }
});
app.get('/logout', (req, res) => {
    const sessionId = req.session.id;
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar la sesión:', err);
            res.status(500).json({ message: 'Error al cerrar la sesión' });
        } else {
            //console.log("Sesión cerrada");
            getIo().in(sessionId).disconnectSockets();

            res.clearCookie('connect.sid'); // Elimina la cookie de sesión
            res.status(200).send();
        }
    });
});

//REGISTER USER
app.post('/registrarUsuari', (req, res) => {
    usuariDades = req.body; // Assuming req.body contains user data
    let comprovacio = true;

    mysqlConnection.SelectEmails((emails) => {
        emails.forEach(email => {
            if (email.email === usuariDades.email) {
                //console.log("Aquest mail ja està en ús");
                comprovacio = false;
            }
        });

        if (comprovacio) {
            mysqlConnection.InsertUser([usuariDades.name, usuariDades.surname, usuariDades.email, usuariDades.contrasena], ((result) => { res.send(result) }));
        } else {
            res.status(409).send("Mail en uso");
        }
    })
});

//UPDATE USER
app.post('/actualitzarUsuari', requireLogin, (req, res) => {
    dades = (req.body)
    comprovacio = true
    mysqlConnection.UpdateUser([dades.name, dades.surname, dades.email, dades.userId], (successMessage) => {
        //console.log("Operación completada:", successMessage);
        req.session.user.name = dades.name;
        req.session.user.surname = dades.surname;
        req.session.user.email = dades.email;
        //console.log("Usuario actualizado correctamente: ", result)
        res.status(200).send("Registro exitoso");
    })
        .catch(error => {
            console.error("Error:", error);
            res.status(500).send("Error en el registro");
        });

    res.status(200).send()
})

//CREAR AULA
app.post('/crearAula', requireLogin, (req, res) => {
    aulaDades = req.body;
    //let contrasena = "shu351";
    codesAulas = [];
    let contrasena = generarPassword(6).toLocaleUpperCase();
    //console.log("Acces_code de Aula Creado: " + contrasena);
    //console.log("Id del profesor: " + req.session.user);

    mysqlConnection.SelectAccesCode((codes) => {

        codes.forEach(code => {
            codesAulas.push(code)
        })
        //console.log(codesAulas)
    })

    if (codesAulas.includes(contrasena)) {
        res.send(res)
    }
    else {
        mysqlConnection.InsertAula([req.session.user.id, aulaDades.name, contrasena], ((result) => {
            res.send(result)

        }));
    }


});

//GET AULAS
app.get('/getAulas', (req, res) => {
    mysqlConnection.SelectClassrooms(req.session.user.id, (aulas) => {
        aulasEnviar = []
        aulas.forEach(aula => {
            aulaIndividual = { id: aula.id, name: aula.name, access_code: aula.access_code }
            aulasEnviar.push(aulaIndividual)
        })

        res.json(aulasEnviar)
    })

});

app.get('/getAulaById/:id', (req, res) => {
    const id = parseInt(req.params.id)
    //console.log("Código de Acceso en Server: ", id)
    mysqlConnection.SelectClassroomId(id, (results) => {
        //console.log("Resultados en Server: ", results)
        if (!results) {
            res.json(null);
        } else {
            if (results.length > 0) {
                res.json(results);
            } else {
                res.json(null);
            }
        }
    });
})

app.get('/getAula/:classroom', (req, res) => {
    const classroomId = req.params.classroom.toUpperCase()
    //console.log("Código de Acceso en Server: ", classroomId)
    mysqlConnection.SelectClassroom(classroomId, (results) => {
        //console.log("Resultados en Server: ", results)
        if (results.length > 0) {
            res.json(results);
        } else {
            res.json(null);
        }
    });
})

//JOIN AULA
app.post('/joinAula', (req, res) => {
    //console.log("Body content: ", req.body)
    const aula = req.body;
    const id_classroom = aula.id;
    //console.log("ID CLASS: ", id_classroom)
    const id = req.session.user.id;
    //console.log("Id del usuario: " + req.session.user.id);
    mysqlConnection.UpdateUserClassroom([id_classroom, id], (successMessage) => {
        //console.log("Operación completada:", successMessage);
        req.session.user.id_classroom = id_classroom;
        req.session.user.classroom_code = aula.access_code;
        res.status(200).send("Registro exitoso");
    })
});


//GET USUARIOS
app.get('/consultarUsuaris', async (req, res) => {
    try {
        const usuaris = await new Promise((resolve, reject) => {
            if (req.query.id) {
                mysqlConnection.SelectUsersByAula(req.query.id, (usuaris) => {
                    resolve(usuaris);
                });
            } else {
                mysqlConnection.SelectUsers((usuaris) => {
                    resolve(usuaris);
                });
            }
        });

        const usuarisEnviar = usuaris.map(usuari => {
            return {
                id: usuari.id,
                name: usuari.name,
                contrasena: usuari.contrasena,
                surname: usuari.surname,
                email: usuari.email,
                rank: usuari.rank,
                lvl: usuari.lvl,
                image: usuari.image
                //image: `${SERVER_URL}:${port}/imagen/${usuari.image}`
            };
        });

        res.json(usuarisEnviar);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Hubo un error al procesar la solicitud' });
    }
});

//GET USUARIO POR ID
app.get('/consultarUsuariPerId/:id', async (req, res) => {
    try {
        //console.log(req.params.id);        
        const usuari = await new Promise((resolve, reject) => {
            mysqlConnection.SelectUserById(req.params.id, (usuari) => {
                resolve(usuari[0]);
            });
        });


        let usuariEnviar = {
            id: usuari.id,
            name: usuari.name,
            contrasena: usuari.contrasena,
            surname: usuari.surname,
            email: usuari.email,
            rank: usuari.rank,
            lvl: usuari.lvl,
            image: usuari.image,
            //image: `${SERVER_URL}:${port}/imagen/${usuari.image}`
            id_classroom: usuari.id_classroom,
            nom_aula: usuari.nomaula
        }

        res.json(usuariEnviar);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Hubo un error al procesar la solicitud' });
    }
});

//Quitar alumno de un aula por su id
app.get('/quitarAlumnoAula/:id', async (req, res) => {
    try {
        //console.log(req.params.id);        
        const resposta = await new Promise((resolve, reject) => {
            mysqlConnection.RemoveUserFromClassroom(req.params.id, (callback) => {
                resolve(callback);
            });
        });


        res.json(resposta);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Hubo un error al procesar la solicitud' });
    }
});

//Restablecer constraseña
app.post('/restablecerConstrasenya', requireLogin, async (req, res) => {
    try {
        //console.log(req.body);
        if (req.session.user.contrasena == req.body.contrasenyaAntigua) {
            const resposta = await new Promise((resolve, reject) => {
                mysqlConnection.UpdatePassword([req.body.contrasenyaNueva, req.session.user.id], (callback) => {
                    resolve(callback);
                });
            });
            req.session.user.contrasena = req.body.contrasenyaNueva;
            //console.log("login contrasenya cambiada", req.session.user);
            res.json(resposta); // Envía la respuesta si la comparación de contraseñas es correcta   funcio

        } else {
            res.status(500).json({ error: 'La contraseña antigua no coincide' });
        }

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Hubo un error al procesar la solicitud' });
    }
});

//Get Datos perfil
app.post('/datosPerfil', (req, res) => {
    //console.log("Body content: ", req.body)
    const aula = req.body;
    const id_classroom = aula.idA;
    const id_prof = aula.idP;
    mysqlConnection.SelectProfTotal(id_classroom, id_prof, (successMessage) => {
        res.json(successMessage);
    })
});
app.post('/historial', requireLogin, async (req, res) => {
    try {
        let result3 = []//await getBatallas();
        let result4 = []//await GetResueltas({ ejercicioid: null });
        let historial = [];
        if (req.body.email == null) {
            await findRegisteredBattles(req.session.user.email).then((result) => {
                result3 = result
            })
        } else {
            await findRegisteredBattles(req.body.email).then((result) => {
                result3 = result
            })
        }
        let idUsuario = req.session.user.id
        let idEjercicio = req.body.ejercicioid
        if (req.body.id != null) {
            result4 = await findRegisteredHistory(req.body.id);
        } else if (idEjercicio == null) {
            result4 = await findRegisteredHistory(idUsuario);
        } else {
            result4 = await findRegisteredHistory(idUsuario, idEjercicio);
        }
        let batalla = result3

        Promise.all(result4.map(async (ejercicio) => {
            let resultado = null
            let result = await getDocument(ejercicio.idEjercicio).then((document) => {
                resultado = document.nombre
            });
            let resultadoEjercicio = '';
            if (ejercicio.correcta) {
                resultadoEjercicio = 'bé';
            } else {
                resultadoEjercicio = 'malament';
            }
            historial.push("Has resolt " + resultadoEjercicio + " l'activitat " + ejercicio.idPregunta + " de l'exercici " + resultado + " &el& " + ejercicio.time);
        })).then(() => {
            // Ordenar el historial por fecha en orden descendente
            batalla.forEach(element => {
                let resultadoBatalla = ''
                if (element.ganador === 1) {
                    // Verificar si el email está en el equipo1
                    const equipo1 = element.equipo1.find(member => member.email === req.session.user.email);
                    resultadoBatalla = equipo1 ? "guanyat" : "perdut";
                } else if (element.ganador === 2) {
                    // Verificar si el email está en el equipo2
                    const equipo2 = element.equipo2.find(member => member.email === req.session.user.email);
                    resultadoBatalla = equipo2 ? "guanyat" : "perdut";
                }
                historial.push("Has " + resultadoBatalla + " la batalla " + element.battle + " &el& " + element.time)
            });
        }).then(() => {
            historial.sort((a, b) => {
                const tiempoA = new Date(a.match(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}/));
                const tiempoB = new Date(b.match(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}/));
                return tiempoB - tiempoA;
            });
        }).then(() => {
            let history = historial.map((element) => {
                recorte = element.split(" &el& ");
                return {
                    "historial": recorte[0],
                    "hora": recorte[1]
                }
            })
            res.send(history);
        })
    } catch (error) {
        console.error(error);
    }
});

app.post("/getpreguntarandom2", (req, res) => {
    const functionName = req.body.nums;
    const ran = Math.floor(Math.random() * functionName.length)
    //console.log(functionName[ran]);
    const pythonProcess = spawn('python', ['ejercicios.py', functionName[ran]]);

    let result = [];

    pythonProcess.stdout.on('data', (data) => {
        result.push(data.toString())
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error al ejecutar el script de Python: ${data.toString()}`);
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            try {
                const parsedResult = JSON.parse(result[0]);
                res.json(parsedResult);
            } catch (error) {
                console.error('Error al analizar el resultado JSON:', error);
                res.status(500).send('Error interno del servidor');
            }
        } else {
            console.error(`La ejecución de Python terminó con código de salida ${code}`);
            res.status(500).send('Error interno del servidor');
        }
    });
});

//idPregunta: 1, respuesta: "1111"
app.post('/pregunta', async (req, res) => {
    var pregunta = await getPregunta(req.body.idPregunta);
    res.json(pregunta);
});

app.get('/getEjercicios',(req,res)=>{
    var totales = getPreguntas().then((preguntas)=>{        
        res.json(preguntas);
    });
})



