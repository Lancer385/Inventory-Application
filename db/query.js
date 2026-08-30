const pool  = require('./pool');


async function queryGame(gameID = null) {
    const clause = gameID ? `WHERE games.id = $1` : '';
    const id = gameID ? [gameID] : [];

    const [platforms, genres, developers] = await Promise.all([
        pool.query(`SELECT games.id AS "gameID", games.name AS "gameName", games.description AS "gameDescription",
                   platforms.name AS platforms 
                   FROM games 
                   LEFT JOIN games_platforms ON games.id = games_platforms.game_id 
                   LEFT JOIN platforms ON platforms.id = platform_id
                   ${clause}`, id),

        pool.query(`SELECT games.id AS "gameID", games.name AS "gameName", games.description AS "gameDescription",
                   genres.name AS genres 
                   FROM games 
                   LEFT JOIN games_genres ON games.id = games_genres.game_id 
                   LEFT JOIN genres ON genres.id = genre_id
                   ${clause}`, id),

        pool.query(`SELECT games.id AS "gameID", games.name AS "gameName", games.description AS "gameDescription",
                   developers.name AS developers 
                   FROM games 
                   LEFT JOIN games_developers ON games.id = games_developers.game_id 
                   LEFT JOIN developers ON developers.id = developer_id
                   ${clause}`, id),
    ]);
    const result = [...platforms.rows, ...genres.rows, ...developers.rows]
    return combineGame(result);
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
    const category = await pool.query(`SELECT id, name FROM ${categoryName} ${clause}`, id);
    console.log(category.rows)
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
    `DELETE FROM ${junctionName} WHERE game_id = $1 AND ${category}_id = $2
    `, [gameID, categoryID]
 )
}

async function updateGameName(id, name){
    `UPDATE FROM games
     SET name = $1 WHERE id = $2
    `, [name, id]
}
async function updateGameDesc(id,description){
    `UPDATE FROM games
     SET description = $1 WHERE id = $2
    `, [description, id]
}

async function updateCategoryName(categoryTable, id, name){
    `UPDATE FROM ${categoryTable}
     SET name = $1 WHERE id = $2
    `, [name, id]
}

module.exports = {
    getAllGames,
    getGame,
    getCategories,
    addNewGame,
    addRelation,
    addNewCategory,
    removeRelation,
    updateGameName,
    updateGameDesc,
    updateCategoryName,
}

// helper functions
function combineGame(arr) {
        const result = arr.reduce((acc, {gameID, gameName, gameDescription, platforms, genres, developers}) => {
        acc[gameID] ??= {
            gameID: gameID,
            gameName: gameName,
            gameDescription: gameDescription,
            platforms: [],
            genres: [],
            developers: [],
        }
        
       for (const category of [{name: "platforms", value: platforms}, {name: "genres", value: genres}, {name: "developers", value: developers}]){
        if (category.value){
        if (Array.isArray(category.value)){
            acc[gameID][category.name].push(...category.value)
        }   
        else {
            acc[gameID][category.name].push(category.value);
        }
        }
       }
       return acc
    }, {})
    return Object.values(result);
}