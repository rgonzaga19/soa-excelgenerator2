const { app, BrowserWindow } = require("electron");
const path = require("path");

// Start Express server
require("./server");

function createWindow() {

    const win = new BrowserWindow({
        width: 1500,
        height: 900,
        autoHideMenuBar: true,
        icon: path.join(__dirname, "public", "images", "logo.ico")
    });

    win.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
    setTimeout(createWindow, 1000);
});