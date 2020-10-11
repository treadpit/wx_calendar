/**
 * @Author: drfu*
 * @Description: 时间区域选择
 * @Date: 2020-10-08 21:22:09*
 * @Last Modified by: drfu
 * @Last Modified time: 2020-10-11 13:56:32
 * */

import { renderCalendar } from '../render'
import {
  logger,
  dateUtil,
  getCalendarConfig,
  getCalendarData
} from '../utils/index'

function pusheNextMonthDateArea(
  dateInfo = {},
  startTimestamp,
  endTimestamp,
  selectedDates = []
) {
  let tempOfSelectedDate = [...selectedDates]
  const dates = dateUtil.calcDates(dateInfo.year, dateInfo.month)
  let datesLen = dates.length
  for (let i = 0; i < datesLen; i++) {
    const date = dates[i]
    const timeStamp = dateUtil.getTimeStamp(date)
    if (timeStamp <= endTimestamp && timeStamp >= startTimestamp) {
      tempOfSelectedDate.push({
        ...date,
        choosed: true
      })
    }
    if (i === datesLen - 1 && timeStamp < endTimestamp) {
      pusheNextMonthDateArea(
        dateUtil.getNextMonthInfo(date),
        startTimestamp,
        endTimestamp,
        tempOfSelectedDate
      )
    }
  }
  return tempOfSelectedDate
}
function pushPrevMonthDateArea(
  dateInfo = {},
  startTimestamp,
  endTimestamp,
  selectedDates = []
) {
  let tempOfSelectedDate = [...selectedDates]
  const dates = dateUtil.sortDatesByTime(
    dateUtil.calcDates(dateInfo.year, dateInfo.month),
    'desc'
  )
  let datesLen = dates.length
  let firstDate = dateUtil.getTimeStamp(dates[0])
  for (let i = 0; i < datesLen; i++) {
    const date = dates[i]
    const timeStamp = dateUtil.getTimeStamp(date)
    if (timeStamp >= startTimestamp && timeStamp <= endTimestamp) {
      tempOfSelectedDate.push({
        ...date,
        choosed: true
      })
    }
    if (i === datesLen - 1 && firstDate > startTimestamp) {
      pushPrevMonthDateArea(
        dateUtil.getPrevMonthInfo(date),
        startTimestamp,
        endTimestamp,
        tempOfSelectedDate
      )
    }
  }
  return tempOfSelectedDate
}
/**
 * 当设置日期区域非当前时保存其他月份的日期至已选日期数组
 * @param {object} info
 */
function calcDateWhenNotInOneMonth(info) {
  const { firstDate, lastDate, startTimestamp, endTimestamp } = info
  let { selectedDate } = info
  if (dateUtil.getTimeStamp(firstDate) > startTimestamp) {
    selectedDate = pushPrevMonthDateArea(
      dateUtil.getPrevMonthInfo(firstDate),
      startTimestamp,
      endTimestamp,
      selectedDate
    )
  }
  if (dateUtil.getTimeStamp(lastDate) < endTimestamp) {
    selectedDate = pusheNextMonthDateArea(
      dateUtil.getNextMonthInfo(lastDate),
      startTimestamp,
      endTimestamp,
      selectedDate
    )
  }
  return [...selectedDate]
}

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
      const [startDateTimestamp, endDateTimestamp] = chooseAreaTimestamp
      if (chooseAreaTimestamp.length === 2) {
        __selectedDates = []
        __dates = dates.map(d => {
          const date = { ...d }
          const dateTimeStamp = dateUtil.getTimeStamp(date)
          if (
            dateTimeStamp >= startDateTimestamp &&
            endDateTimestamp >= dateTimeStamp
          ) {
            date.choosed = true
            __selectedDates.push(date)
          } else {
            date.choosed = false
            __selectedDates = __selectedDates.filter(
              item => dateUtil.getTimeStamp(item) !== dateTimeStamp
            )
          }
          return date
        })
        const monthOfStartDate = new Date(startDateTimestamp).getMonth()
        const monthOfEndDate = new Date(endDateTimestamp).getMonth()
        if (monthOfStartDate !== monthOfEndDate) {
          __selectedDates = calcDateWhenNotInOneMonth({
            firstDate: __dates[0],
            lastDate: __dates[__dates.length - 1],
            startTimestamp: startDateTimestamp,
            endTimestamp: endDateTimestamp,
            selectedDate: __selectedDates
          })
        }
      }
      return {
        calendarData: {
          ...calendarData,
          dates: __dates,
          selectedDates: dateUtil.sortDatesByTime(
            dateUtil.uniqueArrayByDate(__selectedDates)
          )
        },
        calendarConfig
      }
    },
    onTapDate(tapedDate, calendarData = {}, calendarConfig = {}) {
      if (!calendarConfig.chooseAreaMode) {
        return {
          calendarData,
          calendarConfig
        }
      }
      let {
        tempChooseAreaTimestamp = [],
        chooseAreaTimestamp: existChooseAreaTimestamp = [],
        selectedDates = [],
        dates = []
      } = calendarData
      const timestamp = dateUtil.getTimeStamp(tapedDate)
      let __dates = [...dates]
      let __selectedDates = [...selectedDates]
      if (
        tempChooseAreaTimestamp.length === 2 ||
        existChooseAreaTimestamp.length === 2
      ) {
        tempChooseAreaTimestamp = [tapedDate]
        __selectedDates = []
        __dates.forEach(d => (d.choosed = false))
      } else if (tempChooseAreaTimestamp.length === 1) {
        const preChoosedDate = tempChooseAreaTimestamp[0]
        const preTimestamp = dateUtil.getTimeStamp(preChoosedDate)
        if (preTimestamp <= timestamp) {
          tempChooseAreaTimestamp.push(tapedDate)
        } else if (preTimestamp > timestamp) {
          tempChooseAreaTimestamp.unshift(tapedDate)
        }
      } else {
        tempChooseAreaTimestamp = [tapedDate]
      }
      let chooseAreaTimestamp = []
      if (tempChooseAreaTimestamp.length === 2) {
        const [startDate, endDate] = tempChooseAreaTimestamp
        const startDateTimestamp = dateUtil.getTimeStamp(startDate)
        const endDateTimestamp = dateUtil.getTimeStamp(endDate)
        chooseAreaTimestamp = [startDateTimestamp, endDateTimestamp]
      }
      return {
        calendarData: {
          ...calendarData,
          chooseAreaTimestamp,
          tempChooseAreaTimestamp,
          dates: __dates,
          selectedDates: __selectedDates
        },
        calendarConfig: {
          ...calendarConfig,
          multi: true
        }
      }
    },
    methods(component) {
      return {
        /**
         * 设置连续日期选择区域
         * @param {array} dateArea 区域开始结束日期数组
         */
        chooseDateArea: (dateArea = []) => {
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
              multi: true,
              chooseAreaMode: true
            }
          )
        }
      }
    }
  }
}
