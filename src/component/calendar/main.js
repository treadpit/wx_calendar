import {
  warn,
  tips,
  newDate,
  initialTasks,
  getDayOfWeek,
  getThisMonthDays,
  getFirstDayOfWeek,
  getCurrentPage,
  getComponent,
  uniqueArrayByDate,
  delRepeatedEnableDay,
  converEnableDaysToTimestamp,
  convertEnableAreaToTimestamp
} from './utils';

let Component = {};

/**
 * 全局赋值正在操作的组件实例，方便读/写各自的 data
 * @param {string} componentId 要操作的组件ID
 * @param {object} self 当前调用上下文
 */
function bindCurrentComponent(componentId, self) {
  if (componentId) {
    Component = getComponent(componentId);
  } else if (self && self.config) {
    Component = self;
  }
}

function getData(key, componentId) {
  bindCurrentComponent(componentId, this);
  if (!key) return Component.data;
  if (key.includes('.')) {
    let keys = key.split('.');
    let len = keys.length;
    let tmp = null;
    for (let i = 0; i < len; i++) {
      const v = keys[i];
      if (i === 0) {
        if (Component.data[v] !== undefined) {
          tmp = Component.data[v];
        }
      } else {
        if (tmp[v] !== undefined) {
          tmp = tmp[v];
        }
      }
    }
    return tmp;
  } else {
    return Component.data[key];
  }
}

function setData(data, callback = () => {}) {
  if (!data) return;
  if (typeof data === 'object') {
    Component.setData(data, callback);
  }
}

function getCalendarConfig() {
  return Component.config;
}

function setCalendarConfig(key, value) {
  Component.config[key] = value;
}

function getTodayDate() {
  const _date = new Date();
  const year = _date.getFullYear();
  const month = _date.getMonth() + 1;
  const date = _date.getDate();
  return {
    year,
    month,
    date
  };
}

function getTodayTimestamp() {
  const { year, month, date } = getTodayDate();
  const timestamp = newDate(year, month, date).getTime();
  return timestamp;
}

/**
 * 上滑
 * @param {object} e 事件对象
 * @returns {boolean} 布尔值
 */
export function isUpSlide(e) {
  const { startX, startY } = getData.call(this, 'gesture') || {};
  if (this.slideLock) {
    const t = e.touches[0];
    const deltaX = t.clientX - startX;
    const deltaY = t.clientY - startY;
    if (deltaY < -60 && deltaX < 20 && deltaX > -20) {
      this.slideLock = false;
      return true;
    } else {
      return false;
    }
  }
}
/**
 * 下滑
 * @param {object} e 事件对象
 * @returns {boolean} 布尔值
 */
export function isDownSlide(e) {
  const { startX, startY } = getData.call(this, 'gesture') || {};
  if (this.slideLock) {
    const t = e.touches[0];
    const deltaX = t.clientX - startX;
    const deltaY = t.clientY - startY;
    if (deltaY > 60 && deltaX < 20 && deltaX > -20) {
      this.slideLock = false;
      return true;
    } else {
      return false;
    }
  }
}
/**
 * 左滑
 * @param {object} e 事件对象
 * @returns {boolean} 布尔值
 */
export function isLeftSlide(e) {
  const { startX, startY } = getData.call(this, 'gesture') || {};
  if (this.slideLock) {
    const t = e.touches[0];
    const deltaX = t.clientX - startX;
    const deltaY = t.clientY - startY;
    if (deltaX < -60 && deltaY < 20 && deltaY > -20) {
      this.slideLock = false;
      return true;
    } else {
      return false;
    }
  }
}
/**
 * 右滑
 * @param {object} e 事件对象
 * @returns {boolean} 布尔值
 */
export function isRightSlide(e) {
  const { startX, startY } = getData.call(this, 'gesture') || {};
  if (this.slideLock) {
    const t = e.touches[0];
    const deltaX = t.clientX - startX;
    const deltaY = t.clientY - startY;

    if (deltaX > 60 && deltaY < 20 && deltaY > -20) {
      this.slideLock = false;
      return true;
    } else {
      return false;
    }
  }
}

