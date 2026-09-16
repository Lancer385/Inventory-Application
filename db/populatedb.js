#! /usr/bin/env node
const { Client } = require("pg");

require("dotenv").config();
const drop = `DROP TABLE IF EXISTS games, genres, developers, platforms, games_genres, games_platforms, games_developers;`;
const tables = `
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
);`;

const seed = `
-- Platforms
INSERT INTO platforms (name) VALUES ('Xbox');
INSERT INTO platforms (name) VALUES ('PC');
INSERT INTO platforms (name) VALUES ('PlayStation 4');
INSERT INTO platforms (name) VALUES ('PlayStation 5');
INSERT INTO platforms (name) VALUES ('Nintendo Switch');
INSERT INTO platforms (name) VALUES ('Xbox Series X');
INSERT INTO platforms (name) VALUES ('Xbox One');
INSERT INTO platforms (name) VALUES ('PlayStation 3');
INSERT INTO platforms (name) VALUES ('iOS');
INSERT INTO platforms (name) VALUES ('Android');
INSERT INTO platforms (name) VALUES ('Mac');

-- Genres
INSERT INTO genres (name) VALUES ('Platformer');
INSERT INTO genres (name) VALUES ('Turn-Based');
INSERT INTO genres (name) VALUES ('Metroidvania');
INSERT INTO genres (name) VALUES ('RPG');
INSERT INTO genres (name) VALUES ('Action RPG');
INSERT INTO genres (name) VALUES ('Roguelike');
INSERT INTO genres (name) VALUES ('Simulation');
INSERT INTO genres (name) VALUES ('Strategy');
INSERT INTO genres (name) VALUES ('First-Person Shooter');
INSERT INTO genres (name) VALUES ('Fighting');
INSERT INTO genres (name) VALUES ('Survival');
INSERT INTO genres (name) VALUES ('Open World');
INSERT INTO genres (name) VALUES ('Puzzle');
INSERT INTO genres (name) VALUES ('Visual Novel');
INSERT INTO genres (name) VALUES ('Horror');

-- Developers
INSERT INTO developers (name) VALUES ('Extremely OK games');
INSERT INTO developers (name) VALUES ('Team Cherry');
INSERT INTO developers (name) VALUES ('FromSoftware');
INSERT INTO developers (name) VALUES ('Nintendo EPD');
INSERT INTO developers (name) VALUES ('ConcernedApe');
INSERT INTO developers (name) VALUES ('Supergiant Games');
INSERT INTO developers (name) VALUES ('Motion Twin');
INSERT INTO developers (name) VALUES ('Toby Fox');
INSERT INTO developers (name) VALUES ('CD Projekt Red');
INSERT INTO developers (name) VALUES ('Bungie');
INSERT INTO developers (name) VALUES ('Mojang Studios');
INSERT INTO developers (name) VALUES ('Re-Logic');
INSERT INTO developers (name) VALUES ('Klei Entertainment');

-- Games
INSERT INTO games (name, description) VALUES ('Celeste',
'Celeste is a 2018 platform video game developed and published by indie studio Maddy Makes Games. The player controls the player character Madeline, a young woman with anxiety and depression, who endeavors to climb Celeste Mountain, a fictional version of Mount Celeste.'
);
INSERT INTO games (name, description) VALUES ('Hollow Knight',
'Hollow Knight is a 2017 Metroidvania video game developed and published by Australian independent developer Team Cherry. The player controls a nameless insectoid warrior in exploring Hallownest, a fallen kingdom plagued by a supernatural disease.'
);
INSERT INTO games (name, description) VALUES ('Elden Ring',
'Elden Ring is a 2022 action role-playing game developed by FromSoftware. Set in the Lands Between, players control a customizable character known as the Tarnished, who must explore the open world and defeat demigods to restore the Elden Ring and become the Elden Lord.'
);
INSERT INTO games (name, description) VALUES ('Stardew Valley',
'Stardew Valley is a 2016 farming simulation role-playing game developed by ConcernedApe. Players inherit a run-down farm and must restore it while building relationships with the townspeople of Pelican Town.'
);
INSERT INTO games (name, description) VALUES ('Hades',
'Hades is a 2020 roguelike action game developed by Supergiant Games. Players control Zagreus, son of Hades, attempting to escape the Underworld while using gifts from the Olympian gods to fight through procedurally generated challenges.'
);
INSERT INTO games (name, description) VALUES ('Dead Cells',
'Dead Cells is a 2018 roguelike Metroidvania game developed by Motion Twin. Players control a failed alchemic experiment trying to escape a diseased island through an ever-changing castle in a non-linear, run-based progression.'
);
INSERT INTO games (name, description) VALUES ('Undertale',
'Undertale is a 2015 role-playing game developed by Toby Fox. The player controls a child who has fallen into the Underground, a large cavern beneath the surface of the Earth, and must find a way back to the surface.'
);
INSERT INTO games (name, description) VALUES ('The Legend of Zelda: Breath of the Wild',
'Breath of the Wild is a 2017 action-adventure game developed by Nintendo EPD. Set in the open world of Hyrule, players control Link, who awakens from a long slumber to defeat Calamity Ganon and rescue Princess Zelda.'
);
INSERT INTO games (name, description) VALUES ('The Witcher 3: Wild Hunt',
'The Witcher 3: Wild Hunt is a 2015 action role-playing game developed by CD Projekt Red. Players control Geralt of Rivia, a monster hunter known as a Witcher, searching for his adopted daughter across a vast open world.'
);
INSERT INTO games (name, description) VALUES ('Minecraft',
'Minecraft is a 2011 sandbox game developed by Mojang Studios. Players explore a blocky, procedurally generated 3D world and can build, craft, and survive in a variety of game modes.'
);
INSERT INTO games (name, description) VALUES ('Terraria',
'Terraria is a 2011 action-adventure sandbox game developed by Re-Logic. Players explore a procedurally generated 2D world, mining resources, building structures, and battling a large variety of enemies and bosses.'
);
INSERT INTO games (name, description) VALUES ('Don''t Starve Together',
'Don''t Starve Together is a 2016 multiplayer survival game developed by Klei Entertainment. Players must survive in a dark, whimsical wilderness by gathering resources, building shelters, and managing sanity while fending off monsters.'
);

-- Games genres
INSERT INTO games_genres (game_id, genre_id) VALUES
((SELECT id FROM games WHERE name = 'Celeste'), (SELECT id FROM genres WHERE name = 'Platformer')),
((SELECT id FROM games WHERE name = 'Hollow Knight'), (SELECT id FROM genres WHERE name = 'Platformer')),
((SELECT id FROM games WHERE name = 'Elden Ring'), (SELECT id FROM genres WHERE name = 'Action RPG')),
((SELECT id FROM games WHERE name = 'Elden Ring'), (SELECT id FROM genres WHERE name = 'Open World')),
((SELECT id FROM games WHERE name = 'Stardew Valley'), (SELECT id FROM genres WHERE name = 'Simulation')),
((SELECT id FROM games WHERE name = 'Stardew Valley'), (SELECT id FROM genres WHERE name = 'RPG')),
((SELECT id FROM games WHERE name = 'Hades'), (SELECT id FROM genres WHERE name = 'Roguelike')),
((SELECT id FROM games WHERE name = 'Hades'), (SELECT id FROM genres WHERE name = 'Action RPG')),
((SELECT id FROM games WHERE name = 'Dead Cells'), (SELECT id FROM genres WHERE name = 'Roguelike')),
((SELECT id FROM games WHERE name = 'Dead Cells'), (SELECT id FROM genres WHERE name = 'Metroidvania')),
((SELECT id FROM games WHERE name = 'Undertale'), (SELECT id FROM genres WHERE name = 'RPG')),
((SELECT id FROM games WHERE name = 'The Legend of Zelda: Breath of the Wild'), (SELECT id FROM genres WHERE name = 'Open World')),
((SELECT id FROM games WHERE name = 'The Witcher 3: Wild Hunt'), (SELECT id FROM genres WHERE name = 'Action RPG')),
((SELECT id FROM games WHERE name = 'The Witcher 3: Wild Hunt'), (SELECT id FROM genres WHERE name = 'Open World')),
((SELECT id FROM games WHERE name = 'Minecraft'), (SELECT id FROM genres WHERE name = 'Survival')),
((SELECT id FROM games WHERE name = 'Terraria'), (SELECT id FROM genres WHERE name = 'Survival')),
((SELECT id FROM games WHERE name = 'Terraria'), (SELECT id FROM genres WHERE name = 'Platformer')),
((SELECT id FROM games WHERE name = 'Don''t Starve Together'), (SELECT id FROM genres WHERE name = 'Survival'));

-- Games platforms
INSERT INTO games_platforms (game_id, platform_id) VALUES
((SELECT id FROM games WHERE name = 'Celeste'), (SELECT id FROM platforms WHERE name = 'Xbox')),
((SELECT id FROM games WHERE name = 'Celeste'), (SELECT id FROM platforms WHERE name = 'PC')),
((SELECT id FROM games WHERE name = 'Celeste'), (SELECT id FROM platforms WHERE name = 'PlayStation 4')),
((SELECT id FROM games WHERE name = 'Celeste'), (SELECT id FROM platforms WHERE name = 'PlayStation 5')),
((SELECT id FROM games WHERE name = 'Celeste'), (SELECT id FROM platforms WHERE name = 'Nintendo Switch')),
((SELECT id FROM games WHERE name = 'Hollow Knight'), (SELECT id FROM platforms WHERE name = 'PC')),
((SELECT id FROM games WHERE name = 'Hollow Knight'), (SELECT id FROM platforms WHERE name = 'Xbox')),
((SELECT id FROM games WHERE name = 'Hollow Knight'), (SELECT id FROM platforms WHERE name = 'PlayStation 4')),
((SELECT id FROM games WHERE name = 'Hollow Knight'), (SELECT id FROM platforms WHERE name = 'PlayStation 5')),
((SELECT id FROM games WHERE name = 'Hollow Knight'), (SELECT id FROM platforms WHERE name = 'Nintendo Switch')),
((SELECT id FROM games WHERE name = 'Elden Ring'), (SELECT id FROM platforms WHERE name = 'PC')),
((SELECT id FROM games WHERE name = 'Elden Ring'), (SELECT id FROM platforms WHERE name = 'PlayStation 4')),
((SELECT id FROM games WHERE name = 'Elden Ring'), (SELECT id FROM platforms WHERE name = 'PlayStation 5')),
((SELECT id FROM games WHERE name = 'Elden Ring'), (SELECT id FROM platforms WHERE name = 'Xbox One')),
((SELECT id FROM games WHERE name = 'Elden Ring'), (SELECT id FROM platforms WHERE name = 'Xbox Series X')),
((SELECT id FROM games WHERE name = 'Stardew Valley'), (SELECT id FROM platforms WHERE name = 'PC')),
((SELECT id FROM games WHERE name = 'Stardew Valley'), (SELECT id FROM platforms WHERE name = 'Nintendo Switch')),
((SELECT id FROM games WHERE name = 'Stardew Valley'), (SELECT id FROM platforms WHERE name = 'PlayStation 4')),
((SELECT id FROM games WHERE name = 'Stardew Valley'), (SELECT id FROM platforms WHERE name = 'Xbox One')),
((SELECT id FROM games WHERE name = 'Stardew Valley'), (SELECT id FROM platforms WHERE name = 'iOS')),
((SELECT id FROM games WHERE name = 'Stardew Valley'), (SELECT id FROM platforms WHERE name = 'Android')),
((SELECT id FROM games WHERE name = 'Hades'), (SELECT id FROM platforms WHERE name = 'PC')),
((SELECT id FROM games WHERE name = 'Hades'), (SELECT id FROM platforms WHERE name = 'Nintendo Switch')),
((SELECT id FROM games WHERE name = 'Hades'), (SELECT id FROM platforms WHERE name = 'PlayStation 4')),
((SELECT id FROM games WHERE name = 'Hades'), (SELECT id FROM platforms WHERE name = 'PlayStation 5')),
((SELECT id FROM games WHERE name = 'Hades'), (SELECT id FROM platforms WHERE name = 'Xbox One')),
((SELECT id FROM games WHERE name = 'Dead Cells'), (SELECT id FROM platforms WHERE name = 'PC')),
((SELECT id FROM games WHERE name = 'Dead Cells'), (SELECT id FROM platforms WHERE name = 'Nintendo Switch')),
((SELECT id FROM games WHERE name = 'Dead Cells'), (SELECT id FROM platforms WHERE name = 'PlayStation 4')),
((SELECT id FROM games WHERE name = 'Dead Cells'), (SELECT id FROM platforms WHERE name = 'Xbox One')),
((SELECT id FROM games WHERE name = 'Dead Cells'), (SELECT id FROM platforms WHERE name = 'iOS')),
((SELECT id FROM games WHERE name = 'Undertale'), (SELECT id FROM platforms WHERE name = 'PC')),
((SELECT id FROM games WHERE name = 'Undertale'), (SELECT id FROM platforms WHERE name = 'Nintendo Switch')),
((SELECT id FROM games WHERE name = 'Undertale'), (SELECT id FROM platforms WHERE name = 'PlayStation 4')),
((SELECT id FROM games WHERE name = 'The Legend of Zelda: Breath of the Wild'), (SELECT id FROM platforms WHERE name = 'Nintendo Switch')),
((SELECT id FROM games WHERE name = 'The Witcher 3: Wild Hunt'), (SELECT id FROM platforms WHERE name = 'PC')),
((SELECT id FROM games WHERE name = 'The Witcher 3: Wild Hunt'), (SELECT id FROM platforms WHERE name = 'PlayStation 4')),
((SELECT id FROM games WHERE name = 'The Witcher 3: Wild Hunt'), (SELECT id FROM platforms WHERE name = 'PlayStation 5')),
((SELECT id FROM games WHERE name = 'The Witcher 3: Wild Hunt'), (SELECT id FROM platforms WHERE name = 'Xbox One')),
((SELECT id FROM games WHERE name = 'The Witcher 3: Wild Hunt'), (SELECT id FROM platforms WHERE name = 'Nintendo Switch')),
((SELECT id FROM games WHERE name = 'Minecraft'), (SELECT id FROM platforms WHERE name = 'PC')),
((SELECT id FROM games WHERE name = 'Minecraft'), (SELECT id FROM platforms WHERE name = 'Nintendo Switch')),
((SELECT id FROM games WHERE name = 'Minecraft'), (SELECT id FROM platforms WHERE name = 'PlayStation 4')),
((SELECT id FROM games WHERE name = 'Minecraft'), (SELECT id FROM platforms WHERE name = 'Xbox One')),
((SELECT id FROM games WHERE name = 'Minecraft'), (SELECT id FROM platforms WHERE name = 'iOS')),
((SELECT id FROM games WHERE name = 'Minecraft'), (SELECT id FROM platforms WHERE name = 'Android')),
((SELECT id FROM games WHERE name = 'Terraria'), (SELECT id FROM platforms WHERE name = 'PC')),
((SELECT id FROM games WHERE name = 'Terraria'), (SELECT id FROM platforms WHERE name = 'Nintendo Switch')),
((SELECT id FROM games WHERE name = 'Terraria'), (SELECT id FROM platforms WHERE name = 'PlayStation 4')),
((SELECT id FROM games WHERE name = 'Terraria'), (SELECT id FROM platforms WHERE name = 'Xbox One')),
((SELECT id FROM games WHERE name = 'Terraria'), (SELECT id FROM platforms WHERE name = 'iOS')),
((SELECT id FROM games WHERE name = 'Terraria'), (SELECT id FROM platforms WHERE name = 'Android')),
((SELECT id FROM games WHERE name = 'Don''t Starve Together'), (SELECT id FROM platforms WHERE name = 'PC')),
((SELECT id FROM games WHERE name = 'Don''t Starve Together'), (SELECT id FROM platforms WHERE name = 'PlayStation 4')),
((SELECT id FROM games WHERE name = 'Don''t Starve Together'), (SELECT id FROM platforms WHERE name = 'Nintendo Switch'));

-- Games developers
INSERT INTO games_developers (game_id, developer_id) VALUES
((SELECT id FROM games WHERE name = 'Celeste'), (SELECT id FROM developers WHERE name = 'Extremely OK games')),
((SELECT id FROM games WHERE name = 'Hollow Knight'), (SELECT id FROM developers WHERE name = 'Team Cherry')),
((SELECT id FROM games WHERE name = 'Elden Ring'), (SELECT id FROM developers WHERE name = 'FromSoftware')),
((SELECT id FROM games WHERE name = 'Stardew Valley'), (SELECT id FROM developers WHERE name = 'ConcernedApe')),
((SELECT id FROM games WHERE name = 'Hades'), (SELECT id FROM developers WHERE name = 'Supergiant Games')),
((SELECT id FROM games WHERE name = 'Dead Cells'), (SELECT id FROM developers WHERE name = 'Motion Twin')),
((SELECT id FROM games WHERE name = 'Undertale'), (SELECT id FROM developers WHERE name = 'Toby Fox')),
((SELECT id FROM games WHERE name = 'The Legend of Zelda: Breath of the Wild'), (SELECT id FROM developers WHERE name = 'Nintendo EPD')),
((SELECT id FROM games WHERE name = 'The Witcher 3: Wild Hunt'), (SELECT id FROM developers WHERE name = 'CD Projekt Red')),
((SELECT id FROM games WHERE name = 'Minecraft'), (SELECT id FROM developers WHERE name = 'Mojang Studios')),
((SELECT id FROM games WHERE name = 'Terraria'), (SELECT id FROM developers WHERE name = 'Re-Logic')),
((SELECT id FROM games WHERE name = 'Don''t Starve Together'), (SELECT id FROM developers WHERE name = 'Klei Entertainment'));`;

async function SQLquery(query, message) {
  console.log(message);
  const client = new Client({
    connectionString: process.env.CONNECTION_STRING,
  });
  await client.connect();
  await client.query(query);
  await client.end();
  console.log("done");
}

const command = process.argv[2];

if (command === "--create" || command === "-c") {
  SQLquery(tables, "creating tables...");
} else if (command === "--drop" || command === "-d") {
  SQLquery(drop, "dropping tables...");
} else if (command === "--seed" || command === "-s") {
  SQLquery(seed, "seeding...");
} else {
  console.log(
    "Usage: node ./db/populatedb.js [OPTION]\n-c, --create\nCreate your tables(only once or after reset)\n\n-d, --drop\ndrop all of the tables and start over(run --create)\n\n-s, --seed\nSeed your tables with random data",
  );
}
