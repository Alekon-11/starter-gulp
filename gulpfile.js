const {src, dest, parallel, watch, series} = require('gulp');

//plugins
let htmlmin = require('gulp-htmlmin');
let concat = require('gulp-concat');
let autoprefixer = require('gulp-autoprefixer');
let sass = require('gulp-sass')(require('sass'));
let browsersync = require('browser-sync').create();
let del = require('del');

//function
function html(){
    return src('./src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('./dist'))
    .pipe(browsersync.stream());
}

function scss(){
    return src('./src/scss/style.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({ overrideBrowserslist: 'last 8 versions' }))
    .pipe(concat('style.min.css'))
    .pipe(dest('./dist/css'))
    .pipe(browsersync.stream());
}

function clear(){
    return del('./dist');
}

function js(){
    return src('./src/js/*.js')
    .pipe(dest('./dist/js'))
    .pipe(browsersync.stream());
}

function browserSync(){
    browsersync.init({
        server: {
            baseDir: "./dist"
        },
        notify: false
    });
}

function wather(){
    watch(['./src/*.html'], html);
    watch(['./src/js/*.js'], js);
    watch(['./src/scss/*.scss'], scss);
}

//exports
exports.scss = scss;
exports.js = js;
exports.wather = wather;
exports.clear = clear;
exports.browserSync = browserSync;
exports.html = html;
exports.default = series(
    clear,
    html,
    scss,
    js,
    parallel(wather, browserSync)
);



