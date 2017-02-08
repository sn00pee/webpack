'use strict';
var	gulp 			= require('gulp'),
	postcss 		= require('gulp-postcss'),
	autoprefixer 	= require('gulp-autoprefixer'),
	sass 			= require('gulp-sass'),
	notify 			= require('gulp-notify'),
	del 			= require('del'),
	runSequence 	= require('run-sequence'),
	watch 			= require('gulp-watch'),
	webpack2 		= require('webpack'),
	webpack 		= require('webpack-stream');

var webpackConfig = './build/webpack.base.conf.js'

gulp.task('sass',function() {
	return gulp.src('./src/scss/main.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		})
		.on('error', sass.logError))
	  	.pipe(autoprefixer({browsers: ['last 10 versions']}))
		.pipe(notify({message:"**** SCSS FINISHED ****"}))
		.pipe(gulp.dest('./dist/css/'))
});

gulp.task('clean', function () {
  return del([
    './dist/**/*',
    './dist/'
  ]);
});

gulp.task('set-dev', function() {
    return process.env.NODE_ENV = 'development';
});

gulp.task('set-prod', function() {
    return process.env.NODE_ENV = 'production';
});

gulp.task('build', ['set-prod'], function() {
	webpackConfig = './build/webpack.prod.conf.js'
    runSequence(
    	'default',
    	'sass',
        'webpack'
    );
});

gulp.task('dev', ['set-dev'], function() {
	webpackConfig = './build/webpack.dev.conf.js'
    runSequence(
    	'default',
    	'sass',
        'webpack'
    );
});

gulp.task('watch', ['dev'], function () {
	gulp.watch('./src/scss/**/*.scss',['sass']);
	gulp.watch('./src/js/**/*.{js,vue}',['webpack']);
});

gulp.task('webpack', function() {
  return gulp.src('./src/js/main.js')
    .pipe(webpack(require(webpackConfig), webpack2))
	.pipe(notify({message:"**** WEBPACK FINISHED ****"}))
    .pipe(gulp.dest('./dist/'));
});

//default task should be set to clean; use 'gulp watch for dev'
gulp.task('default', ['clean']);