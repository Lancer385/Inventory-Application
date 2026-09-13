const {
  indexGet,
  addGameGet,
  addGamePost,
  addCategoryGet,
  addCategoryPost,
} = require("../controllers/indexController");
const { Router } = require("express");
const { loadCategories } = require("../middlewares/categoriesMiddleware");
const {
  validateGameAdd,
  validateCategoriesAdd,
} = require("../middlewares/validatorMiddleware");
const indexRouter = Router();

indexRouter.get("/", indexGet);
indexRouter.get("/addGame", loadCategories, addGameGet);
indexRouter.post("/newGame", loadCategories, validateGameAdd, addGamePost);
indexRouter.get("/addCategory", loadCategories, addCategoryGet);
indexRouter.post(
  "/newCategory",
  loadCategories,
  validateCategoriesAdd,
  addCategoryPost,
);
module.exports = indexRouter;