const conf = {
  /**
   * 渲染日历
   * @param {number} curYear
   * @param {number} curMonth
   * @param {number} curDate
   */
  renderCalendar(curYear, curMonth, curDate) {
    if (this && this.config) Component = this;
    conf.calculateEmptyGrids(curYear, curMonth);
    conf.calculateDays(curYear, curMonth, curDate);
    const { todoLabels } = getData('calendar') || {};
    if (
      todoLabels &&
      todoLabels instanceof Array &&
      todoLabels.find(item => +item.month === +curMonth)
    ) {
      conf.setTodoLabels();
    }

    if (!Component.firstRender) {
      mountEventsOnPage(getCurrentPage());
      Component.triggerEvent('afterCalendarRender', Component);
      Component.firstRender = true;
      initialTasks.flag = 'finished';
      if (initialTasks.tasks.length) {
        initialTasks.tasks.shift()();
      }
    }
  },
  /**
   * 计算当前月份前后两月应占的格子
   * @param {number} year 年份
   * @param {number} month 月份
   */
  calculateEmptyGrids(year, month) {
    conf.calculatePrevMonthGrids(year, month);
    conf.calculateNextMonthGrids(year, month);
  },
  /**
   * 计算上月应占的格子
   * @param {number} year 年份
   * @param {number} month 月份
   */
  calculatePrevMonthGrids(year, month) {
    let empytGrids = [];
    const prevMonthDays = getThisMonthDays(year, month - 1);
    let firstDayOfWeek = getFirstDayOfWeek(year, month);
    const config = getCalendarConfig() || {};
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
      for (let i = prevMonthDays; i > len; i--) {
        if (onlyShowCurrentMonth) {
          empytGrids.push('');
        } else {
          empytGrids.push(i);
        }
      }
      setData({
        'calendar.empytGrids': empytGrids.reverse()
      });
    } else {
      setData({
        'calendar.empytGrids': null
      });
    }
  },
  /**
   * 计算下月应占的格子
   * @param {number} year 年份
   * @param {number} month  月份
   */
  calculateNextMonthGrids(year, month) {
    let lastEmptyGrids = [];
    const thisMonthDays = getThisMonthDays(year, month);
    let lastDayWeek = getDayOfWeek(year, month, thisMonthDays);
    const config = getCalendarConfig() || {};
    if (config.firstDayOfWeek === 'Mon') {
      if (lastDayWeek === 0) {
        lastDayWeek = 6;
      } else {
        lastDayWeek -= 1;
      }
    }
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
      setData({
        'calendar.lastEmptyGrids': lastEmptyGrids
      });
    } else {
      setData({
        'calendar.lastEmptyGrids': null
      });
    }
  },
  /**
   * 日历初始化将默认值写入 selectDay
   * @param {number} year
   * @param {number} month
   * @param {number} curDate
   */
  initSelectedDayWhenRender(year, month, curDate) {
    let selectedDay = [];
    const config = getCalendarConfig();
    if (config.noDefault) {
      selectedDay = [];
      config.noDefault = false;
    } else {
      const data = getData('calendar') || {};
      selectedDay = curDate
        ? [
            {
              year,
              month,
              day: curDate,
              choosed: true,
              week: getDayOfWeek(year, month, curDate)
            }
          ]
        : data.selectedDay;
    }
    return selectedDay;
  },
  /**
   * 设置日历面板数据
   * @param {number} year 年份
   * @param {number} month  月份
   */
  calculateDays(year, month, curDate) {
    let days = [];
    const {
      todayTimestamp,
      disableDays = [],
      enableArea = [],
      enableDays = [],
      enableAreaTimestamp = []
    } = getData('calendar');
    const thisMonthDays = getThisMonthDays(year, month);
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
        week: getDayOfWeek(year, month, i)
      });
    }
    const selectedDay = conf.initSelectedDayWhenRender(year, month, curDate);
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
      const timestamp = newDate(item.year, item.month, item.day).getTime();
      const { disablePastDay } = getCalendarConfig();
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
    setData({
      'calendar.days': days,
      'calendar.selectedDay': selectedDay || []
    });
  },
  /**
   * 当改变月份时触发
   * @param {object} param
   */
  whenChangeDate({ curYear, curMonth, newYear, newMonth }) {
    Component.triggerEvent('whenChangeMonth', {
      current: {
        year: curYear,
        month: curMonth
      },
      next: {
        year: newYear,
        month: newMonth
      }
    });
  },
  /**
   * 点击日期后触发事件
   * @param {object} currentSelected 当前选择的日期
   * @param {array} selectedDays  多选状态下选中的日期
   */
  afterTapDay(currentSelected, selectedDays) {
    const config = getCalendarConfig();
    const { multi } = config;
    if (!multi) {
      Component.triggerEvent('afterTapDay', currentSelected);
    } else {
      Component.triggerEvent('afterTapDay', {
        currentSelected,
        selectedDays
      });
    }
  },
  /**
   * 多选
   * @param {object} opts
   */
  whenMulitSelect(opts = {}) {
    if (this && this.config) Component = this;
    let { currentSelected, selectedDays = [] } = opts;
    const { days, idx } = opts;
    const day = days[idx];
    if (!day) return;
    day.choosed = !day.choosed;
    if (!day.choosed) {
      day.cancel = true; // 该次点击是否为取消日期操作
      currentSelected = day;
      selectedDays = selectedDays.filter(
        item =>
          `${item.year}-${item.month}-${item.day}` !==
          `${currentSelected.year}-${currentSelected.month}-${
            currentSelected.day
          }`
      );
      if (opts.todoLabels) {
        opts.todoLabels.forEach(item => {
          if (
            `${currentSelected.year}-${currentSelected.month}-${
              currentSelected.day
            }` === `${item.year}-${item.month}-${item.day}`
          ) {
            currentSelected.showTodoLabel = true;
          }
        });
      }
    } else {
      currentSelected = day;
      currentSelected.cancel = false;
      currentSelected.showTodoLabel = false;
      selectedDays.push(currentSelected);
    }
    const config = getCalendarConfig();
    if (config.takeoverTap) {
      return Component.triggerEvent('onTapDay', currentSelected);
    }
    setData({
      'calendar.days': days,
      'calendar.selectedDay': selectedDays
    });
    conf.afterTapDay(currentSelected, selectedDays);
  },
  /**
   * 单选
   * @param {object} opts
   */
  whenSingleSelect(opts = {}) {
    if (this && this.config) Component = this;
    let { currentSelected, selectedDays = [] } = opts;
    let shouldMarkerTodoDay = [];
    const { days = [], idx } = opts;
    const selectedDay = selectedDays[0] || {};
    const date = selectedDay.day;
    const preSelectedDate = (date && days[date - 1]) || {};
    const { month: dMonth, year: dYear } = days[0] || {};
    const { calendar = {} } = getData();
    const currentDay = days[idx];
    const config = getCalendarConfig();
    currentSelected = currentDay;
    if (config.takeoverTap) {
      return Component.triggerEvent('onTapDay', currentSelected);
    }
    conf.afterTapDay(currentSelected);
    if (!config.inverse && preSelectedDate.day === currentDay.day) return;
    if (Component.weekMode) {
      days.forEach((item, idx) => {
        if (item.day === date) days[idx].choosed = false;
      });
    }
    if (calendar.todoLabels) {
      // 过滤所有待办日期中当月有待办事项的日期
      shouldMarkerTodoDay = calendar.todoLabels.filter(
        item => +item.year === dYear && +item.month === dMonth
      );
    }
    conf.showTodoLabels(shouldMarkerTodoDay, days, selectedDays);
    if (!currentDay) return;
    const tmp = {
      'calendar.days': days
    };
    if (preSelectedDate.day !== currentDay.day) {
      preSelectedDate.choosed = false;
      currentDay.choosed = true;
      currentDay.showTodoLabel = false;
      tmp['calendar.selectedDay'] = [currentSelected];
    } else if (config.inverse) {
      currentDay.choosed = !currentDay.choosed;
      if (currentDay.choosed) currentDay.showTodoLabel = false;
      tmp['calendar.selectedDay'] = [];
    }
    setData(tmp);
  },
  /**
   * 周、月视图下单选标记代办事项
   * @param {array} todoDays
   * @param {array} days
   * @param {array} selectedDays
   */
  showTodoLabels(todoDays, days, selectedDays) {
    todoDays.forEach(item => {
      if (Component.weekMode) {
        days.forEach((_item, idx) => {
          if (+_item.day === +item.day) {
            const day = days[idx];
            day.hasTodo = true;
            day.todoText = item.todoText;
            if (
              selectedDays &&
              selectedDays.length &&
              +selectedDays[0].day === +item.day
            ) {
              day.showTodoLabel = true;
            }
          }
        });
      } else {
        const day = days[item.day - 1];
        if (!day) return;
        day.hasTodo = true;
        day.todoText = item.todoText;
        if (
          selectedDays &&
          selectedDays.length &&
          +selectedDays[0].day === +item.day
        ) {
          days[selectedDays[0].day - 1].showTodoLabel = true;
        }
      }
    });
  },
  /**
   * 设置代办事项标志
   * @param {object} options 代办事项配置
   */
  setTodoLabels(options) {
    if (options) this.todoConfig = options;
    const calendar = getData('calendar');
    if (!calendar || !calendar.days) {
      return warn('请等待日历初始化完成后再调用该方法');
    }
    const days = calendar.days.slice();
    const { curYear, curMonth } = calendar;
    const { days: todoDays = [], pos = 'bottom', dotColor = '', circle } =
      options || this.todoConfig;
    const { todoLabels = [], todoLabelPos, todoLabelColor } = calendar;
    const shouldMarkerTodoDay = todoDays.filter(
      item => +item.year === curYear && +item.month === curMonth
    );
    let currentMonthTodoLabels = todoLabels.filter(
      item => +item.year === curYear && +item.month === curMonth
    );
    shouldMarkerTodoDay.concat(currentMonthTodoLabels).forEach(item => {
      let target = {};
      if (Component.weekMode) {
        target = days.find(d => +d.day === +item.day);
      } else {
        target = days[item.day - 1];
      }
      if (target) {
        target.showTodoLabel = !target.choosed;
        if (target.showTodoLabel && item.todoText) {
          target.todoText = item.todoText;
        }
      }
    });
    const o = {
      'calendar.days': days,
      'calendar.todoLabels': uniqueArrayByDate(todoDays.concat(todoLabels))
    };
    if (!circle) {
      if (pos && pos !== todoLabelPos) o['calendar.todoLabelPos'] = pos;
      if (dotColor && dotColor !== todoLabelColor) {
        o['calendar.todoLabelColor'] = dotColor;
      }
    } else {
      o['calendar.todoLabelCircle'] = circle;
    }
    setData(o);
  },
  /**
   * 筛选待办事项
   * @param {array} todos 需要删除待办标记的日期
   */
  filterTodos(todos) {
    const { todoLabels } = getData('calendar');
    const deleteTodo = todos.map(
      item => `${item.year}-${item.month}-${item.day}`
    );
    return todoLabels.filter(
      item =>
        deleteTodo.indexOf(`${item.year}-${item.month}-${item.day}`) === -1
    );
  },
  /**
   *  删除指定日期的待办标识
   * @param {array} todos 需要删除待办标记的日期
   */
  deleteTodoLabels(todos) {
    if (!(todos instanceof Array) || !todos.length) return;
    const todoLabels = conf.filterTodos(todos);
    const { days, curYear, curMonth } = getData('calendar');
    const currentMonthTodoLabels = todoLabels.filter(
      item => curYear === +item.year && curMonth === +item.month
    );
    days.forEach(item => {
      item.showTodoLabel = false;
    });
    currentMonthTodoLabels.forEach(item => {
      days[item.day - 1].showTodoLabel = !days[item.day - 1].choosed;
    });
    setData({
      'calendar.days': days,
      'calendar.todoLabels': todoLabels
    });
  },
  /**
   * 清空所有日期的待办标识
   */
  clearTodoLabels() {
    const { days = [] } = getData('calendar');
    const _days = [].concat(days);
    _days.forEach(item => {
      item.showTodoLabel = false;
    });
    setData({
      'calendar.days': _days,
      'calendar.todoLabels': []
    });
  },
  /**
   * 跳转至今天
   */
  jumpToToday() {
    const { year: curYear, month: curMonth, date: curDate } = getTodayDate();
    const timestamp = getTodayTimestamp();
    setData({
      'calendar.curYear': curYear,
      'calendar.curMonth': curMonth,
      'calendar.selectedDay': [
        {
          year: curYear,
          day: curDate,
          month: curMonth,
          choosed: true
        }
      ],
      'calendar.todayTimestamp': timestamp
    });
    conf.renderCalendar(curYear, curMonth, curDate);
  },
  /**
   * 更新当前年月
   */
  updateCurrYearAndMonth(type) {
    let { days, curYear, curMonth } = getData('calendar');
    const { month: firstMonth } = days[0];
    const { month: lastMonth } = days[days.length - 1];
    const lastDayOfThisMonth = getThisMonthDays(curYear, curMonth);
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
  },
  /**
   * 计算周视图下当前这一周和当月的最后一天
   */
  calculateLastDay() {
    const { days, curYear, curMonth } = getData('calendar');
    const lastDayInThisWeek = days[days.length - 1].day;
    const lastDayInThisMonth = getThisMonthDays(curYear, curMonth);
    return { lastDayInThisWeek, lastDayInThisMonth };
  },
  /**
   * 计算周视图下当前这一周第一天
   */
  calculateFirstDay() {
    const { days } = getData('calendar');
    const firstDayInThisWeek = days[0].day;
    return { firstDayInThisWeek };
  },
  /**
   * 当月第一周所有日期范围
   * @param {number} year
   * @param {number} month
   */
  firstWeekInMonth(year, month) {
    const firstDay = getDayOfWeek(year, month, 1);
    const firstWeekDays = [1, 1 + (6 - firstDay)];
    const { days } = getData('calendar');
    const daysCut = days.slice(firstWeekDays[0] - 1, firstWeekDays[1]);
    return daysCut;
  },
  /**
   * 当月最后一周所有日期范围
   * @param {number} year
   * @param {number} month
   */
  lastWeekInMonth(year, month) {
    const lastDay = getThisMonthDays(year, month);
    const lastDayWeek = getDayOfWeek(year, month, lastDay);
    const lastWeekDays = [lastDay - lastDayWeek, lastDay];
    const { days } = getData('calendar');
    const daysCut = days.slice(lastWeekDays[0] - 1, lastWeekDays[1]);
    return daysCut;
  },
  /**
   * 渲染日期之前初始化已选日期
   * @param {array} days 当前日期数组
   */
  initSelectedDay(days) {
    const daysCopy = days.slice();
    const { selectedDay = [], todoLabels = [] } = getData('calendar');
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
        item.showTodoLabel = !item.choosed;
        const todoLabel = todoLabels[idx];
        if (item.showTodoLabel && todoLabel && todoLabel.todoText)
          item.todoText = todoLabel.todoText;
      }
    });
    return daysCopy;
  },
  /**
   * 周视图下设置可选日期范围
   * @param {object} days 当前展示的日期
   */
  setEnableAreaOnWeekMode(days) {
    let {
      todayTimestamp,
      enableAreaTimestamp = [],
      enableDaysTimestamp = []
    } = getData('calendar');
    days.forEach(item => {
      const timestamp = newDate(item.year, item.month, item.day).getTime();

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
      if (
        getCalendarConfig().disablePastDay &&
        timestamp - todayTimestamp < 0 &&
        !item.disable
      ) {
        item.disable = true;
      }
    });
  },
  /**
   * 计算下一周的日期
   */
  calculateNextWeekDays() {
    let { lastDayInThisWeek, lastDayInThisMonth } = conf.calculateLastDay.call(
      this
    );
    let { curYear, curMonth } = getData('calendar');
    let days = [];
    if (lastDayInThisMonth - lastDayInThisWeek >= 7) {
      const { Uyear, Umonth } = conf.updateCurrYearAndMonth('next');
      curYear = Uyear;
      curMonth = Umonth;
      for (let i = lastDayInThisWeek + 1; i <= lastDayInThisWeek + 7; i++) {
        days.push({
          year: curYear,
          month: curMonth,
          day: i,
          week: getDayOfWeek(curYear, curMonth, i)
        });
      }
    } else {
      for (let i = lastDayInThisWeek + 1; i <= lastDayInThisMonth; i++) {
        days.push({
          year: curYear,
          month: curMonth,
          day: i,
          week: getDayOfWeek(curYear, curMonth, i)
        });
      }
      const { Uyear, Umonth } = conf.updateCurrYearAndMonth('next');
      curYear = Uyear;
      curMonth = Umonth;
      for (let i = 1; i <= 7 - (lastDayInThisMonth - lastDayInThisWeek); i++) {
        days.push({
          year: curYear,
          month: curMonth,
          day: i,
          week: getDayOfWeek(curYear, curMonth, i)
        });
      }
    }
    days = conf.initSelectedDay(days);
    conf.setEnableAreaOnWeekMode(days);
    setData({
      'calendar.curYear': curYear,
      'calendar.curMonth': curMonth,
      'calendar.days': days
    });
  },
  /**
   * 计算上一周的日期
   */
  calculatePrevWeekDays() {
    let { firstDayInThisWeek } = conf.calculateFirstDay.call(this);
    let { curYear, curMonth } = getData('calendar');
    let days = [];

    if (firstDayInThisWeek - 7 > 0) {
      const { Uyear, Umonth } = conf.updateCurrYearAndMonth('prev');
      curYear = Uyear;
      curMonth = Umonth;
      for (let i = firstDayInThisWeek - 7; i < firstDayInThisWeek; i++) {
        days.push({
          year: curYear,
          month: curMonth,
          day: i,
          week: getDayOfWeek(curYear, curMonth, i)
        });
      }
    } else {
      let temp = [];
      for (let i = 1; i < firstDayInThisWeek; i++) {
        temp.push({
          year: curYear,
          month: curMonth,
          day: i,
          week: getDayOfWeek(curYear, curMonth, i)
        });
      }
      const { Uyear, Umonth } = conf.updateCurrYearAndMonth('prev');
      curYear = Uyear;
      curMonth = Umonth;
      const prevMonthDays = getThisMonthDays(curYear, curMonth);
      for (
        let i = prevMonthDays - Math.abs(firstDayInThisWeek - 7);
        i <= prevMonthDays;
        i++
      ) {
        days.push({
          year: curYear,
          month: curMonth,
          day: i,
          week: getDayOfWeek(curYear, curMonth, i)
        });
      }
      days = days.concat(temp);
    }
    days = conf.initSelectedDay(days);
    conf.setEnableAreaOnWeekMode(days);
    setData({
      'calendar.curYear': curYear,
      'calendar.curMonth': curMonth,
      'calendar.days': days
    });
  },
  /**
   * 计算当前选中日期所在周，并重新渲染日历
   * @param {object} currentDay 当前选择日期
   */
  selectedDayWeekAllDays(currentDay) {
    let { days, curYear, curMonth } = getData('calendar');
    let { year, month, day } = currentDay;
    let lastWeekDays = conf.lastWeekInMonth(year, month);
    const firstWeekDays = conf.firstWeekInMonth(year, month);
    // 判断选中日期的月份是否与当前月份一致
    if (curYear !== year || curMonth !== month) day = 1;
    if (curYear !== year) year = curYear;
    if (curMonth !== month) month = curMonth;
    if (firstWeekDays.find(item => item.day === day)) {
      // 当前选择的日期为该月第一周
      let temp = [];
      const lastDayInThisMonth = getThisMonthDays(year, month - 1);
      const { Uyear, Umonth } = conf.updateCurrYearAndMonth('prev');
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
          week: getDayOfWeek(curYear, curMonth, i)
        });
      }
      days = temp.concat(firstWeekDays);
    } else if (lastWeekDays.find(item => item.day === day)) {
      // 当前选择的日期为该月最后一周
      const temp = [];
      if (lastWeekDays && lastWeekDays.length < 7) {
        const { Uyear, Umonth } = conf.updateCurrYearAndMonth.call(
          this,
          'next'
        );
        curYear = Uyear;
        curMonth = Umonth;
        for (let i = 1, len = 7 - lastWeekDays.length; i <= len; i++) {
          temp.push({
            year: curYear,
            month: curMonth,
            day: i,
            week: getDayOfWeek(curYear, curMonth, i)
          });
        }
      }
      days = lastWeekDays.concat(temp);
    } else {
      const week = getDayOfWeek(year, month, day);
      const range = [day - week, day + (6 - week)];
      days = days.slice(range[0] - 1, range[1]);
    }
    days = conf.initSelectedDay(days);
    setData({
      'calendar.days': days,
      'calendar.empytGrids': [],
      'calendar.lastEmptyGrids': []
    });
  },
  /**
   * 周、月视图切换
   * @param {string} view  视图 [week, month]
   * @param {object} day  {year: 2017, month: 11, day: 1}
   */
  switchWeek(view, day) {
    if (getCalendarConfig().multi) return warn('多选模式不能切换周月视图');
    const { selectedDay = [], curYear, curMonth } = getData('calendar');
    if (!selectedDay.length) return;
    const currentDay = selectedDay[0];
    if (view === 'week') {
      if (Component.weekMode) return;
      Component.weekMode = true;
      setData({
        'calendar.weekMode': true
      });
      conf.selectedDayWeekAllDays(day || currentDay);
    } else {
      Component.weekMode = false;
      setData({
        'calendar.weekMode': false
      });
      conf.renderCalendar(curYear, curMonth, day);
    }
  },
  /**
   * 禁用指定日期
   * @param {array} days  禁用
   */
  disableDays(data) {
    const { disableDays = [], days } = getData('calendar');
    if (Object.prototype.toString.call(data) !== '[object Array]') {
      return warn('disableDays 参数为数组');
    }
    let _disableDays = [];
    if (data.length) {
      _disableDays = uniqueArrayByDate(data.concat(disableDays));
      const disableDaysCol = _disableDays.map(
        d => `${d.year}-${d.month}-${d.day}`
      );
      days.forEach(item => {
        const cur = `${item.year}-${item.month}-${item.day}`;
        if (disableDaysCol.includes(cur)) item.disable = true;
      });
    } else {
      days.forEach(item => {
        item.disable = false;
      });
    }
    setData({
      'calendar.days': days,
      'calendar.disableDays': _disableDays
    });
  }
};

