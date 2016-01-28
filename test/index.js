var should = require('should');
var readLine = require('..');

describe('测试用例:', function () {

    it('行读取测试', function (done) {
        this.timeout(60000); // istanbul 测试容易超时
        var rl = readLine('test/fixtures/afile.txt');

        rl.on('line', function (line) {
            should.notEqual(line, null);
            should.notEqual(line, undefined);
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

        rl.on('end', function () {
            done();
        });

        rl.on('close', function () {
            done();
        });
    });

    it("文件处理中错误测试", function (done) {
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
            lastError.message.should.equal('fake error');
            lineCalls.should.equal(9);
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

        var rl = readLine('test/fixtures/file-in-win1251.txt');

        rl.on('line', function (data, idx) {
            var line = iconv.decode(data, 'win1251');
            should.ok(!testFileValidationKeywords[idx] || line.indexOf(testFileValidationKeywords[idx]) > -1);
        });

        rl.on("end", function () {
            done();
        });
    });

});