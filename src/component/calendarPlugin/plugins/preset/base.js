import { calcJumpData } from '../../core'
import { renderCalendar } from '../../render'
import {
  dateUtil,
  getCalendarData,
  setCalendarData,
  getCalendarConfig
} from '../../utils/index'

export default () => {
  return {
    name: 'base',
    install(comp) {},
    beforeRender(calendarData = {}) {
      const calendar = calendarData
      const { selectedDates = [], dates, curYear, curMonth } = calendar
      let _dates = [...dates]
      if (selectedDates.length) {
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
      const calendarConfig = getCalendarConfig(component)
      const updatedRenderData = calcJumpData({
        dateInfo: date,
        config: calendarConfig
      })
      return {
        ...calendarData,
        ...updatedRenderData
      }
    },
    methods(component) {
      return {
        jump: dateInfo => {
          const updatedRenderData = calcJumpData({
            dateInfo,
            component
          })
          const existCalendarData = getCalendarData('calendar', component)
          const config = getCalendarConfig(component)
          if (config.autoChoosedWhenJump) {
            const target = updatedRenderData.dates[dateInfo.date - 1]
            if (!updatedRenderData.selectedDates) {
              updatedRenderData.selectedDates = [target]
            } else {
              updatedRenderData.selectedDates.push(target)
            }
          }
          return renderCalendar.call(component, {
            ...existCalendarData,
            ...updatedRenderData
          })
        },
        getCalendarConfig() {
          return getCalendarConfig(component)
        },
        setCalendarConfig(config) {
          return new Promise((resolve, reject) => {
            if (!component || !component.config) {
              reject('异常：未找到组件配置信息')
              return
            }
            let conf = { ...component.config, ...config }
            component.config = conf
            setCalendarData('calendar.config', conf)
          })
        },
        cancelSelectedDates(cancelDates = []) {
          const existCalendarData = getCalendarData('calendar', component) || {}
          const { dates = [], selectedDates = [] } = existCalendarData
          let updatedRenderData = {}
          if (!cancelDates.length) {
            dates.forEach(item => {
              item.choosed = false
            })
            updatedRenderData = {
              dates,
              selectedDates: []
            }
          } else {
            const cancelDatesStr = cancelDates.map(date =>
              dateUtil.toTimeStr(date)
            )
            const filterSelectedDates = selectedDates.filter(
              date => !cancelDatesStr.includes(dateUtil.toTimeStr(date))
            )
            dates.forEach(date => {
              if (cancelDatesStr.includes(dateUtil.toTimeStr(date))) {
                date.choosed = false
              }
            })
            updatedRenderData = {
              dates,
              selectedDates: filterSelectedDates
            }
          }

          return renderCalendar.call(component, {
            ...existCalendarData,
            ...updatedRenderData
          })
        }
      }
    }
  }
}
