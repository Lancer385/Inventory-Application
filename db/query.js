const { Pool } = require('./pool');

async function getAllGames(){
    const { rows } = await pool.query("SELECT * FROM games");
    return rows;
}

async function addNewGame(name, description = ""){
    await pool.query("INSERT INTO games (name, description) VALUES ($1, $2)", [name, description]);
}

async function addNewCategory(tableName, column, name){
    await pool.query(`INSERT INTO ${tableName} (${column}) VALUES ($1)`, [name])
};

async function addRelation(junctionName, gameName, category){
    await pool.query(
        `INSERT INTO ${junctionName} (game_id, ${category.name}_id)
            VALUES (
            (SELECT id FROM games WHERE name = $1),
            (SELECT id FROM ${category.tableName} WHERE ${category.column} = $2)
            )
        `
    ,[gameName, category.value])
}