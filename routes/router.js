const { Router } = require("express");
const { indexGet } = require("../controllers/indexController");
const { gamesGet, addGameGet, addGamePost, editGameGet, editGamePost} = require("../controllers/gamesController");
const { categoriesGet, addCategoryGet, addCategoryPost } = require("../controllers/categoriesController");
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
//router.get("/game/add/genre",);
//router.get("/game/add/platform", );
//router.get("/game/add/developer", );
module.exports = router