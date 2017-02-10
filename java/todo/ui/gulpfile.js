var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require("gulp-concat");
var webserver = require('gulp-webserver');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var basePath= "./dist/";

gulp.task('copy',function(){
  gulp.src('src/dashboard.html').pipe(gulp.dest(basePath));
  gulp.src('src/jquery-3.1.0/*').pipe(gulp.dest(basePath+'jquery-3.1.0/'));
  gulp.src('src/bootstrap-3.3.7-dist/**/**').pipe(gulp.dest(basePath+'bootstrap-3.3.7-dist/'));
});

gulp.task("browserify",function(){
	gulp.src('src/js/start.js')
	.pipe(browserify({transform:'reactify'}))
	.pipe(concat('start.js'))
	.pipe(gulp.dest(basePath+'js/'))
});

gulp.task("browserify-minify",function(){
  gulp.src('src/js/start.js')
  .pipe(browserify({transform:'reactify'}))
  .pipe(uglify())
  .pipe(concat('start-min.js'))
  .pipe(gulp.dest(basePath+'js/'))
});

// this serves the transformed files to dist folder
gulp.task("serve", ["copy", "browserify", "browserify-minify"]);

// Watch over changes to all files
gulp.task("watch",function(){
    gulp.watch("src/**/*.*", ['serve']);
});

// spawn a web server you can specify any other port that you want
gulp.task('webserver', function() {
  gulp.src(['dist'])
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
      https:false,
      host:'localhost',
      port:8000
    }));
});

// the default gulp task which is run when you run gulp
gulp.task('default', ['serve']);
