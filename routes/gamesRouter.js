const { Router } = require("express");
const { gamesGet, editGameGet, editGamePost, deleteRelatedCategory, assignCategoryGet, assignCategoryPost, removeGame} = require("../controllers/gamesController");
const gamesRouter = Router()

gamesRouter.get("/", gamesGet);
gamesRouter.get("/edit/:id", editGameGet);
gamesRouter.post("/edit/:id", editGamePost);
gamesRouter.post("/:category/deleteRelation/", deleteRelatedCategory);
gamesRouter.get("/:gameName/:gameId/assignCategories", assignCategoryGet);
gamesRouter.post("/:gameName/:gameId/assignCategories", assignCategoryPost);
gamesRouter.post("/delete/:gameId", removeGame);

module.exports = gamesRouter