const mysql = require('mysql2');


// Configuración del pool de conexiones a la base de datos
const pool = mysql.createPool({
    connectionLimit: 10, // Número máximo de conexiones en el pool
    host: '127.0.0.1',
    user: 'mathgame',
    password: 'mathgame',
    database: 'mathGame'
});

// Función para ejecutar consultas SQL utilizando el pool de conexiones
function ejecutarConsulta(sql, valores, callback) {
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error al obtener la conexión del pool:', error);
            throw error;
        }

        connection.query(sql, valores, (errorQuery, results, fields) => {
            connection.release(); // Liberar la conexión al terminar la consulta

            if (errorQuery) {
                console.error('Error al ejecutar la consulta:', errorQuery);
                throw errorQuery;
            }
            callback(results);
        });
    });
}
function SelectUsers(callback) {
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error al obtener la conexión del pool:', error);
            throw error;
        }

        connection.query('SELECT u.*, c.access_code AS id_classroom_code FROM users u LEFT JOIN classrooms c ON u.id_classroom = c.id', [], (errorQuery, results, fields) => {
            connection.release(); // Liberar la conexión al terminar la consultas

            if (errorQuery) {
                console.error('Error al ejecutar la consulta:', errorQuery);
                throw errorQuery;
            }
            callback(results);
        });
    });
}

function SelectUsersByAula(id,callback) {
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error al obtener la conexión del pool:', error);
            throw error;
        }

        connection.query('SELECT * FROM users WHERE id_classroom=?',id, (errorQuery, results, fields) => {
            connection.release(); // Liberar la conexión al terminar la consulta

            if (errorQuery) {
                console.error('Error al ejecutar la consulta:', errorQuery);
                throw errorQuery;
            }
            callback(results);
        });
    });
}
function SelectClassroomId(id,callback) {
    if(id==null){
        callback(null);
    }
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error al obtener la conexión del pool:', error);
            throw error;
        }

        connection.query('SELECT * FROM classrooms WHERE id = ?',id, (errorQuery, results, fields) => {
            connection.release(); // Liberar la conexión al terminar la consulta

            if (errorQuery) {
                console.error('Error al ejecutar la consulta:', errorQuery);
            }
            callback(results);
        });
    }); 
}
function SelectClassroom(access_code,callback) {
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error al obtener la conexión del pool:', error);
            throw error;
        }

        connection.query('SELECT * FROM classrooms WHERE access_code = ?',access_code, (errorQuery, results, fields) => {
            connection.release(); // Liberar la conexión al terminar la consulta

            if (errorQuery) {
                console.error('Error al ejecutar la consulta:', errorQuery);
                throw errorQuery;
            }
            callback(results);
        });
    });
}

//Selecionar un usuari per la seva ID
function SelectUserById(id,callback) {
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error al obtener la conexión del pool:', error);
            throw error;
        }      

        connection.query('SELECT U.*, C.name AS nomaula FROM users U,classrooms C WHERE U.id=? AND U.id_classroom=C.id',id, (errorQuery, results, fields) => {
            connection.release(); // Liberar la conexión al terminar la consulta

            if (errorQuery) {
                console.error('Error al ejecutar la consulta:', errorQuery);
                throw errorQuery;
            }
            callback(results);
        });
    });
}

