// This is a base gulp file to start working.
// Because the paths of the specified files are taking the WP structure (wp-content/themes...), you will have to put this file and the package.json one in the root of the WP installation to work properly. If you feel more comfortable leaving this file into the the wordpress template folder you will have to change the paths consequently. This message will self-destruct in 3, 2, 1...

// The theme slug variable.
var themeSlug       = 'wp-content/themes/pandora-wordpress-theme/';

var gulp            = require('gulp'),
    nib             = require('nib'),
    util            = require('gulp-util'),
    stylus          = require('gulp-stylus'),
    rename          = require('gulp-rename'),
    notify          = require('gulp-notify'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglify'),    
    checktextdomain = require('gulp-checktextdomain');;

gulp.task('styles', function(){
    gulp.src(themeSlug + 'assets/css/styl/main.styl')
        .pipe(stylus({
                compress: false, 
                use: nib(),
                'include css': true,
                paths: [themeSlug + 'assets/css/styl']
            }))
            .on('error', swallowError)
            .pipe(rename(themeSlug + 'style.css'))
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
            themeSlug + 'assets/js/compile/modernizr.min.js',
            themeSlug + 'assets/js/compile/jquery.min.js',
            themeSlug + 'assets/js/compile/*.js'
        ])
        .pipe(concat('javascript.js'))
        .pipe(gulp.dest(themeSlug + 'assets/js'))
        .pipe(uglify())
        .on('error', swallowError)
        .pipe(gulp.dest(themeSlug + 'assets/js'));
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
    gulp.watch(themeSlug + 'assets/css/styl/*.styl', ['styles']);
    gulp.watch(themeSlug + 'assets/js/compile/*.js', ['js']);
});

gulp.task('watch-dev', function(){
    gulp.watch('assets/css/styl/*.styl', ['styles-dev']);
    gulp.watch('assets/js/compile/*.js', ['js']);
});

// Check textdomains in the theme.
gulp.task('checktextdomain', function() {
    var textdomain = 'pandora';
    return gulp.src([
        themeSlug + '*.php',
        themeSlug + '**/*.php',
        themeSlug + '**/**/*.php'
    ])
    .pipe(checktextdomain({
        text_domain: textdomain, //Specify allowed domain(s)
        keywords: [ //List keyword specifications
            '__:1,2d',
            '_e:1,2d',
            '_x:1,2c,3d',
            'esc_html__:1,2d',
            'esc_html_e:1,2d',
            'esc_html_x:1,2c,3d',
            'esc_attr__:1,2d',
            'esc_attr_e:1,2d',
            'esc_attr_x:1,2c,3d',
            '_ex:1,2c,3d',
            '_n:1,2,4d',
            '_nx:1,2,4c,5d',
            '_n_noop:1,2,3d',
            '_nx_noop:1,2,3c,4d'
        ],
        force: true,
        correct_domain: true
    }));
});

gulp.task('checktextdomain-dev', function() {
    var textdomain = 'pandora';
    return gulp.src([
        '*.php',
        '**/*.php',
        '**/**/*.php'
    ])
    .pipe(checktextdomain({
        text_domain: textdomain, //Specify allowed domain(s)
        keywords: [ //List keyword specifications
            '__:1,2d',
            '_e:1,2d',
            '_x:1,2c,3d',
            'esc_html__:1,2d',
            'esc_html_e:1,2d',
            'esc_html_x:1,2c,3d',
            'esc_attr__:1,2d',
            'esc_attr_e:1,2d',
            'esc_attr_x:1,2c,3d',
            '_ex:1,2c,3d',
            '_n:1,2,4d',
            '_nx:1,2,4c,5d',
            '_n_noop:1,2,3d',
            '_nx_noop:1,2,3c,4d'
        ],
        force: true,
        correct_domain: true
    }));
});

// Show errors on console.
function swallowError (error) {
    console.log(error.toString())
    this.emit('end')
}