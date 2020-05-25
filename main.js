console.log("main process are working fine, unlike grammar");

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
//const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')


let win;

function createWindow () {

  win = new BrowserWindow({width: 800, height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'login.html'),
    protocol: 'file:',
    slashes: true
  }));

  win.maximize()

  win.on('closed', () => {
    win = null
  });
}

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

const { ipcMain } = require( "electron" );

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "seutrongluckydraw.ddns.net",
  user: "remote",
  password: "seutrongRemote_1",
  database: "seutrong_service"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

global.con = con;

ipcMain.on( "loginUser", ( event, user ) => {
  global.user = user;
} );