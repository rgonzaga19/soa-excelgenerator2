const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/generate", require("./routes/generate"));

// Returns a promise that resolves once the server is actually listening,
// instead of firing app.listen() blind. This lets electron-main.js wait
// for the real ready signal rather than guessing with a fixed timeout.
function start(port = 3000) {
    return new Promise((resolve) => {
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
            resolve();
        });
    });
}

// If this file is run directly (e.g. `node server.js`), start the server
// immediately — same as the original behavior. When required as a module
// (e.g. by electron-main.js), only export start() and let the caller
// decide when to invoke it.
if (require.main === module) {
    start();
}

module.exports = { start };