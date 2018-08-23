'use strict';

//Подключаем модули
const gulp = require("gulp");
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const debug = require('gulp-debug');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');

//Преобразование всех less файлов в один main.css
gulp.task('less', function() {
    //Берем assets/styles/main.less
    return gulp.src("assets/styles/components/**/*.less")
        //Преобразуем в css
        .pipe(less())
        //Добавляем префиксы???
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        //Дебаггинг
        .pipe(debug({title:"All Less to one"}))
        //Записываем все в один файл
        .pipe(concat("main.css"))
        //Записываем в assets/styles
        .pipe(gulp.dest("assets/styles"))
        //Обновляем браузер
        .pipe(browserSync.stream());
});

//Удаление main.css
gulp.task('clean', function() {
    return del('assets/styles/main.css');
});

//Синхронизация с браузером
gulp.task('serve', function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("assets/styles/components/**/*.less", gulp.series('less'));
    //Событие при изменении
    gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task('default', gulp.series('clean', 'less', 'serve'));