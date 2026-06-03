const {Router} = require("express")
const indexRouter = Router()

indexRouter.get("/", (req, res) => {
    res.send("test.")
});


module.exports = indexRouter