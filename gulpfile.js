var gulp = require("gulp");

// Requires the gulp-sass plugin
var sass = require("gulp-sass");

gulp.task("sass", function() {
  return gulp
    .src("assets/sass/main.scss")
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest("assets/css"));
});

gulp.task("watch", function() {
  gulp.watch("assets/sass/**/*.scss", gulp.series("sass"));
});
