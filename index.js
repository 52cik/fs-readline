/**
 * @file fs-readline
 * @author 52cik
 * @email fe.52cik@gmail.com
 */

var fs = require('fs');
var EE = require('events').EventEmitter;
var util = require('util');

util.inherits(ReadLine, EE);


function ReadLine(file, opts) {
    var self = this;

    if (!(self instanceof ReadLine)) {
        return new ReadLine(file, opts);
    }

    EE.call(self);

    opts = opts || {};

    var maxLineLength = opts.maxLineLength || 8 * 1024; // 8k
    var lineBuffer = new Buffer(maxLineLength); // 行数据缓存, 超出 8k 的行只保留 8k 数据
    var lineSize = 0; // 行长度

    var input = self.input = fs.createReadStream(file, opts);

    input.on('data', function (chunk) {
        for (var i = 0, len = chunk.length; i < len; i++) {
            if (chunk[i] === 10) {
                emitLine(lineSize);
            } else if (chunk[i] === 13) {
                // 忽略
            } else {
                lineBuffer[lineSize++] = chunk[i];
            }
        }
    });

    input.on('end', function () {
        if (lineSize) {
            emitLine(lineSize);
        }
        self.emit('end');
    });

    input.on('error', function (err) {
        self.emit('error', err);
    });

    input.on('open', function (fd) {
        self.emit('open', fd);
    });

    input.on('close', function () {
        self.emit('close');
    });

    function emitLine(size) {
        try {
            self.emit('line', lineBuffer.slice(0, size));
        } catch (e) {
            self.emit('error', e);
        } finally {
            lineSize = 0;
        }
    }
}

module.exports = ReadLine;
