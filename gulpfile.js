// This is the Gulp file used for generate the theme or develop this package.
const manifest      = require('./manifest.json');
const theme         = manifest.theme;

var fs              = require('fs-extra'),
    gulp            = require('gulp'),
    nib             = require('nib'),
    stylus          = require('gulp-stylus'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglify'),
    sourcemaps      = require('gulp-sourcemaps'),
    realFavicon     = require('gulp-real-favicon'),
    runSequence     = require('gulp4-run-sequence'),
    replace         = require('gulp-string-replace'),
    checktextdomain = require('gulp-checktextdomain');

gulp.task('styles', function(done){
    gulp.src('build/' + theme.slug + '/assets/css/styl/style.styl')
        .pipe(sourcemaps.init())
        .pipe(stylus({
            compress: true, 
            use: nib(),
            'include css': true,
            paths: ['build/' + theme.slug + '/assets/css/styl']
        }))
        .on('error', swallowError)
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/' + theme.slug));
    done();
});

// Generate Javascript
gulp.task('js', function(done){
    return gulp.src([
            'build/' + theme.slug + '/assets/javascript/compile/*.js'
        ])
        .pipe(concat('javascript.js'))
        .pipe(gulp.dest('build/' + theme.slug + '/assets/javascript'))
        .pipe(uglify())
        .on('error', swallowError)
        .pipe(gulp.dest('build/' + theme.slug + '/assets/javascript'));
    done();
});

// Check textdomains in the theme.
gulp.task('checktextdomain', function() {
    var textDomain = theme.slug;
    return gulp.src([
        'build/' + textDomain + '/*.php',
        'build/' + textDomain + '/**/*.php',
        'build/' + textDomain + '/**/**/*.php'
    ])
    .pipe(checktextdomain({
        text_domain: textDomain, // Specify allowed domain
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
    var FAVICON_DATA_FILE = 'build/' + theme.slug + '/assets/images/favicons/faviconData.json';
    realFavicon.generateFavicon({
        masterPicture: 'build/' + theme.slug + '/assets/images/favicons/favicon-master.png',
        dest: 'build/' + theme.slug + '/assets/images/favicons',
        iconsPath: 'build/' + theme.slug + '/assets/images/favicons/',
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

gulp.task('clean-build', function () {
    return fs.remove('build');
});

gulp.task('copy-development-files', function() {
    return gulp.src(['src/*.*', 'src/.gitignore'])
        .pipe(gulp.dest('build/'))
});

gulp.task('copy-theme-files', function() {
    return gulp.src('src/theme/**/*.*')
        .pipe(gulp.dest('build/' + theme.slug))
});

gulp.task('replace-css-handlebars', function(done) {
    return gulp.src('build/' + theme.slug + '/assets/css/styl/style.styl')
        .pipe(replace('{{theme_name}}', theme.name))
        .pipe(replace('{{theme_description}}', theme.description))
        .pipe(replace('{{theme_author}}', theme.author))
        .pipe(replace('{{theme_author_uri}}', theme.author_uri))
        .pipe(replace('{{theme_version}}', theme.version))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});

gulp.task('build', function (callback) {
    runSequence(
        'clean-build',
        'copy-theme-files',
        'copy-development-files',
        'checktextdomain',
        'replace-css-handlebars',
        ['styles','js'],
        'generate-favicon',
        callback
    );
});

// Show errors on console.
function swallowError (error) {
    console.log(error.toString())
    this.emit('end')
}