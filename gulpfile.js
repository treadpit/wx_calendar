const gulp = require('gulp');
const debug = require('gulp-debug');
const path = require('path');

// 项目根目录配置
const projRootDir = path.join(process.cwd(), 'src');

function fileCopy() {
  return gulp.src([
    'src/**/*',
  ], {
    base: projRootDir,
  }).pipe(debug({
    title: '文件复制:'
  })).pipe(gulp.dest('dist'));
}

gulp.task('default', fileCopy);
gulp.task('watch', () => {
  gulp.watch('src/**/*', fileCopy);
});
