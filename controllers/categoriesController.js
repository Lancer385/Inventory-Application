const db = require("../db/query");
const CustomError = require("../utils/customError");


async function categoriesGet(req, res){
   const categories = await db.getCategories();
   if (!categories){
    throw new CustomError("Couldn't Find the requested Categories", 404)
   }
   res.render("viewCategories", { categories })
}


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

async function removeCategoryItem(req, res){
    const {category, itemId} = req.params;
    await db.removeCategoryItem(category, Number(itemId));
    res.redirect(`/categories/${category}/view/`)
}


module.exports = {
    categoriesGet,
    viewCategoryGet,
    editCategoryItemGet,
    editCategoryItemPost,
    removeCategoryItem
};
