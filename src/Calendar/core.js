import { dateUtil } from './utils/index'
import { getConfig } from './utils/config'

/**
 * 计算当前月份前后两月应占的格子
 * @param {number} year 年份
 * @param {number} month 月份
 */
function calculateEmptyGrids(year, month, config) {
  const prevMonthGrids = calculatePrevMonthGrids(year, month, config)
  const nextMonthGrids = calculateNextMonthGrids(year, month, config)
  return {
    prevMonthGrids,
    nextMonthGrids
  }
}

/**
 * 计算上月应占的格子
 * @param {number} year 年份
 * @param {number} month 月份
 */
function calculatePrevMonthGrids(year, month, config) {
  let empytGrids = []
  const prevMonthDays = dateUtil.getDatesCountOfMonth(year, month - 1)
  let firstDayOfWeek = dateUtil.firstDayOfWeek(year, month)
  if (config.firstDayOfWeek === 'Mon') {
    if (firstDayOfWeek === 0) {
      firstDayOfWeek = 6
    } else {
      firstDayOfWeek -= 1
    }
  }
  if (firstDayOfWeek > 0) {
    const len = prevMonthDays - firstDayOfWeek
    const { onlyShowCurrentMonth } = config
    for (let i = prevMonthDays; i > len; i--) {
      if (onlyShowCurrentMonth) {
        empytGrids.push('')
      } else {
        empytGrids.push({
          date: i
        })
      }
    }
    empytGrids.reverse()
  }
  return empytGrids
}
/**
 * 计算下一月日期是否需要多展示的日期
 * 某些月份日期为5排，某些月份6排，统一为6排
 * @param {number} year
 * @param {number} month
 * @param {object} config
 */
function calculateExtraEmptyDate(year, month, config) {
  let extDate = 0
  if (+month === 2) {
    extDate += 7
    let firstDayofMonth = dateUtil.dayOfWeek(year, month, 1)
    if (config.firstDayOfWeek === 'Mon') {
      if (+firstDayofMonth === 1) extDate += 7
    } else {
      if (+firstDayofMonth === 0) extDate += 7
    }
  } else {
    let firstDayofMonth = dateUtil.dayOfWeek(year, month, 1)
    if (config.firstDayOfWeek === 'Mon') {
      if (firstDayofMonth !== 0 && firstDayofMonth < 6) {
        extDate += 7
      }
    } else {
      if (firstDayofMonth <= 5) {
        extDate += 7
      }
    }
  }
  return extDate
}
/**
 * 计算下月应占的格子
 * @param {number} year 年份
 * @param {number} month  月份
 */
function calculateNextMonthGrids(year, month, config) {
  let emptyGrids = []
  const datesCount = dateUtil.getDatesCountOfMonth(year, month)
  let lastDayWeek = dateUtil.dayOfWeek(year, month, datesCount)
  if (config.firstDayOfWeek === 'Mon') {
    if (lastDayWeek === 0) {
      lastDayWeek = 6
    } else {
      lastDayWeek -= 1
    }
  }
  let len = 7 - (lastDayWeek + 1)
  const { onlyShowCurrentMonth } = config
  if (!onlyShowCurrentMonth) {
    len = len + calculateExtraEmptyDate(year, month, config)
  }
  for (let i = 1; i <= len; i++) {
    if (onlyShowCurrentMonth) {
      emptyGrids.push('')
    } else {
      emptyGrids.push({
        date: i
      })
    }
  }
  return emptyGrids
}
/**
 * 设置日历面板数据
 * @param {number} year 年份
 * @param {number} month  月份
 * @param {number} curDate  日期
 */
function calculateCurrentMonthDates(year, month) {
  return dateUtil.calcDates(year, month)
}

export function calcJumpData({ dateInfo, config, component }) {
  dateInfo = dateInfo || dateUtil.todayFMD()
  const { year, month, date } = dateInfo
  const calendarConfig = config || getConfig(component)
  const emptyGrids = calculateEmptyGrids(year, month, calendarConfig)
  const calendar = {
    curYear: year,
    curMonth: month,
    curDate: date,
    dates: calculateCurrentMonthDates(year, month),
    ...emptyGrids
  }
  return calendar
}
