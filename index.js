/*jshint node:true */
/*global require*/
/*global module*/

'use strict';

var _        = require('lodash');
var gutil    = require('gulp-util');
var msg      = require('gulp-messenger');
var chalk    = require('gulp-messenger').chalk;
var utils    = require('./src/utils.js');
var through  = require('through2');
var exec     = require('child_process').execFile;

msg.init({timestamp: true, logToFile: false});

var phplintPlugin = function(command, opt) {

	if ( typeof command !== 'undefined') {
		if (typeof command !== 'string') {
			throw new gutil.PluginError('gulp-phplint', 'Parameter 1 must be path to php command, or empty string');
		}
	}

	// Assign default options if one is not supplied
	opt = opt || {};

	// merge default options and user supplied options
	var defaultOptions = {

		// plugin specific options (not associated with phpunit options)
		silent:             false,
		debug:              false,
		clear:              false,
		dryRun:             false,
		notify:             true,
		statusLine:         true,
		skipPassedFiles:    true
	};

	opt = _.defaults( opt, defaultOptions );

	var phpCmd = command || 'php';
	var cmd    = phpCmd;
	if ( opt.debug ) { cmd += ' --debug';}

	// append debug code if switch enabled
	if ((opt.debug) || (opt.dryRun)) {
		var debugCmd = cmd.replace('php', 'phplint');
		if(opt.dryRun) {
			console.log(chalk.green('\n       *** Dry Run Cmd: ' + debugCmd  + ' ***\n'));
		} else {
			console.log(chalk.yellow('\n       *** Debug Cmd: ' + debugCmd  + ' ***\n'));
		}
	}

	var result = through.obj(function(file, enc, callback) {

		// had to do something with encoding parameter so jshint wont throw error
		enc = '';

		if (file.isNull()) {
			return callback(null, file);
		}

		if ( ! opt.dryRun ) {
			exec(phpCmd, ['-l', file.path], function(error, stdout, stderr) {
				var report = {
					error: false,
				};

				if (error) {

					var match = stderr.match(/(.+?):  (.+?) in (.+?) on line (\d+)/i);

					if (match) {
						report.rule     = match[1];
						report.message  = match[2];
						report.filename = match[3];
						report.line     = match[4];
					} else {
						report.message = stderr;
					}

					// using console here so extra timestamp value is not sent to console
					// (due to default timestamp enabled)
					var errMsg;
					if ( stderr.length > 0) {
						errMsg = stderr;
					} else {
						if ( stdout.length > 0) {
							errMsg = stdout;
						}
					}
					report.error = true;

					// if notify flag enabled, show notification
					if ( opt.notify ) {
						var options = utils.notifyOptions(error ? 'fail' : 'pass', {taskName: 'PHPLint'});
						var notificationMsg = '[' + options.title + ']';
						if ( error ) {
							notificationMsg += ' ' + file.path;
							msg.error(notificationMsg);
							console.log(msg.chalk.red('---' + errMsg));
						} else {
							if ( ! opt.skipPassedFiles ) {
								notificationMsg += ' ' + file.path;
								msg.success(notificationMsg);
							}
						}
					}

				}

				file.phplintReport = report;

				callback(null, file);

			});

		} else {
			if ( opt.statusLine ) { msg.chalkline.yellow(); }
		}

	});

	return result;

};


// Attach reporters and export plugin
phplintPlugin.reporter = require('./src/reporters');
module.exports = phplintPlugin;



