const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    getAppVersion: () => ipcRenderer.invoke("get-app-version"),

    downloadUpdate: (downloadUrl) =>
        ipcRenderer.invoke("download-update", downloadUrl),

    installUpdate: (installerPath) =>
        ipcRenderer.invoke("install-update", installerPath)
});