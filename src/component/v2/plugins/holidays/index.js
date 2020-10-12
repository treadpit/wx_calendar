/* *
  @Author: drfu*
  @Description: 显示法定节假日班/休情况
  @Date: 2020-10-12 14:29:45*
 * @Last Modified by: drfu
 * @Last Modified time: 2020-10-12 14:30:51
*/

import holidays from './holidays-map'
import { dateUtil, getCalendarData, logger } from '../../utils/index'

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

export default () => {
  return {
    name: 'holidays',
    beforeRender(calendarData = {}, calendarConfig = {}) {
      let { dates = [] } = calendarData
      if (calendarConfig.showHolidays) {
        dates = dates.map(d => {
          let item = { ...d }
          const { year, month, date } = item
          const hasHolidaysOfThisMonth = holidays[year] && holidays[year][month]
          if (hasHolidaysOfThisMonth) {
            const holidayDate = hasHolidaysOfThisMonth[date]
            if (holidayDate) {
              item.label = holidayDate.text
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
                item.label = hasHolidaysOfThisMonth[target].text
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
