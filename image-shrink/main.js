const path = require("path");
const os = require("os");
const {
  app,
  BrowserWindow,
  Menu,
  MenuItem,
  // globalShortcut,
  ipcMain,
  shell,
} = require("electron");
const imagemin = require("imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const slash = require("slash");
const log = require("electron-log");

// Set env
process.env.NODE_ENV = "production";

const isDev = process.env.NODE_ENV !== "production" ? true : false;
const isMac = process.platform === "darwin" ? true : false;

let mainWindow;
let aboutWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Image Shrink",
    width: isDev ? 800 : 500,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: isDev ? true : false,
  });
  // mainWindow.loadURL(`file://${__dirname}/app/index.html`);
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  mainWindow.loadFile("./app/index.html");
}

function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    title: "About Image Shrink",
    width: 300,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: false,
    enableRemoteModule: true,
  });
  aboutWindow.loadFile("./app/about.html");
}

app.on("ready", () => {
  createMainWindow();
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);
  //   if (isDev) {
  //     globalShortcut.register("CmdOrCtrl+R", () => mainWindow.reload());
  //     globalShortcut.register(isMac ? "Command+Alt+I" : "Ctrl+Shift+I", () =>
  //       mainWindow.webContents.toggleDevTools()
  //     );
  //   }
  mainWindow.on("closed", () => (mainWindow = null));
});

const menu = [
  ...(isMac
    ? [
        new MenuItem({
          label: app.name,
          submenu: [
            new MenuItem({
              label: "About",
              click() {
                createAboutWindow();
              },
            }),
          ],
        }),
      ]
    : []),
  new MenuItem({
    role: "fileMenu",
  }),
  ...(!isMac
    ? [
        new MenuItem({
          label: "Help",
          submenu: [
            new MenuItem({
              label: "About",
              click() {
                createAboutWindow();
              },
            }),
          ],
        }),
      ]
    : []),
  ...(isDev
    ? [
        new MenuItem({
          label: "Developer",
          submenu: [
            new MenuItem({
              role: "reload",
            }),
            new MenuItem({
              role: "forceReload",
            }),
            new MenuItem({
              type: "separator",
            }),
            new MenuItem({
              role: "toggleDevTools",
            }),
          ],
        }),
      ]
    : []),
];

ipcMain.on("image:minimize", (event, options) => {
  options.dest = path.join(os.homedir(), "imageshrink");
  shrinkImage(options);
});

async function shrinkImage({ imgPath, quality, dest }) {
  try {
    const pngQuality = quality / 100;

    const files = await imagemin([slash(imgPath)], {
      destination: dest,
      plugins: [
        imageminMozjpeg({ quality }),
        imageminPngquant({
          quality: [pngQuality, pngQuality],
        }),
      ],
    });

    log.info(files);

    //     Changed from shell.openItem() for v9
    shell.openPath(dest);

    mainWindow.webContents.send("image:done");
  } catch (err) {
    log.error(err);
  }
}

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
