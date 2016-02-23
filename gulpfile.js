"use strict";
/** Requires */
const fs          = require('fs');
const path        = require('path');

const gulp        = require('gulp');
const gutil       = require('gulp-util');
const plumber     = require('gulp-plumber');
const yaml        = require('js-yaml');

const del         = require('del');
const babel       = require('gulp-babel');
const eslint      = require('gulp-eslint');

/** Constants */
const eslintRules = yaml.load(
  fs.readFileSync(path.join(__dirname, "./.eslintrc.yml")));

const babelOpts = JSON.parse(
  fs.readFileSync('./.babelrc').toString());

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
  return gulp.src('./development/**/*.js')
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(babel(babelOpts))
    .pipe(gulp.dest('./bin'));
});

gulp.task('lint', () => {
  return gulp.src([
    './development/**/*.js',
    './gulpfile.js',
    './bare.js'
  ])
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(eslint(eslintRules))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('watch', () => {
  gulp.watch('./development/**/*.js', ['build']);
});

gulp.task('default', ['build']);
