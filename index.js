/*jshint node:true */
/*global require*/
/*global module*/

'use strict';

var map      = require('map-stream');
var	gutil    = require('gulp-util');
var	os       = require('os');
var	exec     = require('child_process').exec;
var msg      = require('gulp-messenger');
var _        = require('lodash');
var notifier = require('node-notifier');
var utils    = require('./src/utils.js');
var chalk    = msg.chalk;

module.exports = function(command, opt) {

	var cmd      = '';
	var launched = false;

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

	};
	opt = _.defaults( opt, defaultOptions );

	// If path to phplint bin not supplied, use default vendor/bin path
	if (!command) {
		command = './vendor/bin/phpunit';

		// Use the backslashes on Windows
		if (os.platform() === 'win32') {
			command = command.replace(/[/]/g, '\\');
		}
	} else if (typeof command !== 'string') {
		throw new gutil.PluginError('gulp-phplint', 'Command Not Found: PHPLint');
	}


	return map( function(file, cb) {
		// First file triggers the command, so other files does not matter
		if (launched) {
			return cb(null, file);
		}
		launched = true;

		if (opt.debug)              { cmd += ' --debug'; }

		// construct command
		cmd = command + cmd;
		if ( opt.clear ) {
			cmd = 'clear && ' + cmd;
		}

		// append debug code if switch enabled
		if ((opt.debug) || (opt.dryRun)) {
			if(opt.dryRun) {
				console.log(chalk.green('\n\n       *** Dry Run Cmd: ' + cmd  + ' ***\n'));
			} else {
				console.log(chalk.yellow('\n\n       *** Debug Cmd: ' + cmd  + ' ***\n'));
			}
		}

		if( ! opt.dryRun ) {

			exec(cmd, function (error, stdout, stderr) {

				msg.success('PHPLint Execution Successful...');

				if (!opt.silent && stderr) {
					msg.error(stderr);
				}

				if (!opt.silent) {
					// Trim trailing cr-lf
					stdout = stdout.trim();
					if (stdout) {
						console.log(stdout);
					}
				}

				// call user callback if error occurs
				if (error) {
					if ( opt.statusLine ) {
						console.log('\n');
						msg.chalkline.red();
					}
					if (opt.debug) {
						msg.error(error);
						msg.chalkline.yellow();
					}
					cb(error, file);
				} else {
					if ( opt.statusLine ) {
						console.log('\n');
						if ( opt.debug ) {
							msg.chalkline.yellow();
						} else {
							msg.chalkline.green();
						}
					}
					cb(null, file);
				}


				// if notify flag enabled, show notification
				if ( opt.notify ) {
					var options = utils.notifyOptions(error ? 'fail' : 'pass',{taskName: 'PHPLint'});
					notifier.notify(options);
				}

			}).stdout.on('data', function(data) {
				var str = data.toString();
				cb(null, str);
			});
		}

	});
};

