import {
  dateUtil,
  getCurrentPage,
  calendarGesture,
  logger
} from './utils/index'
import { renderCalendar } from './render'
import plugins from './plugins/index'
import { setConfig } from './utils/config'
import { calcJumpData } from './core'

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
  data: {
    handleMap: {
      prev_year: 'chooseYear',
      prev_month: 'chooseMonth',
      next_month: 'chooseMonth',
      next_year: 'chooseYear'
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
          dateUtil.todayDate()
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
            year: dateInfo[0],
            month: dateInfo[1],
            date: dateInfo[2]
          }
        }
      }
      const waitRenderData = calcJumpData({
        dateInfo: date,
        config
      })
      const timestamp = dateUtil.todayTimestamp()
      if (config.autoChoosedWhenJump) {
        const target = waitRenderData.dates[date.date - 1]
        if (!waitRenderData.selectedDates) {
          waitRenderData.selectedDates = [target]
        } else {
          waitRenderData.selectedDates.push(target)
        }
      }
      return {
        ...waitRenderData,
        todayTimestamp: timestamp,
        weeksCh: dateUtil.getWeekHeader(config)
      }
    },
    setConfig(config) {
      if (config.markToday && typeof config.markToday === 'string') {
        config.highlightToday = true
      }
      config.theme = config.theme || 'default'
      this.weekMode = config.weekMode
      setConfig(config, this).then(() => {
        for (let plugin of plugins.installed) {
          const [, p] = plugin
          if (typeof p.install === 'function') {
            p.install(this)
          }
          if (typeof p.methods === 'function') {
            const methods = p.methods(this)
            for (let fnName in methods) {
              const fn = methods[fnName]
              if (typeof fn === 'function') {
                const page = getCurrentPage()
                if (!page.calendar) page.calendar = {}
                page.calendar[fnName] = fn
              }
            }
          }
        }
        const initData = this.initCalendar(config)
        renderCalendar.call(this, initData, config)
      })
    },
    tapDate(e) {
      const { info = {} } = e.currentTarget.dataset
      const { date, disable } = info
      if (disable || !date) return
      const { calendar, config } = this.data
      let calendarData = calendar
      for (let plugin of plugins.installed) {
        const [, p] = plugin
        if (typeof p.onTapDate === 'function') {
          calendarData = p.onTapDate(info, calendarData, config)
        }
      }
      renderCalendar.call(this, calendarData, config).then(() => {
        this.triggerEvent('afterTapDay', calendarData.dates[date - 1])
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
      // let swipeCalendarType = 'next_month'
      // let weekChangeType = 'next_week'
      if (direction === 'right') {
        swipeKey = 'calendar.rightSwipe'
        // swipeCalendarType = 'prev_month'
        // weekChangeType = 'prev_week'
      }
      this.setData({
        [swipeKey]: 1
      })
      // this.currentYM = getCurrentYM()
      // if (this.weekMode) {
      //   this.swipeLock = false
      //   // this.currentDates = getCalendarDates()
      //   if (weekChangeType === 'prev_week') {
      //     Week(this).calculatePrevWeekDays()
      //   } else if (weekChangeType === 'next_week') {
      //     Week(this).calculateNextWeekDays()
      //   }
      //   this.onSwipeCalendar(weekChangeType)
      //   this.onWeekChange(weekChangeType)
      //   return
      // }
      // this.chooseMonth(swipeCalendarType)
      // this.onSwipeCalendar(swipeCalendarType)
      const { calendar, config } = this.data
      let calendarData = calendar
      const { curYear, curMonth } = calendarData
      const getMonthInfo =
        direction === 'left'
          ? dateUtil.getNextMonthInfo
          : dateUtil.getPrevMonthInfo
      const target = getMonthInfo({
        year: curYear,
        month: curMonth
      })
      for (let plugin of plugins.installed) {
        const [, p] = plugin
        if (typeof p.onChangeMonth === 'function') {
          calendarData = p.onChangeMonth(target, this)
        }
      }
      renderCalendar.call(this, calendarData, config).then(() => {
        this.triggerEvent('whenChangeMonth', {
          current: {
            year: curYear,
            month: curMonth
          },
          next: target
        })
      })
    }
  }
})
