# fs-readline

> 按行读取文件，基于文件可读流。

  [![Linux Build][travis-image]][travis-url] 
  [![Windows Build][appveyor-image]][appveyor-url] 
  [![Coverage Status][coveralls-image]][coveralls-url]
  [![license MIT][license-image]][license-url]


## 安装

``` sh
$ npm install 52cik/fs-readline
```


## 使用

``` js
var readLine = require('fs-readline');

var rl = readLine('./somefile.txt');
rl.on('line', function (line, idx) {
  console.log(idx, line.toString());
});
```


## 参数说明

仅仅只有 2 个附加参数，其他参数继承自 `fs.createReadStream` 参数。


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
  console.log(idx, line.toString());
});

// 输出为:
// 1 '111'
// 3 '222'
// 5 '333'
```

行号依然是对应的行号，如果要得到连续的新行号，请自己计数。


### maxLineLength

> maxLineLength 行缓冲大小，默认 64k




[travis-url]: https://travis-ci.org/52cik/fs-readline
[travis-image]: https://img.shields.io/travis/52cik/fs-readline/master.svg?label=linux

[appveyor-url]: https://ci.appveyor.com/project/52cik/fs-readline
[appveyor-image]: https://img.shields.io/appveyor/ci/52cik/fs-readline/master.svg?label=windows

[coveralls-url]: https://coveralls.io/github/52cik/fs-readline?branch=master
[coveralls-image]: https://coveralls.io/repos/52cik/fs-readline/badge.svg?branch=master&service=github

[license-url]: https://opensource.org/licenses/MIT
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
