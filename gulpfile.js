var gulp = require('gulp');
var rollup = require('rollup');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');
var babel = require('rollup-plugin-babel');
var uglify = require('gulp-uglify');

gulp.task('css', () => {
  return gulp.src('src/animation.css')
    .pipe(minifyCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('script', () => {
  return rollup.rollup({
    input: 'src/carousel.js',
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  }).then((bundle) => {
    return bundle.write({
      file: 'dist/carousel.js',
      format: 'umd',
      name: 'carousel',
    });
  });
});

gulp.task('uglify-js', () => {
  return gulp.src('carousel.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['script'], () => {
  gulp.run('css', 'uglify-js');
});
