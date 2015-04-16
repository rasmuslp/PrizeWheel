'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('default', function() {
  gulp.watch(['src/**/*.js'], [browserSync.reload]);
  gulp.watch(['src/**/*.html'], [browserSync.reload]);
  gulp.watch(['src/**/*.css'], [browserSync.reload]);
  gulp.watch(['src/**/*.json'], [browserSync.reload]);

  browserSync({
    server: {
      baseDir: 'src/'
    }
  });
});