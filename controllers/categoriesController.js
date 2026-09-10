const db = require("../db/query");


async function categoriesGet(req, res){
   const categories = await db.getCategories();
   res.render("viewCategories", { categories: categories})
}

async function addCategoryGet(req, res){
    const categories =  await db.getCategories();
    res.render("categoryForm", {categories: Object.keys(categories)});
}

async function addCategoryPost(req,res){
    for (const [tableName, value] of Object.entries(req.body)){
        if (!value){
            continue;
        }
       
        await db.addNewCategory(tableName, value);
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


module.exports = {
    categoriesGet,
    addCategoryGet,
    addCategoryPost,
    viewCategoryGet,
    editCategoryItemGet,
    editCategoryItemPost
};
