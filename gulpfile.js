// taken from https://github.com/chemzqm/confirm-dialog/blob/master/gulpfile.js

var growl = require('growl');
var serve = require('gulp-live-serve');
var livereload = require('gulp-livereload');
var webpack = require('webpack');
var gutil = require("gulp-util");
var gulp = require("gulp");
var path = require("path");
var del = require("del");
var babel = require('gulp-babel');
var browserify = require('gulp-browserify');
var config = require("./webpack.config");

const input = path.resolve(__dirname, 'src');

const output = path.resolve(__dirname, 'output');

var paths = {
    scripts: `${input}/**/*.js`,
    htmls: `${input}/**/*.html`,
    outputs: `${output}/**/*`
};

gulp.task('clean', function(){
    return del(paths.outputs);
});

gulp.task("default", ['build-dev']);

gulp.task("build-dev", ['serve', 'livereload', 'babel', 'example', 'watch']);

gulp.task('serve', serve({
    root: __dirname
}));

gulp.task('livereload', function(){
    livereload({start: true});
    var watcher = gulp.watch(paths.outputs);
    watcher.on('change', function(e){
        livereload.changed(e.path);
        growl(path.basename(e.path));
    });
});

gulp.task('babel', ['clean'], function(){
    return gulp.src(paths.scripts)
                .pipe(babel({
                    presets: ['env']
                }))
                .pipe(gulp.dest(output));
});

gulp.task('example', ['babel', 'copy-html', 'browsify-script']);

gulp.task('watch', ['example'], function(){
    gulp.watch([paths.scripts, paths.htmls], ['example']);
});

gulp.task('copy-html', ['clean'], function(){
    return gulp.src(paths.htmls).pipe(gulp.dest(output));
});

gulp.task('browsify-script', ['babel'], function(){
    return gulp.src(`${output}/example/index.js`)
                .pipe(browserify({
                    insertGlobals : true
                }))
                .pipe(gulp.dest(`${output}/example/build`));
});