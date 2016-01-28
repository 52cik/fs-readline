# fs-readline

造轮子系列 -- 文件流按行读取。


## 安装

``` sh
$ npm install 52cik/fs-readline
```


## 使用

``` js
var readLine = require('fs-readline');

var rl = readLine('./somefile.txt');
rl.on('line', function (line, idx) {
  console.log('idx', line.toString());
});
```
