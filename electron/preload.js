const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {

  saveTasks: (tasks) => ipcRenderer.send("save-tasks", tasks),

  loadTasks: () => ipcRenderer.invoke("load-tasks"),

  notifyTaskAdded: (task) =>
    ipcRenderer.send("notify-task-added", task)

});