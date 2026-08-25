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
    const {gameName, gameDescription, genre, platform, developer} = req.body;
    await db.addNewGame(gameName, gameDescription);
    for (category of [{value: genre, name: "genre"}, {value: platform, name: "platform"}, {value: developer, name: "developer"}]){
        if(Array.isArray(category.value)){
        for (item of category.value){
            console.log(item)
            if (item !== "" || item === undefined){
                await db.addRelation(`games_${category.name}s`,`${category.name}`, gameName, `${category.name}s`, item)
            }
        }
    }
    else {
        if (category.value !== ""){
            console.log(category.value)
             await db.addRelation(`games_${category.name}s`,`${category.name}`, gameName, `${category.name}s`, category.value)
        }
    }
    }
    console.log(req.body)
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