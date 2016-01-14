'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var gfi = require('gulp-file-insert');

gulp.task('scripts', function() {
    return gulp.src('src/scripts/**/*.js')
        .pipe(gulp.dest('build/assets/js'));
});

gulp.task('shaders', function() {
    gulp.src('./src/html/index.html')
        .pipe(gfi({
            '/* vertex-shader */': 'src/shaders/vector.glsl',
            '/* fragment-shader */': 'src/shaders/fragment.glsl'
        }))
        .pipe(gulp.dest('./build/'));
});

gulp.task('serve', ['shaders', 'scripts'], function() {
    browserSync.init({
        startPath: '/index.html',
        server: {
            baseDir: './build',
            routes: {
                '/static': 'static',
            }
        }
    });
    gulp.watch('./src/shaders/*.glsl', ['shaders']);
    gulp.watch('./src/scripts/*.js', ['scripts']);
    gulp.watch('./src/html/*.html', ['shaders']);
    gulp.watch('build/*.html').on('change', browserSync.reload);
    gulp.watch('build/assets/js/*.js').on('change', browserSync.reload);
});


