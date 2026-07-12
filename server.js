const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/generate", require("./routes/generate"));

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});