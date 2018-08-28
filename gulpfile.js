'use strict';

//Подключаем модули
const gulp = require("gulp"),
      browserSync = require('browser-sync').create(),
      concat = require('gulp-concat'),
      debug = require('gulp-debug'),
      less = require('gulp-less'),
      autoprefixer = require('gulp-autoprefixer'),
      del = require('del'),
      svgmin   = require("gulp-svgmin"),
      rename   = require("gulp-rename"),
      inject   = require("gulp-inject"),
      svgstore = require("gulp-svgstore"),
      path = require("path");

//Преобразование всех less файлов в один main.css
gulp.task('less', function() {
    //Берем assets/styles/main.less
    return gulp.src("assets/styles/main.less") //minimatch
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
        //.pipe(concat("main.css"))
        //Записываем в assets/styles
        .pipe(gulp.dest("assets/styles"))
        //Обновляем браузер
        .pipe(browserSync.stream());
});

//Удаление main.css
gulp.task('clean', function() {
    return del('assets/styles/main.css');
});

gulp.task("svg", () => {
    let svgs = gulp
        .src("./assets/images/*.svg")
        .pipe(svgmin(function (file) {
            let prefix = path.basename(file.relative, path.extname(file.relative));

            return {
                plugins: [
                    {
                        removeTitle: true
                    },
                    {
                        removeAttrs: {
                            attrs: "(fill|stroke)"
                        }
                    },
                    {
                        removeStyleElement: true
                    },
                    {
                        cleanupIDs: {
                            prefix: prefix + "-",
                            minify: true
                        }
                    }
                ]
            }
        }))
        //.pipe(rename({prefix: "icon-"}))
        .pipe(svgstore({inlineSvg: true}));

    function fileContents(filePath, file) {
        return file.contents.toString();
    }

    return gulp
        .src("index.html")
        .pipe(inject(svgs, {transform: fileContents}))
        .pipe(gulp.dest("./"));
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

//Действия по-умолчанию
gulp.task('default', gulp.series('clean', 'svg', 'less', 'serve'));