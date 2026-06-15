const pool  = require('./pool');

async function getAllGames(){
    const games_platforms = (await pool.query('SELECT games.id AS "gameID", games.name AS "gameName" ,games.description AS "gameDescription",platforms.name AS platforms FROM games JOIN games_platforms ON games.id = games_platforms.game_id JOIN platforms ON platforms.id = platform_id')).rows;
    const games_genres = (await pool.query('SELECT games.id AS "gameID", games.name AS "gameName" ,games.description AS "gameDescription",genres.types AS genres FROM games JOIN games_genres ON games.id = games_genres.game_id JOIN genres ON genres.id = genre_id')).rows;
    const games_developers = (await pool.query('SELECT games.id AS "gameID", games.name AS "gameName" ,games.description AS "gameDescription",developers.name AS developers FROM games JOIN games_developers ON games.id = games_developers.game_id JOIN developers ON developers.id = developer_id')).rows;
    games_platforms.push(...games_genres);
    games_platforms.push(...games_developers);
    const result = combine(games_platforms, "genres", "platforms", "developers");
    return result;
};

async function getCategories() {
    const [platforms, genres, developers] = await Promise.all([
        pool.query(`SELECT * FROM platforms`),
        pool.query(`SELECT * FROM genres`),
        pool.query(`SELECT * FROM developers`)
    ]);

    return [
        {
            name: "platforms",
            value: platforms.rows
        },
        {
            name: "genres",
            value: genres.rows
        },
        {
            name: "developers",
            value: developers.rows
        }
    ]
}

async function addNewGame(name, description = ""){
    await pool.query("INSERT INTO games (name, description) VALUES ($1, $2)", [name, description]);
};

async function addNewCategory(tableName, column, name){
    await pool.query(`INSERT INTO ${tableName} (${column}) VALUES ($1)`, [name]);
};

async function addRelation(junctionName, gameName, category){
    await pool.query(
        `INSERT INTO ${junctionName} (game_id, ${category.name}_id)
            VALUES (
            (SELECT id FROM games WHERE name = $1),
            (SELECT id FROM ${category.tableName} WHERE ${category.column} = $2)
            )
        `
    ,[gameName, category.value]);
};



function combine(arr, genres, platforms, developers) {
        const result = arr.reduce((acc, currentItem) => {
        const condition = acc.find(item => item.gameID === currentItem.gameID );
        if (!condition) {
        const newCurr = {
            gameID: currentItem.gameID,
            gameName: currentItem.gameName,
            gameDescription: currentItem.gameDescription,
            [platforms]: [currentItem[platforms]],
            [genres]: [],
            [developers]: []
        }
        return acc.concat([newCurr])
        } else {
            currentItem[genres] && condition[genres].push(currentItem[genres]);
            currentItem[platforms] && condition[platforms].push(currentItem[platforms]);
            currentItem[developers] && condition[developers].push(currentItem[developers]);
            return acc;
        }
    }, [])
    return result;
}

