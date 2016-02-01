/**
 * @file   fs-readline
 * @author 52cik
 * @email  fe.52cik@gmail.com
 */

var util = require('util');
var ReadStream = require('fs').ReadStream;

util.inherits(ReadLine, ReadStream);

function ReadLine(file, opts) {
    if (!(this instanceof ReadLine)) {
        return new ReadLine(file, opts);
    }

    var self = this;
    opts = opts || {};
    opts.highWaterMark = opts.maxLineLength || opts.highWaterMark || 64 * 1024; // 64k

    var blankLine = opts.blankLine === undefined ? true : !!opts.blankLine; // 是否忽略空格
    var lineBuffer = new Buffer(opts.highWaterMark); // 行数据缓存
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
        try {
            if (size > 0 || blankLine) { // 忽略空行
                self.emit('line', lineBuffer.slice(0, size), idx);
            }
        } catch (e) {
            self.emit('error', e);
        } finally {
            lineSize = 0;
        }
    }
}

module.exports = ReadLine;
