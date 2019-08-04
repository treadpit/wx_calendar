const gulp = require('gulp');
const debug = require('gulp-debug');
const path = require('path');

const rootPath = path.join(__dirname, 'src');

function fileCopy() {
  return gulp
    .src(['src/**/*'], {
      base: rootPath
    })
    .pipe(
      debug({
        title: '文件复制:'
      })
    )
    .pipe(gulp.dest('dist'));
}

gulp.task('default', fileCopy);
gulp.task('watch', () => {
  gulp.watch(['src/**/*', 'src/*'], fileCopy);
});
