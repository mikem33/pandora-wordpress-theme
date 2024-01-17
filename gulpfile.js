// This is the Gulp file used for generate the theme or develop this package.
const manifest      = require('./manifest.json'),
      theme         = manifest.theme;

var fs              = require('fs-extra'),
    gulp            = require('gulp'),
    stylus          = require('gulp-stylus'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglify'),
    replace         = require('gulp-replace'),
    sourcemaps      = require('gulp-sourcemaps'),
    runSequence     = require('gulp4-run-sequence'),
    checktextdomain = require('gulp-checktextdomain');

gulp.task('main-style', function(done){
    gulp.src('build/wp-content/themes/' + theme.slug + '/assets/css/styl/style.styl')
        .pipe(sourcemaps.init())
        .pipe(stylus({
            compress: true, 
            'include css': true,
            paths: ['build/wp-content/themes/' + theme.slug + '/assets/css/styl']
        }))
        .on('error', swallowError)
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/wp-content/themes/' + theme.slug));
    done();
});

gulp.task('pages-style', function(done){
    gulp.src('build/wp-content/themes/' + theme.slug + '/assets/css/styl/pages/*.styl')
        .pipe(sourcemaps.init())
        .pipe(stylus({
            compress: true, 
            'include css': true,
            paths: ['build/wp-content/themes/' + theme.slug + '/assets/css/styl/pages']
        }))
        .on('error', swallowError)
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/wp-content/themes/' + theme.slug + '/assets/css/pages'));
    done();
});

// Generate Javascript
gulp.task('js', function(done){
    return gulp.src([
            'build/wp-content/themes/' + theme.slug + '/assets/javascript/compile/*.js'
        ])
        .pipe(concat('javascript.min.js'))
        .pipe(gulp.dest('build/wp-content/themes/' + theme.slug + '/assets/javascript'))
        .pipe(uglify())
        .on('error', swallowError)
        .pipe(gulp.dest('build/wp-content/themes/' + theme.slug + '/assets/javascript'));
    done();
});

// Check textdomains in the theme.
gulp.task('checktextdomain', function() {
    var textDomain = theme.slug;
    return gulp.src([
        'build/wp-content/themes/' + textDomain + '/*.php',
        'build/wp-content/themes/' + textDomain + '/**/*.php',
        'build/wp-content/themes/' + textDomain + '/**/**/*.php'
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

gulp.task('clean-build', function () {
    return fs.remove('build');
});

gulp.task('copy-development-files', function() {
    return gulp.src(['src/*.*', 'src/.gitignore'])
        .pipe(gulp.dest('build/'))
});

gulp.task('copy-theme-files', function() {
    return gulp.src('src/wp-content/themes/theme/**/*.*')
        .pipe(gulp.dest('build/wp-content/themes/' + theme.slug))
});

gulp.task('copy-manifest', function() {
    return gulp.src('manifest.json')
        .pipe(gulp.dest('build'))
});

gulp.task('replace-css-handlebars', function(done) {
    return gulp.src([
        'build/wp-content/themes/' + theme.slug + '/assets/css/styl/style.styl',
        'build/manifest.json'
    ])
        .pipe(replace('{{theme_name}}', theme.name))
        .pipe(replace('{{theme_description}}', theme.description))
        .pipe(replace('{{theme_author}}', theme.author))
        .pipe(replace('{{theme_author_uri}}', theme.author_uri))
        .pipe(replace('{{theme_version}}', theme.version))
        .pipe(replace('{{theme_slug}}', theme.slug))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});

gulp.task('build', function (callback) {
    runSequence(
        'clean-build',
        'copy-theme-files',
        'copy-manifest',
        'copy-development-files',
        'checktextdomain',
        'replace-css-handlebars',
        ['main-style', 'pages-style', 'js'],
        callback
    );
});

// Show errors on console.
function swallowError (error) {
    console.log(error.toString())
    this.emit('end')
}