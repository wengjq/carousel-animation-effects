var gulp = require('gulp');
var rollup = require('rollup');
var rename = require('gulp-rename');
var minify_css = require('gulp-minify-css');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');

gulp.task('css', function () {
  return gulp.src('src/animation.css')
    .pipe(minify_css())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(''));
});

gulp.task('script', function () {
	return rollup.rollup({
    input: 'src/carousel.js',
  }).then(function (bundle) {
  	return bundle.write({
      file: 'carousel.js',
      format: 'umd',
      name: 'carousel',
    });
  })
});

gulp.task('2es5-uglify', function () {
	return gulp.src('carousel.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(''))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(''));
});

gulp.task('default', ['script'], function () {
  gulp.run('css', '2es5-uglify');
});