const express = require("express")
const app = express();
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const gamesRouter = require("./routes/gamesRouter");
const categoriesRouter = require("./routes/CategoriesRouter");
const PORT = process.env.PORT || 8000

app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.use("/games", gamesRouter);
app.use("/categories", categoriesRouter);
app.use("/", indexRouter);
app.listen(PORT, () => {
    console.log(`listening to port: ${PORT}`)
    console.log(`go to : http://localhost:${PORT}/`)
})