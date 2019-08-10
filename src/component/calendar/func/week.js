import WxData from './wxData';
import Render from './render';
import CalendarConfig from './config';
import { GetDate, Logger } from './utils';

const getDate = new GetDate();
const logger = new Logger();

class WeekMode {
  constructor(component) {
    this.Component = component;
  }
  /**
   * 周、月视图切换
   * @param {string} view  视图 [week, month]
   * @param {object} day  {year: 2017, month: 11, day: 1}
   */
  switchWeek(view, day) {
    const wxData = WxData(this.Component);
    return new Promise((resolve, reject) => {
      if (CalendarConfig(this.Component).getCalendarConfig().multi)
        return logger.warn('多选模式不能切换周月视图');
      const { selectedDay = [], curYear, curMonth } = wxData.getData(
        'calendar'
      );
      if (!selectedDay.length) return;
      const currentDay = selectedDay[0];
      if (view === 'week') {
        if (this.Component.weekMode) return;
        this.Component.weekMode = true;
        wxData.setData({
          'calendar.weekMode': true
        });
        this.selectedDayWeekAllDays(day || currentDay).then(resolve);
      } else {
        this.Component.weekMode = false;
        wxData.setData({
          'calendar.weekMode': false
        });
        Render(this.Component)
          .renderCalendar(curYear, curMonth, day)
          .then(resolve);
      }
    });
  }
  /**
   * 更新当前年月
   */
  updateCurrYearAndMonth(type) {
    let { days, curYear, curMonth } = WxData(this.Component).getData(
      'calendar'
    );
    const { month: firstMonth } = days[0];
    const { month: lastMonth } = days[days.length - 1];
    const lastDayOfThisMonth = getDate.thisMonthDays(curYear, curMonth);
    const lastDayOfThisWeek = days[days.length - 1];
    const firstDayOfThisWeek = days[0];
    if (
      (lastDayOfThisWeek.day + 7 > lastDayOfThisMonth ||
        (curMonth === firstMonth && firstMonth !== lastMonth)) &&
      type === 'next'
    ) {
      curMonth = curMonth + 1;
      if (curMonth > 12) {
        curYear = curYear + 1;
        curMonth = 1;
      }
    } else if (
      (+firstDayOfThisWeek.day <= 7 ||
        (curMonth === lastMonth && firstMonth !== lastMonth)) &&
      type === 'prev'
    ) {
      curMonth = curMonth - 1;
      if (curMonth <= 0) {
        curYear = curYear - 1;
        curMonth = 12;
      }
    }
    return {
      Uyear: curYear,
      Umonth: curMonth
    };
  }
  /**
   * 计算周视图下当前这一周和当月的最后一天
   */
  calculateLastDay() {
    const { days, curYear, curMonth } = WxData(this.Component).getData(
      'calendar'
    );
    const lastDayInThisWeek = days[days.length - 1].day;
    const lastDayInThisMonth = getDate.thisMonthDays(curYear, curMonth);
    return { lastDayInThisWeek, lastDayInThisMonth };
  }
  /**
   * 计算周视图下当前这一周第一天
   */
  calculateFirstDay() {
    const { days } = WxData(this.Component).getData('calendar');
    const firstDayInThisWeek = days[0].day;
    return { firstDayInThisWeek };
  }
  /**
   * 当月第一周所有日期范围
   * @param {number} year
   * @param {number} month
   */
  firstWeekInMonth(year, month) {
    const firstDay = getDate.dayOfWeek(year, month, 1);
    const firstWeekDays = [1, 1 + (6 - firstDay)];
    const { days } = WxData(this.Component).getData('calendar');
    const daysCut = days.slice(firstWeekDays[0] - 1, firstWeekDays[1]);
    return daysCut;
  }
  /**
   * 当月最后一周所有日期范围
   * @param {number} year
   * @param {number} month
   */
  lastWeekInMonth(year, month) {
    const lastDay = getDate.thisMonthDays(year, month);
    const lastDayWeek = getDate.dayOfWeek(year, month, lastDay);
    const lastWeekDays = [lastDay - lastDayWeek, lastDay];
    const { days } = WxData(this.Component).getData('calendar');
    const daysCut = days.slice(lastWeekDays[0] - 1, lastWeekDays[1]);
    return daysCut;
  }
  /**
   * 渲染日期之前初始化已选日期
   * @param {array} days 当前日期数组
   */
  initSelectedDay(days) {
    const daysCopy = days.slice();
    const { selectedDay = [], todoLabels = [], showLabelAlways } = WxData(
      this.Component
    ).getData('calendar');
    const selectedDayStr = selectedDay.map(
      item => `${+item.year}-${+item.month}-${+item.day}`
    );
    const todoLabelsCol = todoLabels.map(
      d => `${+d.year}-${+d.month}-${+d.day}`
    );
    daysCopy.forEach(item => {
      if (
        selectedDayStr.includes(`${+item.year}-${+item.month}-${+item.day}`)
      ) {
        item.choosed = true;
      } else {
        item.choosed = false;
      }
      const idx = todoLabelsCol.indexOf(
        `${+item.year}-${+item.month}-${+item.day}`
      );
      if (idx !== -1) {
        if (showLabelAlways) {
          item.showTodoLabel = true;
        } else {
          item.showTodoLabel = !item.choosed;
        }
        const todoLabel = todoLabels[idx];
        if (item.showTodoLabel && todoLabel && todoLabel.todoText)
          item.todoText = todoLabel.todoText;
      }
    });
    return daysCopy;
  }
  /**
   * 周视图下设置可选日期范围
   * @param {object} days 当前展示的日期
   */
  setEnableAreaOnWeekMode(days) {
    let {
      todayTimestamp,
      enableAreaTimestamp = [],
      enableDaysTimestamp = []
    } = WxData(this.Component).getData('calendar');
    days.forEach(item => {
      const timestamp = getDate
        .newDate(item.year, item.month, item.day)
        .getTime();

      let setDisable = false;
      if (enableAreaTimestamp.length) {
        if (
          (+enableAreaTimestamp[0] > +timestamp ||
            +timestamp > +enableAreaTimestamp[1]) &&
          !enableDaysTimestamp.includes(+timestamp)
        ) {
          setDisable = true;
        }
      } else if (
        enableDaysTimestamp.length &&
        !enableDaysTimestamp.includes(+timestamp)
      ) {
        setDisable = true;
      }
      if (setDisable) {
        item.disable = true;
        item.choosed = false;
      }
      const { disablePastDay } =
        CalendarConfig(this.Component).getCalendarConfig() || {};
      if (disablePastDay && timestamp - todayTimestamp < 0 && !item.disable) {
        item.disable = true;
      }
    });
  }
  /**
   * 计算下一周的日期
   */
  calculateNextWeekDays() {
    let { lastDayInThisWeek, lastDayInThisMonth } = this.calculateLastDay();
    let { curYear, curMonth } = WxData(this.Component).getData('calendar');
    let days = [];
    if (lastDayInThisMonth - lastDayInThisWeek >= 7) {
      const { Uyear, Umonth } = this.updateCurrYearAndMonth('next');
      curYear = Uyear;
      curMonth = Umonth;
      for (let i = lastDayInThisWeek + 1; i <= lastDayInThisWeek + 7; i++) {
        days.push({
          year: curYear,
          month: curMonth,
          day: i,
          week: getDate.dayOfWeek(curYear, curMonth, i)
        });
      }
    } else {
      for (let i = lastDayInThisWeek + 1; i <= lastDayInThisMonth; i++) {
        days.push({
          year: curYear,
          month: curMonth,
          day: i,
          week: getDate.dayOfWeek(curYear, curMonth, i)
        });
      }
      const { Uyear, Umonth } = this.updateCurrYearAndMonth('next');
      curYear = Uyear;
      curMonth = Umonth;
      for (let i = 1; i <= 7 - (lastDayInThisMonth - lastDayInThisWeek); i++) {
        days.push({
          year: curYear,
          month: curMonth,
          day: i,
          week: getDate.dayOfWeek(curYear, curMonth, i)
        });
      }
    }
    days = this.initSelectedDay(days);
    this.setEnableAreaOnWeekMode(days);
    WxData(this.Component).setData({
      'calendar.curYear': curYear,
      'calendar.curMonth': curMonth,
      'calendar.days': days
    });
  }
  /**
   * 计算上一周的日期
   */
  calculatePrevWeekDays() {
    let { firstDayInThisWeek } = this.calculateFirstDay();
    let { curYear, curMonth } = WxData(this.Component).getData('calendar');
    let days = [];

    if (firstDayInThisWeek - 7 > 0) {
      const { Uyear, Umonth } = this.updateCurrYearAndMonth('prev');
      curYear = Uyear;
      curMonth = Umonth;
      for (let i = firstDayInThisWeek - 7; i < firstDayInThisWeek; i++) {
        days.push({
          year: curYear,
          month: curMonth,
          day: i,
          week: getDate.dayOfWeek(curYear, curMonth, i)
        });
      }
    } else {
      let temp = [];
      for (let i = 1; i < firstDayInThisWeek; i++) {
        temp.push({
          year: curYear,
          month: curMonth,
          day: i,
          week: getDate.dayOfWeek(curYear, curMonth, i)
        });
      }
      const { Uyear, Umonth } = this.updateCurrYearAndMonth('prev');
      curYear = Uyear;
      curMonth = Umonth;
      const prevMonthDays = getDate.thisMonthDays(curYear, curMonth);
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
        });
      }
      days = days.concat(temp);
    }
    days = this.initSelectedDay(days);
    this.setEnableAreaOnWeekMode(days);
    WxData(this.Component).setData({
      'calendar.curYear': curYear,
      'calendar.curMonth': curMonth,
      'calendar.days': days
    });
  }
  /**
   * 计算当前选中日期所在周，并重新渲染日历
   * @param {object} currentDay 当前选择日期
   */
  selectedDayWeekAllDays(currentDay) {
    return new Promise((resolve, reject) => {
      let { days, curYear, curMonth } = WxData(this.Component).getData(
        'calendar'
      );
      let { year, month, day } = currentDay;
      let lastWeekDays = this.lastWeekInMonth(year, month);
      const firstWeekDays = this.firstWeekInMonth(year, month);
      // 判断选中日期的月份是否与当前月份一致
      if (curYear !== year || curMonth !== month) day = 1;
      if (curYear !== year) year = curYear;
      if (curMonth !== month) month = curMonth;
      if (firstWeekDays.find(item => item.day === day)) {
        // 当前选择的日期为该月第一周
        let temp = [];
        const lastDayInThisMonth = getDate.thisMonthDays(year, month - 1);
        const { Uyear, Umonth } = this.updateCurrYearAndMonth('prev');
        curYear = Uyear;
        curMonth = Umonth;
        for (
          let i = lastDayInThisMonth - (7 - firstWeekDays.length) + 1;
          i <= lastDayInThisMonth;
          i++
        ) {
          temp.push({
            year: curYear,
            month: curMonth,
            day: i,
            week: getDate.dayOfWeek(curYear, curMonth, i)
          });
        }
        days = temp.concat(firstWeekDays);
      } else if (lastWeekDays.find(item => item.day === day)) {
        // 当前选择的日期为该月最后一周
        const temp = [];
        if (lastWeekDays && lastWeekDays.length < 7) {
          const { Uyear, Umonth } = this.updateCurrYearAndMonth('next');
          curYear = Uyear;
          curMonth = Umonth;
          for (let i = 1, len = 7 - lastWeekDays.length; i <= len; i++) {
            temp.push({
              year: curYear,
              month: curMonth,
              day: i,
              week: getDate.dayOfWeek(curYear, curMonth, i)
            });
          }
        }
        days = lastWeekDays.concat(temp);
      } else {
        const week = getDate.dayOfWeek(year, month, day);
        const range = [day - week, day + (6 - week)];
        days = days.slice(range[0] - 1, range[1]);
      }
      days = this.initSelectedDay(days);
      WxData(this.Component).setData(
        {
          'calendar.days': days,
          'calendar.empytGrids': [],
          'calendar.lastEmptyGrids': []
        },
        resolve
      );
    });
  }
}

export default component => new WeekMode(component);
