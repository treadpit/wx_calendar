import { getCurrentPage, warn } from './utils';
import {
  jump,
  isLeftSlide,
  isRightSlide,
  whenChangeDate,
  renderCalendar,
  whenMulitSelect,
  whenSingleSelect,
  calculateNextWeekDays,
  calculatePrevWeekDays
} from './main.js';

let page = {};

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    calendar: {
      type: Object
    }
  },
  lifetimes: {
    attached: function() {
      page = getCurrentPage();
    }
  },
  attached: function() {
    page = getCurrentPage();
  },
  data: {
    handleMap: {
      prev_year: 'chooseYear',
      prev_month: 'chooseMonth',
      next_month: 'chooseMonth',
      next_year: 'chooseYear'
    }
  },
  methods: {
    chooseDate(e) {
      const { type } = e.currentTarget.dataset;
      if (!type) return;
      const methodName = this.data.handleMap[type];
      this[methodName](type);
    },
    chooseYear(type) {
      const { curYear, curMonth } = this.data.calendar;
      if (!curYear || !curMonth) return warn('异常：未获取到当前年月');
      let newYear = curYear;
      let newMonth = curMonth;
      if (type === 'prev_year') {
        newYear = curYear - 1;
      } else if (type === 'next_year') {
        newYear = curYear + 1;
      }
      this.calculate(curYear, curMonth, newYear, newMonth);
    },
    chooseMonth(type) {
      const { curYear, curMonth } = this.data.calendar;
      if (!curYear || !curMonth) return warn('异常：未获取到当前年月');
      let newYear = curYear;
      let newMonth = curMonth;
      if (type === 'prev_month') {
        newMonth = curMonth - 1;
        if (newMonth < 1) {
          newYear = curYear - 1;
          newMonth = 12;
        }
      } else if (type === 'next_month') {
        newMonth = curMonth + 1;
        if (newMonth > 12) {
          newYear = curYear + 1;
          newMonth = 1;
        }
      }
      this.calculate(curYear, curMonth, newYear, newMonth);
    },
    calculate(curYear, curMonth, newYear, newMonth) {
      whenChangeDate({
        curYear,
        curMonth,
        newYear,
        newMonth
      });
      page.setData({
        'calendar.curYear': newYear,
        'calendar.curMonth': newMonth
      });
      renderCalendar(newYear, newMonth);
    },
    /**
     * 日期点击事件
     * @param {!object} e 事件对象
     */
    tapDayItem(e) {
      const { idx, disable } = e.currentTarget.dataset;
      if (disable) return;
      let currentSelected = {}; // 当前选中日期
      let { days, selectedDay: selectedDays, todoLabels } =
        this.data.calendar || []; // 所有选中日期
      const config = page.config;
      const { multi, onTapDay } = config;
      const opts = {
        e,
        idx,
        onTapDay,
        currentSelected,
        selectedDays,
        todoLabels,
        days: days.slice()
      };
      if (multi) {
        whenMulitSelect(opts);
      } else {
        whenSingleSelect(opts);
      }
    },
    doubleClickToToday() {
      if (page.config.multi) return;
      if (this.count === undefined) {
        this.count = 1;
      } else {
        this.count += 1;
      }
      if (this.lastClick) {
        const difference = new Date().getTime() - this.lastClick;
        if (difference < 500 && this.count >= 2) {
          jump();
        }
        this.count = undefined;
        this.lastClick = undefined;
      } else {
        this.lastClick = new Date().getTime();
      }
    },
    /**
     * 日历滑动开始
     * @param {object} e
     */
    calendarTouchstart(e) {
      const t = e.touches[0];
      const startX = t.clientX;
      const startY = t.clientY;
      page.slideLock = true; // 滑动事件加锁
      page.setData({
        'gesture.startX': startX,
        'gesture.startY': startY
      });
    },
    /**
     * 日历滑动中
     * @param {object} e
     */
    calendarTouchmove(e) {
      const self = page;
      if (isLeftSlide.call(self, e)) {
        self.setData({
          'calendar.leftSwipe': 1
        });
        if (page.weekMode) return calculateNextWeekDays.call(page);
        this.chooseMonth('next_month');
      }
      if (isRightSlide.call(self, e)) {
        self.setData({
          'calendar.rightSwipe': 1
        });
        if (page.weekMode) return calculatePrevWeekDays.call(page);
        this.chooseMonth('prev_month');
      }
    },
    calendarTouchend(e) {
      page.setData({
        'calendar.leftSwipe': 0,
        'calendar.rightSwipe': 0
      });
    }
  }
});
