# fs-readline

造轮子系列 -- 文件流按行读取。


## 安装

``` sh
$ npm install 52cik/fs-readline
```

## 使用

``` js
var rl = require('fs-readline');

rl('./somefile.txt')
  .on('line', function(line) {
    console.log(line.toString());
  })
  .on('error', function(e) {
    // something went wrong
  });
```
