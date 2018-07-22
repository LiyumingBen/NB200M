const gulp = require('gulp');
const uglify = require('gulp-uglify');
const minifycss = require('gulp-cssmin');
const minhtml = require('gulp-htmlmin');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');

const app = {
    srcPath: './',   //源代码路径
    devPath: 'build/'//整合后的路径，开发路径
};

gulp.task('clean', function () {
    return gulp.src(app.devPath)
        .pipe(clean());
});

gulp.task('css', ['clean'], function () {
    return gulp.src(app.srcPath + 'css/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest(app.devPath + 'css'))
});

gulp.task('js', ['clean'], function () {
    return gulp.src(app.srcPath + 'js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(app.devPath + 'js'))
});

gulp.task('image', ['clean'], function () {
    return gulp.src(app.srcPath + 'img/*')
        .pipe(imagemin())
        .pipe(gulp.dest(app.devPath + 'img'))
});

gulp.task('html', ['clean'], function () {
    return gulp.src(app.srcPath + '*.html')
        .pipe(minhtml({collapseWhitespace: true}))
        .pipe(gulp.dest(app.devPath))
});

gulp.task('build', ['css', "js", "image", "html"], function () {
    return console.log("build success!");
});