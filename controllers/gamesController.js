const db = require("../db/query");


async function gamesGet(req, res){
    const games =  await db.getAllGames();
    res.render("viewGames", { games });
};


async function editGameGet(req,res){
    const {gameID, gameName, gameDescription, ...categories} = await db.getGame(req.params.id);
    res.render("editGames", {gameID, gameName, gameDescription, categories})
}

async function editGamePost(req, res){
    const {gameName, gameDescription} = req.body;
    await db.updateGame(req.params.id, gameName, gameDescription);
    res.redirect(`/games/edit/` + req.params.id);
}

async function assignCategoryGet(req, res) {
    const categories = await db.getCategories();
    const { gameID, gameName, gameDescription, ...assignedCategories } = await db.getGame(req.params.gameId);
    const matched = {}
    for (const category of Object.keys(assignedCategories)){
        let result = categories[category].filter(object1 => !assignedCategories[category].some(object2 => object1.id === object2.id));
        if (result.length !== 0) {
            matched[category] = result;
        };
    };
     res.render("assignCategory", { gameID ,gameName, gameDescription, categories: matched});
}

async function assignCategoryPost(req, res){
    const gameName = req.params.gameName
    for (const [name, category] of Object.entries(req.body)){
        if (!category){
            continue;
        }
        if(Array.isArray(category)){
            for (const item of category){
                if (item !== ""){
                    
                    await db.addRelation(name, gameName, item);
                }
            }
        }
        else {
              await db.addRelation(name, gameName, category);
        }
    } 
    res.redirect("/games");
}


async function deleteRelatedCategory(req, res){
    const {gameId, itemId} = req.body;
    await db.removeRelation(req.params.category, gameId, itemId);
    res.json({ success: true })
}


async function removeGame(req, res){
    const gameID = req.params.gameId;
    await db.removeGame(Number(gameID));
    res.redirect("/games")
}
module.exports = {
    gamesGet,
    editGameGet,
    editGamePost, 
    assignCategoryGet,
    assignCategoryPost,
    deleteRelatedCategory,
    removeGame
}