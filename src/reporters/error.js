'use strict';

var chalk = require('chalk');
var plugin_error = require('plugin-error');

/**
 * Returns the error reporter
 *
 * The error reporter throws an error if PHP linter fails
 *
 * @returns {Function}
 */
module.exports = function (file) {
  var report = file.phplintReport || {};

  if (report.error) {
    var message = report.message;

    if (report.rule) {
      message = report.rule + ' ' + chalk.magenta(file.path) + ':' +
        chalk.yellow(report.line) + ' ' + report.message;
    }

    throw new plugin_error('gulp-eslint', {
      plugin: 'PHPLintError',
      message: message
    });
  }
};
