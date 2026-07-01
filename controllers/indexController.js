const db = require("../db/query");

async function indexGet(req, res){
    res.render("index");
}

module.exports = {
    indexGet
}
    

