const { app, BrowserWindow, ipcMain, Tray, Menu, Notification, globalShortcut } = require("electron");
const path = require("path");
const fs = require("fs");

// MUST be first - fixes notification sender name and taskbar identity
app.setAppUserModelId("com.taskdesk.app");

let mainWindow;
let tray;

const isDev = !app.isPackaged;

// Single instance lock
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (!mainWindow.isVisible()) mainWindow.show();
      mainWindow.focus();
    }
  });
}

// Icon path - .ico for everything on Windows
const iconPath = isDev
  ? path.join(__dirname, "../build/to-do.ico")
  : path.join(process.resourcesPath, "to-do.ico");

// Task storage path
const dataPath = path.join(app.getPath("userData"), "tasks.json");

function createWindow() {

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: iconPath,
    title: "TaskDesk",
    show: false,
    skipTaskbar: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.setIcon(iconPath);

  // Show window when ready
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    mainWindow.setIcon(iconPath);
  });

  // Load React app
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // Hide instead of closing
  mainWindow.on("close", (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
      mainWindow.setSkipTaskbar(false);
    }
  });

}

app.whenReady().then(() => {

  createWindow();

  new Notification({
    title: "TaskDesk",
    body: "App is working!",
    icon: iconPath
  }).show();

  // Auto start with Windows (production only)
  if (!isDev) {
    app.setLoginItemSettings({ openAtLogin: true });
  }

  // Global shortcut
  globalShortcut.register("CommandOrControl+Shift+T", () => {
    if (!mainWindow) return;
    if (mainWindow.isVisible()) {
      mainWindow.focus();
    } else {
      mainWindow.show();
    }
  });

  // System tray
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open TaskDesk",
      click: () => mainWindow.show()
    },
    {
      label: "Quit",
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip("TaskDesk");
  tray.setContextMenu(contextMenu);

  tray.on("double-click", () => {
    mainWindow.show();
  });

});

ipcMain.on("save-tasks", (event, tasks) => {
  fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2));
});

ipcMain.handle("load-tasks", () => {
  if (!fs.existsSync(dataPath)) return [];
  return JSON.parse(fs.readFileSync(dataPath));
});

ipcMain.on("notify-task-added", (event, taskText) => {
  new Notification({
    title: "TaskDesk",
    body: `New Task Added: ${taskText}`,
    icon: iconPath
  }).show();
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});