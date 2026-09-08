const db = require("../db/query");


async function categoriesGet(req, res){
   const categories = await db.getCategories();
   res.render("viewCategories", { categories: categories})
}

async function addCategoryGet(req, res){
    res.render("categoryForm");
}

async function addCategoryPost(req,res){
    const {platforms, genres, developers} = req.body;
    for (const category of [{tableName: "platforms", value: platforms}, {tableName: "genres", value: genres}, {tableName: "developers", value: developers}]){
        if (!category.value){
            continue;
        }
       
        await db.addNewCategory(category.tableName, category.value);
    }
     res.redirect("/");
};
async function viewCategoryGet(req, res){
    const categoryName = req.params.category;
    const categoryNameSingular = categoryName.slice(0, req.params.category.length - 1);
    const category = await db.getCategory(categoryName, categoryNameSingular);
    res.render("viewCategory", {category: category, categoryName: categoryName});
};

async function editCategoryItemGet(req, res){
    const categoryName = req.params.category;
    const categoryNameSingular = categoryName.slice(0, categoryName.length - 1);
    const categoryItem = await db.getCategoryItem(categoryName, categoryNameSingular, Number(req.params.id));
    res.render("editCategoryItem", {item: categoryItem, categoryName: categoryName});

}

async function editCategoryItemPost(req,res){
    const {name} = req.body;
    await db.updateCategoryName(req.params.category, Number(req.params.id), name);
    res.redirect(`/${req.params.category}/edit/${req.params.id}`);
}

async function deleteRelatedGames(req, res){
    const categoryNameSingular = req.params.category.slice(0, req.params.category.length - 1);
    // the id from the body is the category item id, where is the id from the parameter is the game id.
    await db.removeRelation(req.params.category, categoryNameSingular,Number(req.params.id),Number(req.body.id));
    res.json({ success: true })
}
module.exports = {
    categoriesGet,
    addCategoryGet,
    addCategoryPost,
    viewCategoryGet,
    editCategoryItemGet,
    editCategoryItemPost,
    deleteRelatedGames
};
    


