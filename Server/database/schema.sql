-- MySQL schema + datos de prueba para Math Game (Server/mySQL.js)
-- Charset recomendado: utf8mb4
--
-- Cargar: mysql -u USER -p < Server/database/schema.sql
-- O desde cliente: SOURCE Server/database/schema.sql;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS classrooms;
DROP TABLE IF EXISTS Levelsxp;
DROP TABLE IF EXISTS professors;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE professors (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name          VARCHAR(100) NOT NULL,
  surname       VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  contrasena    VARCHAR(255) NOT NULL,
  image         VARCHAR(512) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_professors_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Levelsxp (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  lvl           INT UNSIGNED NOT NULL COMMENT 'Número de nivel mostrado (usado en selectLevel)',
  requiredxp    INT UNSIGNED NOT NULL DEFAULT 0,
  health        INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uk_levelsxp_lvl (lvl)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE classrooms (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  professor_id  INT UNSIGNED NOT NULL,
  name          VARCHAR(150) NOT NULL,
  access_code   VARCHAR(32)  NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_classrooms_access_code (access_code),
  KEY idx_classrooms_professor (professor_id),
  CONSTRAINT fk_classrooms_professor
    FOREIGN KEY (professor_id) REFERENCES professors (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE users (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name           VARCHAR(100) NOT NULL,
  surname        VARCHAR(100) NOT NULL,
  email          VARCHAR(255) NOT NULL,
  contrasena     VARCHAR(255) NOT NULL,
  rank           VARCHAR(50)  NOT NULL DEFAULT 'apprenent',
  lvl            INT UNSIGNED NULL COMMENT 'FK a Levelsxp.id (updateLevelData)',
  image          VARCHAR(255) NULL,
  id_classroom   INT UNSIGNED NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_email (email),
  KEY idx_users_classroom (id_classroom),
  KEY idx_users_lvl (lvl),
  CONSTRAINT fk_users_classroom
    FOREIGN KEY (id_classroom) REFERENCES classrooms (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_users_levelsxp
    FOREIGN KEY (lvl) REFERENCES Levelsxp (id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Datos de prueba ----------
-- Contraseñas en texto plano (igual que en el código actual del servidor).

INSERT INTO professors (id, name, surname, email, contrasena, image) VALUES
(1, 'Kru', 'Prova', 'prof@test.cat', 'prof123', NULL);

INSERT INTO Levelsxp (id, lvl, requiredxp, health) VALUES
(1, 1,    0, 100),
(2, 2,  150, 115),
(3, 3,  400, 130),
(4, 4,  900, 150),
(5, 5, 1800, 170);

INSERT INTO classrooms (id, professor_id, name, access_code) VALUES
(1, 1, 'Aula Alpha', 'TEST01');

INSERT INTO users (id, name, surname, email, contrasena, rank, lvl, image, id_classroom) VALUES
(1, 'Anna', 'Alumne', 'alumne@test.cat', 'alumne123', 'apprenent', 1, NULL, 1),
(2, 'Pere', 'Senseaula', 'pere@test.cat', 'pere123', 'apprenent', 1, NULL, NULL);

-- Reset autoincrement por si se insertan filas con id fijo
ALTER TABLE professors AUTO_INCREMENT = 10;
ALTER TABLE Levelsxp AUTO_INCREMENT = 10;
ALTER TABLE classrooms AUTO_INCREMENT = 10;
ALTER TABLE users AUTO_INCREMENT = 10;
