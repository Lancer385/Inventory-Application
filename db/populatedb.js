#! /usr/bin/env node
const { Client } = require("pg");
require('dotenv').config()

const SQL = `
DROP TABLE IF EXISTS games, genres, developers, platforms, games_genres, games_platforms, games_developers;
CREATE TABLE games (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);
CREATE TABLE genres (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE developers (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE platforms (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE games_genres (
  game_id INT,
  genre_id INT,
  PRIMARY KEY (game_id, genre_id),
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

CREATE TABLE games_developers (
  game_id INT,
  developer_id INT,
  PRIMARY KEY (game_id, developer_id),
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  FOREIGN KEY (developer_id) REFERENCES developers(id) ON DELETE CASCADE
);

CREATE TABLE games_platforms (
  game_id INT,
  platform_id INT,
  PRIMARY KEY (game_id, platform_id),
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

INSERT INTO games (name, description) VALUES ('Celeste',
'Celeste is a 2018 platform video game developed and published by indie studio Maddy Makes Games. The player controls the player character Madeline, a young woman with anxiety and depression, who endeavors to climb Celeste Mountain, a fictional version of Mount Celeste.'
);
INSERT INTO games (name, description) VALUES ('Hollow Knight',
'Hollow Knight is a 2017 Metroidvania video game developed and published by Australian independent developer Team Cherry. The player controls a nameless insectoid warrior in exploring Hallownest, a fallen kingdom plagued by a supernatural disease.'
);
INSERT INTO genres (name) VALUES ('Platformer');
INSERT INTO genres (name) VALUES ('Turn-Based');
INSERT INTO developers (name) VALUES ('Extremely OK games');
INSERT INTO developers (name) VALUES ('Team Cherry');
INSERT INTO platforms (name) VALUES ('Xbox');
INSERT INTO platforms (name) VALUES ('PC');
INSERT INTO platforms (name) VALUES ('PlayStation 4');
INSERT INTO platforms (name) VALUES ('PlayStation 5');
INSERT INTO platforms (name) VALUES ('Nintendo Switch');

INSERT INTO games_genres (game_id, genre_id)
VALUES (
  (SELECT id from games WHERE name = 'Celeste'),
  (SELECT id from genres WHERE name = 'Platformer')
),
(
  (SELECT id from games WHERE name = 'Hollow Knight'),
  (SELECT id from genres WHERE name = 'Platformer')
);

INSERT INTO games_platforms (game_id, platform_id)
VALUES (
  (SELECT id from games WHERE name = 'Celeste'),
  (SELECT id from platforms WHERE name = 'Xbox')
),
(
  (SELECT id from games WHERE name = 'Celeste'),
  (SELECT id from platforms WHERE name = 'PlayStation 4')
),
(
  (SELECT id from games WHERE name = 'Celeste'),
  (SELECT id from platforms WHERE name = 'PlayStation 5')
),
(
  (SELECT id from games WHERE name = 'Celeste'),
  (SELECT id from platforms WHERE name = 'Nintendo Switch')
),
(
  (SELECT id from games WHERE name = 'Celeste'),
  (SELECT id from platforms WHERE name = 'PC')
),
(
  (SELECT id from games WHERE name = 'Hollow Knight'),
  (SELECT id from platforms WHERE name = 'PC')
),
(
  (SELECT id from games WHERE name = 'Hollow Knight'),
  (SELECT id from platforms WHERE name = 'Xbox')
),
(
  (SELECT id from games WHERE name = 'Hollow Knight'),
  (SELECT id from platforms WHERE name = 'PlayStation 4')
),
(
  (SELECT id from games WHERE name = 'Hollow Knight'),
  (SELECT id from platforms WHERE name = 'PlayStation 5')
),
(
  (SELECT id from games WHERE name = 'Hollow Knight'),
  (SELECT id from platforms WHERE name = 'Nintendo Switch')
);

INSERT INTO games_developers (game_id, developer_id)
VALUES (
  (SELECT id from games WHERE name = 'Celeste'),
  (SELECT id from developers WHERE name = 'Extremely OK games')
),
(
  (SELECT id from games WHERE name = 'Hollow Knight'),
  (SELECT id from developers WHERE name = 'Team Cherry')
);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();


