/* *
  @Author: drfu*
  @Description: 显示法定节假日班/休情况
  @Date: 2020-10-12 14:29:45*
 * @Last Modified by: drfu
 * @Last Modified time: 2020-10-16 17:34:13
*/

import { holidays, festival } from './holidays-map'
import { dateUtil, getCalendarData, logger } from '../../utils/index'

/**
 * 当前是否在休假期内
 * @param {object} { year, month }
 * @param {object} { start, end, current }
 * @returns
 */
function inHolidays({ year, month }, { start, end, current }) {
  const getTimeStamp = dateUtil.getTimeStamp
  const startTimestamp = getTimeStamp({
    year,
    month,
    date: start
  })
  const endTimestamp = getTimeStamp({
    year,
    month,
    date: end
  })
  const currentDateTimestamp = getTimeStamp({
    year,
    month,
    date: current
  })
  if (
    currentDateTimestamp >= startTimestamp &&
    currentDateTimestamp <= endTimestamp
  ) {
    return true
  }
  return false
}
/**
 * 是否匹配到节日
 * @param {object} [dateInfo={}]
 * @param {object} [component={}]
 * @returns
 */
function hasFestivalDate(dateInfo = {}, component = {}) {
  const { month, date } = dateInfo
  let festivalDate = festival.solar[month] && festival.solar[month][date]
  if (!festivalDate) {
    const { convertSolarLunar } = component.calendar || {}
    if (typeof convertSolarLunar === 'function') {
      const { lMonth, lDay } = convertSolarLunar(dateInfo)
      festivalDate = festival.lunar[lMonth] && festival.lunar[lMonth][lDay]
    } else {
      logger.warn(
        '农历节日显示需要引入农历插件(/component/v2/plugins/solarLunar)'
      )
    }
  }
  return festivalDate
}

export default () => {
  return {
    name: 'holidays',
    beforeRender(calendarData = {}, calendarConfig = {}, component) {
      let { dates = [] } = calendarData
      if (calendarConfig.showHolidays || calendarConfig.showFestival) {
        dates = dates.map(d => {
          let item = { ...d }
          const { year, month, date } = item
          const hasHolidaysOfThisMonth =
            (holidays[year] && holidays[year][month]) || {}
          const holidayDate = hasHolidaysOfThisMonth[date]
          if (holidayDate) {
            item = {
              ...item,
              ...holidayDate
            }
          } else {
            const holidayKeys = Object.keys(
              hasHolidaysOfThisMonth
            ).filter(item => item.includes('-'))
            let target = ''
            for (let v of holidayKeys) {
              const [start, end] = v.split('-')
              if (+d.date >= +start && +d.date <= +end) {
                target = v
                break
              }
            }
            const [start, end] = target.split('-')
            const isInHolidays = inHolidays(
              {
                year,
                month
              },
              {
                start,
                end,
                current: date
              }
            )
            if (isInHolidays) {
              item = {
                ...item,
                ...hasHolidaysOfThisMonth[target]
              }
            } else if (calendarConfig.showFestival) {
              const festivalDate = hasFestivalDate(item, component)
              if (festivalDate) {
                item = {
                  ...item,
                  ...festivalDate
                }
              }
            }
          }
          return item
        })
      }
      return {
        calendarData: {
          ...calendarData,
          dates: dates
        },
        calendarConfig
      }
    },
    methods(component) {
      return {
        getHolidaysOfCurrentYear() {
          const calendar = getCalendarData('calendar', component)
          const { curYear } = calendar
          return this.methods(component).getHolidaysOfYear(curYear)
        },
        getHolidaysOfYear(year) {
          if (!year) return logger.warn('getHolidaysOfCurrentYear() 入参错误')
          if (!holidays[year]) {
            logger.warn('未匹配到当前年份节假日信息，请自行补充')
            return {
              err: 'not match'
            }
          }
          return holidays[year]
        }
      }
    }
  }
}
