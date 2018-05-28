/**
* 上滑
* @param {object} e 事件对象
* @returns {boolean} 布尔值
*/
export function isUpSlide(e) {
  const { startX, startY } = this.data.gesture;
  if (this.slideLock) {
    const t = e.touches[ 0 ];
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
  const { startX, startY } = this.data.gesture;
  if (this.slideLock) {
    const t = e.touches[ 0 ];
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
  const { startX, startY } = this.data.gesture;
  if (this.slideLock) {
    const t = e.touches[ 0 ];
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
  const { startX, startY } = this.data.gesture;
  if (this.slideLock) {
    const t = e.touches[ 0 ];
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
/**
 *  todo 数组去重
 * @param {array} array todo 数组
 */
function uniqueTodoLabels(array = []) {
  let uniqueObject = {};
  let uniqueArray = [];
  array.forEach(item => {
    uniqueObject[ `${item.year}-${item.month}-${item.day}` ] = item;
  });
  for (let i in uniqueObject) {
    uniqueArray.push(uniqueObject[ i ]);
  }
  return uniqueArray;
}

const conf = {
  /**
	 * 计算指定月份共多少天
	 * @param {number} year 年份
	 * @param {number} month  月份
	 */
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  /**
	 * 计算指定月份第一天星期几
	 * @param {number} year 年份
	 * @param {number} month  月份
	 */
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  /**
	 * 计算当前月份前后两月应占的格子
	 * @param {number} year 年份
	 * @param {number} month  月份
	 */
  calculateEmptyGrids(year, month) {
    conf.calculatePrevMonthGrids.call(this, year, month);
    conf.calculateNextMonthGrids.call(this, year, month);
  },
  /**
	 * 计算上月应占的格子
	 * @param {number} year 年份
	 * @param {number} month  月份
	 */
  calculatePrevMonthGrids(year, month) {
    const prevMonthDays = conf.getThisMonthDays(year, month - 1);
    const firstDayOfWeek = conf.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      const len = prevMonthDays - firstDayOfWeek;
      for (let i = prevMonthDays; i > len; i--) {
        empytGrids.push(i);
      }
      this.setData({
        'calendar.empytGrids': empytGrids.reverse(),
      });
    } else {
      this.setData({
        'calendar.empytGrids': null,
      });
    }
  },
  /**
	 * 计算下月应占的格子
	 * @param {number} year 年份
	 * @param {number} month  月份
	 */
  calculateNextMonthGrids(year, month) {
    const thisMonthDays = conf.getThisMonthDays(year, month);
    const lastDayWeek = new Date(`${year}-${month}-${thisMonthDays}`).getDay();
    let lastEmptyGrids = [];
    if (+lastDayWeek !== 6) {
      const len = 7 - (lastDayWeek + 1);
      for (let i = 1; i <= len; i++) {
        lastEmptyGrids.push(i);
      }
      this.setData({
        'calendar.lastEmptyGrids': lastEmptyGrids,
      });
    } else {
      this.setData({
        'calendar.lastEmptyGrids': null,
      });
    }
  },
  /**
	 * 设置日历面板数据
	 * @param {number} year 年份
	 * @param {number} month  月份
	 */
  calculateDays(year, month, curDate) {
    let days = [];
    const { todayTimestamp } = this.data.calendar;
    const thisMonthDays = conf.getThisMonthDays(year, month);
    const selectedDay = this.data.calendar.selectedDay || [ {
      day: curDate,
      choosed: true,
      year,
      month,
    } ];
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push({
        day: i,
        choosed: false,
        year,
        month,
      });
    }
    days.map(item => {
      selectedDay.forEach(d => {
        if (item.day === d.day && item.year === d.year && item.month === d.month) {
          item.choosed = true;
        }
      });
      const timestamp = new Date(`${item.year}-${item.month}-${item.day}`).getTime();
      if (this.config.disablePastDay && (timestamp - todayTimestamp < 0)) {
        item.disable = true;
      }
    });
    const tmp = {
      'calendar.days': days,
    };
    if (curDate) {
      tmp[ 'calendar.selectedDay' ] = selectedDay;
    }
    this.setData(tmp);
  },
  /**
   * 选择上一月
   */
  choosePrevMonth() {
    const { curYear, curMonth } = this.data.calendar;
    let newMonth = curMonth - 1;
    let newYear = curYear;
    if (newMonth < 1) {
      newYear = curYear - 1;
      newMonth = 12;
    }
    conf.renderCalendar.call(this, newYear, newMonth);
    this.setData({
      'calendar.curYear': newYear,
      'calendar.curMonth': newMonth,
    });
  },
  /**
   * 选择下一月
   */
  chooseNextMonth() {
    const curYear = this.data.calendar.curYear;
    const curMonth = this.data.calendar.curMonth;
    let newMonth = curMonth + 1;
    let newYear = curYear;
    if (newMonth > 12) {
      newYear = curYear + 1;
      newMonth = 1;
    }
    conf.renderCalendar.call(this, newYear, newMonth);
    this.setData({
      'calendar.curYear': newYear,
      'calendar.curMonth': newMonth
    });
  },
  /**
	 * 选择具体日期
	 * @param {!object} e  事件对象
	 */
  tapDayItem(e) {
    const { idx, disable } = e.currentTarget.dataset;
    if (disable) return;
    const config = this.config;
    const { multi, afterTapDay, onTapDay } = config;
    const days = this.data.calendar.days.slice();
    let selected;
    let selectedDays = this.data.calendar.selectedDay || [];
    if (multi) {
      days[ idx ].choosed = !days[ idx ].choosed;
      if (!days[ idx ].choosed) {
        days[ idx ].cancel = true; // 点击事件是否是取消日期选择
        selected = days[ idx ];
        selectedDays = selectedDays.filter(item => item.day !== days[ idx ].day);
      } else {
        selected = days[ idx ];
        selectedDays.push(selected);
      }
      if (onTapDay && typeof onTapDay === 'function') {
        config.onTapDay(selected, e);
        return;
      };
      this.setData({
        'calendar.days': days,
        'calendar.selectedDay': selectedDays,
      });
    } else {
      days[ selectedDays[ 0 ].day - 1 ].choosed = false;
      const { calendar = {} } = this.data;
      const { year, month } = days[ 0 ];
      let shouldMarkerTodoDay = [];
      if (calendar && calendar.todoLabels) {
        shouldMarkerTodoDay = calendar.todoLabels.filter(item => {
          return item.year === year && item.month === month;
        });
      }
      shouldMarkerTodoDay.forEach(item => {
        days[ item.day - 1 ].hasTodo = true;
        if (selectedDays[ 0 ].day === item.day) {
          days[ selectedDays[ 0 ].day - 1 ].showTodoLabel = true;
        }
      });

      if (days[ idx ].showTodoLabel) days[ idx ].showTodoLabel = false;
      days[ idx ].choosed = true;
      selected = days[ idx ];
      if (onTapDay && typeof onTapDay === 'function') {
        config.onTapDay(selected, e);
        return;
      };
      this.setData({
        'calendar.days': days,
        'calendar.selectedDay': [ selected ],
      });
    }
    if (afterTapDay && typeof afterTapDay === 'function') {
      if (!multi) {
        config.afterTapDay(selected);
      } else {
        config.afterTapDay(selected, selectedDays);
      }
    };
  },
  /**
   * 设置代办事项标志
   * @param {object} options 代办事项配置
   */
  setTodoLabels(options = {}) {
    const { calendar } = this.data;
    if (!calendar || !calendar.days) {
      console.error('请等待日历初始化完成后再调用该方法');
      return;
    }
    const days = calendar.days.slice();
    const { year, month } = days[ 0 ];
    const { days: todoDays = [], pos = 'bottom', dotColor = '' } = options;
    const { todoLabels = [], todoLabelPos, todoLabelColor } = calendar;
    const shouldMarkerTodoDay = todoDays.filter(item => +item.year === year && +item.month === month);
    if ((!shouldMarkerTodoDay || !shouldMarkerTodoDay.length) && !todoLabels.length) return;
    let temp = [];
    let currentMonthTodoLabels = todoLabels.filter(item => +item.year === year && +item.month === month);
    shouldMarkerTodoDay.concat(currentMonthTodoLabels).forEach((item) => {
      temp.push(days[ item.day - 1 ]);
      days[ item.day - 1 ].showTodoLabel = !days[ item.day - 1 ].choosed;
    });
    const o = {
      'calendar.days': days,
      'calendar.todoLabels': uniqueTodoLabels(todoDays.concat(todoLabels)),
    };
    if (pos && pos !== todoLabelPos) o[ 'calendar.todoLabelPos' ] = pos;
    if (dotColor && dotColor !== todoLabelColor) o[ 'calendar.todoLabelColor' ] = dotColor;
    this.setData(o);
  },
  /**
   * 筛选待办事项
   * @param {array} todos 需要删除待办标记的日期
   */
  filterTodos(todos) {
    const { todoLabels } = this.data.calendar;
    const deleteTodo = todos.map(item => `${item.year}-${item.month}-${item.day}`);
    return todoLabels.filter(item => deleteTodo.indexOf(`${item.year}-${item.month}-${item.day}`) === -1);
  },
  /**
   *  删除指定日期的待办标识
   * @param {array} todos  需要删除待办标记的日期
   */
  deleteTodoLabels(todos) {
    if (!(todos instanceof Array)) return;
    if (!todos.length) return;
    const todoLabels = conf.filterTodos.call(this, todos);
    const { days, curYear, curMonth } = this.data.calendar;
    days.map(item => {
      item.showTodoLabel = false;
    });
    const currentMonthTodoLabels = todoLabels.filter(item => curYear === item.year && curMonth === item.month);
    currentMonthTodoLabels.forEach(item => {
      days[ item.day - 1 ].showTodoLabel = !days[ item.day - 1 ].choosed;
    });
    this.setData({
      'calendar.days': days,
      'calendar.todoLabels': todoLabels,
    });
  },
  /**
   * 清空所有日期的待办标识
   */
  clearTodoLabels() {
    const { days } = this.data.calendar;
    days.map(item => {
      item.showTodoLabel = false;
    });
    this.setData({
      'calendar.days': days,
      'calendar.todoLabels': [],
    });
  },
  /**
	 * 跳转至今天
	 */
  jumpToToday() {
    const date = new Date();
    const curYear = date.getFullYear();
    const curMonth = date.getMonth() + 1;
    const curDate = date.getDate();
    const timestamp = new Date(`${curYear}-${curMonth}-${curDate}`).getTime();
    this.setData({
      'calendar.curYear': curYear,
      'calendar.curMonth': curMonth,
      'calendar.selectedDay': [ {
        day: curDate,
        choosed: true,
        year: curYear,
        month: curMonth,
      } ],
      'calendar.todayTimestamp': timestamp,
    });
    conf.renderCalendar.call(this, curYear, curMonth, curDate);
  },
  renderCalendar(curYear, curMonth, curDate) {
    conf.calculateEmptyGrids.call(this, curYear, curMonth);
    conf.calculateDays.call(this, curYear, curMonth, curDate);
    const { todoLabels } = this.data.calendar || {};
    if (todoLabels && todoLabels instanceof Array) conf.setTodoLabels.call(this);
    const { afterCalendarRender } = this.config;
    if (afterCalendarRender && typeof afterCalendarRender === 'function' && !this.firstRender) {
      afterCalendarRender();
      this.firstRender = true;
    }
  },
  calendarTouchstart(e) {
    const t = e.touches[ 0 ];
    const startX = t.clientX;
    const startY = t.clientY;
    this.slideLock = true; // 滑动事件加锁
    this.setData({
      'gesture.startX': startX,
      'gesture.startY': startY
    });
  },
  calendarTouchmove(e) {
    if (isLeftSlide.call(this, e)) {
      conf.chooseNextMonth.call(this);
    }
    if (isRightSlide.call(this, e)) {
      conf.choosePrevMonth.call(this);
    }
  },
};

/**
 * 获取当前页面实例
 */
function _getCurrentPage() {
  const pages = getCurrentPages();
  const last = pages.length - 1;
  return pages[ last ];
}
/**
 * 绑定函数到当前页面实例上
 * @param {array} functionArray 函数数组
 */
function bindFunctionToPage(functionArray) {
  if (!functionArray || !functionArray.length) return;
  functionArray.forEach(item => {
    this[ item ] = conf[ item ].bind(this);
  });
}

/**
 * 获取已选择的日期
*/
export const getSelectedDay = () => {
  const self = _getCurrentPage();
  return self.data.calendar.selectedDay;
};
/**
 * 跳转至今天
 */
export const jumpToToday = () => {
  const self = _getCurrentPage();
  conf.jumpToToday.call(self);
};

/**
 * 设置代办事项日期标记
 * @param {object} todos  待办事项配置
 * @param {string} [todos.pos] 标记显示位置，默认值'bottom' ['bottom', 'top']
 * @param {string} [todos.dotColor] 标记点颜色，backgroundColor 支持的值都行
 * @param {object[]} todos.days 需要标记的所有日期，如：[{year: 2015, month: 5, day: 12}]，其中年月日字段必填
 */
export const setTodoLabels = (todos) => {
  const self = _getCurrentPage();
  conf.setTodoLabels.call(self, todos);
};

export const deleteTodoLabels = (todos) => {
  const self = _getCurrentPage();
  conf.deleteTodoLabels.call(self, todos);
};

export const clearTodoLabels = () => {
  const self = _getCurrentPage();
  conf.clearTodoLabels.call(self);
};

export default (config = {}) => {
  const weeksCh = [ '日', '一', '二', '三', '四', '五', '六' ];
  const self = _getCurrentPage();
  self.config = config;
  self.setData({
    'calendar.weeksCh': weeksCh,
  });
  conf.jumpToToday.call(self);
  const functionArray = [ 'tapDayItem', 'choosePrevMonth', 'chooseNextMonth', 'calendarTouchstart', 'calendarTouchmove' ];
  bindFunctionToPage.call(self, functionArray);
};
