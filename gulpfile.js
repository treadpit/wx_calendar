const del = require('del')
const gulp = require('gulp')
const path = require('path')
const debug = require('gulp-debug')

const rootPath = path.join(__dirname, 'src')

function copyExample(dir) {
  return gulp
    .src(['src/**/*'], {
      base: rootPath
    })
    .pipe(
      debug({
        title: '复制:'
      })
    )
    .pipe(gulp.dest(dir))
}

function CopyCompJs() {
  return gulp
    .src('calendar-dist/*')
    .pipe(
      debug({
        title: '复制:'
      })
    )
    .pipe(gulp.dest('calendar_v1'))
}

function copyCalendar() {
  return gulp
    .src([
      'src/component/calendar/**/*',
      '!src/component/calendar/*.js',
      '!src/component/calendar/{func,func/*}'
    ])
    .pipe(
      debug({
        title: '复制:'
      })
    )
    .pipe(gulp.dest('calendar_v1'))
}

exports.copyCalendar = gulp.series(copyCalendar, CopyCompJs)

gulp.task('default', gulp.series(copyCalendar, CopyCompJs))
gulp.task('example', () => copyExample('example'))
gulp.task('clean', function() {
  return del(['calendar-dist'])
})
gulp.task('watch', () => {
  gulp.watch(['src/**/*', 'src/*'], () => copyExample('dist'))
})
