---
layout: post
title:  "node --inspect与使用node-inspector的区别"
date:   2017-04-22 17:02:42 +0800
categories: node
---
# node --inspect 和使用 node-inspector的区别

谷歌Chrome团队的开发者给node项目发了一个[pr](https://github.com/nodejs/node/pull/6792)名为“add v8_inspector support”

在此之前其实已经有一堆的Node调试工具了，虽然大多数在界面上与DevTools相似但是工作方式却并不相同。

这篇博文将会解释 [node-inspector](https://github.com/node-inspector/node-inspector) 的工作原理以及与 `node --inspect` 命令的不同之处。

# 原生Node调试

Node已经附带了一个集成调试器。可惜的是它没有界面，所以你只能使用命令行来调试。

你可以使用 `node debug` 来进行调试

```
$node debug test.js
< Debugger listening on port 5858
debug> . ok
break in test.js:1
> 1 var a = 5;
  2 a = a*a;
  3 a += 2;
debug>
```
你可以看到哪里被断点了并且使用next、cont等命令来控制执行。

```
debug> next
break in test.js:2
  1 var a = 5;
> 2 a = a*a;
  3 a += 2;
  4
```
使用 `repl` 和 `watch` 命令可以查看局部变量的值。

# node-inspector是怎么做的呢？

node-inspector允许你同时使用DevTools界面与原生node调试程序。

然而这里有个问题，原生node调试程序使用了一个叫做[V8-Debug](https://github.com/v8/v8/wiki/Debugging-Protocol)的协议，DevTools使用了[Chrome Debugging Protocol](http://chromedevtools.github.io/debugger-protocol-viewer/tot/Debugger/)，所以node-inspector不得不在两者之间进行转换。

## 连接node进程

如果传递了 `--debug` 选项，node进程将会暴露一个调试端口。

```
$ node --debug-brk test.js
Debugger listening on port 5858
```

这样我们就可以用其它进程去连接。

```
$ node debug localhost:5858
connecting to localhost:5858 ... ok
debug>
```

这就是node-inspector所做的工作，使用Dev-Tools界面将Chrome调试命令转换成V8-Debug指令发送到node进程。

node 从6.x开始支持Chrome调试协议，这就意味着我们可以不用做指令转化就可以直接使用Dev-Tools。

```
$ ./node --inspect --debug-brk test.js
Debugger listening on port 5858.
To start debugging, open the following URL in Chrome:
    chrome-devtools://devtools/remote/serve_file/@521e5b7e2b7cc66b4006a8a54cb9c4e57494a5ef/inspector.html?experiments=true&v8only=true&ws=localhost:5858/node
Debugger attached.
```

复制 `chrome-devtools://...` 整行代码在chrome中打开即可

- `--inspect` 参数启用新的调试协议
- `--debug-brk` 参数使Dev-Tools连接node后断点

![debug](/assets/images/posts/debug.png)