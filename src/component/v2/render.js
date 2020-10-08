import plugins from './plugins/index'
import { getCalendarConfig } from './utils/index'

/**
 * 渲染日历
 */
export function renderCalendar(calendarData, calendarConfig) {
  return new Promise(resolve => {
    const Component = this
    if (Component.firstRender === void 0) {
      Component.firstRender = true
    } else {
      Component.firstRender = false
    }
    const exitData = Component.data.calendar || {}
    for (let plugin of plugins.installed) {
      const [, p] = plugin
      if (typeof p.beforeRender === 'function') {
        const {
          calendarData: newData,
          calendarConfig: newConfig
        } = p.beforeRender(
          { ...exitData, ...calendarData },
          calendarConfig || getCalendarConfig(Component),
          Component
        )
        calendarData = newData
        calendarConfig = newConfig
      }
    }

    Component.setData(
      {
        config: calendarConfig,
        calendar: calendarData
      },
      () => {
        const rst = {
          calendar: calendarData,
          config: calendarConfig,
          firstRender: Component.firstRender
        }
        resolve(rst)
        if (Component.firstRender) {
          Component.triggerEvent('afterCalendarRender', rst)
          Component.firstRender = false
        }
      }
    )
  })
}
