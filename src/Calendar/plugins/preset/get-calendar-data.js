import { getCalendarData } from '../../utils/index'

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
        }
      }
    }
  }
}
