import { Logger, uniqueArrayByDate } from './utils';
import WxData from './wxData';

const logger = new Logger();

class Todo {
  constructor(component) {
    this.Component = component;
  }
  /**
   * 周、月视图下单选标记代办事项
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
   * 设置代办事项标志
   * @param {object} options 代办事项配置
   */
  setTodoLabels(options) {
    const wxData = WxData(this.Component);
    if (options) this.Component.todoConfig = options;
    const calendar = wxData.getData('calendar');
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
    wxData.setData(o);
  }
  /**
   * 筛选待办事项
   * @param {array} todos 需要删除待办标记的日期
   */
  filterTodos(todos) {
    const wxData = WxData(this.Component);
    const { todoLabels } = wxData.getData('calendar');
    const deleteTodo = todos.map(
      item => `${item.year}-${item.month}-${item.day}`
    );
    return todoLabels.filter(
      item =>
        deleteTodo.indexOf(`${item.year}-${item.month}-${item.day}`) === -1
    );
  }
  /**
   *  删除指定日期的待办标识
   * @param {array} todos 需要删除待办标记的日期
   */
  deleteTodoLabels(todos) {
    if (!(todos instanceof Array) || !todos.length) return;
    const wxData = WxData(this.Component);
    const todoLabels = this.filterTodos(todos);
    const { days, curYear, curMonth } = wxData.getData('calendar');
    const currentMonthTodoLabels = todoLabels.filter(
      item => curYear === +item.year && curMonth === +item.month
    );
    days.forEach(item => {
      item.showTodoLabel = false;
    });
    currentMonthTodoLabels.forEach(item => {
      days[item.day - 1].showTodoLabel = !days[item.day - 1].choosed;
    });
    wxData.setData({
      'calendar.days': days,
      'calendar.todoLabels': todoLabels
    });
  }
  /**
   * 清空所有日期的待办标识
   */
  clearTodoLabels() {
    const wxData = WxData(this.Component);
    const { days = [] } = wxData.getData('calendar');
    const _days = [].concat(days);
    _days.forEach(item => {
      item.showTodoLabel = false;
    });
    wxData.setData({
      'calendar.days': _days,
      'calendar.todoLabels': []
    });
  }
}

export default component => new Todo(component);
