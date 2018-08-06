'use strict';

var fancyLog = require('fancy-log');
var chalk    = require('chalk');

/**
 * Returns the defalt reporter
 *
 * The default reporter logs all problems to the console.
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

    fancyLog(message);
  }

  return;
};
