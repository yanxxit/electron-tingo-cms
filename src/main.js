import { app, BrowserWindow, Menu, Tray, MenuItem, globalShortcut, dialog, ipcMain } from 'electron';
import path from 'path';
import os from 'os';
const url = require('url');
const autoUpdater = require('./auto-updater.js')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow;

// 通过main进程发送事件给renderer进程，提示更新信息
// function sendUpdateMessage(text) {
//   mainWindow.webContents.send('message', text);
// }

let tray = null
app.on('ready', () => {
  tray = new Tray(path.join(__dirname, 'tingo.ico'))
  const contextMenu = Menu.buildFromTemplate([
    { label: '启动', type: 'radio' },
    { label: '关闭', type: 'radio' },
    { label: '重启', type: 'radio', checked: true },
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
})
/** 右击菜单 */
const menu = new Menu()

menu.append(new MenuItem({
  label: 'Print',
  accelerator: 'CmdOrCtrl+P',
  click: () => { console.log('time to print stuff') }
}))


const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // and load the index.html of the app.
  // mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // console.log(dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] }))

  // dialog.showMessageBox(win)
  //全局变量
  // globalShortcut.register('CommandOrControl+X', () => {
  //   console.log('CommandOrControl+X is pressed')
  // })
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  // Open the DevTools.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }
  mainWindow.webContents.on('did-finish-load', () => {
    // autoUpdater.init(mainWindow)
  })
  // updateHandle();
};

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
