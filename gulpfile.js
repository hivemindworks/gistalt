var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
    return gulp.src('./sass/style.scss')
            .pipe(sass({ includePaths : ['_/sass/'] }))
            .pipe(gulp.dest('public/css'));
});

// The default task (called when you run `gulp`)
gulp.task('default', function() {
  gulp.run('sass');

  // Watch files and run tasks if they change

  gulp.watch(['./_/sass/style.scss'], function() {
    gulp.run('sass');
  })
});
