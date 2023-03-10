import { app, shell, BrowserWindow, ipcMain, Menu, Tray } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 900,
    minHeight: 670,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  // 忽略CORS校验
  // mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
  //   callback({ requestHeaders: { Origin: "*", ...details.requestHeaders } });
  // });

  // mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
  //   console.log(details);
  //   callback({
  //     responseHeaders: {
  //       "Access-Control-Allow-Origin": ["*"],
  //       ...details.responseHeaders,
  //     },
  //   });
  // });

  let isQuit = false;
  const tray = new Tray(icon);
  tray.setIgnoreDoubleClickEvents(true);
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "退出",
        click: () => {
          console.log(123);
          isQuit = true;
          app.quit();
        },
      },
    ])
  );

  tray.on("click", () => {
    mainWindow.show();
  });

  ipcMain.on("app:hide", () => {
    mainWindow.hide();
  });

  ipcMain.on("app:quit", () => {
    isQuit = true;
    app.quit();
  });

  mainWindow.on("close", (event) => {
    if (!isQuit) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("cc.smilec.mictory");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
