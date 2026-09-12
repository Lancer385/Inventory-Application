const db = require("../db/query");

async function loadCategories(req, res, next) {
  const categories = await db.getCategories();
  req.categories = categories;
  next();
}

module.exports = { loadCategories };
