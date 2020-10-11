/**
 * @Author: drfu*
 * @Description: 获取日历数据
 * @Date: 2020-10-08 21:22:09*
 * @Last Modified by: drfu
 * @Last Modified time: 2020-10-11 13:42:37
 * */

import { getCalendarData, logger, getCalendarConfig } from '../../utils/index'

function wrapDateWithLunar(dates = [], convertFn) {
  const datesWithLunar = JSON.parse(JSON.stringify(dates)).map(date => ({
    ...date,
    lunar: convertFn(date)
  }))
  return datesWithLunar
}

export default () => {
  return {
    name: 'getData',
    methods(component) {
      return {
        getCurrentYM: () => {
          const { curYear, curMonth } = getCalendarData('calendar', component)
          return {
            year: curYear,
            month: curMonth
          }
        },
        getSelectedDates: (options = {}) => {
          const dates =
            getCalendarData('calendar.selectedDates', component) || []
          const config = getCalendarConfig(component) || {}
          if (options.lunar && !config.showLunar) {
            const injectedFns = component.calendar || {}
            if (typeof injectedFns.convertSolarLunar === 'function') {
              return wrapDateWithLunar(dates, injectedFns.convertSolarLunar)
            } else {
              logger.warn('获取农历信息需引入农历插件')
            }
          } else {
            return dates
          }
        },
        getCalendarDates: (options = {}) => {
          const config = getCalendarConfig(component) || {}
          const dates = getCalendarData('calendar.dates', component)
          if (options.lunar && !config.showLunar) {
            const injectedFns = component.calendar || {}
            if (typeof injectedFns.convertSolarLunar === 'function') {
              return wrapDateWithLunar(dates, injectedFns.convertSolarLunar)
            } else {
              logger.warn('获取农历信息需引入农历插件')
            }
          } else {
            return dates
          }
        },
        getCalendarAllData: () => {
          return {
            data: getCalendarData('calendar', component) || {},
            config: getCalendarConfig(component) || {}
          }
        }
      }
    }
  }
}
