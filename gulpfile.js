var gulp = require('gulp');
var concat = require('gulp-concat');
var pump = require('pump');
var uglify = require('gulp-uglify');

var paths = {
  jquery: 'node_modules/jquery/dist/jquery.min.js',
  jspdf: 'node_modules/jspdf/dist/jspdf.min.js'
}

gulp.task('bundle', function () {
   pump([
     gulp.src([paths.jquery, paths.jspdf, 'src/content.js']),
     concat('bundle.js'),
     uglify(),
     gulp.dest('dist/')
   ])
});


gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['bundle']);
});

gulp.task('default', ['watch', 'bundle']);
