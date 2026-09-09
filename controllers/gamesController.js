const db = require("../db/query");


async function gamesGet(req, res){
    const games =  await db.getAllGames();
    res.render("viewGames", { games: games });
};

async function addGameGet(req, res){
    const categories = await db.getCategories();
    res.render("gamesForm", {categories: categories});
}


async function addGamePost(req, res){
    await db.addNewGame(req.body.gameName, req.body.gameDescription);
    for (const category of [{value: req.body.genres, name: "genre"}, {value: req.body.platforms, name: "platform"}, {value: req.body.developers, name: "developer"}]){
        if (!category.value){
            continue;
        }
        if(Array.isArray(category.value)){
        for (const item of category.value){
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

async function editGameGet(req,res){
    const game = await db.getGame(req.params.id);
    res.render("editGames", {game: game})
}

async function editGamePost(req, res){
    const {gameName, gameDescription} = req.body;
    await db.updateGame(req.params.id, gameName, gameDescription);
    res.redirect(`/game/edit/` + req.params.id);
}


async function deleteRelatedCategory(req, res){
    const categoryNameSingular = req.params.category.slice(0, req.params.category.length - 1);
    const {gameId, itemId} = req.body;
    await db.removeRelation(req.params.category, categoryNameSingular, gameId, itemId);
    res.json({ success: true })
}
module.exports = {
    gamesGet,
    addGameGet,
    addGamePost,
    editGameGet,
    editGamePost,
    deleteRelatedCategory
}