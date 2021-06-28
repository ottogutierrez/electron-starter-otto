/* eslint-disable no-undef */
/* eslint global-require: off, no-console: off */

const path = require("path");
const { app, BrowserWindow, shell, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const createWindow = async () => {
  //   const RESOURCES_PATH = app.isPackaged
  //     ? path.join(process.resourcesPath, "assets")
  //     : path.join(__dirname, "../assets");

  //   const getAssetPath = (...paths: string[]): string => {
  //     return path.join(RESOURCES_PATH, ...paths);
  //   };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    // icon: getAssetPath("icon.png"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.webContents.on("devtools-opened", () => {
    setImmediate(() => {
      mainWindow.focus();
    });
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on("did-finish-load", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Open urls in the user's browser
  mainWindow.webContents.on("new-window", (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  //   new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on("window-all-closed", () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

try {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
  });
} catch (error) {
  alert("Error trying to reload the project");
}

autoUpdater.checkForUpdatesAndNotify();

//-----------ipcMain channels
ipcMain.on("get-version", (event) => {
  // Received the version request from the renderer application
  // Send back the application version
  event.sender.send("get-version-reply", app.getVersion());
});
