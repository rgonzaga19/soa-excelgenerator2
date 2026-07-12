const { app, BrowserWindow } = require("electron");
const path = require("path");
const server = require("./server");

function createWindow() {

    const win = new BrowserWindow({
        width: 1500,
        height: 900,
        autoHideMenuBar: true,
        icon: path.join(__dirname, "public", "images", "logo.ico")
    });

    win.loadURL("http://localhost:3000");
}

app.whenReady().then(async () => {
    // Wait for the actual "server is listening" signal instead of a blind
    // fixed delay — removes unnecessary wait time on fast starts and
    // avoids a blank/failed window load if the server ever takes longer
    // than the old hardcoded 1000ms to come up.
    await server.start();
    createWindow();
});