const db = require("../db/query");


async function categoriesGet(req, res){
   const categories = await db.getCategories();
   res.render("categories", { categories: categories})
}


module.exports = {
    categoriesGet
}
    


