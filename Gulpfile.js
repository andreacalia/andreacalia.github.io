var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var concat = require('gulp-concat');

// SASS files
gulp.task('styles', function() {
  return    gulp.src('./index/sass/style.scss')
            .pipe(concat('index.min.css'))
            .pipe(gulp.dest('./index/dist/'))
            .pipe(sass({ style: 'compressed', includePaths: ['./index/sass/']}).on('error', sass.logError))
            .pipe(gulp.dest('./index/dist/'))
            .pipe(browserSync.stream());
});

// JS files
gulp.task('js', function () {
    return  gulp.src('./index/js/**/*.js')
            .pipe(concat('index.min.js'))
            .pipe(gulp.dest('./index/dist/'))
            .pipe(uglify()).on('error', gutil.log)
            .pipe(gulp.dest('./index/dist/'))
            .pipe(browserSync.stream());
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], browserSync.reload);

// Static server
gulp.task('serve', function() {

    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch('./index/sass/**/*.scss', ['styles']);
    gulp.watch("./*.html").on('change', browserSync.reload);
    gulp.watch("./index/js/**/*.js", ['js-watch']);
});

// Watch task
gulp.task('default', ['serve']);
