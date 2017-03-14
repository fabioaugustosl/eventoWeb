var gulp = require('gulp');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');


var jsFiles = ['*.js','public/js/**/*.js']; 


gulp.task('style', function(){
	return gulp.src(jsFiles)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish',{
			verbose: true
		}));
});

gulp.task('inject',function(){
	var wiredep = require('wiredep').stream;
	var inject = require('gulp-inject');

	var injectSrc = gulp.src(['./public/css/*.css',
							  './public/js-lib/*.js',
							  './public/js/*.js',
							  './public/js/services/*.js',
							  './public/js/controllers/*.js',
							  './public/js/**/*.js'],{read:false});

	var injectOptions = {ignorePath: '/public'};

	var options = {
		bowerJson: require('./bower.json'),
		directory: './public/lib',
		ignorePath: '..'
	};

	return gulp.src('./public/view/*.html')
		.pipe(wiredep(options))
		.pipe(inject(injectSrc, injectOptions))
		.pipe(gulp.dest('./public/view'));
});

gulp.task('default', ['style','inject'], function(){
	var options = {
		script: 'scripts/web-server.js',
		delayTime: 1,
		env: {
			'PORT' : 8000
		},
		watch: jsFiles
	};
	return nodemon(options)
				.on('restart', function(ev){
					console.log('Restarting...');
				});
});