export const whenChangeDate = conf.whenChangeDate;
export const renderCalendar = conf.renderCalendar;
export const whenSingleSelect = conf.whenSingleSelect;
export const whenMulitSelect = conf.whenMulitSelect;
export const calculatePrevWeekDays = conf.calculatePrevWeekDays;
export const calculateNextWeekDays = conf.calculateNextWeekDays;

/**
 * 获取已选择的日期
 */
export function getSelectedDay(componentId) {
  bindCurrentComponent(componentId, this);
  return getData('calendar.selectedDay');
}

/**
 * 取消所有选中日期
 * @param {string} componentId
 */
export function cancelAllSelectedDay(componentId) {
  bindCurrentComponent(componentId, this);
  const days = [...getData('calendar.days')];
  days.map(item => {
    item.choosed = false;
  });
  setData({
    'calendar.days': days,
    'calendar.selectedDay': []
  });
}

/**
 * 跳转至指定日期
 */
export function jump(year, month, day, componentId) {
  bindCurrentComponent(componentId, this);
  const { selectedDay = [] } = getData('calendar');
  const { year: y, month: m, day: d } = selectedDay[0] || {};
  if (+y === +year && +m === +month && +d === +day) {
    return;
  }
  if (year && month) {
    if (typeof +year !== 'number' || typeof +month !== 'number') {
      return warn('jump 函数年月日参数必须为数字');
    }
    const timestamp = getTodayTimestamp();
    let tmp = {
      'calendar.curYear': year,
      'calendar.curMonth': month,
      'calendar.todayTimestamp': timestamp
    };
    setData(tmp, () => {
      if (typeof +day === 'number') {
        return conf.renderCalendar(year, month, day);
      }
      conf.renderCalendar(year, month);
    });
  } else {
    conf.jumpToToday();
  }
}
/**
 * 设置代办事项日期标记
 * @param {object} todos  待办事项配置
 * @param {string} [todos.pos] 标记显示位置，默认值'bottom' ['bottom', 'top']
 * @param {string} [todos.dotColor] 标记点颜色，backgroundColor 支持的值都行
 * @param {object[]} todos.days 需要标记的所有日期，如：[{year: 2015, month: 5, day: 12}]，其中年月日字段必填
 */
