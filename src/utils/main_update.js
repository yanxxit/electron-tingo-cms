const { app, BrowserWindow, Menu, protocol, ipcMain } = require('electron');
const log = require('electron-log');
const os = require('os');
// 引入自动更新模块
const Upgrade = require("./upgrade")
log.info('App starting...');

let template = []
if (process.platform === 'darwin') {
  // OS X
  const name = app.getName();

  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() { app.quit(); }
      },
    ]
  })
}

let mainWindow;

// 主进程监听渲染进程传来的信息
ipcMain.on('update', (e, arg) => {
  console.log("update");
  Upgrade.checkForUpdates(mainWindow);
});


app.on('ready', function () {
  // 启动后监听
  setTimeout(() => {
    Upgrade.checkForUpdates(mainWindow);
  }, 3 * 1000);
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  mainWindow = new BrowserWindow();

  mainWindow.webContents.openDevTools();
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.loadURL(`file://${__dirname}/update.html#v${app.getVersion()}`);
});
app.on('window-all-closed', () => {
  app.quit();
});
