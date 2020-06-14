const { app, BrowserWindow, ipcMain, Menu, MenuItem } = require("electron");

let mainWindow;
let todoWindow;
const todos = [];

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Todo",
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  const menuBar = Menu.buildFromTemplate(menuItem);
  Menu.setApplicationMenu(menuBar);
  mainWindow.on("close", app.quit);
}
app.on("ready", createMainWindow);

ipcMain.on("add-todo", (event, todo) => {
  todos.push(todo);
  mainWindow.webContents.send("todos", todos);
  todoWindow.close();
});

function createAddTodoWindow() {
  todoWindow = new BrowserWindow({
    title: "Add Todo",
    width: 300,
    height: 200,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  todoWindow.loadURL(`file://${__dirname}/add-todo.html`);
  todoWindow.on("closed", () => (todoWindow = null));
}

function clearTodos() {
    todos.splice(0);
    mainWindow.webContents.send("todos", todos);
}

const menuItem = [
  new MenuItem({
    label: "File",
    submenu: [
      new MenuItem({
        label: "Add Todo",
        accelerator: process.platform === "darwin" ? "Command+N" : "Ctrl+N",
        click() {
          createAddTodoWindow();
        },
      }),
      new MenuItem({
        label: "Clear Todos",
        accelerator: process.platform === "darwin" ? "Command+Shift+C" : "Ctrl+Shift+C",
        click() {
            clearTodos();
        },
      }),
      new MenuItem({
        label: "Quit",
        accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
        role: "quit",
      }),
    ],
  }),
];

if (process.platform === "darwin") {
  menuItem.unshift({});
}

if (process.env.NODE_ENV !== "production") {
  menuItem.push(
    new MenuItem({
      label: "Dev",
      submenu: [
        new MenuItem({
          label: "Reload",
          role: "reload",
          accelerator: process.platform === "darwin" ? "Command+R" : "Ctrl+R",
        }),
        new MenuItem({
          label: "Dev Tools",
          accelerator:
            process.platform === "darwin" ? "Command+Shift+I" : "Ctrl+Shift+I",
          click(item, focusedWindow) {
            focusedWindow.toggleDevTools();
          },
        }),
      ],
    })
  );
}
