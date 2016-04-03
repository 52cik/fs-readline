# fs-readline

> 按行读取文件，基于文件可读流。

  [![Linux Build][travis-image]][travis-url]
  [![Windows Build][appveyor-image]][appveyor-url]
  [![Coverage Status][coveralls-image]][coveralls-url]
  [![Dependencies][dependencies-image]][dependencies-url]
  [![node][node-image]][node-url]
  [![license MIT][license-image]][license-url]


## 安装

``` sh
$ npm install fs-readline
```

或者直接从 GitHub 上安装。

``` sh
$ npm install 52cik/fs-readline
```


## 使用

``` js
var readLine = require('fs-readline');

var rl = readLine('./somefile.txt');
rl.on('line', function (line, idx) {
  console.log(idx, line);
});
```


## 编码处理

node 支持的编码非常有限, 对于那些不支持的编码可以使用一些第三方库转换, 例如 [iconv-lite][iconv-lite] 模块。

> PS: 记得加 `retainBuffer` 参数防止默认 `toString` 哦。

``` js
var readLine = require('fs-readline');
var iconv = require('iconv-lite');

var rl = readline('./gbkfile.txt', {retainBuffer: true}); // buffer 模式
rl.on('line', function (data, idx){
  var line = iconv.decode(data, 'gbk');
  console.log(idx, line);
});
```


## 参数说明

仅仅只有 4 个附加参数，其他参数继承自 `fs.createReadStream` 参数。


### retainBuffer

> 是否保留 Buffer 数据，而不是转为字符串，默认 false 转为字符串。

``` js
var readLine = require('fs-readline');

var rl = readLine('./somefile.txt', {retainBuffer: true}); // buffer 模式
rl.on('line', function (data, idx) {
  console.log(idx, data.toString()); // 这里要手动 toString
});
```


### blankLine

> blankLine 是否忽略空行，默认 true 不忽略。

假设有个 file.txt 文件，有如下 5 行内容。

```
// file.txt
111

222

333
```

``` js
var readLine = require('fs-readline');

var rl = readLine('./file.txt', {blankLine: false});
rl.on('line', function (line, idx) {
  console.log(idx, line);
});

// 输出为:
// 1 '111'
// 3 '222'
// 5 '333'
```

行号依然是对应的行号，如果要得到连续的新行号，请自己计数。


### maxLineLength

> maxLineLength 行缓冲大小，默认 8k，也就是一行最多只能容纳 8k 的字符内容。


### cutMode

> 截断模式，默认 false，需 maxLineLength 配合使用，直接看例子好了。

假设有个 file.txt 文件，有如下 5 行内容。

```
// file.txt
111111
22
333333
444
555555
```

``` js
var readLine = require('fs-readline');

var rl = readLine('./file.txt', {cutMode: true, maxLineLength: 4}); // 截断模式，一行最多容纳 4 个字符
rl.on('line', function (line, idx) {
  console.log(idx, line);
});

/**
 * 输出为:
 * 1 '1111'
 * 2 '22'
 * 3 '3333'
 * 4 '444'
 * 5 '5555'
 */
```

非常简单直观，行长度超过 4 的都被截断了，在某些特定的场景下还是比较适用的。


## 方法说明

### readLine#abort 终止

假设有个 file.txt 文件，有如下 5 行内容。

```
// file.txt
111111
22
333333
444
555555
```

``` js
var readLine = require('fs-readline');

var rl = readLine('./file.txt');
rl.on('line', function (line, idx) {
  console.log(idx, line);

  if (idx == 3) { // 第三行后停止输出
    this.abort(); // 调用终止方法
  }
}).on('abort', function () {
  console.log('读取已终止');
}).on('close', function () {
  console.log('文件已关闭');
});

/**
 * 输出为:
 * 1 '1111'
 * 2 '22'
 * 3 '3333'
 * 读取已终止
 * 文件已关闭
 */
```


[iconv-lite]: https://github.com/ashtuchkin/iconv-lite

[travis-url]: https://travis-ci.org/52cik/fs-readline
[travis-image]: https://img.shields.io/travis/52cik/fs-readline/master.svg?label=linux

[appveyor-url]: https://ci.appveyor.com/project/52cik/fs-readline
[appveyor-image]: https://img.shields.io/appveyor/ci/52cik/fs-readline/master.svg?label=windows

[coveralls-url]: https://coveralls.io/github/52cik/fs-readline?branch=master
[coveralls-image]: https://coveralls.io/repos/52cik/fs-readline/badge.svg?branch=master&service=github

[license-url]: https://opensource.org/licenses/MIT
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg

[dependencies-url]: https://david-dm.org/52cik/fs-readline
[dependencies-image]: https://img.shields.io/david/52cik/fs-readline.svg?style=flat

[node-url]: https://nodejs.org
[node-image]: https://img.shields.io/node/v/gh-badges.svg
