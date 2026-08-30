const db = require("../db/query");


async function gamesGet(req, res){
    const games =  await db.getAllGames();
    res.render("games", { games: games });
};

async function addGameGet(req, res){
    const categories = await db.getCategories();
    res.render("gamesForm", {categories: categories});
}


async function addGamePost(req, res){
    await db.addNewGame(req.body.gameName, req.body.gameDescription);
    for (category of [{value: req.body.genre, name: "genre"}, {value: req.body.platform, name: "platform"}, {value: req.body.developer, name: "developer"}]){
        if (!category.value){
            continue;
        }
        if(Array.isArray(category.value)){
        for (item of category.value){
            if (item !== ""){
                await db.addRelation(`games_${category.name}s`,`${category.name}`, req.body.gameName, `${category.name}s`, item)
            }
        }
    }
        else {
              await db.addRelation(`games_${category.name}s`,`${category.name}`, req.body.gameName, `${category.name}s`, category.value)
        }
    }
    res.redirect("/");
}

module.exports = {
    gamesGet,
    addGameGet,
    addGamePost,
}