export function setTodoLabels(todos, componentId) {
  bindCurrentComponent(componentId, this);
  conf.setTodoLabels(todos);
}
/**
 * 删除指定日期待办标记
 * @param {array} todos 需要删除的待办日期数组
 */
export function deleteTodoLabels(todos, componentId) {
  bindCurrentComponent(componentId, this);
  conf.deleteTodoLabels(todos);
}
/**
 * 清空所有待办标记
 */
export function clearTodoLabels(componentId) {
  bindCurrentComponent(componentId, this);
  conf.clearTodoLabels();
}
/**
 * 获取所有 TODO 日期
 */
export function getTodoLabels(componentId) {
  bindCurrentComponent(componentId, this);
  return getData('calendar.todoLabels');
}
/**
 * 切换周月视图
 * args[0] view 视图模式[week, month]
 * 剩余两参数为切换到某一天day(如: {year: 2019, month: 1, day: 3})或者 componentId
 */
export function switchView(...args) {
  const view = args[0];
  if (!args[1]) return conf.switchWeek(view);
  if (typeof args[1] === 'string') {
    bindCurrentComponent(args[1], this);
    conf.switchWeek(view, args[2]);
  } else if (typeof args[1] === 'object') {
    if (typeof args[2] === 'string') {
      bindCurrentComponent(args[1], this);
    }
    conf.switchWeek(view, args[1]);
  }
}
/**
 * 禁用指定日期
 * @param {array} days 日期
 * @param {number} [days.year]
 * @param {number} [days.month]
 * @param {number} [days.day]
 */
