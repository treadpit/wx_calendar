import convertSolarLunar from './convertSolarLunar'

let systemInfo
export function getSystemInfo() {
  if (systemInfo) return systemInfo
  systemInfo = wx.getSystemInfoSync()
  return systemInfo
}

export function isComponent(target) {
  return (
    target &&
    target.__wxExparserNodeId__ !== void 0 &&
    typeof target.setData === 'function'
  )
}

export class Logger {
  info(msg) {
    console.log(
      '%cInfo: %c' + msg,
      'color:#FF0080;font-weight:bold',
      'color: #FF509B'
    )
  }
  warn(msg) {
    console.log(
      '%cWarn: %c' + msg,
      'color:#FF6600;font-weight:bold',
      'color: #FF9933'
    )
  }
  tips(msg) {
    console.log(
      '%cTips: %c' + msg,
      'color:#00B200;font-weight:bold',
      'color: #00CC33'
    )
  }
}

export class Slide {
  /**
   * 上滑
   * @param {object} e 事件对象
   * @returns {boolean} 布尔值
   */
  isUp(gesture = {}, touche = {}) {
    const { startX, startY } = gesture
    const deltaX = touche.clientX - startX
    const deltaY = touche.clientY - startY
    if (deltaY < -60 && deltaX < 20 && deltaX > -20) {
      this.slideLock = false
      return true
    } else {
      return false
    }
  }
  /**
   * 下滑
   * @param {object} e 事件对象
   * @returns {boolean} 布尔值
   */
  isDown(gesture = {}, touche = {}) {
    const { startX, startY } = gesture
    const deltaX = touche.clientX - startX
    const deltaY = touche.clientY - startY
    if (deltaY > 60 && deltaX < 20 && deltaX > -20) {
      return true
    } else {
      return false
    }
  }
  /**
   * 左滑
   * @param {object} e 事件对象
   * @returns {boolean} 布尔值
   */
  isLeft(gesture = {}, touche = {}) {
    const { startX, startY } = gesture
    const deltaX = touche.clientX - startX
    const deltaY = touche.clientY - startY
    if (deltaX < -60 && deltaY < 20 && deltaY > -20) {
      return true
    } else {
      return false
    }
  }
  /**
   * 右滑
   * @param {object} e 事件对象
   * @returns {boolean} 布尔值
   */
  isRight(gesture = {}, touche = {}) {
    const { startX, startY } = gesture
    const deltaX = touche.clientX - startX
    const deltaY = touche.clientY - startY

    if (deltaX > 60 && deltaY < 20 && deltaY > -20) {
      return true
    } else {
      return false
    }
  }
}

export class GetDate {
  /**
   * new Date 区分平台
   * @param {number} year
   * @param {number} month
   * @param {number} day
   */
  newDate(year, month, day) {
    let cur = `${+year}-${+month}-${+day}`
    if (isIos()) {
      cur = `${+year}/${+month}/${+day}`
    }
    return new Date(cur)
  }
  /**
   * 计算指定月份共多少天
   * @param {number} year 年份
   * @param {number} month  月份
   */
  thisMonthDays(year, month) {
    return new Date(Date.UTC(year, month, 0)).getUTCDate()
  }
  /**
   * 计算指定月份第一天星期几
   * @param {number} year 年份
   * @param {number} month  月份
   */
  firstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getUTCDay()
  }
  /**
   * 计算指定日期星期几
   * @param {number} year 年份
   * @param {number} month  月份
   * @param {number} date 日期
   */
  dayOfWeek(year, month, date) {
    return new Date(Date.UTC(year, month - 1, date)).getUTCDay()
  }
  todayDate() {
    const _date = new Date()
    const year = _date.getFullYear()
    const month = _date.getMonth() + 1
    const date = _date.getDate()
    return {
      year,
      month,
      date
    }
  }
  todayTimestamp() {
    const { year, month, date } = this.todayDate()
    const timestamp = this.newDate(year, month, date).getTime()
    return timestamp
  }
  toTimeStr(dateInfo) {
    if (dateInfo.day) {
      dateInfo.date = dateInfo.day
    }
    return `${+dateInfo.year}-${+dateInfo.month}-${+dateInfo.date}`
  }
  sortDates(dates, sortType) {
    return dates.sort(function(a, b) {
      const at = getDateTimeStamp(a)
      const bt = getDateTimeStamp(b)
      if (at < bt && sortType !== 'desc') {
        return -1
      } else {
        return 1
      }
    })
  }
  prevMonth(dataInfo) {
    const prevMonthInfo =
      +dataInfo.month > 1
        ? {
            year: dataInfo.year,
            month: dataInfo.month - 1
          }
        : {
            year: dataInfo.year - 1,
            month: 12
          }
    return prevMonthInfo
  }
  nextMonth(dataInfo) {
    const nextMonthInfo =
      +dataInfo.month < 12
        ? {
            year: dataInfo.year,
            month: dataInfo.month + 1
          }
        : {
            year: dataInfo.year + 1,
            month: 1
          }
    return nextMonthInfo
  }
  convertLunar(dates = []) {
    const datesWithLunar = dates.map(date => {
      if (date) {
        date.lunar = convertSolarLunar.solar2lunar(
          +date.year,
          +date.month,
          +date.day
        )
      }
      return date
    })
    return datesWithLunar
  }
}

