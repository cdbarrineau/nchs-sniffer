const { app, BrowserWindow, globalShortcut } = require('electron')
const url = require("url");
const path = require("path");

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS']=true

if (require('electron-squirrel-startup')) app.quit();

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1200,
    icon: '/dist/nchs-sniffer/favicon.ico',
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/nchs-sniffer/index.html`),
      protocol: "file:",
      slashes: true
    })
  );

  globalShortcut.register('CommandOrControl+J', () => {
    mainWindow.webContents.openDevTools();
  });

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
  if (mainWindow === null) createWindow()
});