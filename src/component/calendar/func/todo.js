import WxData from './wxData';
import { Logger, uniqueArrayByDate } from './utils';

const logger = new Logger();

class Todo extends WxData {
  constructor(component) {
    super(component);
    this.Component = component;
  }
  /**
   * 周、月视图下单选标记待办事项
   * @param {array} todoDays
   * @param {array} days
   * @param {array} selectedDays
   */
  showTodoLabels(todoDays, days, selectedDays) {
    todoDays.forEach(item => {
      if (this.Component.weekMode) {
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
  }
  /**
   * 设置待办事项标志
   * @param {object} options 待办事项配置
   */
  setTodoLabels(options) {
    if (options) this.Component.todoConfig = options;
    const calendar = this.getData('calendar');
    if (!calendar || !calendar.days) {
      return logger.warn('请等待日历初始化完成后再调用该方法');
    }
    const days = calendar.days.slice();
    const { curYear, curMonth } = calendar;
    const {
      circle,
      dotColor = '',
      pos = 'bottom',
      showLabelAlways,
      days: todoDays = []
    } = options || this.Component.todoConfig || {};
    const { todoLabels = [], todoLabelPos, todoLabelColor } = calendar;
    const shouldMarkerTodoDay = todoDays.filter(
      item => +item.year === +curYear && +item.month === +curMonth
    );
    let currentMonthTodoLabels = todoLabels.filter(
      item => +item.year === +curYear && +item.month === +curMonth
    );
    shouldMarkerTodoDay.concat(currentMonthTodoLabels).forEach(item => {
      let target = {};
      if (this.Component.weekMode) {
        target = days.find(d => +d.day === +item.day);
      } else {
        target = days[item.day - 1];
      }
      if (target) {
        if (showLabelAlways) {
          target.showTodoLabel = true;
        } else {
          target.showTodoLabel = !target.choosed;
        }
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
    }
    o['calendar.todoLabelCircle'] = circle || false;
    o['calendar.showLabelAlways'] = showLabelAlways || false;
    this.setData(o);
  }
  /**
   * 过滤将删除的待办事项
   * @param {array} todos 需要删除待办事项
   */
  filterTodos(todos) {
    const todoLabels = this.getData('calendar.todoLabels') || [];
    const deleteTodo = todos.map(
      item => `${item.year}-${item.month}-${item.day}`
    );
    return todoLabels.filter(
      item => !deleteTodo.includes(`${item.year}-${item.month}-${item.day}`)
    );
  }
  /**
   *  删除指定日期的待办事项
   * @param {array} todos 需要删除待办事项的日期
   */
  deleteTodoLabels(todos) {
    if (!(todos instanceof Array) || !todos.length) return;
    const todoLabels = this.filterTodos(todos);
    const { days, curYear, curMonth } = this.getData('calendar');
    const currentMonthTodoLabels = todoLabels.filter(
      item => curYear === +item.year && curMonth === +item.month
    );
    days.forEach(item => {
      item.showTodoLabel = false;
    });
    currentMonthTodoLabels.forEach(item => {
      days[item.day - 1].showTodoLabel = !days[item.day - 1].choosed;
    });
    this.setData({
      'calendar.days': days,
      'calendar.todoLabels': todoLabels
    });
  }
  /**
   * 清空所有待办事项
   */
  clearTodoLabels() {
    const { days = [] } = this.getData('calendar');
    const _days = [].concat(days);
    _days.forEach(item => {
      item.showTodoLabel = false;
    });
    this.setData({
      'calendar.days': _days,
      'calendar.todoLabels': []
    });
  }
  /**
   * 获取所有待办事项
   */
  getTodoLabels() {
    const todoLabels = this.getData('calendar.todoLabels') || [];
    return todoLabels;
  }
}

export default component => new Todo(component);
