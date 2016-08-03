var gulp = require('gulp');
var concat = require('gulp-concat');
var pump = require('pump');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');

var paths = {
  jquery: 'node_modules/jquery/dist/jquery.min.js',
  jspdf: 'node_modules/jspdf/dist/jspdf.min.js'
}

gulp.task('bundle', function () {
   pump([
     gulp.src([paths.jquery, paths.jspdf, 'src/scripts/**/*.js']),
     concat('bundle.js'),
     uglify(),
     gulp.dest('dist/')
   ])
});

gulp.task('styles', function () {
  pump([
    gulp.src('src/styles/**/*.css'),
    concat('styles.css'),
    cssmin(),
    gulp.dest('dist/')
  ]);
});


gulp.task('watch', function () {
  gulp.watch('src/scripts/**/*.js', ['bundle']);
  gulp.watch('src/styles/**/*.css', ['styles']);
});

gulp.task('default', ['watch', 'bundle', 'styles']);
