const express = require("express")
const app = express();
const path = require("node:path");
const router = require("./routes/router")
const PORT = process.env.PORT || 8000

app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.use("/", router)

app.listen(PORT, () => {
    console.log(`listening to port: ${PORT}`)
})