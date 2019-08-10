import Todo from './todo';
import WxData from './wxData';
import {
  GetDate,
  delRepeatedEnableDay,
  converEnableDaysToTimestamp
} from './utils';

const getDate = new GetDate();

class Calendar {
  constructor(component) {
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
    return new Promise((resolve, reject) => {
      // if (this.Component && this.Component.config) this.Component = this;
      this.calculateEmptyGrids(curYear, curMonth);
      this.calculateDays(curYear, curMonth, curDate);
      const wxData = WxData(this.Component);
      const { todoLabels } = wxData.getData('calendar') || {};
      if (
        todoLabels &&
        todoLabels instanceof Array &&
        todoLabels.find(item => +item.month === +curMonth)
      ) {
        // this.setTodoLabels();
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
    const wxData = WxData(this.Component);
    if (firstDayOfWeek > 0) {
      const len = prevMonthDays - firstDayOfWeek;
      const { onlyShowCurrentMonth } = config;
      for (let i = prevMonthDays; i > len; i--) {
        if (onlyShowCurrentMonth) {
          empytGrids.push('');
        } else {
          empytGrids.push(i);
        }
      }
      wxData.setData({
        'calendar.empytGrids': empytGrids.reverse()
      });
    } else {
      wxData.setData({
        'calendar.empytGrids': null
      });
    }
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
    const wxData = WxData(this.Component);
    if (+lastDayWeek !== 6) {
      let len = 7 - (lastDayWeek + 1);
      const { onlyShowCurrentMonth } = config;
      for (let i = 1; i <= len; i++) {
        if (onlyShowCurrentMonth) {
          lastEmptyGrids.push('');
        } else {
          lastEmptyGrids.push(i);
        }
      }
      wxData.setData({
        'calendar.lastEmptyGrids': lastEmptyGrids
      });
    } else {
      wxData.setData({
        'calendar.lastEmptyGrids': null
      });
    }
  }
  /**
   * 日历初始化将默认值写入 selectDay
   * @param {number} year
   * @param {number} month
   * @param {number} curDate
   */
  initSelectedDayWhenRender(year, month, curDate) {
    let selectedDay = [];
    const config = this.getCalendarConfig();
    if (config.noDefault) {
      selectedDay = [];
      config.noDefault = false;
    } else {
      const wxData = WxData(this.Component);
      const data = wxData.getData('calendar') || {};
      selectedDay = curDate
        ? [
            {
              year,
              month,
              day: curDate,
              choosed: true,
              week: getDate.dayOfWeek(year, month, curDate)
            }
          ]
        : data.selectedDay;
    }
    return selectedDay;
  }
  /**
   * 设置日历面板数据
   * @param {number} year 年份
   * @param {number} month  月份
   */
  calculateDays(year, month, curDate) {
    const wxData = WxData(this.Component);
    let days = [];
    const {
      todayTimestamp,
      disableDays = [],
      enableArea = [],
      enableDays = [],
      enableAreaTimestamp = []
    } = wxData.getData('calendar');
    const thisMonthDays = getDate.thisMonthDays(year, month);
    let expectEnableDaysTimestamp = converEnableDaysToTimestamp(enableDays);
    if (enableArea.length) {
      expectEnableDaysTimestamp = delRepeatedEnableDay(enableDays, enableArea);
    }
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push({
        year,
        month,
        day: i,
        choosed: false,
        week: getDate.dayOfWeek(year, month, i)
      });
    }
    const selectedDay = this.initSelectedDayWhenRender(year, month, curDate);
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
      const { disablePastDay } = this.getCalendarConfig();
      if (disablePastDay && timestamp - todayTimestamp < 0 && !item.disable) {
        item.disable = true;
        item.choosed = false;
      }
      let setDisable = false;
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
      if (setDisable) {
        item.disable = true;
        item.choosed = false;
      }
    });
    wxData.setData({
      'calendar.days': days,
      'calendar.selectedDay': selectedDay || []
    });
  }
}

export default component => new Calendar(component);
