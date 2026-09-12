const express = require("express");
const app = express();
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const gamesRouter = require("./routes/gamesRouter");
const categoriesRouter = require("./routes/CategoriesRouter");
const CustomError = require("./utils/customError");
const PORT = process.env.PORT || 8000;

app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.use("/games", gamesRouter);
app.use("/categories", categoriesRouter);
app.use("/", indexRouter);
/* eslint-disable-next-line no-unused-vars */
app.use((req, res) => {
  throw new CustomError("Page not found", 404);
});
/* eslint-disable-next-line no-unused-vars */
app.use((err, req, res, next) => {
  if (err.code === "23505") {
    res.status(409).render("error", {
      error: {
        code: 409,
        message: "A record with the entry already exists",
      },
    });
  } else {
    res.status(err.statusCode || 500).render("error", {
      error: {
        code: err.statusCode,
        message: err.message,
      },
    });
  }
});

app.listen(PORT, () => {
  console.log(`listening to port: ${PORT}`);
  console.log(`go to : http://localhost:${PORT}/`);
});
