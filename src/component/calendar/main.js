import Day from './func/day';
import Week from './func/week';
import Todo from './func/todo';
import WxData from './func/wxData';
import Calendar from './func/render';
import CalendarConfig from './func/config';
import {
  Logger,
  GetDate,
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
  dataInstance = WxData(Component);
  return dataInstance.getData(key);
}

function setData(data, callback = () => {}) {
  const dataInstance = WxData(Component);
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
      const { showLabelAlways } = getData('calendar');
      if (showLabelAlways && currentSelected.showTodoLabel) {
        currentSelected.showTodoLabel = true;
      } else {
        currentSelected.showTodoLabel = false;
      }
      selectedDays.push(currentSelected);
    }
    const config = CalendarConfig(Component).getCalendarConfig();
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
    const config = CalendarConfig(Component).getCalendarConfig();
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
    Todo(Component).showTodoLabels(shouldMarkerTodoDay, days, selectedDays);
    if (!currentDay) return;
    const tmp = {
      'calendar.days': days
    };
    if (preSelectedDate.day !== currentDay.day) {
      preSelectedDate.choosed = false;
      currentDay.choosed = true;
      if (!calendar.showLabelAlways || !currentDay.showTodoLabel) {
        currentDay.showTodoLabel = false;
      }
      tmp['calendar.selectedDay'] = [currentSelected];
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
   * 跳转至今天
   */
  jumpToToday() {
    const {
      year: curYear,
      month: curMonth,
      date: curDate
    } = getDate.todayDate();
    const timestamp = getDate.todayTimestamp();
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
 * 设置代办事项日期标记
 * @param {object} todos  待办事项配置
 * @param {string} [todos.pos] 标记显示位置，默认值'bottom' ['bottom', 'top']
 * @param {string} [todos.dotColor] 标记点颜色，backgroundColor 支持的值都行
 * @param {object[]} todos.days 需要标记的所有日期，如：[{year: 2015, month: 5, day: 12}]，其中年月日字段必填
 */
export function setTodoLabels(todos, componentId) {
  bindCurrentComponent(componentId, this);
  Todo(Component).setTodoLabels(todos);
}
/**
 * 删除指定日期待办标记
 * @param {array} todos 需要删除的待办日期数组
 */
export function deleteTodoLabels(todos, componentId) {
  bindCurrentComponent(componentId, this);
  Todo(Component).deleteTodoLabels(todos);
}
/**
 * 清空所有待办标记
 */
export function clearTodoLabels(componentId) {
  bindCurrentComponent(componentId, this);
  Todo(Component).clearTodoLabels();
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
  return new Promise((resolve, reject) => {
    const view = args[0];
    if (!args[1])
      return Week(Component)
        .switchWeek(view)
        .then(resolve);
    if (typeof args[1] === 'string') {
      bindCurrentComponent(args[1], this);
      Week(Component)
        .switchWeek(view, args[2])
        .then(resolve);
    } else if (typeof args[1] === 'object') {
      if (typeof args[2] === 'string') {
        bindCurrentComponent(args[1], this);
      }
      Week(Component)
        .switchWeek(view, args[1])
        .then(resolve);
    }
  });
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
  Day(Component).disableDays(days);
}

/**
 * 指定可选日期范围
 * @param {array} area 日期访问数组
 */
export function enableArea(area = [], componentId) {
  bindCurrentComponent(componentId, this);
  Day(Component).enableArea(area);
}
/**
 * 指定特定日期可选
 * @param {array} days 指定日期数组
 */
export function enableDays(days = [], componentId) {
  bindCurrentComponent(componentId, this);
  Day(Component).enableDays(days);
}

export function setSelectedDays(selected, componentId) {
  bindCurrentComponent(componentId, this);
  Day(Component).setSelectedDays(selected);
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
  logger.tips(
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
      return logger.warn('配置 jumpTo 格式应为: 2018-4-2 或 2018-04-02');
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
