require('dotenv').config();
const express = require("express")
const app = express();
const path = require("node:path");
const indexRouter = require("./routers/indexRouter")
const PORT = process.env.PORT || 8000

app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use("/", indexRouter)

app.listen(PORT, () => {
    console.log(`listening to port: ${PORT}`)
})