function updateLevelData(id,newlvl,callback) {
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error al obtener la conexión del pool:', error);
            throw error;
        }
        console.log("Update Function")
        connection.query(`SELECT id FROM Levelsxp WHERE lvl=?`, newlvl, (errorQuery, result, fields) => {
            console.log("Mid Update Quey")
            if (errorQuery) {
                console.error('Error al ejecutar la consulta:', errorQuery);
                throw errorQuery;
            }
                connection.query(`UPDATE users SET lvl=? WHERE id=?`, [result[0].id,id], (errorQuery, results, fields) => {
                    connection.release(); // Liberar la conexión al terminar la consulta
                    console.log("Mid Update Quey")
                    if (errorQuery) {
                        console.error('Error al ejecutar la consulta:', errorQuery);
                        throw errorQuery;
                    }
                    console.log("End Update Function")
                    callback(results);
                });
    });
    });
}
function getLevelData(exp, callback) {
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error al obtener la conexión del pool:', error);
            throw error;
        }
        connection.query('SELECT * FROM Levelsxp WHERE requiredxp <= ? ORDER BY lvl DESC LIMIT 1', exp, (errorQuery, results, fields) => {
            if (errorQuery) {
                connection.release(); // Release the connection in case of an error
                console.error('Error al ejecutar la consulta:', errorQuery);
                throw errorQuery;
            }
            
            const currentLevelData = results[0];
            connection.query('SELECT requiredxp FROM Levelsxp WHERE lvl = ?', currentLevelData.lvl + 1, (errorNextLevel, nextLevelResult, nextLevelFields) => {
                connection.release(); // Release the connection after both queries

                if (errorNextLevel) {
                    console.error('Error al obtener el siguiente nivel:', errorNextLevel);
                    throw errorNextLevel;
                }

                const nextLevelRequiredXP = (nextLevelResult && nextLevelResult.length > 0) ? nextLevelResult[0].requiredxp - exp : null;
                const levelData = {
                    currentLevel: currentLevelData,
                    nextLevelRequiredXP: nextLevelRequiredXP
                };
                callback(levelData); 
            });
        });
    });
}
function SelectClassrooms(id,callback) {
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error al obtener la conexión del pool:', error);
            throw error;
        }

        connection.query('SELECT * FROM classrooms WHERE professor_id=?',id, (errorQuery, results, fields) => {
            connection.release(); // Liberar la conexión al terminar la consulta

            if (errorQuery) {
                console.error('Error al ejecutar la consulta:', errorQuery);
                throw errorQuery;
            }
            callback(results);
        });
    });
}

function SelectProfessors(callback) {
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error al obtener la conexión del pool:', error);
            throw error;
        }

        connection.query('SELECT * FROM professors', [], (errorQuery, results, fields) => {
            connection.release(); // Liberar la conexión al terminar la consulta

            if (errorQuery) {
                console.error('Error al ejecutar la consulta:', errorQuery);
                throw errorQuery;
            }
            //console.log(results);
            callback(results);
        });
    });
}
function SelectProfTotal(idAula,idProf, callback) {
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error al obtener la conexión del pool:', error);
            throw error;
        }

        // Consulta para contar el total de usuarios en la clase con id_classroom = id
        const query1 = `SELECT COUNT(*) as total FROM users U WHERE U.id_classroom = ${idAula}`;

        // Consulta para obtener todos los profesores
        const query2 = `SELECT * FROM professors WHERE id = ${idProf}`;

        Promise.all([
            new Promise((resolve, reject) => {
                connection.query(query1, (errorQuery1, results1) => {
                    if (errorQuery1) {
                        reject(errorQuery1);
                    } else {
                        resolve(results1);
                    }
                });
            }),
            new Promise((resolve, reject) => {
                connection.query(query2, (errorQuery2, results2) => {
                    if (errorQuery2) {
                        reject(errorQuery2);
                    } else {
                        resolve(results2);
                    }
                });
            })
        ])
        .then(([results1, results2]) => {
            connection.release(); // Liberar la conexión al terminar las consultas
            const combinedResults = {
                totalUsers: results1[0].total,
                professors: results2
            };
            callback(combinedResults);
        })
        .catch((error) => {
            connection.release(); // Liberar la conexión en caso de error
            console.error('Error al ejecutar una o ambas consultas:', error);
            throw error;
        });
    });
}

function SelectEmails(callback) {
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error al obtener la conexión del pool:', error);
            throw error;
        }

        connection.query('SELECT email FROM users', [], (errorQuery, results, fields) => {
            connection.release(); // Liberar la conexión al terminar la consulta

            if (errorQuery) {
                console.error('Error al ejecutar la consulta:', errorQuery);
                throw errorQuery;
            }
            callback(results);
        });
    });
}
function InsertUser(valores, callback) {
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error al obtener la conexión del pool:', error);
            throw error;
        }

        connection.query('INSERT INTO users (name, surname, email, contrasena) VALUES (?, ?, ?, ?)', valores, (errorQuery, results, fields) => {
            connection.release(); // Liberar la conexión al terminar la consulta

            if (errorQuery) {
                console.error('Error al ejecutar la consulta:', errorQuery);
                throw errorQuery;
            }
            callback(results);
        });
    });
}

