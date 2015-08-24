'use strict';

var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var browserSync = require('browser-sync');

gulp.task('deploy', function () {
  return gulp.src('src/**/*')
  .pipe(ghPages());
});

gulp.task('watch', function() {
  browserSync({
    files: 'src/*',
    server: {
      baseDir: 'src/'
    }
  });
});