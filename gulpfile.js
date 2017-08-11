// taken from https://github.com/chemzqm/confirm-dialog/blob/master/gulpfile.js

var growl = require('growl');
var serve = require('gulp-live-serve');
var livereload = require('gulp-livereload');
var webpack = require('webpack');
var gutil = require("gulp-util");
var gulp = require("gulp");
var path = require("path");
var config = require("./webpack.config");

var paths = {
    scripts: ['index.js', 'example/index.js'],
    assets: ['example/bundle.js', 'example/index.html']
}

gulp.task("default", ['build-dev']);

gulp.task("build-dev", ['webpack:build-dev', 'serve'], function(){
    livereload({start: true});
    gulp.watch(paths.scripts, ['webpack:build-dev']);
    var watcher = gulp.watch(paths.assets);
    watcher.on('change', function(e){
        livereload.changed(e.path);
        growl(path.basename(e.path));
    })
});

gulp.task('serve', serve({
    root: __dirname
}))

gulp.task('webpack:build-dev', function(callback){
    var devCompiler = webpack(config);
    // webpack nodejs api, see https://webpack.github.io/docs/node.js-api.html
    devCompiler.run(function(err, stats){
        if(err) {
            throw new gutil.PluginError('webpack:build-dev', err);
        }
        gutil.log('[webpack:build-dev]', stats.toString({
            chunks: false,
            colors: true
        }));
        callback && callback();
    })
})