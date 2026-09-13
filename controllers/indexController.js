const db = require("../db/query");

async function indexGet(req, res) {
  res.render("index");
}

async function addGameGet(req, res) {
  res.render("gamesForm", { categories: req.categories, errors: [] });
}

async function addGamePost(req, res) {
  const { gameName, gameDescription, ...categories } = req.body;
  await db.addNewGame(gameName, gameDescription);
  for (const [name, category] of Object.entries(categories)) {
    if (!category[name]) {
      continue;
    }
    if (Array.isArray(category)) {
      for (const item of category) {
        if (item !== "") {
          await db.addRelation(name, gameName, item);
        }
      }
    } else {
      await db.addRelation(name, gameName, category);
    }
  }
  res.redirect("/games");
}

async function addCategoryGet(req, res) {
  res.render("categoryForm", {
    categories: Object.keys(req.categories),
    errors: [],
  });
}

async function addCategoryPost(req, res) {
  for (const [tableName, value] of Object.entries(req.body)) {
    if (!value) {
      continue;
    }

    await db.addNewCategory(tableName, value);
  }
  res.redirect("/");
}

module.exports = {
  indexGet,
  addGameGet,
  addGamePost,
  addCategoryGet,
  addCategoryPost,
};
