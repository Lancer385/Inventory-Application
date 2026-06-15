const db = require("../db/query");

async function indexGet(req, res){
    res.render("index");
}

async function gamesGet(req, res){
    const [platforms, genres, developers] =  await db.getAllGames();
    platforms.push(...genres)
    platforms.push(...developers)
    const games = combine(platforms);
    res.render("games", { games: games });
};

async function categoriesGet(req, res){
   const categories = await db.getCategories();

   res.render("categories", { categories: categories})
}

module.exports = {
    indexGet,
    gamesGet,
    categoriesGet
}
    


function combine(arr, genres = "genres", platforms = "platforms", developers = "developers") {
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