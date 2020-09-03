import convertSolarLunar from './convertSolarLunar'

export default () => {
  return {
    name: 'convertSolarLunar',
    beforeRender(calendarData = {}, calendarConfig = {}) {
      const { dates } = calendarData
      let _dates = dates
      if (calendarConfig.showLunar) {
        _dates = [...dates].map(dataInfo => {
          const { year, month, date } = dataInfo
          return {
            ...dataInfo,
            lunar: convertSolarLunar.solar2lunar(year, month, date)
          }
        })
      }
      return {
        ...calendarData,
        dates: _dates
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
