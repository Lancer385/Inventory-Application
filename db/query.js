const pool = require("./pool");

const singularMap = {
  platforms: "platform",
  genres: "genre",
  developers: "developer",
};

async function queryGame(gameID = null) {
  const clause = gameID ? `WHERE games.id = $1` : "";
  const id = gameID ? [gameID] : [];

  const [platforms, genres, developers] = await Promise.all([
    pool.query(
      `SELECT games.id AS "gameID", games.name AS "gameName", games.description AS "gameDescription",
                   json_agg(
                    json_build_object(
                    'id', platforms.id,
                    'name', platforms.name)
                    ORDER BY platforms.id) AS platforms 
                   FROM games 
                   LEFT JOIN games_platforms ON games.id = games_platforms.game_id 
                   LEFT JOIN platforms ON platforms.id = platform_id
                   ${clause}
                   GROUP BY games.id
                   ORDER BY games.id
                   `,
      id,
    ),

    pool.query(
      `SELECT games.id AS "gameID", games.name AS "gameName", games.description AS "gameDescription",
                   json_agg(
                    json_build_object(
                    'id', genres.id,
                    'name', genres.name)
                    ORDER BY genres.id) AS genres 
                   FROM games 
                   LEFT JOIN games_genres ON games.id = games_genres.game_id 
                   LEFT JOIN genres ON genres.id = genre_id
                   ${clause}
                   GROUP BY games.id
                   ORDER BY games.id`,
      id,
    ),

    pool.query(
      `SELECT games.id AS "gameID", games.name AS "gameName", games.description AS "gameDescription",
                   json_agg(
                    json_build_object(
                    'id', developers.id,
                    'name', developers.name)
                    ORDER BY developers.id) AS developers
                   FROM games
                   LEFT JOIN games_developers ON games.id = games_developers.game_id 
                   LEFT JOIN developers ON developers.id = developer_id
                   ${clause}
                   GROUP BY games.id
                   ORDER BY games.id`,
      id,
    ),
  ]);
  const combinedGames = [...platforms.rows, ...genres.rows, ...developers.rows];
  const result = combinedGames.reduce((acc, current) => {
    acc[current.gameID] = { ...acc[current.gameID], ...current };
    return acc;
  }, {});
  return gameID ? Object.values(result)[0] : Object.values(result);
}

const getAllGames = () => queryGame();
const getGame = (id) => queryGame(id);

async function getCategories() {
  const platforms = (await pool.query(`SELECT * FROM platforms`)).rows;
  const genres = (await pool.query(`SELECT * FROM genres`)).rows;
  const developers = (await pool.query(`SELECT * FROM developers`)).rows;
  return { platforms, genres, developers };
}

async function queryCategory(categoryName, categoryID = null) {
  const categoryNameSingular = singularMap[categoryName];
  const clause = categoryID ? `HAVING ${categoryName}.id = $1` : "";
  const id = categoryID ? [categoryID] : [];

  const category = await pool.query(
    `SELECT ${categoryName}.id as "id",  ${categoryName}.name AS "name",
                   json_agg(json_build_object('id', games.id, 'name', games.name) ORDER BY games.id) AS "games"
                   FROM ${categoryName}
                   LEFT JOIN games_${categoryName} ON ${categoryName}.id = games_${categoryName}.${categoryNameSingular}_id 
                   LEFT JOIN games ON games.id = game_id
                   GROUP BY ${categoryName}.id
                   ${clause}`,
    id,
  );
  return categoryID ? category.rows[0] : category.rows;
}

const getCategory = (category) => queryCategory(category);
const getCategoryItem = (category, id) => queryCategory(category, id);

async function addNewGame(name, description = "") {
  await pool.query("INSERT INTO games (name, description) VALUES ($1, $2)", [
    name,
    description,
  ]);
}

async function addNewCategory(tableName, name) {
  await pool.query(`INSERT INTO ${tableName} (name) VALUES ($1)`, [name]);
}

async function addRelation(categoryName, gameName, item) {
  const categoryNameSingular = singularMap[categoryName];
  await pool.query(
    `INSERT INTO games_${categoryNameSingular} (game_id, ${categoryName}_id)
            VALUES (
            (SELECT id FROM games WHERE name = $1),
            (SELECT id FROM ${categoryNameSingular} WHERE name = $2)
            )
        `,
    [gameName, item],
  );
}

async function updateGame(id, name, description) {
  await pool.query(
    "UPDATE games SET name = $1, description = $2 WHERE id = $3",
    [name, description, id],
  );
}

async function updateCategoryName(categoryTable, id, name) {
  await pool.query(
    `UPDATE ${categoryTable}
     SET name = $1 WHERE id = $2;
    `,
    [name, id],
  );
}

async function removeRelation(categoryName, gameID, categoryID) {
  const categoryNameSingular = singularMap[categoryName];
  await pool.query(
    `DELETE FROM games_${categoryName} WHERE game_id = $1 AND ${categoryNameSingular}_id = $2;
    `,
    [gameID, categoryID],
  );
}

async function removeGame(gameId) {
  await pool.query(`DELETE FROM games WHERE games.id = $1`, [gameId]);
}

async function removeCategoryItem(categoryName, itemId) {
  await pool.query(
    `DELETE FROM ${categoryName} WHERE ${categoryName}.id = $1`,
    [itemId],
  );
}

module.exports = {
  getAllGames,
  getGame,
  getCategories,
  getCategory,
  getCategoryItem,
  addNewGame,
  addRelation,
  addNewCategory,
  updateGame,
  updateCategoryName,
  removeRelation,
  removeGame,
  removeCategoryItem,
};
