const { app, BrowserWindow, Menu, protocol, ipcMain } = require('electron');
const log = require('electron-log');
const os = require('os');
// 引入自动更新模块
const { autoUpdater } = require("electron-updater");
// const feedUrl = "https://github.com/shawflying/electron-tingo-cms/releases/download/untagged-a8ba4350679dfd8d625d/cms_setup_1.0.1.exe";
// const feedUrl = "https://github.com/shawflying/electron-tingo-cms/releases/download/untagged-a8ba4350679dfd8d625d/";
// const feedUrl = "https://github.com/shawflying/electron-tingo-cms/releases/download/untagged-eb2c090080fd5e6374ea/";
const feedUrl = "http://127.0.0.1:8080/";
// if (require('electron-squirrel-startup')) return;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
var platform = os.platform() + '_' + os.arch();
var version = app.getVersion();
log.info('App starting...');
log.info(`http://download.myapp.com/update/${platform}/${version}`);

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

let checkForUpdates = () => {
  // 配置安装包远端服务器 
  autoUpdater.setFeedURL({
    provider: "github",
    repo: "electron-tingo-cms",
    owner: "shawflying",
    releaseType: "draft"
  });
  // autoUpdater.setFeedURL(feedUrl);
  // 下面是自动更新的整个生命周期所发生的事件
  autoUpdater.on('error', function (message) {
    sendUpdateMessage('Error in auto-updater. ', message);
  });
  // 检查更新
  autoUpdater.on('checking-for-update', function (message) {
    sendUpdateMessage('checking-for-update', message);
  });
  autoUpdater.on('update-available', function (message) {
    sendUpdateMessage('update-available', message);
  });
  autoUpdater.on('update-not-available', function (message) {
    sendUpdateMessage('update-not-available', message);
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    sendUpdateMessage('downloadProgress', progressObj);
  });
  // 更新下载完成事件
  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    sendUpdateMessage('isUpdateNow');
    ipcMain.on('updateNow', (e, arg) => {
      autoUpdater.quitAndInstall();
      mainWindow.destroy()
    });
  });

  //执行自动更新检查
  autoUpdater.checkForUpdates();
};

// 主进程主动发送消息给渲染进程函数
function sendUpdateMessage(message, data) {
  log.info("# sendUpdateMessage:", JSON.stringify({ message, data }));
  mainWindow.webContents.send('message', { message, data });
}

// 主进程监听渲染进程传来的信息
ipcMain.on('update', (e, arg) => {
  console.log("update");
  checkForUpdates();
});

app.on('ready', function () {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  autoUpdater.checkForUpdatesAndNotify();
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
