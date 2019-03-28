// This is a base gulp file to start working.
// Because the paths of the specified files are taking the WP structure (wp-content/themes...), 
// you will have to put this file and the package.json one in the root of the WP installation to work properly. 
// If you feel more comfortable leaving this file into the the wordpress template folder you will have to change the paths consequently. 
// This message will self-destruct in 3, 2, 1...

// The theme slug variable.
var themeSlug       = 'wp-content/themes/pandora-wordpress-theme/';

var fs              = require('fs'),
    gulp            = require('gulp'),
    nib             = require('nib'),
    stylus          = require('gulp-stylus'),
    notify          = require('gulp-notify'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglify'),
    manifest        = require('./manifest.json'),
    modernizr       = require('gulp-modernizr'),
    sourcemaps      = require('gulp-sourcemaps'),    
    realFavicon     = require('gulp-real-favicon'),
    checktextdomain = require('gulp-checktextdomain');

var requiresJs = manifest.requires.js;
var jsDependencies = Object.keys(requiresJs).map((key) => { return requiresJs[key] });

gulp.task('init-config', ['modernizr'], function() {
    gulp.src(jsDependencies)
        .pipe(gulp.dest(themeSlug + 'assets/javascript/vendor'))
});

gulp.task('init-config-dev', ['modernizr-dev'], function() {
    gulp.src(jsDependencies)
        .pipe(gulp.dest('assets/javascript/vendor'))
});

gulp.task('styles', function(){
    gulp.src(themeSlug + 'assets/css/styl/style.styl')
        .pipe(sourcemaps.init())
        .pipe(stylus({
            compress: true, 
            use: nib(),
            'include css': true,
            paths: [themeSlug + 'assets/css/styl']
        }))
        .on('error', swallowError)
        .pipe(sourcemaps.write('.'))
        .pipe(notify('Compiled!'))
        .pipe(gulp.dest(themeSlug))
});

// The -dev suffix is for development purposes. 
// If you want to use this theme to develop your own WordPress theme you can delete this task.
gulp.task('styles-dev', function(){
    gulp.src('assets/css/styl/style.styl')
        .pipe(sourcemaps.init())
        .pipe(stylus({
            compress: true,
            use: nib(),
            'include css': true,
            paths: ['assets/css/styl']
        }))
        .on('error', swallowError)
        .pipe(sourcemaps.write('.'))
        .pipe(notify('Compiled!'))
        .pipe(gulp.dest('.'))
});

// Generate Javascript
gulp.task('js', function(){
    return gulp.src([
            themeSlug + 'assets/javascript/vendor/modernizr.min.js',
            themeSlug + 'assets/javascript/vendor/jquery.min.js',
            themeSlug + 'assets/javascript/compile/*.js'
        ])
        .pipe(concat('javascript.js'))
        .pipe(gulp.dest(themeSlug + 'assets/javascript'))
        .pipe(uglify())
        .on('error', swallowError)
        .pipe(gulp.dest(themeSlug + 'assets/javascript'));
});

// Generate Javascript
gulp.task('js-dev', function(){
    return gulp.src([
            'assets/javascript/compile/*.js'
        ])
        .pipe(concat('javascript.js'))
        .pipe(gulp.dest('assets/javascript'))
        .pipe(uglify())
        .on('error', swallowError)
        .pipe(gulp.dest('assets/javascript'));
});

gulp.task('watch', function(){
    gulp.watch(themeSlug + 'assets/css/styl/**/*.styl', ['styles']);
    gulp.watch(themeSlug + 'assets/javascript/compile/*.js', ['js']);
});

gulp.task('watch-dev', function(){
    gulp.watch('assets/css/styl/**/*.styl', ['styles-dev']);
    gulp.watch('assets/javascript/compile/*.js', ['js']);
});

gulp.task('modernizr', function() {
    return gulp.src('modernizr.json')
        .pipe(modernizr(require('./modernizr.json')))
        .pipe(gulp.dest(themeSlug + 'assets/javascript/vendor'))
        .pipe(notify('Modernizr has been generated.'))
});

gulp.task('modernizr-dev', function() {
    return gulp.src('modernizr.json')
        .pipe(modernizr(require('./modernizr.json')))
        .pipe(gulp.dest('assets/javascript/vendor'))
        .pipe(notify('Modernizr has been generated.'))
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
        text_domain: textdomain, // Specify allowed domain
        keywords: [ // List keyword specifications
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
        text_domain: textdomain, // Specify allowed domain
        keywords: [ // List keyword specifications
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


gulp.task('generate-favicon', function(done) {
    // File where the favicon markups are stored (unnecessary but I don't know how to avoid its generation).
    var FAVICON_DATA_FILE = themeSlug + 'assets/images/favicons/faviconData.json';
    realFavicon.generateFavicon({
        masterPicture: themeSlug + 'assets/images/favicons/master-picture.png',
        dest: themeSlug + 'assets/images/favicons',
        iconsPath: themeSlug + '/assets/images/favicons/',
        design: {
            ios: {
                pictureAspect: 'noChange',
                assets: {
                    ios6AndPriorIcons: false,
                    ios7AndLaterIcons: false,
                    precomposedIcons: false,
                    declareOnlyDefaultIcon: true
                }
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'noChange',
                backgroundColor: '#2b5797',
                onConflict: 'override',
                assets: {
                    windows80Ie10Tile: false,
                    windows10Ie11EdgeTiles: {
                        small: false,
                        medium: true,
                        big: false,
                        rectangle: false
                    }
                }
            },
            androidChrome: {
                pictureAspect: 'noChange',
                themeColor: '#ffffff',
                manifest: {
                    display: 'standalone',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                },
                assets: {
                    legacyIcon: false,
                    lowResolutionIcons: false
                }
            },
            safariPinnedTab: {
                pictureAspect: 'blackAndWhite',
                threshold: 50,
                themeColor: '#5bbad5'
            }
        },
        settings: {
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false,
            readmeFile: false,
            htmlCodeFile: false,
            usePathAsIs: false
        },
        markupFile: FAVICON_DATA_FILE
    }, function() {
        done();
    });
});

gulp.task('generate-favicon-dev', function(done) {
    // File where the favicon markups are stored (unnecessary but I don't know how to avoid its generation).
    var FAVICON_DATA_FILE = 'assets/images/favicons/faviconData.json';
    realFavicon.generateFavicon({
        masterPicture: 'assets/images/favicons/favicon-master.png',
        dest: 'assets/images/favicons',
        iconsPath: '/assets/images/favicons/',
        design: {
            ios: {
                pictureAspect: 'noChange',
                assets: {
                    ios6AndPriorIcons: false,
                    ios7AndLaterIcons: false,
                    precomposedIcons: false,
                    declareOnlyDefaultIcon: true
                }
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'noChange',
                backgroundColor: '#2b5797',
                onConflict: 'override',
                assets: {
                    windows80Ie10Tile: false,
                    windows10Ie11EdgeTiles: {
                        small: false,
                        medium: true,
                        big: false,
                        rectangle: false
                    }
                }
            },
            androidChrome: {
                pictureAspect: 'noChange',
                themeColor: '#ffffff',
                manifest: {
                    display: 'standalone',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                },
                assets: {
                    legacyIcon: false,
                    lowResolutionIcons: false
                }
            },
            safariPinnedTab: {
                pictureAspect: 'blackAndWhite',
                threshold: 50,
                themeColor: '#5bbad5'
            }
        },
        settings: {
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false,
            readmeFile: false,
            htmlCodeFile: false,
            usePathAsIs: false
        },
        markupFile: FAVICON_DATA_FILE
    }, function() {
        done();
    });
});

// Show errors on console.
function swallowError (error) {
    console.log(error.toString())
    this.emit('end')
}