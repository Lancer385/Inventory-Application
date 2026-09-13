const db = require("../db/query");
const CustomError = require("../utils/customError");

async function gamesGet(req, res) {
  const games = await db.getAllGames();
  res.render("viewGames", { games });
}

async function editGameGet(req, res) {
  const game = await db.getGame(req.params.id);
  const { gameID, gameName, gameDescription, ...categories } = game;
  res.render("editGames", {
    gameID,
    gameName,
    gameDescription,
    categories,
    errors: [],
  });
}

async function editGamePost(req, res) {
  const { gameName, gameDescription } = req.body;
  await db.updateGame(req.params.id, gameName, gameDescription);
  res.redirect(`/games/edit/` + req.params.id);
}

async function assignCategoryGet(req, res) {
  const game = await db.getGame(req.params.gameId);
  if (!game) {
    throw new CustomError("Requested game not Found", 404);
  }
  const { gameID, gameName, gameDescription, ...assignedCategories } = game;
  const matched = {};
  for (const category of Object.keys(assignedCategories)) {
    let result = req.categories[category].filter(
      (object1) =>
        !assignedCategories[category].some(
          (object2) => object1.id === object2.id,
        ),
    );
    if (result.length !== 0) {
      matched[category] = result;
    }
  }
  res.render("assignCategory", {
    gameID,
    gameName,
    gameDescription,
    categories: matched,
  });
}

async function assignCategoryPost(req, res) {
  const gameName = req.params.gameName;
  for (const [name, category] of Object.entries(req.body)) {
    if (!category) {
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

async function deleteRelatedCategoryPost(req, res) {
  const { gameId, itemId } = req.body;
  await db.removeRelation(req.params.category, gameId, itemId);
  res.json({ success: true });
}

async function removeGamePost(req, res) {
  const gameID = req.params.gameId;
  await db.removeGame(Number(gameID));
  res.redirect("/games");
}
module.exports = {
  gamesGet,
  editGameGet,
  editGamePost,
  assignCategoryGet,
  assignCategoryPost,
  deleteRelatedCategoryPost,
  removeGamePost,
};