export function disableDay(days = [], componentId) {
  bindCurrentComponent(componentId, this);
  conf.disableDays(days);
}

/**
 * 指定可选日期范围
 * @param {array} area 日期访问数组
 */
export function enableArea(area = [], componentId) {
  bindCurrentComponent(componentId, this);
  const { enableDays = [] } = getData('calendar');
  let expectEnableDaysTimestamp = [];
  if (enableDays.length) {
    expectEnableDaysTimestamp = delRepeatedEnableDay(enableDays, area);
  }
  if (area.length === 2) {
    const {
      start,
      end,
      startTimestamp,
      endTimestamp
    } = convertEnableAreaToTimestamp(area);
    const startMonthDays = getThisMonthDays(start[0], start[1]);
    const endMonthDays = getThisMonthDays(end[0], end[1]);
    if (start[2] > startMonthDays || start[2] < 1) {
      return warn('enableArea() 开始日期错误，指定日期不在当前月份天数范围内');
    }
    if (start[1] > 12 || start[1] < 1) {
      return warn('enableArea() 开始日期错误，月份超出1-12月份');
    }
    if (end[2] > endMonthDays || end[2] < 1) {
      return warn('enableArea() 截止日期错误，指定日期不在当前月份天数范围内');
    }
    if (end[1] > 12 || end[1] < 1) {
      return warn('enableArea() 截止日期错误，月份超出1-12月份');
    }
    if (startTimestamp > endTimestamp) {
      warn('enableArea()参数最小日期大于了最大日期');
    } else {
      let { days = [], selectedDay = [] } = getData('calendar');
      const daysCopy = days.slice();
      daysCopy.forEach(item => {
        const timestamp = newDate(item.year, item.month, item.day).getTime();
        if (
          (+startTimestamp > +timestamp || +timestamp > +endTimestamp) &&
          !expectEnableDaysTimestamp.includes(+timestamp)
        ) {
          item.disable = true;
          if (item.choosed) {
            item.choosed = false;
            selectedDay = selectedDay.filter(
              d =>
                `${item.year}-${item.month}-${item.day}` !==
                `${d.year}-${d.month}-${d.day}`
            );
          }
        } else if (item.disable) {
          item.disable = false;
        }
      });
      setData({
        'calendar.days': daysCopy,
        'calendar.selectedDay': selectedDay,
        'calendar.enableArea': area,
        'calendar.enableAreaTimestamp': [startTimestamp, endTimestamp]
      });
    }
  } else {
    warn('enableArea()参数需为时间范围数组，形如：["2018-8-4" , "2018-8-24"]');
  }
}
/**
 * 指定特定日期可选
 * @param {array} days 指定日期数组
 */
