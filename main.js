console.log("main process are working fine, unlike grammar");

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
//const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const { autoUpdater } = require('electron-updater');

(async () => {
  const sequelize = require('./config/connection.js')
  const personOrm = require('./models/person_orm.js')
  admin = await personOrm.admin
  branch = await personOrm.branch
  sequelize.sync({ alter: true });
})()


let win;

function createWindow() {

  win = new BrowserWindow({
    width: 800, height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, './launcher/login.html'),
    protocol: 'file:',
    slashes: true
  }));

  win.maximize()

  win.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

  win.on('closed', () => {
    win = null
  });
}

autoUpdater.on('update-available', () => {
  win.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
  win.webContents.send('update_downloaded');
});

app.on('ready', createWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

const { ipcMain } = require("electron");

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});