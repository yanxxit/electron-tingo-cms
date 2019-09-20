import { app, BrowserWindow, Menu, Tray, MenuItem, globalShortcut, dialog, ipcMain } from 'electron';
import path from 'path';
import os from 'os';
const url = require('url');
const Upgrade = require("./utils/upgrade")

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow;

// 主进程监听渲染进程传来的信息
ipcMain.on('update', (e, arg) => {
  console.log("update");
  Upgrade.checkForUpdates(mainWindow);
});
let tray = null

app.on('ready', () => {
  /** 右击菜单 */
  const menu = new Menu()

  menu.append(new MenuItem({
    label: 'Print',
    accelerator: 'CmdOrCtrl+P',
    click: () => { console.log('time to print stuff') }
  }))

  Menu.setApplicationMenu(menu);// menu
  tray = new Tray(path.join(__dirname, 'icon/tingo.ico'))
  const contextMenu = Menu.buildFromTemplate([
    { label: '启动', type: 'radio' },
    { label: '关闭', type: 'radio' },
    { label: '重启', type: 'radio', checked: true },
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  mainWindow.webContents.openDevTools();
  mainWindow.loadURL(`file://${__dirname}/index.html#v${app.getVersion()}`)

  // console.log(dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] }))

  // dialog.showMessageBox(win)
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', () => {
    // Upgrade.checkForUpdates(mainWindow);
  })
  // // 启动后监听
  setTimeout(() => {
    Upgrade.checkForUpdates(mainWindow);
  }, 3 * 1000);
})

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