export function enableDays(days = [], componentId) {
  bindCurrentComponent(componentId, this);
  const { enableArea = [], enableAreaTimestamp = [] } = getData('calendar');
  let expectEnableDaysTimestamp = [];
  if (enableArea.length) {
    expectEnableDaysTimestamp = delRepeatedEnableDay(days, enableArea);
  } else {
    expectEnableDaysTimestamp = converEnableDaysToTimestamp(days);
  }
  let { days: allDays = [], selectedDay = [] } = getData('calendar');
  const daysCopy = allDays.slice();
  daysCopy.forEach(item => {
    const timestamp = newDate(item.year, item.month, item.day).getTime();
    let setDisable = false;
    if (enableAreaTimestamp.length) {
      if (
        (+enableAreaTimestamp[0] > +timestamp ||
          +timestamp > +enableAreaTimestamp[1]) &&
        !expectEnableDaysTimestamp.includes(+timestamp)
      ) {
        setDisable = true;
      }
    } else if (!expectEnableDaysTimestamp.includes(+timestamp)) {
      setDisable = true;
    }
    if (setDisable) {
      item.disable = true;
      if (item.choosed) {
        item.choosed = false;
        selectedDay = selectedDay.filter(
          d =>
            `${item.year}-${item.month}-${item.day}` !==
            `${d.year}-${d.month}-${d.day}`
        );
      }
    } else {
      item.disable = false;
    }
  });
  setData({
    'calendar.days': daysCopy,
    'calendar.selectedDay': selectedDay,
    'calendar.enableDays': days,
    'calendar.enableDaysTimestamp': expectEnableDaysTimestamp
  });
}

