const { Router } = require("express");
const { indexGet } = require("../controllers/indexController");
const { gamesGet, addGameGet, addGamePost, editGameGet, editGamePost, deleteRelatedCategory, assignCategoryGet, assignCategoryPost} = require("../controllers/gamesController");
const { categoriesGet, addCategoryGet, addCategoryPost, viewCategoryGet, editCategoryItemGet, editCategoryItemPost } = require("../controllers/categoriesController");
const router = Router()



router.get("/", indexGet);
router.get("/games", gamesGet);
router.get("/categories", categoriesGet);
router.get("/addGame", addGameGet);
router.post("/newGame", addGamePost);
router.get("/addCategory", addCategoryGet);
router.post("/newCategory", addCategoryPost);
router.get("/game/edit/:id", editGameGet);
router.post("/game/edit/:id", editGamePost);
router.get("/:category/view/", viewCategoryGet);
router.get("/:category/edit/:id", editCategoryItemGet);
router.post("/:category/edit/:id", editCategoryItemPost);
router.post("/:category/deleteRelation/", deleteRelatedCategory);
router.get("/:gameName/:gameId/assignCategories", assignCategoryGet)
router.post("/:gameName/:gameId/assignCategories", assignCategoryPost)
module.exports = router