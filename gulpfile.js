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
var config = require("./webpack.config");

const inputDir = path.resolve(__dirname, 'src');

const outputDir = path.resolve(__dirname, 'output');

var paths = {
    scripts: `${inputDir}/**/*.js`,
    htmls: `${inputDir}/**/*.html`,
    outputs: `${outputDir}/**/*`
};

gulp.task('clean', function(){
    return del(paths.outputs);
});

gulp.task("default", ['build-dev']);

gulp.task("build", ["babel"]);

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
    return gulp.src(`${inputDir}/index.js`)
                .pipe(babel({
                    presets: ['env']
                }))
                .pipe(gulp.dest(outputDir));
});

gulp.task('example', ['clean', 'copy-html', 'webpack']);

gulp.task('watch', ['babel', 'example'], function(){
    gulp.watch([paths.scripts, paths.htmls], ['babel','example']);
});

gulp.task('copy-html', ['clean'], function(){
    return gulp.src(paths.htmls).pipe(gulp.dest(outputDir));
});

gulp.task('webpack', ['clean'], function(callback){
    var devCompiler = webpack(config);
    // webpack nodejs api, see https://webpack.github.io/docs/node.js-api.html
    devCompiler.run(function(err, stats){
        if(err) {
            throw new gutil.PluginError('example', err);
        }
        gutil.log('[example]', stats.toString({
            chunks: false,
            colors: true
        }));
        callback && callback();
    })
});