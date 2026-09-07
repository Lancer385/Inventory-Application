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
    for (category of [{tableName: "platforms", value: platforms}, {tableName: "genres", value: genres}, {tableName: "developers", value: developers}]){
        if (!category.value){
            continue;
        }
       
        await db.addNewCategory(category.tableName, category.value);
    }
     res.redirect("/");
};
async function viewCategoryGet(req, res){
    const category = await db.getCategory(req.params.category);
    res.render("viewCategory", {category: category, categoryName: req.params.category});
};

async function editCategoryItemGet(req, res){
    const categoryItem = await db.getCategoryItem(req.params.category, req.params.id);
    res.render("editCategoryItem", {item: categoryItem, categoryName: req.params.category});

}

async function editCategoryItemPost(req,res){
    const {name} = req.body;
    await db.updateCategoryName(req.params.category, req.params.id, name);
    res.redirect(`/${req.params.category}/edit/${req.params.id}`);
}
module.exports = {
    categoriesGet,
    addCategoryGet,
    addCategoryPost,
    viewCategoryGet,
    editCategoryItemGet,
    editCategoryItemPost
};
    


