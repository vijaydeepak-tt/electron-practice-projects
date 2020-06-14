const { app, BrowserWindow, ipcMain } = require("electron");
var ffmpeg = require("fluent-ffmpeg");

let mainWindow;
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  
});

ipcMain.on("video:submit", (event, path) => {
  ffmpeg.ffprobe(path, function (err, metadata) {
    mainWindow.webContents.send("video:metadata", metadata.format.duration);
  });
});
