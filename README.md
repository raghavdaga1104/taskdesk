<div align="center">

# ⚡ TaskDesk

**A fast, minimal desktop task manager built for productivity.**

[![Release](https://img.shields.io/github/v/release/raghavdaga1104/taskdesk?color=6366f1\&label=Download\&style=for-the-badge)](https://github.com/raghavdaga1104/taskdesk/releases/latest)
![Platform](https://img.shields.io/badge/Platform-Windows-blue?style=for-the-badge\&logo=windows)
![Electron](https://img.shields.io/badge/Electron-Desktop-47848F?style=for-the-badge\&logo=electron)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge\&logo=react)

[**⬇️ Download Latest**](https://github.com/raghavdaga1104/taskdesk/releases/latest) · [**🐛 Report Bug**](https://github.com/raghavdaga1104/taskdesk/issues) · [**💡 Request Feature**](https://github.com/raghavdaga1104/taskdesk/issues)

</div>

---

# ✨ What is TaskDesk?

TaskDesk is a lightweight **desktop task manager** designed to help you organize daily work without distractions.

Unlike browser-based tools, TaskDesk runs as a **native desktop application** so it is always available and fast to open.

Perfect for students, developers, and professionals who want a **simple productivity tool directly on their desktop**.

---

# 🎯 Features

| Feature                   | Description                               |
| ------------------------- | ----------------------------------------- |
| 📝 **Task Management**    | Add, edit, and delete tasks easily        |
| 📅 **Daily Organization** | Plan your tasks for the day               |
| 🚀 **Fast Desktop App**   | Runs as a native desktop application      |
| 💻 **Electron Powered**   | Cross-platform desktop framework          |
| ⚡ **React Interface**     | Smooth and modern UI                      |
| 💾 **Local Storage**      | All data stored locally on your computer  |
| 🖥️ **Minimal UI**        | Clean interface for distraction-free work |

---

# ⬇️ Installation

You don't need Node.js to use the application.

1. Go to the **Releases** section
2. Download the file:

```
TaskDesk Setup.exe
```

3. Double-click and install.

That's it ✅

---

# 🛠️ Run From Source

If you want to run or modify the project locally:

### Prerequisites

Install:

* Node.js 18+
* npm

---

### 1️⃣ Clone the repository

```
git clone https://github.com/raghavdaga1104/taskdesk.git
cd taskdesk
```

---

### 2️⃣ Install dependencies

```
npm install
```

---

### 3️⃣ Run the application

```
npm run electron
```

This will start the React frontend and launch the Electron desktop app.

---

### 4️⃣ Build the `.exe` installer

```
npm run dist
```

The installer will be generated in:

```
release/
```

---

# 📁 Project Structure

```
taskdesk/
│
├── electron/
│   ├── main.js
│   └── preload.js
│
├── src/
│   ├── App.jsx
│   └── main.jsx
│
├── public/
│   └── icon.png
│
├── index.html
├── package.json
└── README.md
```

---

# 💾 Data Storage

TaskDesk stores all tasks locally on your machine.

Example location:

```
%APPDATA%/TaskDesk/tasks.json
```

Your data never leaves your computer.

---

# 🧪 Troubleshooting

### App not opening

Try running:

```
npm install
npm run electron
```

---

### Build errors

Delete node modules and reinstall:

```
rm -rf node_modules
npm install
```

---

# 🤝 Contributing

Contributions are welcome!

Steps:

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push to your fork
5. Open a Pull Request

---

<div align="center">

Made with ❤️ by **Raghav Daga**

</div>
