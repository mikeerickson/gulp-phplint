/*jshint node:true */
/*global require*/
/*global module*/

'use strict';

var _        = require('lodash');
var gutil    = require('gulp-util');
var msg      = require('gulp-messenger');
var chalk    = require('chalk');
var utils    = require('./src/utils.js');
var through  = require('through2');
var exec     = require('child_process').execFile;

msg.init({timestamp: true, logToFile: false});

var phplintPlugin = function(command, opt) {

	var options         = {};
	var notificationMsg = '';

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
		skipPassedFiles:    false
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

	return through.obj(function(file, enc, callback) {

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

					var errMsg = stderr || stdout;
					var match = errMsg.match(/(.+?):\s+(.+?) in (.+?) on line (\d+)/im);

					if (match) {
						report.rule     = match[1];
						report.message  = match[2];
						report.filename = match[3];
						report.line     = match[4];
					} else {
						report.message = errMsg;
					}

					report.error = true;

					// if notify flag enabled, show notification
					if ( opt.notify ) {
						options = utils.notifyOptions(error ? 'fail' : 'pass', {taskName: 'PHPLint'});
						notificationMsg = '[' + options.title + ']';
						if ( error ) {
							if ( ! opt.silent ) {
								notificationMsg += ' ' + file.path;
								msg.error(notificationMsg);
								console.log(msg.chalk.red('---' + errMsg));
							}
						} else {
							if ( ! opt.skipPassedFiles ) {
								if ( ! opt.silent ) {
									notificationMsg += ' ' + file.path;
									msg.success(notificationMsg);
								}
							}
						}
					}
				} else {
					if ( ! opt.skipPassedFiles ) {
						options = utils.notifyOptions(error ? 'fail' : 'pass', {taskName: 'PHPLint'});
						notificationMsg = '[' + options.title + ']';
						notificationMsg += ' ' + file.path;
						msg.success(notificationMsg);
					}
				}

				file.phplintReport = report;

				callback(null, file);

			});

		} else {
			if ( opt.statusLine ) { msg.chalkline.yellow(); }
		}

	});


};


// Attach reporters and export plugin
phplintPlugin.reporter = require('./src/reporters');
module.exports = phplintPlugin;
