const pool  = require('./pool');


async function queryGame(gameID = null) {
    const clause = gameID ? `WHERE games.id = $1` : '';
    const id = gameID ? [gameID] : [];

    const [platforms, genres, developers] = await Promise.all([
        pool.query(`SELECT games.id AS "gameID", games.name AS "gameName", games.description AS "gameDescription",
                   ARRAY_AGG(platforms.name) AS platforms 
                   FROM games 
                   LEFT JOIN games_platforms ON games.id = games_platforms.game_id 
                   LEFT JOIN platforms ON platforms.id = platform_id
                   ${clause}
                   GROUP BY games.id
                   ORDER BY games.id
                   `, id),

        pool.query(`SELECT games.id AS "gameID", games.name AS "gameName", games.description AS "gameDescription",
                   ARRAY_AGG(genres.name) AS genres 
                   FROM games 
                   LEFT JOIN games_genres ON games.id = games_genres.game_id 
                   LEFT JOIN genres ON genres.id = genre_id
                   ${clause}
                   GROUP BY games.id
                   ORDER BY games.id`, id),

        pool.query(`SELECT games.id AS "gameID", games.name AS "gameName", games.description AS "gameDescription",
                   ARRAY_AGG(developers.name) AS developers
                   FROM games
                   LEFT JOIN games_developers ON games.id = games_developers.game_id 
                   LEFT JOIN developers ON developers.id = developer_id
                   ${clause}
                   GROUP BY games.id
                   ORDER BY games.id`, id),
    ]);
    const combinedGames = [...platforms.rows, ...genres.rows, ...developers.rows];
    const result = combinedGames.reduce((acc, current) => {
        acc[current.gameID] = { ...acc[current.gameID], ...current };
        return acc;
        }, {});
    return gameID? Object.values(result[0]): Object.values(result);
}

const getAllGames = () => queryGame();
const getGame = (id) => queryGame(id);

async function getCategories() {
    const platforms = (await pool.query (`SELECT * FROM platforms`)).rows
    const genres = (await pool.query (`SELECT * FROM genres`)).rows
    const developers = (await pool.query (`SELECT * FROM developers`)).rows;
    return {platforms: platforms, genres: genres, developers: developers}
}

async function queryCategory(categoryName, categoryID = null){
    const clause = categoryID ? `WHERE id = 1$`: ``;
    const id = categoryID ? [categoryID] : [];
    const category = await pool.query(`
        SELECT games.id AS "gameID", ${categoryName}_id, ${categoryName}s.name AS ${categoryName}s,games.name AS "gameName",
                   FROM games
                   LEFT JOIN games_${categoryName}s ON games.id = games_${categoryName}s.game_id 
                   LEFT JOIN ${categoryName}s ON ${categoryName}s.id = ${categoryName}_id; ${clause}`, id);
    return category.rows;
}

const getCategory = (categoryName) => queryCategory(categoryName);
const getCategoryItem = (categoryName, id) => queryCategory(categoryName, id);

async function addNewGame(name, description = ""){
    await pool.query("INSERT INTO games (name, description) VALUES ($1, $2)", [name, description]);
};

async function addNewCategory(tableName, name){
    await pool.query(`INSERT INTO ${tableName} (name) VALUES ($1)`, [name]);
};

async function addRelation(junctionName,category, gameName, tableName, item){
    await pool.query(
        `INSERT INTO ${junctionName} (game_id, ${category}_id)
            VALUES (
            (SELECT id FROM games WHERE name = $1),
            (SELECT id FROM ${tableName} WHERE name = $2)
            )
        `
    ,[gameName, item]);
};

async function removeRelation(junctionName, category, gameID, categoryID){
 await pool.query(
    `DELETE FROM ${junctionName} WHERE game_id = $1 AND ${category}_id = $2;
    `, [gameID, categoryID]
 )
}

async function updateGame(id, name, description){
    await pool.query("UPDATE games SET name = $1, description = $2 WHERE id = $3", [name, description, id])
}


async function updateCategoryName(categoryTable, id, name){
    await pool.query(`UPDATE FROM ${categoryTable}
     SET name = $1 WHERE id = $2;
    `, [name, id])
}

module.exports = {
    getAllGames,
    getGame,
    getCategories,
    addNewGame,
    addRelation,
    addNewCategory,
    removeRelation,
    updateGame,
    updateCategoryName,
}


getAllGames()