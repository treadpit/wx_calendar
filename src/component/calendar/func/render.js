import Todo from './todo';
import WxData from './wxData';
import convertSolarLunar from './convertSolarLunar';
import {
  GetDate,
  delRepeatedEnableDay,
  converEnableDaysToTimestamp
} from './utils';

const getDate = new GetDate();

class Calendar extends WxData {
  constructor(component) {
    super(component);
    this.Component = component;
  }
  getCalendarConfig() {
    return this.Component.config;
  }
  /**
   * 渲染日历
   * @param {number} curYear
   * @param {number} curMonth
   * @param {number} curDate
   */
  renderCalendar(curYear, curMonth, curDate) {
    return new Promise(resolve => {
      this.calculateEmptyGrids(curYear, curMonth);
      this.calculateDays(curYear, curMonth, curDate);
      const { todoLabels } = this.getData('calendar') || {};
      if (
        todoLabels &&
        todoLabels instanceof Array &&
        todoLabels.find(item => +item.month === +curMonth)
      ) {
        Todo(this.Component).setTodoLabels();
      }

      if (!this.Component.firstRender) {
        resolve();
      }
    });
  }
  /**
   * 计算当前月份前后两月应占的格子
   * @param {number} year 年份
   * @param {number} month 月份
   */
  calculateEmptyGrids(year, month) {
    this.calculatePrevMonthGrids(year, month);
    this.calculateNextMonthGrids(year, month);
  }
  /**
   * 计算上月应占的格子
   * @param {number} year 年份
   * @param {number} month 月份
   */
  calculatePrevMonthGrids(year, month) {
    let empytGrids = [];
    const prevMonthDays = getDate.thisMonthDays(year, month - 1);
    let firstDayOfWeek = getDate.firstDayOfWeek(year, month);
    const config = this.getCalendarConfig() || {};
    if (config.firstDayOfWeek === 'Mon') {
      if (firstDayOfWeek === 0) {
        firstDayOfWeek = 6;
      } else {
        firstDayOfWeek -= 1;
      }
    }
    if (firstDayOfWeek > 0) {
      const len = prevMonthDays - firstDayOfWeek;
      const { onlyShowCurrentMonth } = config;
      const { showLunar } = this.getCalendarConfig();
      for (let i = prevMonthDays; i > len; i--) {
        if (onlyShowCurrentMonth) {
          empytGrids.push('');
        } else {
          empytGrids.push({
            day: i,
            lunar: showLunar
              ? convertSolarLunar.solar2lunar(year, month - 1, i)
              : null
          });
        }
      }
      this.setData({
        'calendar.empytGrids': empytGrids.reverse()
      });
    } else {
      this.setData({
        'calendar.empytGrids': null
      });
    }
  }
  /**
   * 计算下一月日期是否需要多展示的日期
   * 某些月份日期为5排，某些月份6排，统一为6排
   * @param {number} year
   * @param {number} month
   * @param {object} config
   */
  calculateExtraEmptyDate(year, month, config) {
    let extDate = 0;
    if (+month === 2) {
      extDate += 7;
      let firstDayofMonth = getDate.dayOfWeek(year, month, 1);
      if (config.firstDayOfWeek === 'Mon') {
        if (+firstDayofMonth === 1) extDate += 7;
      } else {
        if (+firstDayofMonth === 0) extDate += 7;
      }
    } else {
      let firstDayofMonth = getDate.dayOfWeek(year, month, 1);
      if (config.firstDayOfWeek === 'Mon') {
        if (firstDayofMonth !== 0 && firstDayofMonth < 6) {
          extDate += 7;
        }
      } else {
        if (firstDayofMonth < 6) {
          extDate += 7;
        }
      }
    }
    return extDate;
  }
  /**
   * 计算下月应占的格子
   * @param {number} year 年份
   * @param {number} month  月份
   */
  calculateNextMonthGrids(year, month) {
    let lastEmptyGrids = [];
    const thisMonthDays = getDate.thisMonthDays(year, month);
    let lastDayWeek = getDate.dayOfWeek(year, month, thisMonthDays);
    const config = this.getCalendarConfig() || {};
    if (config.firstDayOfWeek === 'Mon') {
      if (lastDayWeek === 0) {
        lastDayWeek = 6;
      } else {
        lastDayWeek -= 1;
      }
    }
    let len = 7 - (lastDayWeek + 1);
    const { onlyShowCurrentMonth, showLunar } = config;
    if (!onlyShowCurrentMonth) {
      len = len + this.calculateExtraEmptyDate(year, month, config);
    }
    for (let i = 1; i <= len; i++) {
      if (onlyShowCurrentMonth) {
        lastEmptyGrids.push('');
      } else {
        lastEmptyGrids.push({
          day: i,
          lunar: showLunar
            ? convertSolarLunar.solar2lunar(year, month + 1, i)
            : null
        });
      }
    }
    this.setData({
      'calendar.lastEmptyGrids': lastEmptyGrids
    });
  }
  /**
   * 日历初始化将默认值写入 selectDay
   * @param {number} year
   * @param {number} month
   * @param {number} curDate
   */
  setSelectedDay(year, month, curDate) {
    let selectedDay = [];
    const config = this.getCalendarConfig();
    if (config.noDefault) {
      selectedDay = [];
      config.noDefault = false;
    } else {
      const data = this.getData('calendar') || {};
      const { showLunar } = this.getCalendarConfig();
      selectedDay = curDate
        ? [
            {
              year,
              month,
              day: curDate,
              choosed: true,
              week: getDate.dayOfWeek(year, month, curDate),
              lunar: showLunar
                ? convertSolarLunar.solar2lunar(year, month, curDate)
                : null
            }
          ]
        : data.selectedDay;
    }
    return selectedDay;
  }
  /**
   *
   * @param {number} year
   * @param {number} month
   */
  buildDate(year, month) {
    const today = getDate.todayDate();
    const thisMonthDays = getDate.thisMonthDays(year, month);
    const dates = [];
    for (let i = 1; i <= thisMonthDays; i++) {
      const isToday =
        +today.year === +year && +today.month === +month && i === +today.date;
      const config = this.getCalendarConfig();
      dates.push({
        year,
        month,
        day: i,
        choosed: false,
        week: getDate.dayOfWeek(year, month, i),
        isToday: isToday && config.highlightToday
      });
    }
    return dates;
  }
  /**
   * 设置日历面板数据
   * @param {number} year 年份
   * @param {number} month  月份
   */
  calculateDays(year, month, curDate) {
    let days = [];
    const { todayTimestamp, disableDays = [] } = this.getData('calendar');
    days = this.buildDate(year, month);
    const selectedDay = this.setSelectedDay(year, month, curDate);
    const selectedDayCol = selectedDay.map(
      d => `${+d.year}-${+d.month}-${+d.day}`
    );
    const disableDaysCol = disableDays.map(
      d => `${+d.year}-${+d.month}-${+d.day}`
    );
    days.forEach(item => {
      const cur = `${+item.year}-${+item.month}-${+item.day}`;
      if (selectedDayCol.includes(cur)) item.choosed = true;
      if (disableDaysCol.includes(cur)) item.disable = true;
      const timestamp = getDate
        .newDate(item.year, item.month, item.day)
        .getTime();
      const {
        showLunar,
        disablePastDay,
        disableLaterDay
      } = this.getCalendarConfig();
      if (showLunar) {
        item.lunar = convertSolarLunar.solar2lunar(
          +item.year,
          +item.month,
          +item.day
        );
      }
      let disabelByConfig = false;
      if (disablePastDay) {
        disabelByConfig =
          disablePastDay && timestamp - todayTimestamp < 0 && !item.disable;
      } else if (disableLaterDay) {
        disabelByConfig =
          disableLaterDay && timestamp - todayTimestamp > 0 && !item.disable;
      }
      const isDisable = disabelByConfig || this.__isDisable(timestamp);
      if (isDisable) {
        item.disable = true;
        item.choosed = false;
      }
    });
    this.setData({
      'calendar.days': days,
      'calendar.selectedDay': selectedDay || []
    });
  }
  __isDisable(timestamp) {
    const {
      enableArea = [],
      enableDays = [],
      enableAreaTimestamp = []
    } = this.getData('calendar');
    let setDisable = false;
    let expectEnableDaysTimestamp = converEnableDaysToTimestamp(enableDays);
    if (enableArea.length) {
      expectEnableDaysTimestamp = delRepeatedEnableDay(enableDays, enableArea);
    }
    if (enableAreaTimestamp.length) {
      if (
        (+enableAreaTimestamp[0] > +timestamp ||
          +timestamp > +enableAreaTimestamp[1]) &&
        !expectEnableDaysTimestamp.includes(+timestamp)
      ) {
        setDisable = true;
      }
    } else if (
      expectEnableDaysTimestamp.length &&
      !expectEnableDaysTimestamp.includes(+timestamp)
    ) {
      setDisable = true;
    }
    return setDisable;
  }
}

export default component => new Calendar(component);
