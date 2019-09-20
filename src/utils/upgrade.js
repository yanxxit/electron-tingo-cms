// 引入自动更新模块
const { autoUpdater } = require("electron-updater");
const { ipcMain } = require('electron');
// const feedUrl = "http://127.0.0.1:8080/";//成功
const feedUrl = "http://dev.du-nang.com/update/";//成功，当前版本要低于目标版本
// const feedUrl = "https://github.com/shawflying/electron-tingo-cms/releases/download/untagged-32498617e97bdbde4ff2/";//失败 或者太慢
const log = require('electron-log');
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

class Upgrade {
  static checkForUpdates(mainWindow) {

    // 主进程主动发送消息给渲染进程函数
    function sendUpdateMessage(message, data) {
      log.info("# sendUpdateMessage:", { message, data });
      mainWindow.webContents.send('message', { message, data });
    }

    // 配置安装包远端服务器 
    autoUpdater.setFeedURL(feedUrl);
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
        // mainWindow.destroy()
      });
    });

    //执行自动更新检查
    autoUpdater.checkForUpdates();
  };
}

module.exports = Upgrade;