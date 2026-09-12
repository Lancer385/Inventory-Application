const { Router } = require("express");
const { categoriesGet,viewCategoryGet, editCategoryItemGet, editCategoryItemPost, removeCategoryItemPost } = require("../controllers/categoriesController");
const { loadCategories } = require("../middlewares/categoriesMiddleware");
const categoriesRouter = Router()

categoriesRouter.get("/", loadCategories, categoriesGet);
categoriesRouter.get("/:category/view/", viewCategoryGet);
categoriesRouter.get("/:category/edit/:id", editCategoryItemGet);
categoriesRouter.post("/:category/edit/:id", editCategoryItemPost);
categoriesRouter.post("/:category/delete/:itemId", removeCategoryItemPost);

module.exports = categoriesRouter;