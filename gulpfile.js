const {src, dest, parallel, watch, series} = require('gulp');


//plugins
let htmlmin = require('gulp-htmlmin');
let concat = require('gulp-concat');
let autoprefixer = require('gulp-autoprefixer');
let sass = require('gulp-sass')(require('sass'));
let browsersync = require('browser-sync').create();
let del = require('del');
let size = require('gulp-size');
let imagemin = require('gulp-imagemin');

//function
function html(){
    return src('./src/*.html')
    .pipe(size({title: "before size"}))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(size({title: "after size"}))
    .pipe(dest('./dist'))
    .pipe(browsersync.stream());
}

function images(){
    return src('./src/images/**/*.{jpg,png,jpeg,svg,gif,webp}')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5})
    ]))
    .pipe(dest('./dist/images'))
    .pipe(browsersync.stream());
}

function scss(){
    return src('./src/scss/style.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer())
    .pipe(concat('style.min.css'))
    .pipe(dest('./dist/css'))
    .pipe(browsersync.stream());
}

function js(){
    return src('./src/js/*.js')
    .pipe(dest('./dist/js'))
    .pipe(browsersync.stream());
}

function clear(){
    return del('./dist');
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
    watch(['./src/images/**/*.{jpg,png,jpeg,svg,gif,webp}'], images);
}

//exports
exports.images = images;
exports.scss = scss;
exports.js = js;
exports.wather = wather;
exports.clear = clear;
exports.browserSync = browserSync;
exports.html = html;

exports.default = series(
    clear,
    images,
    html,
    scss,
    js,
    parallel(wather, browserSync),
);



