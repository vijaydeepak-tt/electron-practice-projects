const { Tray, Menu, MenuItem } = require("electron");

class TimerTray extends Tray {
  constructor(iconPath, mainWindow) {
    super(iconPath);
    this.mainWindow = mainWindow;
    this.setToolTip("Timer");
    this.on("click", this.onClick.bind(this));
    this.on("right-click", this.onRightClick.bind(this));
  }

  onClick(event, bounce) {
    const { x, y } = bounce;
    // window height and width
    const { height, width } = this.mainWindow.getBounds();
    if (this.mainWindow.isVisible()) {
      this.mainWindow.hide();
    } else {
      const yPos = process.platform === "darwin" ? y : y - height;
      this.mainWindow.setBounds({
        x: x - width / 2,
        y: yPos,
        height,
        width,
      });
      this.mainWindow.show();
    }
  }

  onRightClick() {
    const menuConfig = Menu.buildFromTemplate([
        new MenuItem({
            label: "Quit",
            role: "quit"
        })
    ]);
    this.popUpContextMenu(menuConfig);
  }
}

module.exports = TimerTray;
