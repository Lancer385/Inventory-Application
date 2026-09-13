const db = require("../db/query");
const CustomError = require("../utils/customError");

async function categoriesGet(req, res) {
  res.render("viewCategories", { categories: req.categories });
}

async function viewCategoryGet(req, res) {
  const categoryName = req.params.category;
  const category = await db.getCategory(categoryName);
  if (!category) {
    throw new CustomError("Requested Category Not Found", 404);
  }
  res.render("viewCategory", { category, categoryName });
}

async function editCategoryItemGet(req, res) {
  const categoryName = req.params.category;
  const item = await db.getCategoryItem(categoryName, Number(req.params.id));
  if (!item) {
    throw new CustomError("Requested Category item Not Found", 404);
  }
  res.render("editCategoryItem", { item, categoryName, errors: [] });
}

async function editCategoryItemPost(req, res) {
  const { name } = req.body;
  await db.updateCategoryName(req.params.category, Number(req.params.id), name);
  res.redirect(`/${req.params.category}/edit/${req.params.id}`);
}

async function removeCategoryItemPost(req, res) {
  const { category, itemId } = req.params;
  await db.removeCategoryItem(category, Number(itemId));
  res.redirect(`/categories/${category}/view/`);
}

module.exports = {
  categoriesGet,
  viewCategoryGet,
  editCategoryItemGet,
  editCategoryItemPost,
  removeCategoryItemPost,
};
