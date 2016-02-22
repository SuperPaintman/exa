"use strict";
const fs = require('fs');

const gulp = require('gulp');
const del = require('del');
const babel = require('gulp-babel');

gulp.task('clear', () => {
  del("./bin/**");
});

gulp.task('build', () => {
  const babelOpts = JSON.parse(
    fs.readFileSync('./.babelrc').toString());

  return gulp.src('./development/**/*.js')
    .pipe(babel(babelOpts))
    .pipe(gulp.dest('./bin'));
});

gulp.task('default', ['build']);
