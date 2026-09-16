const express = require("express");
const app = express();
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const gamesRouter = require("./routes/gamesRouter");
const categoriesRouter = require("./routes/CategoriesRouter");
const CustomError = require("./utils/customError");
const PORT = process.env.PORT || 8000;
const assetsPath = path.join(__dirname, "public");
const viewsPath = path.join(__dirname, "views");
if (process.env.NODE_ENV !== "production") {
  const livereload = require("livereload");
  const connectLiveReload = require("connect-livereload");

  const liveReloadServer = livereload.createServer({
    exts: ["css", "js", "ejs"],
  });
  liveReloadServer.watch([assetsPath, viewsPath]);
  app.use(connectLiveReload());
}
app.set("views", viewsPath);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(assetsPath));
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
  } else if (err.code === "42P01") {
    res.status(500).render("error", {
      error: {
        code: 500,
        message: "Failed to Connect to or find the database",
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
