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
        ...calendarData,
        dates: dates,
        selectedDates: selectedDates
      }
    },
    methods(component) {
      return {
        convertSolarLunar: (dataInfo = {}) => {
          const { year, month, date } = dataInfo
          return convertSolarLunar.solar2lunar(year, month, date)
        }
      }
    }
  }
}
