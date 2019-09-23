import { app, BrowserWindow, Menu, Tray, MenuItem, globalShortcut, dialog, ipcMain, isMac } from 'electron';
import path from 'path';
import os from 'os';
const log = require('electron-log');
const url = require('url');
const Upgrade = require("./utils/upgrade")
const menuTools = require("./utils/menu")

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
  // darwin 是OSX
  // arch 为X64
  console.log(process.platform, 'darwin')
  /** 右击菜单 */
  tray = new Tray(path.join(__dirname, 'icon/tingo.ico'))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '启动', type: 'radio', click: async () => {
        log.info("---->>>:start");
      }
    },
    {
      label: '关闭', type: 'radio', click: async () => {
        log.info("---->>>:close");
      }
    },
    {
      label: '重启', type: 'radio', checked: true,
      click: async () => {
        log.info("---->>>:restart");
      }
    },
    {
      label: '更新程序', type: 'radio',
      click: async () => {
        log.info("---->>>:update");
        Upgrade.checkForUpdates(mainWindow);
      }
    },
  ])
  tray.setToolTip('这是听果音乐程序')
  tray.setContextMenu(contextMenu)
  mainWindow = new BrowserWindow({
    backgroundColor: '#ffffff',//背景色
    // modal: true, show: false,
    // fullscreen: true,//默认全屏
    title: "听果cms",
    icon: path.join(__dirname, 'icon/tingo.ico'),
    width: 800,
    height: 600,
    // frame: false
  });

  // mainWindow.webContents.openDevTools();
  mainWindow.loadURL(`file://${__dirname}/index.html#v${app.getVersion()}`);
  // mainWindow.loadURL('http://dev.du-nang.com');// 有些js无法加载
  // mainWindow.loadURL('https://github.com')

  menuTools.init(app, mainWindow);
  // console.log(dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] }))

  // dialog.showMessageBox(win)
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', () => {
    log.info("did-finish-load");
    // Upgrade.checkForUpdates(mainWindow);
  })
  // // 启动后监听
  setTimeout(() => {
    // Upgrade.checkForUpdates(mainWindow);
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
