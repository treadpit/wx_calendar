import { dateUtil } from '../../utils/index'
import convertSolarLunar from './convertSolarLunar'

export default () => {
  return {
    name: 'convertSolarLunar',
    beforeRender(calendarData = {}, calendarConfig = {}) {
      let { dates = [], selectedDates = [] } = calendarData
      if (calendarConfig.showLunar) {
        dates = dates.map(dataInfo => {
          const { year, month, date } = dataInfo
          return {
            ...dataInfo,
            lunar: convertSolarLunar.solar2lunar(year, month, date)
          }
        })
        selectedDates = selectedDates.map(dataInfo => {
          const { year, month, date } = dataInfo
          return {
            ...dataInfo,
            lunar: convertSolarLunar.solar2lunar(year, month, date)
          }
        })
      }
      return {
        calendarData: {
          ...calendarData,
          dates: dates,
          selectedDates: selectedDates
        },
        calendarConfig
      }
    },
    methods() {
      return {
        convertSolarLunar: dateInfo => {
          if (!dateInfo) return dateInfo
          if (typeof dateInfo === 'string' && dateInfo.includes('-')) {
            dateInfo = dateUtil.transformDateRow2Dict(dateInfo)
          }
          const { year, month, date } = dateInfo
          return convertSolarLunar.solar2lunar(year, month, date)
        }
      }
    }
  }
}
