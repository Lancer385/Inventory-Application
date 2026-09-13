const { Router } = require("express");
const {
  gamesGet,
  editGameGet,
  editGamePost,
  assignCategoryGet,
  assignCategoryPost,
  removeGamePost,
  deleteRelatedCategoryPost,
} = require("../controllers/gamesController");
const { loadCategories } = require("../middlewares/categoriesMiddleware");
const { validateGameEdit } = require("../middlewares/validatorMiddleware");
const gamesRouter = Router();

gamesRouter.get("/", gamesGet);
gamesRouter.get("/edit/:id", editGameGet);
gamesRouter.post("/edit/:id", validateGameEdit, editGamePost);
gamesRouter.get(
  "/:gameName/:gameId/assignCategories",
  loadCategories,
  assignCategoryGet,
);
gamesRouter.post("/:gameName/:gameId/assignCategories", assignCategoryPost);
gamesRouter.post("/delete/:gameId", removeGamePost);
gamesRouter.post("/:category/deleteRelation/", deleteRelatedCategoryPost);

module.exports = gamesRouter;
