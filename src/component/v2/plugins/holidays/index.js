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

function addSpecialFestival(date, component) {
  const { convertlLunar2Solar, convertSolarLunar } = component.calendar || {}
  const lunarDateInfo = convertSolarLunar(date)
  const { lYear, lMonth } = lunarDateInfo || {}
  // 春节
  const info = {
    type: 'festival',
    name: '除夕',
    label: '除夕'
  }
  if (lMonth === 12) {
    if (!festival.lunar['12']) festival.lunar['12'] = {}
    if (convertlLunar2Solar(`${lYear}-12-30`) === -1) {
      festival.lunar['12']['29'] = info
    } else {
      festival.lunar['12']['30'] = info
    }
  }
}

/**
 * 是否匹配到节日
 * @param {object} [dateInfo={}]
 * @param {object} [component={}]
 * @returns {object|boolean} 匹配到的节日数据或者false
 */
function hasFestivalDate(dateInfo = {}, component = {}) {
  const { month, date } = dateInfo
  let festivalDate = festival.solar[month] && festival.solar[month][date]
  if (!festivalDate) {
    const { convertSolarLunar } = component.calendar || {}
    const lunarDateInfo = convertSolarLunar(dateInfo)
    const { lMonth, lDay } = lunarDateInfo
    festivalDate = festival.lunar[lMonth] && festival.lunar[lMonth][lDay]
    if (!festivalDate) {
      const festivalOfMonth = festival.lunar[lMonth] || {}
      const festivalDateKey = Object.keys(festivalOfMonth).find(item =>
        item.match(new RegExp(`\\b${lDay}\\b`))
      )
      if (!festivalDateKey) {
        festivalDate = false
      } else {
        const festivalInfo = festival.lunar[lMonth][festivalDateKey]
        if (!festivalInfo) {
          festivalDate = false
        } else {
          const { condition } = festivalInfo
          if (typeof condition === 'function') {
            festivalDate = condition(lunarDateInfo)
          } else {
            festivalDate = false
          }
        }
      }
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
          const holidaysOfMonth =
            (holidays[year] && holidays[year][month]) || {}
          const holidayDate = holidaysOfMonth[date]
          if (holidayDate) {
            item = {
              ...item,
              ...holidayDate
            }
          } else {
            const holidayKeys = Object.keys(holidaysOfMonth).filter(item =>
              item.includes('-')
            )
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
                ...holidaysOfMonth[target]
              }
            } else if (calendarConfig.showFestival) {
              const { convertSolarLunar, convertlLunar2Solar } =
                component.calendar || {}
              if (
                typeof convertSolarLunar !== 'function' ||
                typeof convertlLunar2Solar !== 'function'
              ) {
                return logger.warn(
                  '农历节日显示需要引入农历插件(/component/v2/plugins/solarLunar)'
                )
              }
              addSpecialFestival(item, component)
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
