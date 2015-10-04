/*
npm install
npm install --global gulp
gulp
npm install --save-dev gulp-postcss
npm install --save-dev gulp-import-css
npm install gulp-concat --save-dev
npm install gulp-sass

https://www.npmjs.com/package/gulp-concat

Application => Copy, Combine, Minify for all types of files.
*/
var gulp = require('gulp');
var concat = require("gulp-concat");
var importCss = require('gulp-import-css');
var minifyCss = require('gulp-minify-css');

gulp.task("page_js",function(){
    gulp.src(['../../static/libs/page.js', '../../app/page_js/custom_js.js'])
        .pipe(concat('page_js.js'))
        .pipe(gulp.dest('../../app/page_js/'));
});
gulp.task("react-todo-app",function(){
    gulp.src([
            '../../static/libs/page.js',
            '../../static/libs/jquery-2.1.3.js',
            '../../static/js/test_helper.js',
            // '../../app/react_workshop/js/react-0.13.2/build/react.js',
            // '../../app/react_workshop/js/react-0.13.2/build/JSXTransformer.js',
            '../../app/react_workshop/todo_assets/js/apis/apis.js',
            '../../app/react_workshop/todo_assets/js/actions/actions.js',
            '../../app/react_workshop/todo_assets/js/component/header.js',
    		'../../app/react_workshop/todo_assets/js/component/todoitem.js',
    		'../../app/react_workshop/todo_assets/js/component/todolist.js',
    		'../../app/react_workshop/todo_assets/js/component/alltask.js',
    		'../../app/react_workshop/todo_assets/js/app.js'])
        .pipe(concat('todo_app.js'))
        .pipe(gulp.dest('../../app/react_workshop/'));
});
gulp.task("test_js",function(){
    gulp.src(['./src/assets/js/test.js', './src/assets/js/test2.js'])
        .pipe(concat('test.js'))
        .pipe(gulp.dest('dist/assets/js/'));
});
gulp.task("test_css",function(){
    gulp.src('./src/assets/css/test.css')
        .pipe(importCss())
        .pipe(minifyCss())
        .pipe(concat('test.css'))
        .pipe(gulp.dest('dist/assets/css/'));
});
gulp.task('default',['test_js', 'test_css', 'page_js', 'react-todo-app']);
gulp.task("watch",['default'],function(){
	gulp.watch('../../app/page_js/*.js',['page_js']);
	gulp.watch('../../app/react_workshop/**/*.js',['react-todo-app']);
});