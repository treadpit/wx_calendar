/**
 * @Author: drfu*
 * @Description: 禁用、启用日期选择
 * @Date: 2020-10-08 21:22:09*
 * @Last Modified by: drfu
 * @Last Modified time: 2020-10-08 21:25:00
 * */

import { getCalendarData, dateUtil, logger } from '../utils/index'
import { renderCalendar } from '../render'

function convertEnableAreaToTimestamp(timearea = []) {
  const start = timearea[0].split('-')
  const end = timearea[1].split('-')
  if (start.length !== 3 || end.length !== 3) {
    logger.warn('enableArea() 参数格式为: ["2018-2-1", "2018-3-1"]')
    return {}
  }
  const startTimestamp = dateUtil
    .newDate(start[0], start[1], start[2])
    .getTime()
  const endTimestamp = dateUtil.newDate(end[0], end[1], end[2]).getTime()
  return {
    start,
    end,
    startTimestamp,
    endTimestamp
  }
}

function isValiditeOfDateArea(dateArea) {
  const {
    start,
    end,
    startTimestamp,
    endTimestamp
  } = convertEnableAreaToTimestamp(dateArea)
  if (!start || !end) return
  const datesCountOfStart = dateUtil.getDatesCountOfMonth(start[0], start[1])
  const datesCountOfEnd = dateUtil.getDatesCountOfMonth(end[0], end[1])
  if (start[2] > datesCountOfStart || start[2] < 1) {
    logger.warn('enableArea() 开始日期错误，指定日期不在指定月份天数范围内')
    return false
  } else if (start[1] > 12 || start[1] < 1) {
    logger.warn('enableArea() 开始日期错误，月份超出1-12月份')
    return false
  } else if (end[2] > datesCountOfEnd || end[2] < 1) {
    logger.warn('enableArea() 截止日期错误，指定日期不在指定月份天数范围内')
    return false
  } else if (end[1] > 12 || end[1] < 1) {
    logger.warn('enableArea() 截止日期错误，月份超出1-12月份')
    return false
  } else if (startTimestamp > endTimestamp) {
    logger.warn('enableArea()参数最小日期大于了最大日期')
    return false
  } else {
    return true
  }
}

function handleDisableMode(calendarConfig) {
  const { disableMode } = calendarConfig
  if (!disableMode) return {}
  const disableBound =
    dateUtil.getTimeStamp(disableMode.date) || dateUtil.todayTimestamp()
  return {
    disableBound,
    disableType: disableMode.type
  }
}

function disabledByConfig(dateInfo, currentDate, calendarConfig) {
  const date = { ...dateInfo }
  const { disableType, disableBound } = handleDisableMode(calendarConfig)
  if (
    (disableType === 'before' && disableBound && currentDate < disableBound) ||
    (disableType === 'after' && disableBound && currentDate > disableBound)
  ) {
    date.disable = true
  } else {
    date.disable = false
  }
  return date
}

export default () => {
  return {
    name: 'enable',
    beforeRender(calendarData = {}, calendarConfig = {}) {
      const {
        dates,
        enableArea,
        enableDates,
        disableDates,
        renderCausedBy
      } = calendarData
      const _dates = [...dates].map(date => {
        let item = { ...date }
        const timeStr = dateUtil.toTimeStr(date)
        const timestamp = +dateUtil.getTimeStamp(item)
        if (renderCausedBy === 'enableDates') {
          if (enableDates && enableDates.length) {
            if (enableDates.includes(timeStr)) {
              item.disable = false
            } else {
              item.disable = true
            }
            return item
          }
        } else if (renderCausedBy === 'enableArea') {
          if (enableArea && enableArea.length) {
            const [startTimestamp, endTimestamp] = enableArea || []
            const ifOutofArea =
              +startTimestamp > timestamp || timestamp > +endTimestamp
            item.disable = ifOutofArea
            return item
          }
        } else if (renderCausedBy === 'disableDates') {
          if (disableDates && disableDates.length) {
            if (disableDates && disableDates.includes(timeStr)) {
              item.disable = true
            } else {
              item.disable = false
            }
            return item
          }
        }
        return disabledByConfig(item, timestamp, calendarConfig)
      })

      return {
        calendarData: {
          ...calendarData,
          dates: _dates
        },
        calendarConfig
      }
    },
    methods(component) {
      return {
        enableArea: (dateArea = []) => {
          if (dateArea.length === 2) {
            const validate = isValiditeOfDateArea(dateArea)
            if (validate) {
              const existCalendarData = getCalendarData('calendar', component)
              const {
                startTimestamp,
                endTimestamp
              } = convertEnableAreaToTimestamp(dateArea)

              return renderCalendar.call(component, {
                ...existCalendarData,
                renderCausedBy: 'enableArea',
                enableArea: [startTimestamp, endTimestamp]
              })
            }
          } else {
            return Promise.inject(
              'enableArea()参数需为时间范围数组，形如：["2018-8-4" , "2018-8-24"]'
            )
          }
        },
        enableDates: (toSet = []) => {
          if (!toSet.length) return
          const existCalendarData = getCalendarData('calendar', component)
          const { enableDates = [] } = existCalendarData || {}
          let toSetDates = toSet.map(item => {
            let date = { ...item }
            if (typeof date === 'string') {
              return dateUtil.transformDateRow2Dict(item)
            }
            return item
          })
          if (enableDates.length) {
            toSetDates = dateUtil.uniqueArrayByDate([
              ...toSetDates,
              ...enableDates.map(d => dateUtil.transformDateRow2Dict(d))
            ])
          }
          return renderCalendar.call(component, {
            ...existCalendarData,
            renderCausedBy: 'enableDates',
            enableDates: toSetDates.map(date => {
              if (typeof date !== 'string') {
                return dateUtil.toTimeStr(date)
              }
              return date
            })
          })
        },
        disableDates: toSet => {
          const existCalendarData = getCalendarData('calendar', component)
          const { disableDates = [], dates = [] } = existCalendarData || {}
          let toSetDates = toSet.map(item => {
            let date = { ...item }
            if (typeof date === 'string') {
              return dateUtil.transformDateRow2Dict(item)
            }
            return item
          })
          if (disableDates && disableDates.length) {
            toSetDates = dateUtil.uniqueArrayByDate([
              ...toSetDates,
              ...disableDates.map(d => dateUtil.transformDateRow2Dict(d))
            ])
          }
          return renderCalendar.call(component, {
            ...existCalendarData,
            renderCausedBy: 'disableDates',
            dates,
            disableDates: toSetDates.map(date => {
              if (typeof date !== 'string') {
                return dateUtil.toTimeStr(date)
              }
              return date
            })
          })
        }
      }
    }
  }
}
