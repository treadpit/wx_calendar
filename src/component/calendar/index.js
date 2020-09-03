import Week from './func/week'
import { Logger, Slide, GetDate, initialTasks } from './func/utils'
import initCalendar, {
  jump,
  getCurrentYM,
  whenChangeDate,
  renderCalendar,
  whenMulitSelect,
  whenSingleSelect,
  whenChooseArea,
  getCalendarDates
} from './main.js'

const slide = new Slide()
const logger = new Logger()
const getDate = new GetDate()

Component({
  options: {
    styleIsolation: 'apply-shared',
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    calendarConfig: {
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
    },
    detached: function() {
      initialTasks.flag = 'finished'
      initialTasks.tasks.length = 0
    }
  },
  methods: {
    initComp() {
      const calendarConfig = this.setDefaultDisableDate()
      this.setConfig(calendarConfig)
    },
    setDefaultDisableDate() {
      const calendarConfig = this.properties.calendarConfig || {}
      if (calendarConfig.disableMode && !calendarConfig.disableMode.date) {
        calendarConfig.disableMode.date = getDate.toTimeStr(getDate.todayDate())
      }
      return calendarConfig
    },
    setConfig(config) {
      if (config.markToday && typeof config.markToday === 'string') {
        config.highlightToday = true
      }
      config.theme = config.theme || 'default'
      this.weekMode = config.weekMode
      this.setData(
        {
          calendarConfig: config
        },
        () => {
          initCalendar(this, config)
        }
      )
    },
    chooseDate(e) {
      const { type } = e.currentTarget.dataset
      if (!type) return
      const methodName = this.data.handleMap[type]
      this[methodName](type)
    },
    chooseYear(type) {
      const { curYear, curMonth } = this.data.calendar
      if (!curYear || !curMonth) return logger.warn('异常：未获取到当前年月')
      if (this.weekMode) {
        return console.warn('周视图下不支持点击切换年月')
      }
      let newYear = +curYear
      let newMonth = +curMonth
      if (type === 'prev_year') {
        newYear -= 1
      } else if (type === 'next_year') {
        newYear += 1
      }
      this.render(curYear, curMonth, newYear, newMonth)
    },
    chooseMonth(type) {
      const { curYear, curMonth } = this.data.calendar
      if (!curYear || !curMonth) return logger.warn('异常：未获取到当前年月')
      if (this.weekMode) return console.warn('周视图下不支持点击切换年月')
      let newYear = +curYear
      let newMonth = +curMonth
      if (type === 'prev_month') {
        newMonth = newMonth - 1
        if (newMonth < 1) {
          newYear -= 1
          newMonth = 12
        }
      } else if (type === 'next_month') {
        newMonth += 1
        if (newMonth > 12) {
          newYear += 1
          newMonth = 1
        }
      }
      this.render(curYear, curMonth, newYear, newMonth)
    },
    render(curYear, curMonth, newYear, newMonth) {
      whenChangeDate.call(this, {
        curYear,
        curMonth,
        newYear,
        newMonth
      })
      this.setData({
        'calendar.curYear': newYear,
        'calendar.curMonth': newMonth
      })
      renderCalendar.call(this, newYear, newMonth)
    },
    /**
     * 日期点击事件
     * @param {!object} e 事件对象
     */
    tapDayItem(e) {
      const { idx, date = {} } = e.currentTarget.dataset
      const { day, disable } = date
      if (disable || !day) return
      const config = this.data.calendarConfig || this.config || {}
      const { multi, chooseAreaMode } = config
      if (multi) {
        whenMulitSelect.call(this, idx)
      } else if (chooseAreaMode) {
        whenChooseArea.call(this, idx)
      } else {
        whenSingleSelect.call(this, idx)
      }
      this.setData({
        'calendar.noDefault': false
      })
    },
    doubleClickToToday() {
      if (this.config.multi || this.weekMode) return
      if (this.count === undefined) {
        this.count = 1
      } else {
        this.count += 1
      }
      if (this.lastClick) {
        const difference = new Date().getTime() - this.lastClick
        if (difference < 500 && this.count >= 2) {
          jump.call(this)
        }
        this.count = undefined
        this.lastClick = undefined
      } else {
        this.lastClick = new Date().getTime()
      }
    },
    /**
     * 日历滑动开始
     * @param {object} e
     */
    calendarTouchstart(e) {
      const t = e.touches[0]
      const startX = t.clientX
      const startY = t.clientY
      this.slideLock = true // 滑动事件加锁
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
      const { preventSwipe } = this.properties.calendarConfig
      if (!this.slideLock || preventSwipe) return
      if (slide.isLeft(gesture, e.touches[0])) {
        this.handleSwipe('left')
        this.slideLock = false
      }
      if (slide.isRight(gesture, e.touches[0])) {
        this.handleSwipe('right')
        this.slideLock = false
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
      let swipeCalendarType = 'next_month'
      let weekChangeType = 'next_week'
      if (direction === 'right') {
        swipeKey = 'calendar.rightSwipe'
        swipeCalendarType = 'prev_month'
        weekChangeType = 'prev_week'
      }
      this.setData({
        [swipeKey]: 1
      })
      this.currentYM = getCurrentYM()
      if (this.weekMode) {
        this.slideLock = false
        this.currentDates = getCalendarDates()
        if (weekChangeType === 'prev_week') {
          Week(this).calculatePrevWeekDays()
        } else if (weekChangeType === 'next_week') {
          Week(this).calculateNextWeekDays()
        }
        this.onSwipeCalendar(weekChangeType)
        this.onWeekChange(weekChangeType)
        return
      }
      this.chooseMonth(swipeCalendarType)
      this.onSwipeCalendar(swipeCalendarType)
    },
    onSwipeCalendar(direction) {
      this.triggerEvent('onSwipe', {
        directionType: direction,
        currentYM: this.currentYM
      })
    },
    onWeekChange(direction) {
      this.triggerEvent('whenChangeWeek', {
        current: {
          currentYM: this.currentYM,
          dates: [...this.currentDates]
        },
        next: {
          currentYM: getCurrentYM(),
          dates: getCalendarDates()
        },
        directionType: direction
      })
      this.currentDates = null
      this.currentYM = null
    }
  }
})
