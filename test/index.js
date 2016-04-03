var should = require('should');
var readLine = require('..');

describe('测试用例:', function () {

    it('行读取测试', function (done) {
        this.timeout(60000); // istanbul 测试容易超时

        var rl = readLine('test/fixtures/afile.txt');

        rl.on('line', function (line) {
            line
                .should.not.equal(null)
                .and.not.equal(undefined)
                .and.be.a.String();
        });

        rl.on('end', function () {
            done();
        });
    });

    it('数字测试', function (done) {
        var answer = 28;
        var sum = 0;

        var rl = readLine('test/fixtures/nmbr.txt');

        rl.on('line', function (line) {
            sum += Number(line);
        });

        rl.on('end', function () {
            sum.should.equal(answer);
            done();
        });
    });

    it('错误测试', function (done) {
        var rl = readLine('./Idontexist');

        rl.on('error', function (e) {
            (function () {
                throw e
            }).should.throw(e);
            done();
        });
    });

    it('文件处理中错误测试', function (done) {
        var rl = readLine('test/fixtures/nmbr.txt');
        var lastError;
        var lineCalls;

        rl.on('line', function (str, idx) {
            lineCalls = idx;

            if (idx === 7) {
                throw new Error('fake error');
            }
        });

        rl.on('error', function (err) {
            if (!lastError) {
                lastError = err;
            }
        });

        rl.on('end', function () {
            lineCalls.should.equal(10);
            lastError.message.should.equal('fake error');
            done();
        });
    });

    it('忽略空行', function (done) {
        var rl = readLine('test/fixtures/nmbr.txt', {blankLine: false});
        var lineCalls;

        rl.on('line', function (str, idx) {
            lineCalls = idx;
        });

        rl.on('end', function () {
            lineCalls.should.equal(7);
            done();
        });
    });

    it('ASCII文件读取测试', function (done) {
        var iconv = require('iconv-lite');
        var testFileValidationKeywords = {
            1: 'папка',
            3: 'телефон',
            11: 'электричество',
            14: 'дерево'
        };

        var rl = readLine('test/fixtures/file-in-win1251.txt', {retainBuffer: true});

        rl.on('line', function (data, idx) {
            var line = iconv.decode(data, 'win1251');
            should.ok(!testFileValidationKeywords[idx] || line.indexOf(testFileValidationKeywords[idx]) > -1);
        });

        rl.on('end', function () {
            done();
        });
    });

    it('截断模式测试', function (done) {
        var rl = readLine('test/fixtures/cut-mode.txt', {cutMode: true, maxLineLength: 4});

        rl.on('line', function (line) {
            line.should.match(/\d{0,4}/);
        });

        rl.on('end', function () {
            done();
        });
    });

    it('abort 终止输出测试', function (done) {
        var rl = readLine('test/fixtures/nmbr.txt');
        var sum = 0;

        rl.on('line', function (line, idx) {
            sum += Number(line);

            if (idx === 3) {
                this.abort();
            }
        }).on('close', function () {
            sum.should.be.equal(6);
            done();
        });
    });

});
