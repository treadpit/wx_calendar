import { calcJumpData } from '../../core'
import { getCalendarData } from '../../utils/index'
import { renderCalendar } from '../../render'
import { getConfig } from '../../utils/config'

export default () => {
  return {
    name: 'jump',
    methods(component) {
      return {
        jump: dateInfo => {
          const waitRenderData = calcJumpData({
            dateInfo,
            component
          })
          const existCalendarData = getCalendarData('calendar', component)
          const config = getConfig(component)
          if (config.autoChoosedWhenJump) {
            const target = waitRenderData.dates[dateInfo.date - 1]
            if (!waitRenderData.selectedDates) {
              waitRenderData.selectedDates = [target]
            } else {
              waitRenderData.selectedDates.push(target)
            }
          }
          renderCalendar.call(component, {
            ...existCalendarData,
            ...waitRenderData
          })
        }
      }
    }
  }
}
