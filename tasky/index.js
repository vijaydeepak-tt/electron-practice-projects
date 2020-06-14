const { app, ipcMain } = require("electron");
const { join } = require("path");
const TimerTray = require("./app/timer_tray");
const MainWindow = require("./app/main_window");

let mainWindow;
let tray;
app.on("ready", () => {
  if (process.platform === "darwin") {
    // only works on osX
    app.dock && app.dock.hide();
  }
  mainWindow = new MainWindow(`file://${__dirname}/src/index.html`);
  const iconName =
    process.platform === "win32" ? "windows-icon@2x.png" : "iconTemplate.png";
  const iconPath = join(__dirname, `./src/assets/${iconName}`);
  tray = new TimerTray(iconPath, mainWindow);
});

ipcMain.on("update-timer", (event, timeLeft) => {
  if (process.platform === "darwin") {
    // only works on osX
    tray.setTitle(timeLeft);
  }
});
