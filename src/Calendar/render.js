import plugins from './plugins/index'
import { getConfig } from './utils/config'
export let initialComponent = null

/**
 * 渲染日历
 */
export function renderCalendar(calendarData, config) {
  return new Promise(resolve => {
    if (this.firstRender === void 0) {
      this.firstRender = true
    } else {
      this.firstRender = false
    }
    initialComponent = this
    const calendarConfig = config || getConfig()
    const exitData = this.data.calendar || {}
    for (let plugin of plugins.installed) {
      const [, p] = plugin
      if (typeof p.beforeRender === 'function') {
        calendarData = p.beforeRender(
          { ...exitData, ...calendarData },
          calendarConfig,
          this
        )
      }
    }
    this.setData(
      {
        calendar: calendarData
      },
      () => {
        resolve({
          calendar: calendarData,
          firstRender: this.firstRender
        })
      }
    )
  })
}
