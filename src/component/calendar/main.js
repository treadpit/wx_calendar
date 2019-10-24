import Day from './func/day';
import Week from './func/week';
import Todo from './func/todo';
import WxData from './func/wxData';
import Calendar from './func/render';
import CalendarConfig from './func/config';
import convertSolarLunar from './func/convertSolarLunar';
import {
  Logger,
  GetDate,
  isComponent,
  initialTasks,
  getCurrentPage,
  getComponent
} from './func/utils';

let Component = {};
let logger = new Logger();
let getDate = new GetDate();
let dataInstance = null;

/**
 * 全局赋值正在操作的组件实例，方便读/写各自的 data
 * @param {string} componentId 要操作的日历组件ID
 */
function bindCurrentComponent(componentId) {
  if (componentId) {
    Component = getComponent(componentId);
  }
}
/**
 * 获取日历内部数据
 * @param {string} key 获取值的键名
 * @param {string} componentId 要操作的日历组件ID
 */
function getData(key, componentId) {
  bindCurrentComponent(componentId);
  dataInstance = new WxData(Component);
  return dataInstance.getData(key);
}
/**
 * 设置日历内部数据
 * @param {object}} data 待设置的数据
 * @param {function} callback 设置成功回调函数
 */
function setData(data, callback = () => {}) {
  const dataInstance = new WxData(Component);
  return dataInstance.setData(data, callback);
}

