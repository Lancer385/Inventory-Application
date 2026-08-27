const db = require("../db/query");


async function categoriesGet(req, res){
   const categories = await db.getCategories();
   res.render("categories", { categories: categories})
}

async function addCategoryGet(req, res){
    res.render("categoryForm");
}

async function addCategoryPost(req,res){
    const {platforms, genres, developers} = req.body;
    for (category of [{tableName: "platforms", value: platforms}, {tableName: "genres", value: genres}, {tableName: "developers", value: developers}]){
         console.log(category)
        if (!category.value){
            continue;
        }
       
        await db.addNewCategory(category.tableName, category.value);
    }
     res.redirect("/");
}
module.exports = {
    categoriesGet,
    addCategoryGet,
    addCategoryPost
}
    


