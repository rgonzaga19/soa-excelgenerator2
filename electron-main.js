const { app, BrowserWindow } = require("electron");
const path = require("path");
const server = require("./server");

let mainWindow;

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 1500,
        height: 900,
        autoHideMenuBar: true,
        icon: path.join(__dirname, "public", "images", "logo.ico"),
        show: false
    });

    mainWindow.loadURL("http://localhost:3000");

    // Show the window only after the page has finished loading.
    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    });
}

app.whenReady().then(async () => {

    if (app.isPackaged) {
        process.env.APP_RESOURCES = process.resourcesPath;
    }

    await server.start();
    createWindow();

});

// Cleanly stop the Express server.
app.on("before-quit", () => {
    server.stop();
});

// Quit when all windows are closed (except on macOS).
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// Re-create the window if the dock icon is clicked on macOS.
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});