//Selecionar acces_code de Aulas
function SelectAccesCode(callback) {
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error al obtener la conexión del pool:', error);
            throw error;
        }

        connection.query('SELECT access_code FROM classrooms', [], (errorQuery, results, fields) => {
            connection.release();

            if (errorQuery) {
                console.error('Error al ejecutar la consulta:', errorQuery);
                throw errorQuery;
            }
            callback(results);
        });
    });
}

//AÑADIR UNA AULA NUEVA
function InsertAula(valores, callback) {
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error al obtener la conexión del pool:', error);
            throw error;
        }
       
        connection.query('INSERT INTO classrooms (professor_id, name, access_code) VALUES (?, ?, ?)', valores, (errorQuery, results, fields) => {
            connection.release(); // Liberar la conexión al terminar la consulta

            if (errorQuery) {
                console.error('Error al ejecutar la consulta:', errorQuery);
                throw errorQuery;
            }
            callback(results);
        });
    });
}


//UPDATE usuario SET name = ?, surname = ?, email = ? WHERE id = ?
function UpdateUser(valores, callback) {
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error al obtener la conexión del pool:', error);
            throw error;
        }

        connection.query('UPDATE users SET name = ?, surname = ?, email = ? WHERE id = ?', valores, (errorQuery, results, fields) => {
            connection.release(); // Liberar la conexión al terminar la consulta

            if (errorQuery) {
                console.error('Error al ejecutar la consulta:', errorQuery);
                throw errorQuery;
            }
            callback(results);
        });
    });
}

//Funcion para cambiar el password de professor por uno nuevo
function UpdatePassword(valores, callback) {
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error al obtener la conexión del pool:', error);
            throw error;
        }

        connection.query('UPDATE professors SET contrasena = ? WHERE id = ?',valores, (errorQuery, results, fields) => {
            connection.release(); // Liberar la conexión al terminar la consulta

            if (errorQuery) {
                console.error('Error al ejecutar la consulta:', errorQuery);
                throw errorQuery;
            }
            callback(results);
        });
    });
}
function UpdateImage(valores, callback) {
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error al obtener la conexión del pool:', error);
            throw error;
        }

        connection.query('UPDATE users SET image = ? WHERE id = ?', valores, (errorQuery, results, fields) => {
            connection.release(); // Liberar la conexión al terminar la consulta

            if (errorQuery) {
                console.error('Error al ejecutar la consulta:', errorQuery);
                throw errorQuery;
            }
            callback(results);
        });
    });
}

//Quitar un usuario de una aula
function RemoveUserFromClassroom(id, callback) {
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error al obtener la conexión del pool:', error);
            throw error;
        }

        connection.query('UPDATE users SET id_classroom = NULL WHERE id = ?', id, (errorQuery, results, fields) => {
            connection.release(); // Liberar la conexión al terminar la consulta

            if (errorQuery) {
                console.error('Error al ejecutar la consulta:', errorQuery);
                throw errorQuery;
            }
            callback(results);
        });
    });
}

function UpdateUserClassroom(valores, callback) {
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error al obtener la conexión del pool:', error);
            throw error;
        }

        connection.query('UPDATE users SET id_classroom = ? WHERE id = ?', valores, (errorQuery, results, fields) => {
            connection.release(); // Liberar la conexión al terminar la consulta

            if (errorQuery) {
                console.error('Error al ejecutar la consulta:', errorQuery);
                throw errorQuery;
            }
            callback(results);
        });
    });
}
function selectLevel(level, callback) {
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error al obtener la conexión del pool:', error);
            throw error;
        }

        connection.query('SELECT * FROM Levelsxp WHERE lvl = ?', level, (errorQuery, results, fields) => {
            connection.release(); // Liberar la conexión al terminar la consulta

            if (errorQuery) {
                console.error('Error al ejecutar la consulta:', errorQuery);
                throw errorQuery;
            }
            callback(results);
        });
    });
}
module.exports = {
    ejecutarConsulta,
    SelectUsers,
    SelectUsersByAula,
    SelectUserById,
    SelectEmails,
    SelectClassrooms,
    InsertUser,
    InsertAula,
    UpdateUser,
    UpdatePassword,
    selectLevel,
    SelectAccesCode, 
    SelectProfessors,SelectProfTotal,
    RemoveUserFromClassroom,   
    UpdateImage,
    SelectClassroom,
    UpdateUserClassroom,
    SelectClassroomId,
    getLevelData,
    updateLevelData
    // Puedes añadir más funciones según tus necesidades...
};
