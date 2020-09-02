import { getCalendarData, logger, getCalendarConfig } from '../../utils/index'

export default () => {
  return {
    name: 'todo',
    methods(component) {
      return {
        getCurrentYM: () => {
          const { curYear, curMonth } = getCalendarData('calendar', component)
          return {
            year: curYear,
            month: curMonth
          }
        },
        getSelectedDates: () => {
          const dates =
            getCalendarData('calendar.selectedDates', component) || []
          return dates
        },
        getCalendarDates: (options = {}) => {
          const config = getCalendarConfig(component) || {}
          const dates = getCalendarData('calendar.dates', component)
          if (options.lunar && !config.showLunar) {
            const injectedFns = component.calendar || {}
            if (typeof injectedFns.convertSolarLunar === 'function') {
              const datesWithLunar = JSON.parse(JSON.stringify(dates)).map(
                date => ({
                  ...date,
                  lunar: injectedFns.convertSolarLunar(date)
                })
              )
              return datesWithLunar
            } else {
              logger.warn('获取农历信息需引入农历插件')
            }
          } else {
            return dates
          }
        }
      }
    }
  }
}
