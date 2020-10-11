/**
 * @Author: drfu*
 * @Description: 基础功能
 * @Date: 2020-10-08 21:22:09*
 * @Last Modified by: drfu
 * @Last Modified time: 2020-10-11 13:28:52
 * */

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
    beforeRender(calendarData = {}, calendarConfig) {
      const calendar = calendarData
      const { selectedDates = [], dates } = calendar
      let _dates = [...dates]
      if (selectedDates.length) {
        const selectedDatesStr = selectedDates.map(date =>
          dateUtil.toTimeStr(date)
        )
        _dates.forEach(date => {
          const dateStr = dateUtil.toTimeStr(date)
          if (selectedDatesStr.includes(dateStr)) {
            date.choosed = true
          }
        })
      }
      return {
        calendarData: {
          ...calendarData,
          dates: _dates
        },
        calendarConfig
      }
    },
    onTapDate(tapedDate, calendarData = {}, calendarConfig = {}) {
      const calendar = {
        ...calendarData
      }
      const dateIndex = dateUtil.findDateIndexInArray(
        tapedDate,
        calendarData.dates
      )
      const { multi, inverse } = calendarConfig
      let dates = [...calendar.dates]
      const { selectedDates = [] } = calendar
      if (!multi) {
        let preSelectedDate = {}
        if (selectedDates.length) {
          preSelectedDate = [...selectedDates].pop() || {}
        }
        if (!inverse && +preSelectedDate.date === +tapedDate.date) {
          return calendar
        }
        let _tapedDate = { ...tapedDate, choosed: !tapedDate.choosed }

        dates[dateIndex] = _tapedDate
        if (preSelectedDate.date) {
          const idx = dateUtil.findDateIndexInArray(preSelectedDate, dates)
          const date = dates[idx]
          if (date) {
            date.choosed = false
          }
        }
        if (dates[dateIndex].choosed) {
          calendar.selectedDates = [dates[dateIndex]]
        } else {
          calendar.selectedDates = []
        }
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
        calendarData: {
          ...calendar,
          dates
        },
        calendarConfig
      }
    },
    onSwitchCalendar(date, calendarData = {}, component) {
      const calendarConfig = getCalendarConfig(component)
      if (calendarConfig.weekMode) {
        return calendarData
      }
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
          if (Object.prototype.toString.call(dateInfo) !== '[object Object]')
            return
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
          const config = getCalendarConfig(component)
          let chooseAreaData = {}
          if (config.chooseAreaMode) {
            chooseAreaData = {
              chooseAreaTimestamp: [],
              tempChooseAreaTimestamp: []
            }
          }
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
            ...updatedRenderData,
            ...chooseAreaData
          })
        },
        setSelectedDates: targetDates => {
          const existCalendarData = getCalendarData('calendar', component)
          let { dates, selectedDates = [] } = existCalendarData || {}
          let __selectedDates = []
          let __dates = dates
          if (!targetDates) {
            __dates = dates.map(item => {
              const date = { ...item }
              date.choosed = true
              if (existCalendarData.showLabelAlways && date.showTodoLabel) {
                date.showTodoLabel = true
              } else {
                date.showTodoLabel = false
              }
              return date
            })
            __selectedDates = dates
          } else if (targetDates && targetDates.length) {
            const allSelected = dateUtil.uniqueArrayByDate(
              selectedDates.concat(targetDates)
            )
            const allSelectedDateStr = allSelected.map(d =>
              dateUtil.toTimeStr(d)
            )
            __dates = dates.map(item => {
              const date = { ...item }
              if (allSelectedDateStr.includes(dateUtil.toTimeStr(date))) {
                date.choosed = true
                __selectedDates.push(date)
              }
              if (existCalendarData.showLabelAlways && date.showTodoLabel) {
                date.showTodoLabel = true
              } else {
                date.showTodoLabel = false
              }
              return date
            })
          }
          return renderCalendar.call(component, {
            ...existCalendarData,
            dates: __dates,
            selectedDates: __selectedDates
          })
        },
        setDateStyle: toSetDates => {
          if (!Array.isArray(toSetDates)) return Promise.reject()
          const existCalendarData = getCalendarData('calendar', component)
          const { dates = [], specialStyleDates } = existCalendarData || {}
          if (Array.isArray(specialStyleDates)) {
            toSetDates = dateUtil.uniqueArrayByDate([
              ...specialStyleDates,
              ...toSetDates
            ])
          }
          const toSetDatesStr = toSetDates.map(item => dateUtil.toTimeStr(item))
          const _dates = dates.map(item => {
            const idx = toSetDatesStr.indexOf(dateUtil.toTimeStr(item))
            if (idx > -1) {
              return {
                ...item,
                class: toSetDates[idx].class
              }
            } else {
              return item
            }
          })
          return renderCalendar.call(component, {
            ...existCalendarData,
            dates: _dates,
            specialStyleDates: toSetDates
          })
        }
      }
    }
  }
}
