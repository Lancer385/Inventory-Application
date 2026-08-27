const { Router } = require("express");
const { indexGet } = require("../controllers/indexController");
const { gamesGet, addGameGet, addGamePost} = require("../controllers/gamesController");
const { categoriesGet, addCategoryGet, addCategoryPost } = require("../controllers/categoriesController");
const router = Router()



router.get("/", indexGet);
router.get("/games", gamesGet);
router.get("/categories", categoriesGet);
router.get("/addGame", addGameGet);
router.post("/newGame", addGamePost);
router.get("/addCategory", addCategoryGet);
router.post("/newCategory", addCategoryPost)
module.exports = router