// This is a base gulp file to start working.
// Because the paths of the specified files are taking the WP structure (wp-content/themes...), you will have to put this file and the package.json one in the root of the WP installation to work properly. If you feel more comfortable leaving this file into the the wordpress template folder you will have to change the paths consequently. This message will self-destruct in 3, 2, 1...

var gulp            = require('gulp'),
    nib             = require('nib'),
    stylus          = require('gulp-stylus'),
    rename          = require('gulp-rename'),
    notify          = require('gulp-notify'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglify');

gulp.task('styles', function(){
    gulp.src('wp-content/themes/pandora-wordpress-theme/assets/css/styl/main.styl')
        .pipe(stylus({
                compress: false, 
                use: nib(),
                'include css': true,
                paths: ['wp-content/themes/pandora-wordpress-theme/assets/css/styl']
            }))
            .on('error', swallowError)
            .pipe(rename('wp-content/themes/pandora-wordpress-theme/style.css'))
            .pipe(notify('Compiled!'))
            .pipe(gulp.dest(''))
});

// The -dev suffix is for development purposes. If you want to use this theme to develop your own WordPress theme you can delete this task.
gulp.task('styles-dev', function(){
    gulp.src('assets/css/styl/main.styl')
        .pipe(
            stylus({
                compress: false,
                use: nib(),
                'include css': true,
                paths: ['assets/css/styl']
            }))
            .on('error', swallowError)
            .pipe(rename('style.css'))
            .pipe(notify('Compiled!'))
            .pipe(gulp.dest(''))
});

// Generate Javascript
gulp.task('js', function(){
    return gulp.src([
            'wp-content/themes/pandora-wordpress-theme/assets/js/compile/modernizr.min.js',
            'wp-content/themes/pandora-wordpress-theme/assets/js/compile/jquery.min.js',
            'wp-content/themes/pandora-wordpress-theme/assets/js/compile/*.js'
        ])
        .pipe(concat('javascript.js'))
        .pipe(gulp.dest('wp-content/themes/pandora-wordpress-theme/assets/js'))
        .pipe(uglify())
        .on('error', swallowError)
        .pipe(gulp.dest('wp-content/themes/pandora-wordpress-theme/assets/js'));
});

// Generate Javascript
gulp.task('js-dev', function(){
    return gulp.src([
            'assets/js/compile/*.js'
        ])
        .pipe(concat('javascript.js'))
        .pipe(gulp.dest('assets/js'))
        .pipe(uglify())
        .on('error', swallowError)
        .pipe(gulp.dest('assets/js'));
});

gulp.task('watch', function(){
    gulp.watch('wp-content/themes/pandora-wordpress-theme/assets/css/styl/*.styl', ['styles']);
    gulp.watch('wp-content/themes/pandora-wordpress-theme/assets/js/compile/*.js', ['js']);
});

gulp.task('watch-dev', function(){
    gulp.watch('assets/css/styl/*.styl', ['styles-dev']);
    gulp.watch('assets/js/compile/*.js', ['js']);
});

// Show errors on console.
function swallowError (error) {
    console.log(error.toString())
    this.emit('end')
}