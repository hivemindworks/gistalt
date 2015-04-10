var gulp = require('gulp'),
    path = require('path'),
    fs = require('fs'),
    rev = require('gulp-rev'),
    concat = require('gulp-concat')
    sass = require('gulp-sass'),
    nodemon = require('gulp-nodemon')

gulp.task('sass', function () {
    return gulp.src('./sass/style.scss')
            .pipe(sass({ includePaths : ['_/sass/'] }))
            .pipe(gulp.dest('public/dist'));
});

gulp.task('rev', function(){
  return gulp.src(['./public/dist/app.js', './public/dist/style.css'], {base:path.join(process.cwd(),'/' )})
    .pipe(rev())
    .pipe(gulp.dest(path.join(process.cwd(), '')))
    .pipe(rev.manifest())
    .pipe(gulp.dest(path.join(process.cwd(), '/public/dist')))
})

gulp.task('concat', function(){
  return gulp.src([
    './public/js/codemirror.js',
    './public/js/overlay.js',
    './public/js/markdown.js',
    './public/js/gfm.js',
    './public/js/active-storage.js',
    './public/js/app.js'
  ]).pipe(concat('app.js'))
    .pipe(gulp.dest('./public/dist/'));
})

gulp.task('build', function(){
  gulp.run(['sass','concat','rev'])
})

// The default task (called when you run `gulp`)
gulp.task('default', function() {
  nodemon({script: './bin/www'})
  gulp.run(['sass','concat','rev']);

  // Watch files and run tasks if they change

  gulp.watch('sass/*.scss', ['sass'], function() {
    gulp.run(['sass','rev'])
  })
  gulp.watch('public/js/*.js', ['concat'], function() {
    gulp.run(['concat','rev'])
  })
});

