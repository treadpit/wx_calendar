const gulp = require('gulp');
const debug = require('gulp-debug');
const fs = require('fs');
const path = require('path');

// 项目根目录配置
const projRootDir = path.join(process.cwd(), 'src');

function file_copy() {
  return gulp.src([
    'src/**/*',
  ], {
    base: projRootDir,
  }).pipe(debug({
    title: '文件复制:'
  })).pipe(gulp.dest('dist'));
}

gulp.task('default', file_copy);
gulp.task('watch', () => {
	gulp.watch('src/**/*', file_copy);
});