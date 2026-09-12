const {
  indexGet,
  addGameGet,
  addGamePost,
  addCategoryGet,
  addCategoryPost,
} = require("../controllers/indexController");
const { Router } = require("express");
const { loadCategories } = require("../middlewares/categoriesMiddleware");
const indexRouter = Router();

indexRouter.get("/", indexGet);
indexRouter.get("/addGame", loadCategories, addGameGet);
indexRouter.post("/newGame", addGamePost);
indexRouter.get("/addCategory", loadCategories, addCategoryGet);
indexRouter.post("/newCategory", addCategoryPost);

module.exports = indexRouter;