export function setSelectedDays(selected, componentId) {
  bindCurrentComponent(componentId, this);
  const config = getCalendarConfig();
  if (!config.multi) {
    return warn('单选模式下不能设置多日期选中，请配置 multi');
  }
  const { selectedDay, days } = getData('calendar');
  let newSelectedDay = [];
  if (!selected) {
    days.map(item => {
      item.choosed = true;
      item.showTodoLabel = false;
    });
    newSelectedDay = days;
  } else if (selected && selected.length) {
    if (selectedDay && selectedDay.length) {
      newSelectedDay = uniqueArrayByDate(selectedDay.concat(selected));
    } else {
      newSelectedDay = selected;
    }
    const { year: curYear, month: curMonth } = days[0];
    const currentSelectedDays = [];
    newSelectedDay.forEach(item => {
      if (+item.year === +curYear && +item.month === +curMonth) {
        currentSelectedDays.push(`${item.year}-${item.month}-${item.day}`);
      }
    });
    days.map(item => {
      if (
        currentSelectedDays.includes(`${item.year}-${item.month}-${item.day}`)
      ) {
        item.choosed = true;
        item.showTodoLabel = false;
      }
    });
  }
  setCalendarConfig('multi', true);
  setData({
    'calendar.days': days,
    'calendar.selectedDay': newSelectedDay
  });
}

