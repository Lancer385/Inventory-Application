
const { indexGet, addGameGet, addGamePost, addCategoryGet, addCategoryPost } = require("../controllers/indexController");
const { Router } = require("express");
const indexRouter = Router()

indexRouter.get("/", indexGet);
indexRouter.get("/addGame", addGameGet);
indexRouter.post("/newGame", addGamePost);
indexRouter.get("/addCategory", addCategoryGet);
indexRouter.post("/newCategory", addCategoryPost);

module.exports = indexRouter;


