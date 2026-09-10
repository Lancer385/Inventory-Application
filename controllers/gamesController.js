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
    const {gameName, gameDescription, ...categories} = req.body
    await db.addNewGame(gameName, gameDescription);
    for (const [name, category] of Object.entries(categories)){
        const singular = name.slice(0, name.length - 1);
        if (!category[name]){
            continue;
        }
        if(Array.isArray(category)){
            for (const item of category){
                if (item !== ""){
                    await db.addRelation(singular, gameName, item);
                }
            }
        }
        else {
              await db.addRelation(singular, gameName, category);
        }
    }
    res.redirect("/games");
}

async function editGameGet(req,res){
    const {gameID, gameName, gameDescription, ...categories} = await db.getGame(req.params.id);
    res.render("editGames", {gameID: gameID, gameName: gameName, gameDescription: gameDescription, categories: categories})
}

async function editGamePost(req, res){
    const {gameName, gameDescription} = req.body;
    await db.updateGame(req.params.id, gameName, gameDescription);
    res.redirect(`/game/edit/` + req.params.id);
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
     res.render("assignCategory", { gameId:gameID, gameName: gameName, gameDescription: gameDescription, categories: matched});
}

async function assignCategoryPost(req, res){
    const gameName = req.params.gameName
    for (const [name, category] of Object.entries(req.body)){
        const singular = name.slice(0, name.length - 1);
        if (!category){
            continue;
        }
        if(Array.isArray(category)){
            for (const item of category){
                if (item !== ""){
                    
                    await db.addRelation(singular, gameName, item);
                }
            }
        }
        else {
            console
              await db.addRelation(singular, gameName, category);
        }
    } 
    res.redirect("/games");
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
    deleteRelatedCategory,
    assignCategoryGet,
    assignCategoryPost
}