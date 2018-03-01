// This is a base gulp file to start working.
// Because the paths of the specified files are taking the WP structure (wp-content/themes...), you will have to put this file and the package.json one in the root of the WP installation to work properly. If you feel more comfortable leaving this file into the the wordpress template folder you will have to change the paths consequently. This message will self-destruct in 3, 2, 1...

var gulp            = require('gulp'),
    nib             = require('nib'),
    stylus          = require('gulp-stylus'),
    rename          = require('gulp-rename'),
    notify          = require('gulp-notify');

gulp.task('styles', function(){
    gulp.src('wp-content/themes/pandora-wordpress-theme/assets/css/styl/main.styl')
        .pipe(stylus({compress: false, use: nib(), paths: ['wp-content/themes/pandora-wordpress-theme/assets/css/styl']}))
            .pipe(rename('wp-content/themes/pandora-wordpress-theme/style.css'))
            .pipe(notify('Compiled!'))
            .pipe(gulp.dest(''))
});

// The -dev suffix is for development purposes. If you want to use this theme to develop your own WordPress theme you can delete this task.
gulp.task('styles-dev', function(){
    gulp.src('assets/css/styl/main.styl')
        .pipe(stylus({compress: false, use: nib(), paths: ['assets/css/styl']}))
            .pipe(rename('style.css'))
            .pipe(notify('Compiled!'))
            .pipe(gulp.dest(''))
});

gulp.task('watch-dev', function(){
    gulp.watch('assets/css/styl/*.styl', ['styles']);
});

gulp.task('watch', function(){
    gulp.watch('wp-content/themes/pandora-wordpress-theme/assets/css/styl/*.styl', ['styles']);
});