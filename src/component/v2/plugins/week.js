import { renderCalendar } from '../render'
import {
  getCalendarConfig,
  getCalendarData,
  logger,
  dateUtil
} from '../utils/index'
import { calcJumpData } from '../core'

/**
 * 计算周视图下当前这一周和当月的最后一天
 */
// function calculateLastDay() {
//   const { days = [], curYear, curMonth } = this.getData('calendar')
//   const lastDayInThisWeek = days[days.length - 1].day
//   const lastDayInThisMonth = dateUtil.getDatesCountOfMonth(curYear, curMonth)
//   return { lastDayInThisWeek, lastDayInThisMonth }
// }
/**
 * 计算周视图下当前这一周第一天
 */
// function calculateFirstDay() {
//   const { days } = this.getData('calendar')
//   const firstDayInThisWeek = days[0].day
//   return { firstDayInThisWeek }
// }

/**
 * 当月第一周所有日期
 */
function firstWeekInMonth(
  target = {},
  calendarDates = [],
  calendarConfig = {}
) {
  const { firstDayOfWeek } = calendarConfig
  const firstDayOfWeekIsMon = firstDayOfWeek === 'Mon'
  const { year, month } = target
  let firstDay = dateUtil.getDayOfWeek(year, month, 1)
  if (firstDayOfWeekIsMon && firstDay === 0) {
    firstDay = 7
  }
  const [, end] = [0, 7 - firstDay]
  return calendarDates.slice(0, firstDayOfWeekIsMon ? end + 1 : end)
}

/**
 * 当月最后一周所有日期
 */
function lastWeekInMonth(target = {}, calendarDates = [], calendarConfig = {}) {
  const { firstDayOfWeek } = calendarConfig
  const firstDayOfWeekIsMon = firstDayOfWeek === 'Mon'
  const { year, month } = target
  const lastDay = dateUtil.getDatesCountOfMonth(year, month)
  const lastDayWeek = dateUtil.getDayOfWeek(year, month, lastDay)
  const [start, end] = [lastDay - lastDayWeek, lastDay]
  return calendarDates.slice(firstDayOfWeekIsMon ? start : start - 1, end)
}

/**
 * 判断目标日期是否在某些指定日历内
 */
function dateIsInDatesRange(target, dates) {
  if (!target || !dates || !dates.length) return false
  const targetDateStr = dateUtil.toTimeStr(target)
  for (let date of dates) {
    const dateStr = dateUtil.toTimeStr(date)
    if (dateStr === targetDateStr) {
      return true
    }
    return false
  }
}

function getDatesWhenTargetInFirstWeek(target, firstWeekDates) {
  const { year, month } = target
  const prevMonthInfo = dateUtil.getPrevMonthInfo({ year, month })
  let lastMonthDatsCount = dateUtil.getDatesCountOfMonth(year, month)
  let dates = firstWeekDates
  let firstWeekCount = firstWeekDates.length
  for (let i = 0; i < 7 - firstWeekCount; i++) {
    const week = dateUtil.getDayOfWeek(+year, +month, lastMonthDatsCount)
    dates.unshift({
      year: prevMonthInfo.year,
      month: prevMonthInfo.month,
      date: lastMonthDatsCount,
      day: week
    })
    lastMonthDatsCount -= 1
  }
  return dates
}

function getDatesWhenTargetInLastWeek(target, lastWeekDates) {
  const { year, month } = target
  const prevMonthInfo = dateUtil.getNextMonthInfo({ year, month })
  let dates = lastWeekDates
  let lastWeekCount = lastWeekDates.length
  for (let i = 0; i < 7 - lastWeekCount; i++) {
    const week = dateUtil.getDayOfWeek(+year, +month, i + 1)
    dates.unshift({
      year: prevMonthInfo.year,
      month: prevMonthInfo.month,
      date: i,
      day: week
    })
  }
  return dates
}

function getDates(target, calendarDates = [], calendarConfig = {}) {
  const { year, month, date } = target
  const targetDay = dateUtil.getDayOfWeek(year, month, date)
  const { firstDayOfWeek } = calendarConfig
  const firstDayOfWeekIsMon = firstDayOfWeek === 'Mon'
  if (firstDayOfWeekIsMon) {
    const startIdx = date - targetDay
    return calendarDates.splice(startIdx, 7)
  } else {
    const startIdx = date - targetDay - 1
    return calendarDates.splice(startIdx, 7)
  }
}

function getTargetWeekDates(target, calendarConfig) {
  if (!target) return
  const { year, month } = target
  const calendarDates = dateUtil.calcDates(year, month)
  const firstWeekDates = firstWeekInMonth(target, calendarDates, calendarConfig)
  const lastWeekDates = lastWeekInMonth(target, calendarDates, calendarConfig)
  if (dateIsInDatesRange(target, firstWeekDates)) {
    return getDatesWhenTargetInFirstWeek(target, firstWeekDates)
  } else if (dateIsInDatesRange(target, lastWeekDates)) {
    return getDatesWhenTargetInLastWeek(target, firstWeekDates)
  } else {
    return getDates(target, calendarDates, calendarConfig)
  }
}

export default () => {
  return {
    name: 'week',
    onSwitchCalendar(target, component) {
      const calendarData = getCalendarData('calendar', component)
      // const calendarConfig = getCalendarConfig(component)
      if (component.weekMode) {
      }
      return calendarData
    },
    methods(component) {
      return {
        /**
         * 周、月视图切换
         * @param {string} view  视图 [week, month]
         * @param {object} target  {year: 2017, month: 11, day: 1}
         */
        switchView(view, target) {
          const config = getCalendarConfig(component)
          if (config.multi) return logger.warn('多选模式不能切换周月视图')
          const existCalendarData = getCalendarData('calendar', component) || {}
          const {
            selectedDates = [],
            dates = [],
            curYear,
            curMonth
          } = existCalendarData
          // const notInCurrentMonth = curYear !== year || curMonth !== month
          const currentMonthSelected = selectedDates.filter(
            item => curYear === +item.year || curMonth === +item.month
          )
          let jumpTarget = {}
          if (target) {
            jumpTarget = target
          } else {
            if (currentMonthSelected.length) {
              jumpTarget = currentMonthSelected.pop()
            } else {
              jumpTarget = dates[0]
            }
          }
          if (view === 'week') {
            const weekDates = getTargetWeekDates(jumpTarget, config)
            weekDates.forEach((date, idx) => (date.id = idx))
            component.weekMode = true
            return renderCalendar.call(component, {
              ...existCalendarData,
              prevMonthGrids: null,
              nextMonthGrids: null,
              dates: weekDates
            })
          } else {
            const waitRenderData = calcJumpData({
              dateInfo: jumpTarget,
              config
            })
            component.weekMode = false
            return renderCalendar.call(component, {
              ...existCalendarData,
              ...waitRenderData,
              weekMode: false
            })
          }
        }
      }
    }
  }
}
