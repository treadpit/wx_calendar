import { calcJumpData } from '../../core'
import { getConfig } from '../../utils/config'
import { dateUtil, getCalendarData } from '../../utils/index'

export default () => {
  return {
    name: 'base',
    install(comp) {},
    beforeRender(calendarData = {}) {
      const calendar = calendarData
      const { selectedDates, dates, curYear, curMonth } = calendar
      let _dates = [...dates]
      if (selectedDates && selectedDates.length) {
        const selectedDateOfThisMonth = dateUtil.filterDatesByYM(
          {
            year: curYear,
            month: curMonth
          },
          selectedDates
        )
        selectedDateOfThisMonth.forEach(d => {
          const date = _dates[d.date - 1]
          date.choosed = true
        })
      }
      return {
        ...calendarData,
        dates: _dates
      }
    },
    onTapDate(tapeDate, calendarData = {}, calendarConfig = {}) {
      const dateIndex = tapeDate.date - 1
      const calendar = {
        ...calendarData
      }
      const { multi } = calendarConfig
      let dates = [...calendar.dates]
      if (!multi) {
        dates = dates.map(d => ({
          ...d,
          choosed: false
        }))
        dates[dateIndex] = {
          ...dates[dateIndex],
          choosed: true
        }
        calendar.selectedDates = [dates[dateIndex]]
      } else {
        dates[dateIndex] = {
          ...dates[dateIndex],
          choosed: !dates[dateIndex].choosed
        }
        if (!calendar.selectedDates) {
          calendar.selectedDates = []
        }
        if (dates[dateIndex].choosed) {
          calendar.selectedDates.push(dates[dateIndex])
        } else {
          calendar.selectedDates = calendar.selectedDates.filter(
            date =>
              dateUtil.toTimeStr(date) !== dateUtil.toTimeStr(dates[dateIndex])
          )
        }
      }
      return {
        ...calendar,
        dates
      }
    },
    onChangeMonth(date, component) {
      const calendarData = getCalendarData('calendar', component)
      const calendarConfig = getConfig(component)
      const waitRenderData = calcJumpData({
        dateInfo: date,
        config: calendarConfig
      })
      return {
        ...calendarData,
        ...waitRenderData
      }
    }
  }
}
