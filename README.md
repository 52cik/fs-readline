# fs-readline

造轮子系列 -- 文件流按行读取。

  [![Linux Build][travis-image]][travis-url]
  [![Windows Build][appveyor-image]][appveyor-url]
  [![Coverage Status][coveralls-image]][coveralls-url]

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


## 编码处理

node 支持的编码非常有限, 对于那些不支持的编码可以使用一些第三方库转换, 例如 [iconv-lite][iconv-lite] 模块.

``` js
var readLine = require('fs-readline');
var iconv = require('iconv-lite');

var rl = readline('./gbkfile.txt');
rl.on('line', function (data, idx){
  var line = iconv.decode(data, 'gbk');
  console.log(idx, line);
});
```


[iconv-lite]: https://github.com/ashtuchkin/iconv-lite

[travis-url]: https://travis-ci.org/52cik/fs-readline
[travis-image]: https://img.shields.io/travis/52cik/fs-readline/master.svg?label=linux

[appveyor-url]: https://ci.appveyor.com/project/52cik/fs-readline
[appveyor-image]: https://img.shields.io/appveyor/ci/52cik/fs-readline/master.svg?label=windows

[coveralls-url]:https://coveralls.io/github/52cik/fs-readline?branch=master
[coveralls-image]:https://coveralls.io/repos/52cik/fs-readline/badge.svg?branch=master&service=github