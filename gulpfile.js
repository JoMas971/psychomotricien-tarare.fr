/* global process */
'use strict';

var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var usemin = require('gulp-usemin');
var minifyCss = require('gulp-cssnano');
var minifyHtml = require('gulp-htmlmin');
var gulpMerge = require('gulp-merge');
var replace = require('gulp-replace');
var rev = require('gulp-rev');
var inject = require('gulp-inject');

var distDir = './build_dist';

var jsFiles = [
  './assets/lib/jquery/dist/jquery.js',
  './assets/lib/bootstrap/dist/js/bootstrap.js',
  './assets/lib/wow/dist/wow.js',
  './assets/lib/jquery.mb.ytplayer/dist/jquery.mb.YTPlayer.js',
  './assets/lib/isotope/dist/isotope.pkgd.js',
  './assets/lib/imagesloaded/imagesloaded.pkgd.js',
  './assets/lib/flexslider/jquery.flexslider.js',
  './assets/lib/owl.carousel/dist/owl.carousel.js',
  './assets/lib/magnific-popup/dist/jquery.magnific-popup.js',
  './assets/lib/simple-text-rotator/jquery.simple-text-rotator.js',
  './assets/js/plugins.js',
  './assets/js/main.js'
];

var cssFiles = [
  './assets/lib/components-font-awesome/css/font-awesome.css',
  './assets/lib/bootstrap/dist/css/bootstrap.css',
  './assets/lib/animate.css/animate.css',
  './assets/lib/et-line-font/et-line-font.css',
  './assets/lib/flexslider/flexslider.css',
  './assets/lib/owl.carousel/dist/assets/owl.carousel.css',
  './assets/lib/owl.carousel/dist/assets/owl.theme.default.css',
  './assets/lib/magnific-popup/dist/magnific-popup.css',
  './assets/lib/simple-text-rotator/simpletextrotator.css',
  './assets/css/style.css'
];

var imgFiles = [
  './assets/images/**/bd_1_800.png',
  './assets/images/**/bd_2_800.png',
  './assets/images/**/P1150335.JPG',
  './assets/images/**/P1150342.JPG',
  './assets/images/**/P1150350.JPG',
  './assets/images/**/P1150335.JPG',
  './assets/images/promo.png'
];

gulp.task('clean:dist', function(cb) {
  del.sync(distDir + '/**');
  cb();
});

gulp.task('copy:images', function() {
  return gulp.src(imgFiles, {cwd: './src/'})
    .pipe(gulp.dest(distDir + '/images'));
});

gulp.task('copy:fonts', function() {
  return gulp.src([
    './assets/lib/et-line-font/fonts/**',
    './assets/lib/bootstrap/dist/fonts/**',
    './assets/lib/components-font-awesome/fonts/**'
  ], {cwd: './src/'})
    .pipe(gulp.dest(distDir + '/fonts'));
});

gulp.task('copy:dist:robots', function() {
  return gulp.src([
    './src/robots.txt',
    './src/sitemap.xml'
  ])
    .pipe(gulp.dest(distDir));
});

gulp.task('copy:dist', ['clean:dist', 'copy:images', 'copy:fonts', 'copy:dist:robots'], function() {
  return gulp.src('./src/assets/**/*')
    .pipe(gulp.dest(distDir + '/assets'));
});

gulp.task('inject', ['copy:dist'], function() {
  var _jsFiles, _cssFiles, sourceFiles, tsk;

  _jsFiles = gulp.src(jsFiles, {cwd: './src/'});
  _cssFiles = gulp.src(cssFiles, {cwd: './src/'});
  sourceFiles = gulpMerge(_cssFiles, _jsFiles);

  tsk = gulp.src('./src/index.html')
    .pipe(inject(sourceFiles, {
      relative: true
    }))
    .pipe(replace(/(assets\/images\/)/gmi, 'images/'))
    .pipe(gulp.dest(distDir));

  return tsk;
});

gulp.task('usemin', ['inject'], function() {
  var cssArray = [
    concat('css/styles.min.css'),
    minifyCss(),
    rev()
  ];
  var jsArray = [
    concat('js/scripts.min.js'),
    uglify(),
    rev()
  ];

  return gulp.src(distDir + '/index.html')
    .pipe(usemin({
      html: [minifyHtml({removeComments: true, collapseWhitespace: true})],
      css: cssArray,
      js: jsArray
    })).pipe(gulp.dest(distDir));
});

gulp.task('dist', ['usemin'], function(cb) {
  del.sync(distDir + '/assets/**');
  cb();
});
