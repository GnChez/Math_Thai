const user = "a22osczapmar";
const password = "Nitrome7.";
module.exports = { getDocument, getPreguntas, getPregunta, insertInCollection, findRegisteredResult, updateCollection, findRegisteredHistory, findRegisteredResults, getCategorias, getActivities, findRegisteredBattles, getPreguntaRandom };
const { MongoClient } = require("mongodb");

// Replace the following with your Atlas connection string                                                                                                                                        
const url = `mongodb+srv://goshalizard:RQaLbnDK0BTAKDhg@cluster0.a7ta7.mongodb.net/`;

// Database Name
const dbName = 'mathGameMongo';

// Create a new MongoClient
const client = new MongoClient(url);
// Connect to the Atlas cluster
client.connect();

async function getDocument(id) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("activity");
        // Find and return the document
        const filter = { "id": id };
        //console.log("Inside Mongo Method:", id)
        const document = await col.findOne(filter);
        //console.log("Inside Mongo Method:", document)
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}

async function getActivities(theme) {
    try {
        console.log("Tema a Buscar en Mongo: ", theme)
        await client.connect();
        const db = client.db(dbName);
        const colA = db.collection("activity");
        const colT = db.collection('theme');
        const filter = { "nombre": theme };
        const idTema = await colT.findOne(filter)
        console.log("ID TEMA: ", idTema)
        const resultadoEncontrado = await colA.find({ "id_tema": parseInt(idTema.id) }).toArray();

        console.log("Resultado Encontrado: ", resultadoEncontrado);

        return resultadoEncontrado;
    } catch (err) {
        console.log(err.stack);
        return null;
    }
}
async function getCategorias() {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("theme");
        const resultadoEncontrado = await col.find({}).toArray();

        console.log(resultadoEncontrado);

        return resultadoEncontrado;
    } catch (err) {
        console.log(err.stack);
        return null;
    }
}
async function findRegisteredBattles(email) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("Battles");

        // Find battles where the player participated
        const battles = await col.find({
            $or: [
                { "equipo1.email": email },
                { "equipo2.email": email }
            ]
        }).toArray();

        // Extract the player's answers from the battles
        const answers = battles.flatMap(battle => {
            const team1Player = battle.equipo1.find(player => player.email === email);
            const team2Player = battle.equipo2.find(player => player.email === email);

            if (team1Player) {
                return team1Player.preguntas;
            } else if (team2Player) {
                return team2Player.preguntas;
            } else {
                return [];
            }
        });

        console.log("Answers found:", answers);
        return answers;
    } catch (err) {
        console.log(err.stack);
        return null;
    }
}
async function findRegisteredResult(id_user, id_activity, id_pregunta) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("result");
        const resultadoEncontrado = await col.findOne({
            idUsuario: id_user,
            idEjercicio: id_activity,
            idPregunta: id_pregunta
        });

        if (!resultadoEncontrado) {
            console.log("Documento no encontrado");
            return null;
        }

        console.log("Resultado encontrado:", resultadoEncontrado);
        return resultadoEncontrado;
    } catch (err) {
        console.log(err.stack);
        return null;
    }
}
//Historial
async function findRegisteredResults(id_user, id_ejercicio) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("result");
        let resultadoEncontrado = null
        if (id_ejercicio == null) {
            resultadoEncontrado = await col.find({ idUsuario: id_user }).toArray(function (err, resultado) {
                if (err) {
                    console.error('Error al realizar la consulta:', err);
                    return;
                }
                console.log('Resultado:', resultado)
            });
        } else {
            resultadoEncontrado = await col.find({ idUsuario: id_user, idEjercicio: id_ejercicio }).toArray(function (err, resultado) {
                if (err) {
                    console.error('Error al realizar la consulta:', err);
                    return;
                }
                console.log('Resultado:', resultado)
            });
        }

        return resultadoEncontrado;
    } catch (err) {
        console.log(err.stack);
        return null;
    }
}
async function findRegisteredBattles(email_user) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("Battles");
        let resultadoEncontrado = await col.find({ $or: [{ "equipo1.email": email_user }, { "equipo2.email": email_user }] }).toArray(function (err, resultado) {
            if (err) {
                console.error('Error al realizar la consulta:', err);
                return;
            }
            console.log('Resultado:', resultado)
        });

        return resultadoEncontrado;
    } catch (err) {
        console.log(err.stack);
        return null;
    }
}
async function insertInCollection(data, collection) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection(collection);
        col.insertOne(data, function (err, res) {
            if (err) throw err;
            console.log("1 result inserted")
        })
    } catch (err) {
        console.log(err.stack);
    }
}
async function updateCollection(conditionals, data, collection) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection(collection);
        col.updateOne(conditionals, data, function (err, res) {
            if (err) throw err;
            console.log("1 result updated")
        })
    } catch (err) {
        console.log(err.stack);
    }
}

async function getPreguntas(preguntas) {
    try {
        // Connect to the Atlas cluster
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("question");
        // Find and return the document
        var document = null;
        if (preguntas) {
            const filter = { "id": { $in: preguntas } };
            document = await col.find(filter).toArray();
        } else { 
            document = await col.find().toArray();
        }
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}

async function getPregunta(id) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("question");

        const question = await col.findOne({ "id": id });
        //console.log(question)
        return question;
    } catch (err) {
        console.log(err.stack)
    }
}

async function getPreguntaRandom() {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("question");

        const question = await col.aggregate([{ $sample: { size: 1 } }]).toArray();
        //console.log(question)
        return question;
    } catch (err) {
        console.log(err.stack)
    }
}
async function findRegisteredHistory(id_user, id_ejercicio) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("history");
        let resultadoEncontrado = null
        if (id_ejercicio == null) {
            resultadoEncontrado = await col.find({ idUsuario: id_user }).toArray(function (err, resultado) {
                if (err) {
                    console.error('Error al realizar la consulta:', err);
                    return;
                }
                console.log('Resultado:', resultado)
            });
        } else {
            resultadoEncontrado = await col.find({ idUsuario: id_user, idEjercicio: id_ejercicio }).toArray(function (err, resultado) {
                if (err) {
                    console.error('Error al realizar la consulta:', err);
                    return;
                }
                console.log('Resultado:', resultado)
            });
        }

        return resultadoEncontrado;
    } catch (err) {
        console.log(err.stack);
        return null;
    }
}
async function eliminar(id) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const miColeccion = db.collection('result');

        miColeccion.deleteMany({ idUsuario: id })
            .then((result) => {
                console.log(`${result.deletedCount} documentos eliminados`);
            })
            .catch((error) => {
                console.error('Error al eliminar documentos:', error);
            });
        return question;
    } catch (err) {
        console.log(err.stack)
    }
}
