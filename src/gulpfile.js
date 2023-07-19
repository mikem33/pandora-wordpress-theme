// Development
const manifest      = require('./manifest.json'),
      textDomain    = manifest.theme,
      themeSlug     = 'wp-content/themes/'+ textDomain +'/';

var gulp            = require('gulp'),
    babel           = require('gulp-babel')
    stylus          = require('gulp-stylus'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglify'),
    svgSprites      = require('gulp-svg-sprite'),
    sourcemaps      = require('gulp-sourcemaps'),
    realFavicon     = require('gulp-real-favicon');

var requires        = manifest.requires,
    cssRequires     = requires.css,
    jsRequires      = requires.js,
    cssFileNames    = Object.keys(cssRequires).map((key) => { return cssRequires[key].file }),
    cssDependencies = Object.keys(cssRequires).map((key) => { return cssRequires[key].path }),
    jsDependencies  = Object.keys(jsRequires).map((key) => { return jsRequires[key] });

gulp.task('init-config', gulp.series(function(done) {
    gulp.src(cssDependencies)
        .pipe(gulp.dest(themeSlug + 'assets/css/vendor'))
    gulp.src(jsDependencies)
        .pipe(gulp.dest(themeSlug + 'assets/javascript/vendor'));
    done();
}));

gulp.task('main-style', function(done){
    gulp.src(theme.slug + '/assets/css/styl/style.styl')
        .pipe(sourcemaps.init())
        .pipe(stylus({
            compress: true, 
            'include css': true,
            paths: [theme.slug + '/assets/css/styl']
        }))
        .on('error', swallowError)
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(theme.slug));
    done();
});

gulp.task('pages-style', function(done){
    gulp.src(theme.slug + '/assets/css/styl/pages/*.styl')
        .pipe(sourcemaps.init())
        .pipe(stylus({
            compress: true, 
            'include css': true,
            paths: [theme.slug + '/assets/css/styl/pages']
        }))
        .on('error', swallowError)
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(theme.slug + '/assets/css/pages'));
    done();
});

// Generate Javascript
gulp.task('js', function(){
    return gulp.src([
            themeSlug + 'assets/javascript/compile/*.js'
        ])
        .pipe(concat('javascript.min.js'))
        .pipe(gulp.dest(themeSlug + 'assets/javascript'))
        .pipe(uglify())
        .on('error', swallowError)
        .pipe(gulp.dest(themeSlug + 'assets/javascript'));
});

gulp.task('watch', function(){
    gulp.watch(themeSlug + 'assets/css/styl/components/*.styl', gulp.series('main-styl'));
    gulp.watch(themeSlug + 'assets/css/styl/partials/*.styl', gulp.series('main-styl'));
    gulp.watch(themeSlug + 'assets/css/styl/utilities/*.styl', gulp.series('main-styl', 'pages-style'));
    gulp.watch(themeSlug + 'assets/css/styl/pages/*.styl', gulp.series('pages-style'));
    gulp.watch(themeSlug + 'assets/javascript/compile/*.js', gulp.series('js'));
});

gulp.task('svgsprites', function(done) {
    gulp.src(themeSlug + 'assets/images/_sprites-svg/*.svg')
    .pipe(svgSprites(config))
    .pipe(gulp.dest(themeSlug + 'assets/images'));
    done();
});

// Show errors on console.
function swallowError (error) {
    console.log(error.toString())
    this.emit('end')
}