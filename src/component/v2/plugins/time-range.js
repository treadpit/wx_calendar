/**
 * @Author: drfu*
 * @Description: 时间区域选择
 * @Date: 2020-10-08 21:22:09*
 * @Last Modified by: drfu
 * @Last Modified time: 2020-10-08 21:24:21
 * */

import { renderCalendar } from '../render'
import { dateUtil, getCalendarConfig, logger } from '../utils/index'
import getCalendarData from './preset/get-calendar-data'

/**
 *  指定日期区域转时间戳
 * @param {array} timearea 时间区域
 */
export function convertTimeRangeToTimestamp(timearea = []) {
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

/**
 * 校验时间区域是否合法
 * @param {array} dateArea 时间区域
 */
function validateTimeRange(dateArea) {
  const {
    start,
    end,
    startTimestamp,
    endTimestamp
  } = convertTimeRangeToTimestamp(dateArea)
  if (!start || !end) return
  const startMonthDays = dateUtil.getDatesCountOfMonth(start[0], start[1])
  const endMonthDays = dateUtil.getDatesCountOfMonth(end[0], end[1])
  if (start[2] > startMonthDays || start[2] < 1) {
    logger.warn('enableArea() 开始日期错误，指定日期不在当前月份天数范围内')
    return false
  } else if (start[1] > 12 || start[1] < 1) {
    logger.warn('enableArea() 开始日期错误，月份超出1-12月份')
    return false
  } else if (end[2] > endMonthDays || end[2] < 1) {
    logger.warn('enableArea() 截止日期错误，指定日期不在当前月份天数范围内')
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

export default () => {
  return {
    name: 'timeRange',
    beforeRender(calendarData = {}, calendarConfig = {}) {
      const {
        chooseAreaTimestamp = [],
        dates = [],
        selectedDates = []
      } = calendarData
      let __dates = dates
      let __selectedDates = selectedDates
      if (chooseAreaTimestamp.length === 2) {
        __dates = dates.map(d => {
          const date = { ...d }
          const dateTimeStamp = dateUtil.getTimeStamp(date)
          if (
            dateTimeStamp >= chooseAreaTimestamp[0] &&
            chooseAreaTimestamp[1] >= dateTimeStamp
          ) {
            date.choosed = true
            __selectedDates.push(date)
          }
          return date
        })
      }
      return {
        calendarData: {
          ...calendarData,
          dates: __dates,
          selectedDates: dateUtil.uniqueArrayByDate(__selectedDates)
        },
        calendarConfig
      }
    },
    methods(component) {
      return {
        /**
         * 设置连续日期选择区域
         * @param {array} dateArea 区域开始结束日期数组
         */
        chooseArea: (dateArea = []) => {
          if (dateArea.length === 1) {
            dateArea = dateArea.concat(dateArea)
          }
          if (dateArea.length !== 2) return
          const isRight = validateTimeRange(dateArea)
          if (!isRight) return
          const config = getCalendarConfig(component) || {}
          const { startTimestamp, endTimestamp } = convertTimeRangeToTimestamp(
            dateArea
          )
          const existCalendarData = getCalendarData('calendar', component)
          return renderCalendar.call(
            component,
            {
              ...existCalendarData,
              chooseAreaTimestamp: [startTimestamp, endTimestamp]
            },
            {
              ...config,
              mulit: true,
              chooseAreaMode: true
            }
          )
        }
      }
    }
  }
}
