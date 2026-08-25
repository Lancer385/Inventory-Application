const { Router } = require("express");
const { indexGet } = require("../controllers/indexController");
const { gamesGet, addGameGet, addGamePost } = require("../controllers/gamesController");
const { categoriesGet } = require("../controllers/categoriesController");
const router = Router()



router.get("/", indexGet);
router.get("/games", gamesGet);
router.get("/categories", categoriesGet);
router.get("/addGame", addGameGet);
router.post("/newGame", addGamePost);
module.exports = router