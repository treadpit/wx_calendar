import Logger from './logger'
import WxData from './wxData'

let systemInfo
export function getSystemInfo() {
  if (systemInfo) return systemInfo
  systemInfo = wx.getSystemInfoSync()
  return systemInfo
}

export function isIos() {
  const sys = getSystemInfo()
  return /iphone|ios/i.test(sys.platform)
}

class Gesture {
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

class DateUtil {
  newDate(year, month, date) {
    let cur = `${+year}-${+month}-${+date}`
    if (isIos()) {
      cur = `${+year}/${+month}/${+date}`
    }
    return new Date(cur)
  }
  /**
   * 计算指定日期时间戳
   * @param {object} date
   */
  getTimeStamp(dateInfo) {
    if (typeof dateInfo === 'string') {
      dateInfo = this.transformDateRow2Dict(dateInfo)
    }
    if (Object.prototype.toString.call(dateInfo) !== '[object Object]') return
    const dateUtil = new DateUtil()
    return dateUtil
      .newDate(dateInfo.year, dateInfo.month, dateInfo.date)
      .getTime()
  }
  /**
   * 计算指定月份共多少天
   * @param {number} year 年份
   * @param {number} month  月份
   */
  getDatesCountOfMonth(year, month) {
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
  getDayOfWeek(year, month, date) {
    return new Date(Date.UTC(year, month - 1, date)).getUTCDay()
  }
  todayFMD() {
    const _date = new Date()
    const year = _date.getFullYear()
    const month = _date.getMonth() + 1
    const date = _date.getDate()
    return {
      year: +year,
      month: +month,
      date: +date
    }
  }
  todayTimestamp() {
    const { year, month, date } = this.todayFMD()
    const timestamp = this.newDate(year, month, date).getTime()
    return timestamp
  }
  toTimeStr(dateInfo = {}) {
    return `${+dateInfo.year}-${+dateInfo.month}-${+dateInfo.date}`
  }
  transformDateRow2Dict(dateStr) {
    if (typeof dateStr === 'string' && dateStr.includes('-')) {
      const [year, month, date] = dateStr.split('-')
      return this.tranformStr2NumOfDate({
        year,
        month,
        date
      })
    }
    return {}
  }
  tranformStr2NumOfDate(date = {}) {
    const target = { ...date }
    // 可能传入字符串
    target.year = +target.year
    target.month = +target.month
    target.date = +target.date
    return target
  }
  sortDatesByTime(dates = [], sortType) {
    return dates.sort((a, b) => {
      const at = this.getTimeStamp(a)
      const bt = this.getTimeStamp(b)
      if (at < bt && sortType !== 'desc') {
        return -1
      } else {
        return 1
      }
    })
  }
  getPrevMonthInfo(date = {}) {
    const prevMonthInfo =
      Number(date.month) > 1
        ? {
            year: +date.year,
            month: Number(date.month) - 1
          }
        : {
            year: Number(date.year) - 1,
            month: 12
          }
    return prevMonthInfo
  }
  getNextMonthInfo(date = {}) {
    const nextMonthInfo =
      Number(date.month) < 12
        ? {
            year: +date.year,
            month: Number(date.month) + 1
          }
        : {
            year: Number(date.year) + 1,
            month: 1
          }
    return nextMonthInfo
  }
  getPrevYearInfo(date = {}) {
    return {
      year: Number(date.year) - 1,
      month: +date.month
    }
  }
  getNextYearInfo(date = {}) {
    return {
      year: Number(date.year) + 1,
      month: +date.month
    }
  }
  findDateIndexInArray(target, dates) {
    return dates.findIndex(
      item => dateUtil.toTimeStr(item) === dateUtil.toTimeStr(target)
    )
  }
  calcDates(year, month) {
    const datesCount = this.getDatesCountOfMonth(year, month)
    const dates = []
    const today = dateUtil.todayFMD()
    for (let i = 1; i <= datesCount; i++) {
      const week = dateUtil.getDayOfWeek(+year, +month, i)
      const date = {
        year: +year,
        id: i - 1,
        month: +month,
        date: i,
        week,
        isToday:
          +today.year === +year && +today.month === +month && i === +today.date
      }
      dates.push(date)
    }
    return dates
  }
  /**
   * 日期数组根据日期去重
   * @param {array} array 数组
   */
  uniqueArrayByDate(array = []) {
    let uniqueObject = {}
    let uniqueArray = []
    array.forEach(item => {
      uniqueObject[dateUtil.toTimeStr(item)] = item
    })
    for (let i in uniqueObject) {
      uniqueArray.push(uniqueObject[i])
    }
    return uniqueArray
  }
  /**
   * 筛选指定年月日期
   * @param {object} target 指定年月
   * @param {array} dates 待筛选日期
   */
  filterDatesByYM(target, dates) {
    if (target) {
      const { year, month } = target
      const _dates = dates.filter(
        item => +item.year === +year && +item.month === +month
      )
      return _dates
    }
    return dates
  }
  getWeekHeader(firstDayOfWeek) {
    let weeksCh = ['日', '一', '二', '三', '四', '五', '六']
    if (firstDayOfWeek === 'Mon') {
      weeksCh = ['一', '二', '三', '四', '五', '六', '日']
    }
    return weeksCh
  }
}

/**
 * 获取当前页面实例
 */
export function getCurrentPage() {
  const pages = getCurrentPages() || []
  const last = pages.length - 1
  return pages[last] || {}
}

export function getComponentById(componentId) {
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

export const logger = new Logger()
export const calendarGesture = new Gesture()
export const dateUtil = new DateUtil()
export const getCalendarData = (key, component) =>
  new WxData(component).getData(key)
export const setCalendarData = (data, component) =>
  new WxData(component).setData(data)
export const getCalendarConfig = component =>
  getCalendarData('config', component)
export const setCalendarConfig = (config, component) =>
  setCalendarData(
    {
      config
    },
    component
  )
