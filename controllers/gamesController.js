const db = require("../db/query");


async function gamesGet(req, res){
    const [platforms, genres, developers] =  await db.getAllGames();
    platforms.push(...genres)
    platforms.push(...developers)
    const games = combine(platforms);
    console.log(games)
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
    addGamePost
}
    


function combine(arr, genres = "genres", platforms = "platforms", developers = "developers") {
    console.log(arr)
        const result = arr.reduce((acc, currentItem) => {
        const condition = acc.find(item => item.gameID === currentItem.gameID );
        if (!condition) {
        const newCurr = {
            gameID: currentItem.gameID,
            gameName: currentItem.gameName,
            gameDescription: currentItem.gameDescription,
            [platforms]: currentItem[platforms]? [currentItem[platforms]] : [],
            [genres]: currentItem[genres]? [currentItem[genres]] : [],
            [developers]: currentItem[developers]? [currentItem[developers]] : [],
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