import plugins from './plugins/index'
import { calcJumpData } from './core'
import { renderCalendar } from './render'
import { calcTargetYMInfo } from './helper'
import { dateUtil, calendarGesture, logger } from './utils/index'

Component({
  options: {
    styleIsolation: 'apply-shared',
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    config: {
      type: Object,
      value: {}
    }
  },
  lifetimes: {
    attached: function() {
      this.initComp()
    }
  },
  methods: {
    initComp() {
      const calendarConfig = this.setDefaultDisableDate()
      this.setConfig(calendarConfig)
    },
    // 禁用某天日期配置默认为今天
    setDefaultDisableDate() {
      const calendarConfig = this.properties.config || {}
      if (calendarConfig.disableMode && !calendarConfig.disableMode.date) {
        calendarConfig.disableMode.date = dateUtil.toTimeStr(
          dateUtil.todayFMD()
        )
      }
      return calendarConfig
    },
    initCalendar(config) {
      const { defaultDate } = config
      let date = dateUtil.todayFMD()
      if (defaultDate && typeof defaultDate === 'string') {
        const dateInfo = defaultDate.split('-')
        if (dateInfo.length < 3) {
          return logger.warn('defaultDate配置格式应为: 2018-4-2 或 2018-04-02')
        } else {
          date = {
            year: +dateInfo[0],
            month: +dateInfo[1],
            date: +dateInfo[2]
          }
        }
      }
      const waitRenderData = calcJumpData({
        dateInfo: date,
        config
      })
      const timestamp = dateUtil.todayTimestamp()
      if (config.autoChoosedWhenJump) {
        const target = waitRenderData.dates.filter(
          item => dateUtil.toTimeStr(item) === dateUtil.toTimeStr(date)
        )
        if (target && target.length) {
          if (!waitRenderData.selectedDates) {
            waitRenderData.selectedDates = target
          } else {
            waitRenderData.selectedDates.push(target[0])
          }
        }
      }
      return {
        ...waitRenderData,
        todayTimestamp: timestamp,
        weeksCh: dateUtil.getWeekHeader(config.firstDayOfWeek)
      }
    },
    setConfig(config) {
      if (config.markToday && typeof config.markToday === 'string') {
        config.highlightToday = true
      }
      config.theme = config.theme || 'default'
      this.setData(
        {
          config
        },
        () => {
          for (let plugin of plugins.installed) {
            const [, p] = plugin
            if (typeof p.install === 'function') {
              p.install(this)
            }
            if (typeof p.methods === 'function') {
              const methods = p.methods(this)
              for (let fnName in methods) {
                if (fnName.startsWith('__')) continue
                const fn = methods[fnName]
                if (typeof fn === 'function') {
                  if (!this.calendar) this.calendar = {}
                  this.calendar[fnName] = fn
                }
              }
            }
          }
          const initData = this.initCalendar(config)
          renderCalendar.call(this, initData, config)
        }
      )
    },
    tapDate(e) {
      const { info } = e.currentTarget.dataset
      const { date, disable } = info || {}
      if (disable || !date) return
      const { calendar, config } = this.data
      let calendarData = calendar
      let calendarConfig = config
      if (config.takeoverTap) {
        return this.triggerEvent('takeoverTap', info)
      }
      for (let plugin of plugins.installed) {
        const [, p] = plugin
        if (typeof p.onTapDate === 'function') {
          const {
            calendarData: __calendarData,
            calendarConfig: __calendarConfig
          } = p.onTapDate(info, calendarData, calendarConfig)
          calendarData = __calendarData
          calendarConfig = __calendarConfig
        }
      }
      renderCalendar.call(this, calendarData, calendarConfig).then(() => {
        this.triggerEvent('afterTapDate', info)
      })
    },
    /**
     * 日历滑动开始
     * @param {object} e
     */
    calendarTouchstart(e) {
      const t = e.touches[0]
      const startX = t.clientX
      const startY = t.clientY
      this.swipeLock = true
      this.setData({
        'gesture.startX': startX,
        'gesture.startY': startY
      })
    },
    /**
     * 日历滑动中
     * @param {object} e
     */
    calendarTouchmove(e) {
      const { gesture } = this.data
      const { preventSwipe } = this.properties.config
      if (!this.swipeLock || preventSwipe) return
      if (calendarGesture.isLeft(gesture, e.touches[0])) {
        this.handleSwipe('left')
        this.swipeLock = false
      }
      if (calendarGesture.isRight(gesture, e.touches[0])) {
        this.handleSwipe('right')
        this.swipeLock = false
      }
    },
    calendarTouchend(e) {
      this.setData({
        'calendar.leftSwipe': 0,
        'calendar.rightSwipe': 0
      })
    },
    handleSwipe(direction) {
      let swipeKey = 'calendar.leftSwipe'
      if (direction === 'right') {
        swipeKey = 'calendar.rightSwipe'
      }
      this.setData({
        [swipeKey]: 1
      })
      const { calendar } = this.data
      let calendarData = calendar
      const { curYear, curMonth } = calendarData
      const getMonthInfo = calcTargetYMInfo()[direction]
      const target = getMonthInfo({
        year: +curYear,
        month: +curMonth
      })
      target.direction = direction
      this.renderCalendar(target)
    },
    changeDate(e) {
      const { type } = e.currentTarget.dataset
      const { calendar: calendarData } = this.data
      const { curYear, curMonth } = calendarData
      const getMonthInfo = calcTargetYMInfo()[type]
      const target = getMonthInfo({
        year: +curYear,
        month: +curMonth
      })
      target.direction = type
      this.renderCalendar(target)
    },
    renderCalendar(target) {
      let { calendar: calendarData, config } = this.data
      const { curYear, curMonth } = calendarData || {}
      for (let plugin of plugins.installed) {
        const [, p] = plugin
        if (typeof p.onSwitchCalendar === 'function') {
          calendarData = p.onSwitchCalendar(target, calendarData, this)
        }
      }
      return renderCalendar.call(this, calendarData, config).then(() => {
        let triggerEventName = 'whenChangeMonth'
        if (config.weekMode) {
          triggerEventName = 'whenChangeWeek'
        }
        this.triggerEvent(triggerEventName, {
          current: {
            year: +curYear,
            month: +curMonth
          },
          next: target
        })
      })
    }
  }
})
