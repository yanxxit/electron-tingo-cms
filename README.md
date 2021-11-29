# electron-demo
> electron demo


## 系统托盘
https://electronjs.org/docs/api/tray

安装运行后，通过系统托盘控制状态，进行重启

## 键盘快捷键
配置本地和全局键盘快捷键
https://electronjs.org/docs/tutorial/keyboard-shortcuts#%E9%94%AE%E7%9B%98%E5%BF%AB%E6%8D%B7%E9%94%AE


## 对话框
显示用于打开和保存文件、警报等的本机系统对话框。
https://electronjs.org/docs/api/dialog

https://electronjs.org/docs/api/app


## 工具
```
cnpm install electron-builder -g
cnpm install electron-forge -g
```


## electron-packager

```js
npm install --save-dev electron-packager
```

### 参数设置
electron-packager <sourcedir> <appname> --platform=<platform> --arch=<arch> [optional flags...]

* location of project：项目所在路径 
* name of project：打包的项目名字 
* platform：确定了你要构建哪个平台的应用（Windows、Mac 还是 Linux） 
* architecture：决定了使用 x86 还是 x64 还是两个架构都用 
* electron version：electron 的版本 
* optional options：可选选项


"scripts": {
    "package": "electron-packager ./ notes --all --out ./OutApp --electron-version 4.0.1 --overwrite --icon=./static/img/logo.ico"
  },
参数描述

- sourcedir: ./ 表示的是当前目录,也就是package.json文件所在的目录
- appname: 当前构建应用的名称
- platform: 要构建的平台类型,可取的值有 darwin, linux, mas, win32,
--out ./OutApp: 指定打包文件输出的文件夹位置,当前指定的为项目目录下的OutApp文件夹

--electron-version 4.0.1: 指定当前要构建的electron的版本,需要和当前的版本一致,具体可以在package.json文件中查看,如下所示

可以写成以下格式:

```js
electron-packager ./ notes ./ --platform=darwin
electron-packager ./ notes ./ --platform=linux
electron-packager ./ notes ./ --platform=mas
electron-packager ./ notes ./ --platform=win32
// 也可以一键全平台打包 取值为all

electron-packager ./ notes --all
```

## electron-builder
我们需要知道，electron-builder和electron-packager基本类似，不过builder打包完成的是安装包，而packager打包完成的是可执行文件,packager里面有项目源码，builder里面则是编译后的。这可能是两者的最大差别。

另外，全局安装之后，在命令行中，electron-builder有个别名叫做builder，两者是同一个npm包。大家需要知晓。(当然，有的时候，这个builder并不生效，大家可以多试试electron-builder这个更通用的命令

```sh
cnpm install electron-builder -g
electron-builder --version
electron-builder -mwl 
electron-builder --platform=all
electron-builder --win --x64
```
直接编辑项目文件夹下的package.json文件，添加electron builder编译所需要的属性

貌似json文件使用注释会导致一部分编译报错，所以只在文章中写明注释，放到文件中最好将注释删掉


### 特点

electron-builder 可以打包成msi、exe、dmg文件，macOS系统，只能打包dmg文件，window系统才能打包exe，msi文件；
几乎支持了所有平台的所有格式；
可以将prepackage目录（手动或使用electron-packager生成的目录）打包成安装包；
支持Auto Update；

非常丰富的选项；
支持CLI和JS API两种使用方式；


假如 Electron 胜出，你想发行一个 Electron 应用。有一个很不错的 Node.js 包叫 electron-packager 可以帮你将 app 打包成一个 .app 或者 .exe 文件。也有其他几个类似的项目，包括交互式的一步一步告诉你该怎么做。不过，你应该用 electron-builder，它以 electron-packager 为基础，添加了其他几个相关的模块，生成的是 .dmg 文件和 Windows 安装包，并且为你处理好了代码签名的问题。这很重要，如果没有这一步，你的应用将会被操作系统认为是不可信的，你的应用程序可能会触发防毒软件的运行，Microsoft SmartScreen 可能会尝试阻止用户启动你的应用。


https://www.jianshu.com/p/1c2ad78df208?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation


## build
```
npm run build

```