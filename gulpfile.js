'use strict';

const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const express = require('express');
const pages = require('page-helper');
const $ = gulpLoadPlugins();

const app = express();

// DEV CONFIG
const WebApp = new pages.Helper({
    workingDir: 'web/src',
    defaultLocale: 'sl',
    routes: [
       {
            path: '*',
            component: 'page-home',
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
    WebApp.parse('web/src/components/*.html');
    WebApp.parse('web/src/pages/*.html');
    //WebApp.parse('web/src/pages/*.html', true);
    WebApp.parseLayout('web/src/index.html');
    WebApp.parseResource('web/src/*.json');

    app.use(express.static('web/src/public'));

    WebApp.setupExpress(app, {liveReload: true});

    app.listen(port, () => console.log('app listening on port ' + port));

    gulp.watch(['web/src/public/styles/**/*.scss'], ['styles', WebApp.reload.reload]);
});

gulp.task('build', ['styles'], (done) => {
    WebApp.parse('web/src/components/*.html');
    WebApp.parse('web/src/pages/*.html', true);
    WebApp.parseLayout('web/src/index.html');
    WebApp.parseResource('web/src/*.json');
    WebApp.build('web/dist');
    done()
});