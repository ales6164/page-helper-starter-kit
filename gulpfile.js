'use strict';

const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const express = require('express');
const pages = require('page-helper');
const $ = gulpLoadPlugins();

const expressApp = express();

// DEV CONFIG
const App = new pages.Helper({
    workingDir: 'web/src',
    defaultLocale: 'sl',
    routes: [
        {
            path: '*',
            component: 'page-home',
            page: {
                title: 'Home',
            }
        },
    ]
});

gulp.task('styles', () => {
    const AUTOPREFIXER_BROWSERS = [
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ];
    return gulp.src([
        'web/src/public/styles/style.scss',
    ])
    /*.pipe($.newer('web/src/public/styles'))*/
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            precision: 10
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(gulp.dest('web/src/public/styles'))
        // Concatenate and minify styles
        .pipe($.if('*.css', $.cssnano()))
        .pipe($.size({title: 'styles'}))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('web/src/public/styles'))
});

// Watch files for changes & reload
gulp.task('serve', ['styles'], () => {
    const port = 3000;
    App.parse('web/src/components/*.html');
    App.parse('web/src/pages/*.html');
    //App.parse('web/src/pages/*.html', true);
    App.parseLayout('web/src/index.html');
    App.parseResource('web/src/*.json');

    expressApp.use(express.static('web/src/public'));

    App.setupExpress(expressApp, {liveReload: true});

    expressApp.listen(port, () => console.log('app listening on port ' + port));

    gulp.watch(['web/src/public/styles/**/*.scss'], ['styles', App.reload.reload]);
});