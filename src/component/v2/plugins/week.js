/**
 * @Author: drfu*
 * @Description: 周视图
 * @Date: 2020-10-08 21:22:09*
 * @Last Modified by: drfu
 * @Last Modified time: 2020-10-12 14:39:45
 * */

import { renderCalendar } from '../render'
import {
  getCalendarConfig,
  getCalendarData,
  logger,
  dateUtil
} from '../utils/index'
import { calcJumpData } from '../core'

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
  let rst = false
  for (let date of dates) {
    const dateStr = dateUtil.toTimeStr(date)
    if (dateStr === targetDateStr) {
      rst = true
      return rst
    }
    rst = false
  }
  return rst
}

function getDatesWhenTargetInFirstWeek(target, firstWeekDates) {
  const { year, month } = target
  const prevMonthInfo = dateUtil.getPrevMonthInfo({ year, month })
  let lastMonthDatesCount = dateUtil.getDatesCountOfMonth(
    prevMonthInfo.year,
    prevMonthInfo.month
  )
  let dates = firstWeekDates
  let firstWeekCount = firstWeekDates.length
  for (let i = 0; i < 7 - firstWeekCount; i++) {
    const week = dateUtil.getDayOfWeek(+year, +month, lastMonthDatesCount)
    dates.unshift({
      year: prevMonthInfo.year,
      month: prevMonthInfo.month,
      date: lastMonthDatesCount,
      week
    })
    lastMonthDatesCount -= 1
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
    dates.push({
      year: prevMonthInfo.year,
      month: prevMonthInfo.month,
      date: i + 1,
      week
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
    return getDatesWhenTargetInLastWeek(target, lastWeekDates)
  } else {
    return getDates(target, calendarDates, calendarConfig)
  }
}

/**
 * 计算周视图下当前这一周最后一天
 */
function calculateLastDateOfCurrentWeek(calendarData = {}) {
  const { dates = [] } = calendarData
  return dates[dates.length - 1]
}
/**
 * 计算周视图下当前这一周第一天
 */
function calculateFirstDateOfCurrentWeek(calendarData = {}) {
  const { dates } = calendarData
  return dates[0]
}

/**
 * 计算下一周的日期
 */
function calculateNextWeekDates(calendarData = {}) {
  let { curYear, curMonth } = calendarData
  let calendarDates = []
  let lastDateInThisWeek = calculateLastDateOfCurrentWeek(calendarData)
  const { year: LYear, month: LMonth } = lastDateInThisWeek
  if (curYear !== LYear || curMonth !== LMonth) {
    calendarDates = dateUtil.calcDates(LYear, LMonth)
    curYear = LYear
    curMonth = LMonth
  } else {
    calendarDates = dateUtil.calcDates(curYear, curMonth)
  }
  const lastDateInThisMonth = dateUtil.getDatesCountOfMonth(curYear, curMonth)
  const count = lastDateInThisMonth - lastDateInThisWeek.date
  const lastDateIdx = calendarDates.findIndex(
    date => dateUtil.toTimeStr(date) === dateUtil.toTimeStr(lastDateInThisWeek)
  )
  const startIdx = lastDateIdx + 1
  if (count >= 7) {
    return {
      dates: calendarDates.splice(startIdx, 7),
      year: curYear,
      month: curMonth
    }
  } else {
    const nextMonth = dateUtil.getNextMonthInfo({
      year: curYear,
      month: curMonth
    })
    const { year, month } = nextMonth || {}
    const calendarDatesOfNextMonth = dateUtil.calcDates(year, month)
    const remainDatesOfThisMonth = calendarDates.splice(startIdx)
    const patchDatesOfNextMonth = calendarDatesOfNextMonth.splice(
      0,
      7 - remainDatesOfThisMonth.length
    )
    return {
      dates: [...remainDatesOfThisMonth, ...patchDatesOfNextMonth],
      ...nextMonth
    }
  }
}

/**
 * 计算上一周的日期
 */
function calculatePrevWeekDates(calendarData = {}) {
  let { curYear, curMonth } = calendarData
  let firstDateInThisWeek = calculateFirstDateOfCurrentWeek(calendarData)
  let calendarDates = []
  const { year: FYear, month: FMonth } = firstDateInThisWeek
  if (curYear !== FYear || curMonth !== FMonth) {
    calendarDates = dateUtil.calcDates(FYear, FMonth)
    curYear = FYear
    curMonth = FMonth
  } else {
    calendarDates = dateUtil.calcDates(curYear, curMonth)
  }
  const firstDateIdx = calendarDates.findIndex(
    date => dateUtil.toTimeStr(date) === dateUtil.toTimeStr(firstDateInThisWeek)
  )
  if (firstDateIdx - 7 >= 0) {
    const startIdx = firstDateIdx - 7
    return {
      dates: calendarDates.splice(startIdx, 7),
      year: curYear,
      month: curMonth
    }
  } else {
    const prevMonth = dateUtil.getPrevMonthInfo({
      year: curYear,
      month: curMonth
    })
    const { year, month } = prevMonth || {}
    const calendarDatesOfPrevMonth = dateUtil.calcDates(year, month)
    const remainDatesOfThisMonth = calendarDates.splice(
      0,
      firstDateInThisWeek.date - 1
    )
    const patchDatesOfPrevMonth = calendarDatesOfPrevMonth.splice(
      -(7 - remainDatesOfThisMonth.length)
    )
    return {
      dates: [...patchDatesOfPrevMonth, ...remainDatesOfThisMonth],
      ...prevMonth
    }
  }
}

export default () => {
  return {
    name: 'week',
    beforeRender(calendarData = {}, calendarConfig = {}, component) {
      if (calendarConfig.weekMode && !calendarData.initializedWeekMode) {
        const { defaultDate } = calendarConfig
        const target =
          (defaultDate && dateUtil.transformDateRow2Dict(defaultDate)) ||
          dateUtil.todayFMD()
        const waitRenderData = this.methods(
          component
        ).__calcDatesWhenSwitchView('week', target)
        const { data, config } = waitRenderData || {}
        const setSelectDates = this.methods(
          component
        ).__selectTargetDateWhenJump(target, data.dates, config)
        return {
          calendarData: {
            ...data,
            ...setSelectDates,
            weeksCh: dateUtil.getWeekHeader(calendarConfig.firstDayOfWeek),
            initializedWeekMode: true
          },
          calendarConfig
        }
      }
      return {
        calendarData,
        calendarConfig
      }
    },
    onSwitchCalendar(target = {}, calendarData = {}, component) {
      const { direction } = target
      const { curYear, curMonth } = calendarData
      const calendarConfig = getCalendarConfig(component)
      let waitRenderData = {}
      if (calendarConfig.weekMode) {
        if (direction === 'left') {
          waitRenderData = calculateNextWeekDates(calendarData)
        } else {
          waitRenderData = calculatePrevWeekDates(calendarData)
        }
        const { dates, year, month } = waitRenderData
        return {
          ...calendarData,
          dates,
          curYear: year || curYear,
          curMonth: month || curMonth
        }
      }
      return calendarData
    },
    methods(component) {
      return {
        __selectTargetDateWhenJump: (target = {}, dates = [], config = {}) => {
          let selectedDate = target
          const weekDates = dates.map((date, idx) => {
            const tmp = { ...date }
            tmp.id = idx
            const isTarget =
              dateUtil.toTimeStr(target) === dateUtil.toTimeStr(tmp)
            if (isTarget && !target.choosed && config.autoChoosedWhenJump) {
              tmp.choosed = true
              selectedDate = tmp
            }
            return tmp
          })
          return {
            dates: weekDates,
            selectedDates: [selectedDate]
          }
        },
        __calcDatesForWeekMode(target, config = {}, calendarData = {}) {
          const { year, month } = target || {}
          const weekDates = getTargetWeekDates(target, config)
          weekDates.forEach((date, idx) => (date.id = idx))
          return {
            data: {
              ...calendarData,
              prevMonthGrids: null,
              nextMonthGrids: null,
              dates: weekDates,
              curYear: year,
              curMonth: month
            },
            config: {
              ...config,
              weekMode: true
            }
          }
        },
        __calcDatesForMonthMode(target, config = {}, calendarData = {}) {
          const { year, month } = target || {}
          const waitRenderData = calcJumpData({
            dateInfo: target,
            config
          })
          return {
            data: {
              ...calendarData,
              ...waitRenderData,
              curYear: year,
              curMonth: month
            },
            config: {
              ...config,
              weekMode: false
            }
          }
        },
        /**
         * 周、月视图切换
         * @param {string} view  视图 [week, month]
         * @param {object} target
         */
        __calcDatesWhenSwitchView: (view, target) => {
          const calendarConfig = getCalendarConfig(component)
          if (calendarConfig.multi)
            return logger.warn('多选模式不能切换周月视图')
          const existCalendarData = getCalendarData('calendar', component) || {}
          const {
            selectedDates = [],
            dates = [],
            curYear,
            curMonth
          } = existCalendarData
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
            return this.methods(component).__calcDatesForWeekMode(
              jumpTarget,
              calendarConfig,
              existCalendarData
            )
          } else {
            return this.methods(component).__calcDatesForMonthMode(
              jumpTarget,
              calendarConfig,
              existCalendarData
            )
          }
        },
        weekModeJump: dateInfo => {
          const target = dateInfo || dateUtil.todayFMD()
          const existCalendarData = getCalendarData('calendar', component) || {}
          const waitRenderData = this.methods(
            component
          ).__calcDatesWhenSwitchView('week', target)
          const { data, config } = waitRenderData || {}
          const setSelectDates = this.methods(
            component
          ).__selectTargetDateWhenJump(target, data.dates, config)
          return renderCalendar.call(
            component,
            {
              ...existCalendarData,
              ...data,
              ...setSelectDates
            },
            config
          )
        },
        switchView: (view, target) => {
          const waitRenderData = this.methods(
            component
          ).__calcDatesWhenSwitchView(view, target)
          const { data, config } = waitRenderData || {}
          if (!data) return logger.warn('当前状态不能切换为周视图')
          return renderCalendar.call(component, data, config)
        }
      }
    }
  }
}
