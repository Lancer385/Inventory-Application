const { Router } = require("express");
const {
  categoriesGet,
  viewCategoryGet,
  editCategoryItemGet,
  editCategoryItemPost,
  removeCategoryItemPost,
} = require("../controllers/categoriesController");
const { loadCategories } = require("../middlewares/categoriesMiddleware");
const { validateCategoryEdit } = require("../middlewares/validatorMiddleware");
const categoriesRouter = Router();

categoriesRouter.get("/", loadCategories, categoriesGet);
categoriesRouter.get("/:category/view/", viewCategoryGet);
categoriesRouter.get("/:category/edit/:id", editCategoryItemGet);
categoriesRouter.post(
  "/:category/edit/:id",
  validateCategoryEdit,
  editCategoryItemPost,
);
categoriesRouter.post("/:category/delete/:itemId", removeCategoryItemPost);

module.exports = categoriesRouter;
