const { body, validationResult } = require("express-validator");
const db = require("../db/query");

const validateGameInput = [
  body("gameName").trim().notEmpty().withMessage("Name can not be empty."),
  body("gameDescription")
    .trim()
    .notEmpty()
    .withMessage("Description can not be empty.")
    .isLength({ min: 20, max: 200 })
    .withMessage("Description must be between 20 and 200 characters"),
];

const validateCategoriesInput = [
  body().custom((_, { req }) => {
    if (Object.keys(req.body).length === 0) {
      throw new Error("At least one Category Value must be Submitted");
    }
    const values = Object.values(req.body);
    const valid = values.filter((val) => val.trim() !== "");
    if (valid.length === 0) {
      throw new Error(`At least one Category Value must be Submitted`);
    }
    return true;
  }),
];

const validateCategoryInput = [
  body().custom((_, { req }) => {
    const input = Object.values(req.body)[0];
    if (!input.trim()) {
      throw new Error("Name can not be empty");
    }
    return true;
  }),
];
async function validDataGameAdd(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .render("gamesForm", {
        categories: req.categories,
        errors: errors.array(),
      });
  }
  next();
}

async function validDataGameEdit(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const game = await db.getGame(req.params.id);
    const { gameID, gameName, gameDescription, ...categories } = game;
    return res
      .status(400)
      .render("editGames", {
        gameID,
        gameName,
        gameDescription,
        categories,
        errors: errors.array(),
      });
  }
  next();
}

async function validDataCategoriesAdd(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .render("categoryForm", {
        categories: Object.keys(req.categories),
        errors: errors.array(),
      });
  }
  next();
}

async function validDataCategoryEdit(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const categoryName = req.params.category;
    const item = await db.getCategoryItem(categoryName, Number(req.params.id));
    return res
      .status(400)
      .render("editCategoryItem", {
        item,
        categoryName,
        errors: errors.array(),
      });
  }
  next();
}

exports.validateGameAdd = [validateGameInput, validDataGameAdd];
exports.validateCategoriesAdd = [
  validateCategoriesInput,
  validDataCategoriesAdd,
];
exports.validateGameEdit = [validateGameInput, validDataGameEdit];
exports.validateCategoryEdit = [validateCategoryInput, validDataCategoryEdit];
