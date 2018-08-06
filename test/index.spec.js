'use strict';

var phplint = require('../');
var should  = require('chai').should();

describe('gulp-phplint', function () {

	it('should not throw error if no parameters passed', function (done) {
		var caughtErr;

		try {
			phplint();
		} catch (err) {
			caughtErr = err;
		}
		should.not.exist(caughtErr);
		done();
	});

	it('should throw error if object passed as first parameter', function (done) {
		var caughtErr;

		try {
			phplint({debug: true});
		} catch (err) {
			caughtErr = err;
		}

		should.exist(caughtErr);
		done();
	});
});
