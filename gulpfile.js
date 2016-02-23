"use strict";
/** Requires */
const fs          = require('fs');

const gulp        = require('gulp');
const gutil       = require('gulp-util');
const plumber     = require('gulp-plumber');

const del         = require('del');
const babel       = require('gulp-babel');

/** Helps */
function onError(err) {
  gutil.log(gutil.colors.red("Error"), err.toString());

  this.end();
}

/** Tasks */
gulp.task('clear', () => {
  del("./bin/**");
});

gulp.task('build', () => {
  const babelOpts = JSON.parse(
    fs.readFileSync('./.babelrc').toString());

  return gulp.src('./development/**/*.js')
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(babel(babelOpts))
    .pipe(gulp.dest('./bin'));
});

gulp.task('watch', () => {
  gulp.watch('./development/**/*.js', ['build']);
});

gulp.task('default', ['build']);
