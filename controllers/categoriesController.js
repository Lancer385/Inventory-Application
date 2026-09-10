const db = require("../db/query");


async function categoriesGet(req, res){
   const categories = await db.getCategories();
   res.render("viewCategories", { categories})
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
    const category = await db.getCategory(categoryName);
    res.render("viewCategory", {category,  categoryName});
};

async function editCategoryItemGet(req, res){
    const categoryName = req.params.category;
    const item = await db.getCategoryItem(categoryName, Number(req.params.id));
    res.render("editCategoryItem", {item, categoryName});

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
