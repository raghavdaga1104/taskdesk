const { app, BrowserWindow, ipcMain, Tray, Menu, Notification, globalShortcut } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;
let tray;

const isDev = !app.isPackaged;

// Path where tasks will be stored
const dataPath = path.join(app.getPath("userData"), "tasks.json");

function createWindow() {

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Load React App
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "dist", "index.html"));
  }

  // Hide instead of closing
  mainWindow.on("close", (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

}

app.whenReady().then(() => {

  // Test notification
  new Notification({
    title: "TaskDesk",
    body: "Notification system working!"
  }).show();

  // Auto start with Windows
  if (!isDev) {
    app.setLoginItemSettings({
      openAtLogin: true
    });
  }

  createWindow();

  // ⭐ GLOBAL SHORTCUT (Ctrl + Shift + T)
  globalShortcut.register("CommandOrControl+Shift+T", () => {

    if (mainWindow.isVisible()) {
      mainWindow.focus();
    } else {
      mainWindow.show();
    }

  });

  // Tray icon
  tray = new Tray(path.join(__dirname, "../public/icon.png"));

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


// Save tasks
ipcMain.on("save-tasks", (event, tasks) => {
  fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2));
});


// Load tasks
ipcMain.handle("load-tasks", () => {
  if (!fs.existsSync(dataPath)) return [];
  return JSON.parse(fs.readFileSync(dataPath));
});


// 🔔 Notification when task is added
ipcMain.on("notify-task-added", (event, taskText) => {

  new Notification({
    title: "TaskDesk",
    body: `New Task Added: ${taskText}`
  }).show();

});


// Clean up shortcuts when quitting
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});