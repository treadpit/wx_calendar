import Day from './day'
import WxData from './wxData'
import Render from './render'
import CalendarConfig from './config'
import convertSolarLunar from './convertSolarLunar'
import { GetDate, Logger, getDateTimeStamp } from './utils'

const getDate = new GetDate()
const logger = new Logger()

class WeekMode extends WxData {
  constructor(component) {
    super(component)
    this.Component = component
    this.getCalendarConfig = CalendarConfig(this.Component).getCalendarConfig
  }
  /**
   * 周、月视图切换
   * @param {string} view  视图 [week, month]
   * @param {object} date  {year: 2017, month: 11, day: 1}
   */
  switchWeek(view, date) {
    return new Promise((resolve, reject) => {
      const config = CalendarConfig(this.Component).getCalendarConfig()
      if (config.multi) return logger.warn('多选模式不能切换周月视图')
      const { selectedDay = [], curYear, curMonth } = this.getData('calendar')
      let currentDate = []
      let disableSelected = false
      if (!selectedDay.length) {
        currentDate = getDate.todayDate()
        currentDate.day = currentDate.date
        disableSelected = true
        // return this.__tipsWhenCanNotSwtich();
      } else {
        currentDate = selectedDay[0]
      }
      let selectedDate = date || currentDate
      const { year, month } = selectedDate
      const notInCurrentMonth = curYear !== year || curMonth !== month
      if (view === 'week') {
        if (this.Component.weekMode) return
        if ((selectedDay.length && notInCurrentMonth) || !selectedDay.length) {
          // return this.__tipsWhenCanNotSwtich();
          disableSelected = true
          selectedDate = {
            year: curYear,
            month: curMonth,
            day: selectedDate.day
          }
        }
        this.Component.weekMode = true
        this.setData({
          'calendarConfig.weekMode': true
        })
        this.jump(selectedDate, disableSelected)
          .then(resolve)
          .catch(reject)
      } else {
        this.Component.weekMode = false
        this.setData({
          'calendarConfig.weekMode': false
        })
        const disableSelected =
          (selectedDay.length && notInCurrentMonth) || !selectedDay.length
        Render(this.Component)
          .renderCalendar(curYear, curMonth, selectedDate.day, disableSelected)
          .then(resolve)
          .catch(reject)
      }
    })
  }
  /**
   * 更新当前年月
   */
  updateCurrYearAndMonth(type) {
    let { days, curYear, curMonth } = this.getData('calendar')
    const { month: firstMonth } = days[0]
    const { month: lastMonth } = days[days.length - 1]
    const lastDayOfThisMonth = getDate.thisMonthDays(curYear, curMonth)
    const lastDayOfThisWeek = days[days.length - 1]
    const firstDayOfThisWeek = days[0]
    if (
      (lastDayOfThisWeek.day + 7 > lastDayOfThisMonth ||
        (curMonth === firstMonth && firstMonth !== lastMonth)) &&
      type === 'next'
    ) {
      curMonth = curMonth + 1
      if (curMonth > 12) {
        curYear = curYear + 1
        curMonth = 1
      }
    } else if (
      (+firstDayOfThisWeek.day <= 7 ||
        (curMonth === lastMonth && firstMonth !== lastMonth)) &&
      type === 'prev'
    ) {
      curMonth = curMonth - 1
      if (curMonth <= 0) {
        curYear = curYear - 1
        curMonth = 12
      }
    }
    return {
      Uyear: curYear,
      Umonth: curMonth
    }
  }
  /**
   * 计算周视图下当前这一周和当月的最后一天
   */
  calculateLastDay() {
    const { days = [], curYear, curMonth } = this.getData('calendar')
    const lastDayInThisWeek = days[days.length - 1].day
    const lastDayInThisMonth = getDate.thisMonthDays(curYear, curMonth)
    return { lastDayInThisWeek, lastDayInThisMonth }
  }
  /**
   * 计算周视图下当前这一周第一天
   */
  calculateFirstDay() {
    const { days } = this.getData('calendar')
    const firstDayInThisWeek = days[0].day
    return { firstDayInThisWeek }
  }
  /**
   * 当月第一周所有日期范围
   * @param {number} year
   * @param {number} month
   * @param {boolean} firstDayOfWeekIsMon 每周是否配置为以周一开始
   */
  firstWeekInMonth(year, month, firstDayOfWeekIsMon) {
    let firstDay = getDate.dayOfWeek(year, month, 1)
    if (firstDayOfWeekIsMon && firstDay === 0) {
      firstDay = 7
    }
    const [, end] = [0, 7 - firstDay]
    let days = this.getData('calendar.days') || []
    if (this.Component.weekMode) {
      days = Day(this.Component).buildDate(year, month)
    }
    const daysCut = days.slice(0, firstDayOfWeekIsMon ? end + 1 : end)
    return daysCut
  }
  /**
   * 当月最后一周所有日期范围
   * @param {number} year
   * @param {number} month
   * @param {boolean} firstDayOfWeekIsMon 每周是否配置为以周一开始
   */
  lastWeekInMonth(year, month, firstDayOfWeekIsMon) {
    const lastDay = getDate.thisMonthDays(year, month)
    const lastDayWeek = getDate.dayOfWeek(year, month, lastDay)
    const [start, end] = [lastDay - lastDayWeek, lastDay]
    let days = this.getData('calendar.days') || []
    if (this.Component.weekMode) {
      days = Day(this.Component).buildDate(year, month)
    }
    const daysCut = days.slice(firstDayOfWeekIsMon ? start : start - 1, end)
    return daysCut
  }
  __getDisableDateTimestamp(config) {
    const { date, type } = config.disableMode || {}
    let disableDateTimestamp
    if (date) {
      const t = date.split('-')
      if (t.length < 3) {
        logger.warn('配置 disableMode.date 格式错误')
        return {}
      }
      disableDateTimestamp = getDateTimeStamp({
        year: +t[0],
        month: +t[1],
        day: +t[2]
      })
    }
    return {
      disableDateTimestamp,
      disableType: type
    }
  }
  /**
   * 渲染日期之前初始化已选日期
   * @param {array} dates 当前日期数组
   */
  initSelectedDay(dates) {
    let datesCopy = [...dates]
    const { selectedDay = [] } = this.getData('calendar')
    const selectedDayStr = selectedDay.map(
      item => `${+item.year}-${+item.month}-${+item.day}`
    )
    const config = this.getCalendarConfig()
    const {
      disableDateTimestamp,
      disableType
    } = this.__getDisableDateTimestamp(config)
    datesCopy = datesCopy.map(item => {
      if (!item) return {}
      const dateTimestamp = getDateTimeStamp(item)
      let date = { ...item }
      if (
        selectedDayStr.includes(`${+date.year}-${+date.month}-${+date.day}`)
      ) {
        date.choosed = true
      } else {
        date.choosed = false
      }
      if (
        (disableType === 'after' && dateTimestamp > disableDateTimestamp) ||
        (disableType === 'before' && dateTimestamp < disableDateTimestamp)
      ) {
        date.disable = true
      }
      date = this.__setTodoWhenJump(date, config)
      if (config.showLunar) {
        date = this.__setSolarLunar(date)
      }
      if (config.highlightToday) {
        date = this.__highlightToday(date)
      }
      return date
    })
    return datesCopy
  }
  /**
   * 周视图下设置可选日期范围
   * @param {object} days 当前展示的日期
   */
  setEnableAreaOnWeekMode(dates = []) {
    let { enableAreaTimestamp = [], enableDaysTimestamp = [] } = this.getData(
      'calendar'
    )
    dates.forEach(item => {
      const timestamp = getDate
        .newDate(item.year, item.month, item.day)
        .getTime()

      let setDisable = false
      if (enableAreaTimestamp.length) {
        if (
          (+enableAreaTimestamp[0] > +timestamp ||
            +timestamp > +enableAreaTimestamp[1]) &&
          !enableDaysTimestamp.includes(+timestamp)
        ) {
          setDisable = true
        }
      } else if (
        enableDaysTimestamp.length &&
        !enableDaysTimestamp.includes(+timestamp)
      ) {
        setDisable = true
      }
      if (setDisable) {
        item.disable = true
        item.choosed = false
      }
      const config = CalendarConfig(this.Component).getCalendarConfig()
      const {
        disableDateTimestamp,
        disableType
      } = this.__getDisableDateTimestamp(config)
      if (
        (disableType === 'before' && timestamp < disableDateTimestamp) ||
        (disableType === 'after' && timestamp > disableDateTimestamp)
      ) {
        item.disable = true
      }
    })
  }
  updateYMWhenSwipeCalendarHasSelected(dates) {
    const hasSelectedDate = dates.filter(date => date.choosed)
    if (hasSelectedDate && hasSelectedDate.length) {
      const { year, month } = hasSelectedDate[0]
      return {
        year,
        month
      }
    }
    return {}
  }
  /**
   * 计算下一周的日期
   */
  calculateNextWeekDays() {
    let { lastDayInThisWeek, lastDayInThisMonth } = this.calculateLastDay()
    let { curYear, curMonth } = this.getData('calendar')
    let days = []
    if (lastDayInThisMonth - lastDayInThisWeek >= 7) {
      const { Uyear, Umonth } = this.updateCurrYearAndMonth('next')
      curYear = Uyear
      curMonth = Umonth
      for (let i = lastDayInThisWeek + 1; i <= lastDayInThisWeek + 7; i++) {
        days.push({
          year: curYear,
          month: curMonth,
          day: i,
          week: getDate.dayOfWeek(curYear, curMonth, i)
        })
      }
    } else {
      for (let i = lastDayInThisWeek + 1; i <= lastDayInThisMonth; i++) {
        days.push({
          year: curYear,
          month: curMonth,
          day: i,
          week: getDate.dayOfWeek(curYear, curMonth, i)
        })
      }
      const { Uyear, Umonth } = this.updateCurrYearAndMonth('next')
      curYear = Uyear
      curMonth = Umonth
      for (let i = 1; i <= 7 - (lastDayInThisMonth - lastDayInThisWeek); i++) {
        days.push({
          year: curYear,
          month: curMonth,
          day: i,
          week: getDate.dayOfWeek(curYear, curMonth, i)
        })
      }
    }
    days = this.initSelectedDay(days)
    const {
      year: updateYear,
      month: updateMonth
    } = this.updateYMWhenSwipeCalendarHasSelected(days)
    if (updateYear && updateMonth) {
      curYear = updateYear
      curMonth = updateMonth
    }
    this.setEnableAreaOnWeekMode(days)
    this.setData(
      {
        'calendar.curYear': curYear,
        'calendar.curMonth': curMonth,
        'calendar.days': days
      },
      () => {
        Day(this.Component).setDateStyle()
      }
    )
  }
  /**
   * 计算上一周的日期
   */
  calculatePrevWeekDays() {
    let { firstDayInThisWeek } = this.calculateFirstDay()
    let { curYear, curMonth } = this.getData('calendar')
    let days = []

    if (firstDayInThisWeek - 7 > 0) {
      const { Uyear, Umonth } = this.updateCurrYearAndMonth('prev')
      curYear = Uyear
      curMonth = Umonth
      for (let i = firstDayInThisWeek - 7; i < firstDayInThisWeek; i++) {
        days.push({
          year: curYear,
          month: curMonth,
          day: i,
          week: getDate.dayOfWeek(curYear, curMonth, i)
        })
      }
    } else {
      let temp = []
      for (let i = 1; i < firstDayInThisWeek; i++) {
        temp.push({
          year: curYear,
          month: curMonth,
          day: i,
          week: getDate.dayOfWeek(curYear, curMonth, i)
        })
      }
      const { Uyear, Umonth } = this.updateCurrYearAndMonth('prev')
      curYear = Uyear
      curMonth = Umonth
      const prevMonthDays = getDate.thisMonthDays(curYear, curMonth)
      for (
        let i = prevMonthDays - Math.abs(firstDayInThisWeek - 7);
        i <= prevMonthDays;
        i++
      ) {
        days.push({
          year: curYear,
          month: curMonth,
          day: i,
          week: getDate.dayOfWeek(curYear, curMonth, i)
        })
      }
      days = days.concat(temp)
    }
    days = this.initSelectedDay(days)
    const {
      year: updateYear,
      month: updateMonth
    } = this.updateYMWhenSwipeCalendarHasSelected(days)
    if (updateYear && updateMonth) {
      curYear = updateYear
      curMonth = updateMonth
    }
    this.setEnableAreaOnWeekMode(days)
    this.setData(
      {
        'calendar.curYear': curYear,
        'calendar.curMonth': curMonth,
        'calendar.days': days
      },
      () => {
        Day(this.Component).setDateStyle()
      }
    )
  }
  calculateDatesWhenJump(
    { year, month, day },
    { firstWeekDays, lastWeekDays },
    firstDayOfWeekIsMon
  ) {
    const inFirstWeek = this.__dateIsInWeek({ year, month, day }, firstWeekDays)
    const inLastWeek = this.__dateIsInWeek({ year, month, day }, lastWeekDays)
    let dates = []
    if (inFirstWeek) {
      dates = this.__calculateDatesWhenInFirstWeek(
        firstWeekDays,
        firstDayOfWeekIsMon
      )
    } else if (inLastWeek) {
      dates = this.__calculateDatesWhenInLastWeek(
        lastWeekDays,
        firstDayOfWeekIsMon
      )
    } else {
      dates = this.__calculateDates({ year, month, day }, firstDayOfWeekIsMon)
    }
    return dates
  }
  jump({ year, month, day }, disableSelected) {
    return new Promise(resolve => {
      if (!day) return
      const config = this.getCalendarConfig()
      const firstDayOfWeekIsMon = config.firstDayOfWeek === 'Mon'
      const firstWeekDays = this.firstWeekInMonth(
        year,
        month,
        firstDayOfWeekIsMon
      )
      let lastWeekDays = this.lastWeekInMonth(year, month, firstDayOfWeekIsMon)
      let dates = this.calculateDatesWhenJump(
        { year, month, day },
        {
          firstWeekDays,
          lastWeekDays
        },
        firstDayOfWeekIsMon
      )
      dates = dates.map(d => {
        let date = { ...d }
        if (
          +date.year === +year &&
          +date.month === +month &&
          +date.day === +day &&
          !disableSelected
        ) {
          date.choosed = true
        }
        date = this.__setTodoWhenJump(date, config)
        if (config.showLunar) {
          date = this.__setSolarLunar(date)
        }
        if (config.highlightToday) {
          date = this.__highlightToday(date)
        }
        return date
      })
      this.setEnableAreaOnWeekMode(dates)
      const tmpData = {
        'calendar.days': dates,
        'calendar.curYear': year,
        'calendar.curMonth': month,
        'calendar.empytGrids': [],
        'calendar.lastEmptyGrids': []
      }
      if (!disableSelected) {
        tmpData['calendar.selectedDay'] = dates.filter(item => item.choosed)
      }
      this.setData(tmpData, () => {
        Day(this.Component).setDateStyle()
        resolve({ year, month, date: day })
      })
    })
  }
  __setTodoWhenJump(dateInfo) {
    const date = { ...dateInfo }
    const { todoLabels = [], showLabelAlways } = this.getData('calendar')
    const todosStr = todoLabels.map(d => `${+d.year}-${+d.month}-${+d.day}`)
    const idx = todosStr.indexOf(`${+date.year}-${+date.month}-${+date.day}`)
    if (idx !== -1) {
      if (showLabelAlways) {
        date.showTodoLabel = true
      } else {
        date.showTodoLabel = !date.choosed
      }
      const todo = todoLabels[idx] || {}
      if (date.showTodoLabel && todo.todoText) date.todoText = todo.todoText
      if (todo.color) date.color = todo.color
    }
    return date
  }
  __setSolarLunar(dateInfo) {
    const date = { ...dateInfo }
    date.lunar = convertSolarLunar.solar2lunar(
      +date.year,
      +date.month,
      +date.day
    )
    return date
  }
  __highlightToday(dateInfo) {
    const date = { ...dateInfo }
    const today = getDate.todayDate()
    const isToday =
      +today.year === +date.year &&
      +today.month === +date.month &&
      +date.day === +today.date
    date.isToday = isToday
    return date
  }
  __calculateDatesWhenInFirstWeek(firstWeekDays) {
    const dates = [...firstWeekDays]
    if (dates.length < 7) {
      let { year, month } = dates[0]
      let len = 7 - dates.length
      let lastDate
      if (month > 1) {
        month -= 1
        lastDate = getDate.thisMonthDays(year, month)
      } else {
        month = 12
        year -= 1
        lastDate = getDate.thisMonthDays(year, month)
      }
      while (len) {
        dates.unshift({
          year,
          month,
          day: lastDate,
          week: getDate.dayOfWeek(year, month, lastDate)
        })
        lastDate -= 1
        len -= 1
      }
    }
    return dates
  }
  __calculateDatesWhenInLastWeek(lastWeekDays) {
    const dates = [...lastWeekDays]
    if (dates.length < 7) {
      let { year, month } = dates[0]
      let len = 7 - dates.length
      let firstDate = 1
      if (month > 11) {
        month = 1
        year += 1
      } else {
        month += 1
      }
      while (len) {
        dates.push({
          year,
          month,
          day: firstDate,
          week: getDate.dayOfWeek(year, month, firstDate)
        })
        firstDate += 1
        len -= 1
      }
    }
    return dates
  }
  __calculateDates({ year, month, day }, firstDayOfWeekIsMon) {
    const week = getDate.dayOfWeek(year, month, day)
    let range = [day - week, day + (6 - week)]
    if (firstDayOfWeekIsMon) {
      range = [day + 1 - week, day + (7 - week)]
    }
    const dates = Day(this.Component).buildDate(year, month)
    const weekDates = dates.slice(range[0] - 1, range[1])
    return weekDates
  }
  __dateIsInWeek(date, week) {
    return week.find(
      item =>
        +item.year === +date.year &&
        +item.month === +date.month &&
        +item.day === +date.day
    )
  }
  __tipsWhenCanNotSwtich() {
    logger.info(
      '当前月份未选中日期下切换为周视图，不能明确该展示哪一周的日期，故此情况不允许切换'
    )
  }
}

export default component => new WeekMode(component)
