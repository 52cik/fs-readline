/**
 * @file   fs-readline
 * @author 52cik <fe.52cik@gmail.com>
 */

var util = require('util');
var ReadStream = require('fs').ReadStream;

util.inherits(ReadLine, ReadStream);

var defaults = { // 默认配置
    maxLineLength: 8 * 1024, // 8k
    cutMode: false, // 是否截断
    blankLine: true, // 是否保留空行
    retainBuffer: false // 是否转为字符串
};


function ReadLine(file, opts) {
    if (!(this instanceof ReadLine)) {
        return new ReadLine(file, opts);
    }

    var self = this;
    opts = opts || {};

    for (var key in defaults) {
        if (opts[key] === undefined && defaults.hasOwnProperty(key)) {
            opts[key] = defaults[key];
        }
    }

    if (!opts.cutMode) { // 非截断模式下读取长度和缓冲区长度一致
        opts.highWaterMark = opts.maxLineLength;
    }

    var blankLine = opts.blankLine; // 是否忽略空格
    var retainBuffer = opts.retainBuffer; // 是否转为字符串

    var lineBuffer = new Buffer(opts.maxLineLength); // 行数据缓存
    var lineSize = 0; // 行长度
    var lineCount = 1; // 行号

    ReadStream.call(self, file, opts);

    self.on('data', function (chunk) {
        for (var i = 0, len = chunk.length; i < len; i++) {
            if (chunk[i] === 10) {
                emitLine(lineSize, lineCount++);
            } else if (chunk[i] === 13) {
                // 忽略
            } else {
                lineBuffer[lineSize++] = chunk[i];
            }
        }
    });

    self.on('end', function () {
        emitLine(lineSize, lineCount++);
    });

    function emitLine(size, idx) {
        if (self.aborted) {
            return;
        }

        try {
            if (size > 0 || blankLine) { // 忽略空行
                var line = lineBuffer.slice(0, size);
                self.emit('line', retainBuffer ? line : line.toString(), idx);
            }
        } catch (e) {
            self.emit('error', e);
        } finally {
            lineSize = 0;
        }
    }
}

ReadLine.prototype.abort = function () {
    this.aborted = true;
    this.emit('abort');
    this.close();
};

module.exports = ReadLine;
