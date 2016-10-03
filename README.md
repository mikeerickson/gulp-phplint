# gulp-phplint
PHPLint plugin for gulp 3

## Installation

Install `phplint` service (installed globally)

```shell
npm i -g phplint
```

Install `gulp-phplint` as a development dependency to your project (plugin should be installed for each project)

```shell
npm i -S gulp-phplint
```


## Usage

After you have installed plugin, reference in to your `gulpfile.js`:

```javascript
var phplint = require('gulp-phplint');
```

// option 1: default format, equivalent to using `phplint` in command line (no options)

``` javascript
var gulp    = require('gulp');
var phplint = require('gulp-phplint');

gulp.task('phplint', function() {
  gulp.src('')
    .pipe(phplint());
});
```

// option 2: default format using the `fail` reporter

``` javascript
gulp.task('phplint', function() {
  return gulp.src(['./src/AppBundle/**/*.php'])
    .pipe(phplint('', opts))
    .pipe(phplint.reporter('fail'));
});
```

// option 3: custom src files and custom reporter

``` javascript
gulp.task('phplint:custom', function () {
  return gulp.src(['./src/AppBundle/**/*.php'])
    .pipe(phplint('',opts))
    .pipe(phplint.reporter(function(file){
      var report = file.phplintReport || {};
      if (report.error) {
        console.error(report.message+' on line '+report.line+' of '+report.filename);
      }
    }));
});
```


## API

### phplint(phplintpath,options)

#### phplint path

Type: `String`

Path to `php` binary
- If not supplied, the default php path will be used

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

  - green for passing files
  - red for failing files
  - yellow for execution which have `debug` property enabled (will also display red, green status)

#### skipPassedFiles
Type:    `Boolean`
Default: `false`

Suppress reporting files which dont have syntax errors (passed files)


## Credits

gulp-phplint written by Mike Erickson

E-Mail: [codedungeon@gmail.com](mailto:codedungeon@gmail.com)

Twitter: [@codedungeon](http://twitter.com/codedungeon)

Website: [codedungeon.org](http://codedungeon.org)

Inspired By: [jamarzka/gulp-phplint](https://github.com/jamarzka/gulp-phplint)
