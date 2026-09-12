const { Router } = require("express");
const { categoriesGet,viewCategoryGet, editCategoryItemGet, editCategoryItemPost, removeCategoryItem } = require("../controllers/categoriesController");
const categoriesRouter = Router()

categoriesRouter.get("/", categoriesGet);
categoriesRouter.get("/:category/view/", viewCategoryGet);
categoriesRouter.get("/:category/edit/:id", editCategoryItemGet);
categoriesRouter.post("/:category/edit/:id", editCategoryItemPost);
categoriesRouter.post("/:category/delete/:itemId", removeCategoryItem);

module.exports = categoriesRouter;