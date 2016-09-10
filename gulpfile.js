// This is a base gulp file to start working.
// Because the paths of the specified files are taking the WP structure (wp-content/themes...), you will have to put this file and the package.json one in the root of the WP installation to work properly. If you feel more comfortable leaving this file into the the wordpress template folder you will have to change the paths consequently. This message will self-destruct in 3, 2, 1...

var gulp            = require('gulp'),
    nib             = require('nib'),
    gulpif          = require('gulp-if'),
    stylus          = require('gulp-stylus'),
    minifyCSS       = require('gulp-clean-css'),
    rename          = require('gulp-rename'),
    notify          = require('gulp-notify');

gulp.task('styles', function(){
    gulp.src('wp-content/themes/pandora-wordpress-theme/assets/css/styl/main.styl')
        .pipe(stylus({compress: false, use: nib(), paths: ['wp-content/themes/pandora-wordpress-theme/assets/css/styl']}))
            //.pipe(minifyCSS({keepSpecialComments : 1})) This is not working at the moment...
            .pipe(rename('wp-content/themes/pandora-wordpress-theme/style.css'))
            .pipe(notify('Compiled!'))
            .pipe(gulp.dest(''))
});

gulp.task('watch', function(){
    gulp.watch('wp-content/themes/pandora-wordpress-theme/assets/css/styl/*.styl', ['styles']);
});