export function isIos() {
  const sys = getSystemInfo()
  return /iphone|ios/i.test(sys.platform)
}

/**
 * 浅比较对象是否相等
 * @param {Object} origin 对比源
 * @param {Object} target 对比目标
 * @return {Boolean} true 为相等，false 为不等
 */
export function shallowEqual(origin, target) {
  if (origin === target) {
    return true
  } else if (
    typeof origin === 'object' &&
    origin != null &&
    typeof target === 'object' &&
    target != null
  ) {
    if (Object.keys(origin).length !== Object.keys(target).length) return false
    for (var prop in origin) {
      if (target.hasOwnProperty(prop)) {
        if (!shallowEqual(origin[prop], target[prop])) return false
      } else return false
    }
    return true
  } else return false
}

/**
 * 获取当前页面实例
 */
export function getCurrentPage() {
  const pages = getCurrentPages()
  const last = pages.length - 1
  return pages[last]
}

export function getComponent(componentId) {
  const logger = new Logger()
  let page = getCurrentPage() || {}
  if (page.selectComponent && typeof page.selectComponent === 'function') {
    if (componentId) {
      return page.selectComponent(componentId)
    } else {
      logger.warn('请传入组件ID')
    }
  } else {
    logger.warn('该基础库暂不支持多个小程序日历组件')
  }
}

/**
 * 日期数组根据日期去重
 * @param {array} array 数组
 */
export function uniqueArrayByDate(array = []) {
  let uniqueObject = {}
  let uniqueArray = []
  array.forEach(item => {
    uniqueObject[`${item.year}-${item.month}-${item.day}`] = item
  })
  for (let i in uniqueObject) {
    uniqueArray.push(uniqueObject[i])
  }
  return uniqueArray
}

/**
 * 指定可选日期及可选日期数组去重
 * @param {array} enableDays 特定可选日期数组
 * @param {array} enableArea 可选日期区域数组
 */
export function delRepeatedEnableDay(enableDays = [], enableArea = []) {
  let _startTimestamp
  let _endTimestamp
  if (enableArea.length === 2) {
    const { startTimestamp, endTimestamp } = convertEnableAreaToTimestamp(
      enableArea
    )
    _startTimestamp = startTimestamp
    _endTimestamp = endTimestamp
  }
  const enableDaysTimestamp = converEnableDaysToTimestamp(enableDays)
  const tmp = enableDaysTimestamp.filter(
    item => item < _startTimestamp || item > _endTimestamp
  )
  return tmp
}

/**
 *  指定日期区域转时间戳
 * @param {array} timearea 时间区域
 */
export function convertEnableAreaToTimestamp(timearea = []) {
  const getDate = new GetDate()
  const start = timearea[0].split('-')
  const end = timearea[1].split('-')
  const logger = new Logger()
  if (start.length !== 3 || end.length !== 3) {
    logger.warn('enableArea() 参数格式为: ["2018-2-1", "2018-3-1"]')
    return {}
  }
  const startTimestamp = getDate.newDate(start[0], start[1], start[2]).getTime()
  const endTimestamp = getDate.newDate(end[0], end[1], end[2]).getTime()
  return {
    start,
    end,
    startTimestamp,
    endTimestamp
  }
}

/**
 * 计算指定日期时间戳
 * @param {object} dateInfo
 */
export function getDateTimeStamp(dateInfo) {
  if (Object.prototype.toString.call(dateInfo) !== '[object Object]') return
  const getDate = new GetDate()
  return getDate.newDate(dateInfo.year, dateInfo.month, dateInfo.day).getTime()
}

/**
 *  指定特定日期数组转时间戳
 * @param {array} enableDays 指定时间数组
 */
export function converEnableDaysToTimestamp(enableDays = []) {
  const logger = new Logger()
  const getDate = new GetDate()
  const enableDaysTimestamp = []
  enableDays.forEach(item => {
    if (typeof item !== 'string')
      return logger.warn('enableDays()入参日期格式错误')
    const tmp = item.split('-')
    if (tmp.length !== 3) return logger.warn('enableDays()入参日期格式错误')
    const timestamp = getDate.newDate(tmp[0], tmp[1], tmp[2]).getTime()
    enableDaysTimestamp.push(timestamp)
  })
  return enableDaysTimestamp
}

// 同一页面多个日历组件按先后顺序渲染
export const initialTasks = {
  flag: 'finished', // process 处理中，finished 处理完成
  tasks: []
}
