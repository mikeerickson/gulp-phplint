# gulp-phplint
PHPLint plugin for gulp 3

## Installation

First, install `gulp-phplint` as a development dependency:

```shell
npm install --save-dev gulp-phplint
```


## Usage

After you have installed plugin, reference in to your `gulpfile.js`:

```javascript
var phplint = require('gulp-phplint');

// option 1: default format, equivalent to using `phplint` in command line (no options)

``` javascript
var gulp    = require('gulp');
var phpunit = require('gulp-phplint');

gulp.task('phplint', function() {
  gulp.src('')
    .pipe(phplint());
});
```


## API

### phplint(phpunitpath,options)

#### phpunitpath

Type: `String`

The path to the desired PHPLint binary
- If not supplied, the default path will be `./vendor/bin/phplint`

#### options.debug
Type:    `Boolean`
Default: `false`

Debug mode enabled (enables --debug switch as well)

#### options.clear
Type:    `Boolean`
Default: `false`

Clear console before executing command

#### options.dryRun
Type:    `Boolean`
Default: `false`

Executes dry run (doesn't actually execute tests, just echo command that would be executed)

#### options.notify
Type:    `Boolean`
Default: `true`

Conditionally display notification (both console and growl where applicable)

#### options.statusLine
Type:    `Boolean`
Default: `true`

Displays status lines as follows

  - green for passing tests
  - red for failing tests
  - yellow for tests which have `debug` property enabled (will also display red, green status)



### PHPLint Options

In addition to plugin options, the following PHPLint specific options may be configured.  For more information (and default values), visit the help supplied by PHPUnit

$ phplint --help 


## Credits

gulp-phplint written by Mike Erickson

E-Mail: [codedungeon@gmail.com](mailto:codedungeon@gmail.com)

Twitter: [@codedungeon](http://twitter.com/codedungeon)

Website: [codedungeon.org](http://codedungeon.org)
