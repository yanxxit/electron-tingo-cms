const { app, BrowserWindow, Menu, protocol, ipcMain } = require('electron');
const log = require('electron-log');
// 引入自动更新模块
const { autoUpdater } = require("electron-updater");
// const feedUrl = "https://github.com/shawflying/electron-tingo-cms/releases/download/untagged-a8ba4350679dfd8d625d/cms_setup_1.0.1.exe";
const feedUrl = "https://github.com/shawflying/electron-tingo-cms/releases/download/untagged-a8ba4350679dfd8d625d/latest.yml";
// if (require('electron-squirrel-startup')) return;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
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

function sendStatusToWindow(text) {
  log.info("# sendStatusToWindow:", text);

  mainWindow.webContents.send('message', text);
}
function createDefaultWindow() {
  mainWindow = new BrowserWindow();

  mainWindow.webContents.openDevTools();
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.loadURL(`file://${__dirname}/update.html#v${app.getVersion()}`);
  return mainWindow;
};

// 主进程监听渲染进程传来的信息
ipcMain.on('update', (e, arg) => {
  console.log("update");
  checkForUpdates();
});
let checkForUpdates = () => {
  // 配置安装包远端服务器 
  autoUpdater.setFeedURL(feedUrl);

  // 下面是自动更新的整个生命周期所发生的事件
  autoUpdater.on('error', function (message) {
    sendUpdateMessage('error', message);
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
    });
  });

  //执行自动更新检查
  autoUpdater.checkForUpdates();
};

// 主进程主动发送消息给渲染进程函数
function sendUpdateMessage(message, data) {
  console.log({ message, data });
  mainWindow.webContents.send('message', { message, data });
}

autoUpdater.setFeedURL({
  provider: "github",
  owner: "shawflying",
  repo: "election-tingo-cms"
})

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  log.info("# message:", log_message)
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});
app.on('ready', function () {
  // Create the Menu
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  autoUpdater.checkForUpdatesAndNotify();
  createDefaultWindow();
});
app.on('window-all-closed', () => {
  app.quit();
});
