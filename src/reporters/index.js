'use strict';

var gutil = require('gulp-util');
var through = require('through2');

var failReporter = require('./fail');
var defaultReporter = require('./default');

/**
 * Gets a reporter
 *
 * The function works only with reporters that shipped with the plugin.
 *
 * @param {String} name Name of a reporter to load or reporter function
 * @param {Object} options Custom options object that will be passed to a reporter.
 * @returns {Function}
 */
module.exports = function (reporter) {
  reporter = reporter || defaultReporter;

  if (reporter === 'fail') {
    reporter = failReporter;
  } else if (reporter === 'default') {
    reporter = defaultReporter;
  }

  // Check for a valid reporter
  if (typeof reporter !== 'function') {
    this.emit('error', new gutil.PluginError('gulp-phplint', 'Invalid reporter'));
  }

  return through.obj(function (file, enc, callback) {
    reporter(file);

    return callback(null, file);
  });
};
