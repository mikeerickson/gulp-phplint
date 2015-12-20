'use strict';

var phplint = require('../');
var should  = require('should');

require('mocha');

describe('gulp-phplint', function() {

	it('should not throw error if no parameters passed', function(done) {

		// Arrange
		var caughtErr;

		// Act
		try {
			phplint();
		} catch (err) {
			caughtErr = err;
		}

		// Assert
		should.not.exist(caughtErr);

		// exit gracefully
		done();

	});

	it('should throw error if object passed as first parameter', function(done) {

		// arrange
		var caughtErr;

		// act
		try {
			phplint({debug: true});
		} catch (err) {
			caughtErr = err;
		}

		// assert
		should.exist(caughtErr);

		// exit gracefully
		done();

	});

});
