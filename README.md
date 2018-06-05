# gulp-phplint
PHPLint plugin for Gulp

## Installation

Install `phplint` service (globally)

```shell
npm i -g phplint
```

Install `gulp-phplint` as a development dependency to your project (for each project)

```shell
npm i -S gulp-phplint
```


## Usage

After you have installed the plugin, reference it in to your `gulpfile.js`:

```javascript
var phplint = require('gulp-phplint');
```

### Option 1

Default format. Equivalent to using `phplint` in command line (no options).

```javascript
var gulp    = require('gulp');
var phplint = require('gulp-phplint');

gulp.task('phplint', function() {
  gulp.src('')
    .pipe(phplint());
});
```

### Option 2

Default format using the `error` reporter.

``` javascript
gulp.task('phplint', function() {
  return gulp.src(['./src/AppBundle/**/*.php'])
    .pipe(phplint('', { /*opts*/ }))
    .pipe(phplint.reporter('error'));
});
```

### Option 3

Custom src files and custom reporter.

``` javascript
gulp.task('phplint:custom', function () {
  return gulp.src(['./src/AppBundle/**/*.php'])
    .pipe(phplint('', { /*opts*/ }))
    .pipe(phplint.reporter(function(file){
      var report = file.phplintReport || {};
      if (report.error) {
        console.error(report.message+' on line '+report.line+' of '+report.filename);
      }
    }));
});
```


## API

### phplint(path, options)

#### path

Type: `String`

Path to `php` binary.
If not supplied, the default php path will be used.

#### options.debug
Type:    `Boolean`
Default: `false`

Enable debug mode (enables --debug switch as well).

#### options.clear
Type:    `Boolean`
Default: `false`

Clear console before executing command.

#### options.dryRun
Type:    `Boolean`
Default: `false`

Simulates script execution. Doesn't actually execute tests, just echoes command that would be executed.

#### options.notify
Type:    `Boolean`
Default: `true`

Conditionally display notification (both console and growl where applicable).

#### options.statusLine
Type:    `Boolean`
Default: `true`

Displays status lines as follows:

  - green for passing files
  - red for failing files
  - yellow for an execution which has `debug` property enabled (will also display red and green statuses)

#### skipPassedFiles
Type:    `Boolean`
Default: `false`

Suppress reporting files which don't have syntax errors (files that passed linting).


## Credits

gulp-phplint written by Mike Erickson

E-Mail: [codedungeon@gmail.com](mailto:codedungeon@gmail.com)

Twitter: [@codedungeon](http://twitter.com/codedungeon)

Website: [codedungeon.org](http://codedungeon.org)

Inspired By: [jamarzka/gulp-phplint](https://github.com/jamarzka/gulp-phplint)