const conf = {
  /**
   * 渲染日历
   * @param {number} curYear
   * @param {number} curMonth
   * @param {number} curDate
   */
  renderCalendar(curYear, curMonth, curDate) {
    if (isComponent(this)) Component = this;
    return new Promise((resolve, reject) => {
      Calendar(Component)
        .renderCalendar(curYear, curMonth, curDate)
        .then(() => {
          mountEventsOnPage(getCurrentPage());
          Component.triggerEvent('afterCalendarRender', Component);
          Component.firstRender = true;
          initialTasks.flag = 'finished';
          if (initialTasks.tasks.length) {
            initialTasks.tasks.shift()();
          }
          resolve();
        });
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
   * 多选
   * @param {number} dateIdx 当前选中日期索引值
   */
  whenMulitSelect(dateIdx) {
    if (isComponent(this)) Component = this;
    const { calendar = {} } = getData();
    const { days, todoLabels } = calendar;
    let { selectedDay: selectedDays = [] } = calendar;
    const currentDay = days[dateIdx];
    if (!currentDay) return;
    currentDay.choosed = !currentDay.choosed;
    if (!currentDay.choosed) {
      currentDay.cancel = true; // 该次点击是否为取消日期操作
      const currentDayStr = `${currentDay.year}-${currentDay.month}-${
        currentDay.day
      }`;
      selectedDays = selectedDays.filter(
        item => currentDayStr !== `${item.year}-${item.month}-${item.day}`
      );
      if (todoLabels) {
        todoLabels.forEach(item => {
          if (currentDayStr === `${item.year}-${item.month}-${item.day}`) {
            currentDay.showTodoLabel = true;
          }
        });
      }
    } else {
      currentDay.cancel = false;
      const { showLabelAlways } = getData('calendar');
      if (showLabelAlways && currentDay.showTodoLabel) {
        currentDay.showTodoLabel = true;
      } else {
        currentDay.showTodoLabel = false;
      }
      selectedDays.push(currentDay);
    }
    const config = CalendarConfig(Component).getCalendarConfig();
    if (config.takeoverTap) {
      return Component.triggerEvent('onTapDay', currentDay);
    }
    setData({
      'calendar.days': days,
      'calendar.selectedDay': selectedDays
    });
    conf.afterTapDay(currentDay, selectedDays);
  },
  /**
   * 单选
   * @param {number} dateIdx 当前选中日期索引值
   */
  whenSingleSelect(dateIdx) {
    if (isComponent(this)) Component = this;
    const { calendar = {} } = getData();
    const { days, selectedDay: selectedDays = [], todoLabels } = calendar;
    let shouldMarkerTodoDay = [];
    const currentDay = days[dateIdx];
    if (!currentDay) return;
    const selectedDay = selectedDays[0] || {};
    const date = selectedDay.day;
    const preSelectedDate = (date && days[date - 1]) || {};
    const { month: dMonth, year: dYear } = days[0] || {};
    const config = CalendarConfig(Component).getCalendarConfig();
    if (config.takeoverTap) {
      return Component.triggerEvent('onTapDay', currentDay);
    }
    conf.afterTapDay(currentDay);
    if (!config.inverse && preSelectedDate.day === currentDay.day) return;
    if (Component.weekMode) {
      days.forEach((item, idx) => {
        if (item.day === date) days[idx].choosed = false;
      });
    }
    if (todoLabels) {
      // 筛选当月待办事项的日期
      shouldMarkerTodoDay = todoLabels.filter(
        item => +item.year === dYear && +item.month === dMonth
      );
    }
    Todo(Component).showTodoLabels(shouldMarkerTodoDay, days, selectedDays);
    const tmp = {
      'calendar.days': days
    };
    if (preSelectedDate.day !== currentDay.day) {
      preSelectedDate.choosed = false;
      currentDay.choosed = true;
      if (!calendar.showLabelAlways || !currentDay.showTodoLabel) {
        currentDay.showTodoLabel = false;
      }
      tmp['calendar.selectedDay'] = [currentDay];
    } else if (config.inverse) {
      currentDay.choosed = !currentDay.choosed;
      if (currentDay.choosed) {
        if (currentDay.showTodoLabel && calendar.showLabelAlways) {
          currentDay.showTodoLabel = true;
        } else {
          currentDay.showTodoLabel = false;
        }
      }
      tmp['calendar.selectedDay'] = [];
    }
    setData(tmp);
  },
  /**
   * 点击日期后触发事件
   * @param {object} currentSelected 当前选择的日期
   * @param {array} selectedDays  多选状态下选中的日期
   */
  afterTapDay(currentSelected, selectedDays) {
    const config = CalendarConfig(Component).getCalendarConfig();
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
   * 跳转至今天
   */
  jumpToToday() {
    const { year, month, date } = getDate.todayDate();
    const timestamp = getDate.todayTimestamp();
    const config = CalendarConfig(Component).getCalendarConfig();
    setData({
      'calendar.curYear': year,
      'calendar.curMonth': month,
      'calendar.selectedDay': [
        {
          year: year,
          day: date,
          month: month,
          choosed: true,
          lunar: config.showLunar
            ? convertSolarLunar.solar2lunar(year, month, date)
            : null
        }
      ],
      'calendar.todayTimestamp': timestamp
    });
    conf.renderCalendar(year, month, date);
  }
};

export const whenChangeDate = conf.whenChangeDate;
export const renderCalendar = conf.renderCalendar;
export const whenSingleSelect = conf.whenSingleSelect;
export const whenMulitSelect = conf.whenMulitSelect;
export const calculatePrevWeekDays = conf.calculatePrevWeekDays;
export const calculateNextWeekDays = conf.calculateNextWeekDays;

/**
 * 获取当前年月
 * @param {string} componentId 要操作的日历组件ID
 */
export function getCurrentYM(componentId) {
  bindCurrentComponent(componentId);
  return {
    year: getData('calendar.curYear'),
    month: getData('calendar.curMonth')
  };
}

/**
 * 获取已选择的日期
 * @param {string} componentId 要操作的日历组件ID
 */
export function getSelectedDay(componentId) {
  bindCurrentComponent(componentId);
  return getData('calendar.selectedDay');
}

/**
 * 取消所有选中日期
 * @param {string} componentId 要操作的日历组件ID
 */
export function cancelAllSelectedDay(componentId) {
  bindCurrentComponent(componentId);
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
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @param {string} componentId 要操作的日历组件ID
 */
export function jump(year, month, day, componentId) {
  bindCurrentComponent(componentId);
  const { selectedDay = [], weekMode } = getData('calendar') || {};
  const { year: y, month: m, day: d } = selectedDay[0] || {};
  if (+y === +year && +m === +month && +d === +day) {
    return;
  }
  if (weekMode) {
    return Week(Component).jump({
      year,
      month,
      day
    });
  }
  if (year && month) {
    if (typeof +year !== 'number' || typeof +month !== 'number') {
      return logger.warn('jump 函数年月日参数必须为数字');
    }
    const timestamp = getDate.todayTimestamp();
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
 * 设置待办事项日期标记
 * @param {object} todos  待办事项配置
 * @param {string} [todos.pos] 标记显示位置，默认值'bottom' ['bottom', 'top']
 * @param {string} [todos.dotColor] 标记点颜色，backgroundColor 支持的值都行
 * @param {object[]} [todos.days] 需要标记的所有日期，如：[{year: 2015, month: 5, day: 12}]，其中年月日字段必填
 * @param {string} componentId 要操作的日历组件ID
 */
export function setTodoLabels(todos, componentId) {
  bindCurrentComponent(componentId);
  Todo(Component).setTodoLabels(todos);
}

/**
 * 删除指定日期待办事项
 * @param {array} todos 需要删除的待办日期数组
 * @param {string} componentId 要操作的日历组件ID
 */
export function deleteTodoLabels(todos, componentId) {
  bindCurrentComponent(componentId);
  Todo(Component).deleteTodoLabels(todos);
}

/**
 * 清空所有待办事项
 * @param {string} componentId 要操作的日历组件ID
 */
export function clearTodoLabels(componentId) {
  bindCurrentComponent(componentId);
  Todo(Component).clearTodoLabels();
}

/**
 * 获取所有待办事项
 * @param {string} componentId 要操作的日历组件ID
 */
export function getTodoLabels(componentId) {
  bindCurrentComponent(componentId);
  return Todo(Component).getTodoLabels();
}

/**
 * 禁用指定日期
 * @param {array} days 日期
 * @param {number} [days.year]
 * @param {number} [days.month]
 * @param {number} [days.day]
 * @param {string} componentId 要操作的日历组件ID
 */
export function disableDay(days = [], componentId) {
  bindCurrentComponent(componentId);
  Day(Component).disableDays(days);
}

/**
 * 指定可选日期范围
 * @param {array} area 日期访问数组
 * @param {string} componentId 要操作的日历组件ID
 */
export function enableArea(area = [], componentId) {
  bindCurrentComponent(componentId);
  Day(Component).enableArea(area);
}

/**
 * 指定特定日期可选
 * @param {array} days 指定日期数组
 * @param {string} componentId 要操作的日历组件ID
 */
export function enableDays(days = [], componentId) {
  bindCurrentComponent(componentId);
  Day(Component).enableDays(days);
}

/**
 * 设置选中日期（多选模式下）
 * @param {array} selected 需选中日期
 * @param {string} componentId 要操作的日历组件ID
 */
export function setSelectedDays(selected, componentId) {
  bindCurrentComponent(componentId);
  Day(Component).setSelectedDays(selected);
}

/**
 * 获取当前日历配置
 * @param {string} componentId 要操作的日历组件ID
 */
export function getCalendarConfig(componentId) {
  bindCurrentComponent(componentId);
  CalendarConfig(Component).getCalendarConfig();
}

/**
 * 设置日历配置
 * @param {string} key
 * @param {string|boolean} value
 * @param {string} componentId 要操作的日历组件ID
 */
export function setCalendarConfig(key, value, componentId) {
  bindCurrentComponent(componentId);
  CalendarConfig(Component).setCalendarConfig(key, value);
}

/**
 * 获取当前日历面板日期
 * @param {string} componentId 要操作的日历组件ID
 */
export function getCalendarDates(componentId) {
  bindCurrentComponent(componentId);
  return getData('calendar.days', componentId);
}

/**
 * 切换周月视图
 * 切换视图时可传入指定日期，如: {year: 2019, month: 1, day: 3}
 * args[0] view 视图模式[week, month]
 * args[1]|args[2]为day object或者 componentId
 */
export function switchView(...args) {
  return new Promise((resolve, reject) => {
    const view = args[0];
    if (!args[1]) {
      return Week(Component)
        .switchWeek(view)
        .then(resolve)
        .catch(reject);
    }
    if (typeof args[1] === 'string') {
      bindCurrentComponent(args[1], this);
      Week(Component)
        .switchWeek(view, args[2])
        .then(resolve)
        .catch(reject);
    } else if (typeof args[1] === 'object') {
      if (typeof args[2] === 'string') {
        bindCurrentComponent(args[1], this);
      }
      Week(Component)
        .switchWeek(view, args[1])
        .then(resolve)
        .catch(reject);
    }
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
    getCurrentYM,
    getSelectedDay,
    cancelAllSelectedDay,
    setTodoLabels,
    getTodoLabels,
    deleteTodoLabels,
    clearTodoLabels,
    setSelectedDays,
    getCalendarConfig,
    setCalendarConfig,
    getCalendarDates
  };
}

function setWeekHeader(firstDayOfWeek) {
  let weeksCh = ['日', '一', '二', '三', '四', '五', '六'];
  if (firstDayOfWeek === 'Mon') {
    weeksCh = ['一', '二', '三', '四', '五', '六', '日'];
  }
  setData({
    'calendar.weeksCh': weeksCh
  });
}

function autoSelectDay(defaultDay) {
  if (defaultDay && typeof defaultDay === 'string') {
    const day = defaultDay.split('-');
    if (day.length < 3) {
      return logger.warn('配置 jumpTo 格式应为: 2018-4-2 或 2018-04-02');
    }
    jump(+day[0], +day[1], +day[2]);
  } else if (!defaultDay) {
    Component.config.noDefault = true;
    jump();
  } else {
    jump();
  }
}

function init(component, config) {
  initialTasks.flag = 'process';
  Component = component;
  Component.config = config;
  setWeekHeader(config.firstDayOfWeek);
  autoSelectDay(config.defaultDay);
  logger.tips(
    '使用中若遇问题请反馈至 https://github.com/treadpit/wx_calendar/issues ✍️'
  );
}

export default (component, config = {}) => {
  if (initialTasks.flag === 'process') {
    return initialTasks.tasks.push(function() {
      init(component, config);
    });
  }
  init(component, config);
};
