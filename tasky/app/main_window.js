const { BrowserWindow } = require("electron");

class MainWindow extends BrowserWindow {
  constructor(url) {
    super({
      title: "Timer",
      width: 300,
      height: 500,
      frame: false,
      resizable: false,
      show: false,
      skipTaskbar: true,
      webPreferences: {
        nodeIntegration: true,
        backgroundThrottling: false
      },
    });
    this.loadURL(url);
    this.on("blur", () => {
        this.hide();
    });
  }
}

module.exports = MainWindow;
