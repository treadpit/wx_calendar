import {
  isLeftSlide,
  isRightSlide,
  getCurrentPage,
  whenChangeMonth,
  renderCalendar,
  whenMulitSelect,
  whenSingleSelect,
  calculateNextWeekDays,
  calculatePrevWeekDays
} from './main.js';

let currentPage = {};

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
      currentPage = getCurrentPage();
    }
  },
  attached: function() {
    currentPage = getCurrentPage();
  },
  methods: {
    /**
     * 选择上一月
     */
    choosePrevMonth() {
      const { curYear, curMonth } = this.data.calendar;
      let newYear = curYear;
      let newMonth = curMonth - 1;
      if (newMonth < 1) {
        newYear = curYear - 1;
        newMonth = 12;
      }
      whenChangeMonth.call(currentPage, {
        curYear,
        curMonth,
        newYear,
        newMonth
      });
      currentPage.setData({
        'calendar.curYear': newYear,
        'calendar.curMonth': newMonth
      });
      renderCalendar.call(currentPage, newYear, newMonth);
    },
    /**
     * 选择下一月
     */
    chooseNextMonth() {
      const { curYear, curMonth } = this.data.calendar;
      let newYear = curYear;
      let newMonth = curMonth + 1;
      if (newMonth > 12) {
        newYear = curYear + 1;
        newMonth = 1;
      }
      whenChangeMonth.call(currentPage, {
        curYear,
        curMonth,
        newYear,
        newMonth
      });
      currentPage.setData({
        'calendar.curYear': newYear,
        'calendar.curMonth': newMonth
      });
      renderCalendar.call(currentPage, newYear, newMonth);
    },
    /**
     * 日期点击事件
     * @param {!object} e 事件对象
     */
    tapDayItem(e) {
      const { idx, disable } = e.currentTarget.dataset;
      if (disable) return;
      let currentSelected = {}; // 当前选中日期
      let { days, selectedDay: selectedDays } = this.data.calendar || []; // 所有选中日期
      const config = currentPage.config;
      const { multi, onTapDay } = config;
      const opts = {
        e,
        idx,
        onTapDay,
        currentSelected,
        selectedDays,
        days: days.slice()
      };
      if (multi) {
        whenMulitSelect.call(currentPage, opts);
      } else {
        whenSingleSelect.call(currentPage, opts);
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
      currentPage.slideLock = true; // 滑动事件加锁
      currentPage.setData({
        'gesture.startX': startX,
        'gesture.startY': startY
      });
    },
    /**
     * 日历滑动中
     * @param {object} e
     */
    calendarTouchmove(e) {
      const self = currentPage;
      if (isLeftSlide.call(self, e)) {
        self.setData({
          'calendar.leftSwipe': 1
        });
        if (currentPage.weekMode)
          return calculateNextWeekDays.call(currentPage);
        this.chooseNextMonth();
      }
      if (isRightSlide.call(self, e)) {
        self.setData({
          'calendar.rightSwipe': 1
        });
        if (currentPage.weekMode)
          return calculatePrevWeekDays.call(currentPage);
        this.choosePrevMonth();
      }
    },
    calendarTouchend(e) {
      currentPage.setData({
        'calendar.leftSwipe': 0,
        'calendar.rightSwipe': 0
      });
    }
  }
});
