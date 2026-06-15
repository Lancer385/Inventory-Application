const { Router } = require("express")
const router = Router()
const { indexGet, gamesGet, categoriesGet } = require('../controllers/Controller');


router.get("/", indexGet);
router.get("/games", gamesGet);
router.get("/categories", categoriesGet);

module.exports = router