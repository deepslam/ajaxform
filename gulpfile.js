var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var pump = require('pump');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var src = 'lib/ajaxform.jquery.js';

gulp.task('compress', function (cb) {
  pump([
        gulp.src(src),
        uglify(),
        concat('ajaxform.jquery.min.js'),
        gulp.dest('dist')
    ],
    cb
  );
});

gulp.task('default', [ 'compress' ]);

gulp.task('watch', function () {
   watch(src, batch(function (events, done) {
        gulp.start('compress', done);
    }));
});