/**
 * 绑定日历事件至当前页面实例
 * @param {object} page 当前页面实例
 */
function mountEventsOnPage(page) {
  page.calendar = {
    jump,
    switchView,
    disableDay,
    enableArea,
    enableDays,
    getSelectedDay,
    cancelAllSelectedDay,
    setTodoLabels,
    deleteTodoLabels,
    clearTodoLabels,
    setSelectedDays
  };
}

function init(component, config) {
  initialTasks.flag = 'process';
  tips(
    '使用中若遇问题请反馈至 https://github.com/treadpit/wx_calendar/issues ✍️'
  );
  let weeksCh = ['日', '一', '二', '三', '四', '五', '六'];
  if (config.firstDayOfWeek === 'Mon') {
    weeksCh = ['一', '二', '三', '四', '五', '六', '日'];
  }
  Component = component;
  Component.config = config;
  setData({
    'calendar.weeksCh': weeksCh
  });
  if (config.defaultDay && typeof config.defaultDay === 'string') {
    const day = config.defaultDay.split('-');
    if (day.length < 3) {
      return warn('配置 jumpTo 格式应为: 2018-4-2 或 2018-04-02');
    }
    jump(+day[0], +day[1], +day[2]);
  } else {
    jump();
  }
}

export default (component, config = {}) => {
  if (initialTasks.flag === 'process') {
    return initialTasks.tasks.push(function() {
      init(component, config);
    });
  }
  init(component, config);
};
