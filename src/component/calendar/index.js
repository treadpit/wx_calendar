import { warn } from './utils';
import initCalendar, {
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

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    calendarConfig: {
      type: Object,
      value: {}
    }
  },
  lifetimes: {
    attached: function() {
      initCalendar(this, this.data.calendarConfig);
    }
  },
  attached: function() {
    initCalendar(this, this.data.calendarConfig);
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
      if (this.weekMode) {
        return console.warn('周视图下不支持点击切换年月');
      }
      let newYear = +curYear;
      let newMonth = +curMonth;
      if (type === 'prev_year') {
        newYear = +curYear - 1;
      } else if (type === 'next_year') {
        newYear = +curYear + 1;
      }
      this.calculate(curYear, curMonth, newYear, newMonth);
    },
    chooseMonth(type) {
      const { curYear, curMonth } = this.data.calendar;
      if (!curYear || !curMonth) return warn('异常：未获取到当前年月');
      if (this.weekMode) {
        return console.warn('周视图下不支持点击切换年月');
      }
      let newYear = +curYear;
      let newMonth = +curMonth;
      if (type === 'prev_month') {
        newMonth = +curMonth - 1;
        if (newMonth < 1) {
          newYear = +curYear - 1;
          newMonth = 12;
        }
      } else if (type === 'next_month') {
        newMonth = +curMonth + 1;
        if (newMonth > 12) {
          newYear = +curYear + 1;
          newMonth = 1;
        }
      }
      this.calculate(curYear, curMonth, newYear, newMonth);
    },
    calculate(curYear, curMonth, newYear, newMonth) {
      whenChangeDate.call(this, {
        curYear,
        curMonth,
        newYear,
        newMonth
      });
      this.setData({
        'calendar.curYear': newYear,
        'calendar.curMonth': newMonth
      });
      renderCalendar.call(this, newYear, newMonth);
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
      const config = this.config;
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
        whenMulitSelect.call(this, opts);
      } else {
        whenSingleSelect.call(this, opts);
      }
    },
    doubleClickToToday() {
      if (this.config.multi || this.weekMode) return;
      if (this.count === undefined) {
        this.count = 1;
      } else {
        this.count += 1;
      }
      if (this.lastClick) {
        const difference = new Date().getTime() - this.lastClick;
        if (difference < 500 && this.count >= 2) {
          jump.call(this);
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
      this.slideLock = true; // 滑动事件加锁
      this.setData({
        'gesture.startX': startX,
        'gesture.startY': startY
      });
    },
    /**
     * 日历滑动中
     * @param {object} e
     */
    calendarTouchmove(e) {
      if (isLeftSlide.call(this, e)) {
        this.setData({
          'calendar.leftSwipe': 1
        });
        if (this.weekMode) return calculateNextWeekDays.call(this);
        this.chooseMonth('next_month');
      }
      if (isRightSlide.call(this, e)) {
        this.setData({
          'calendar.rightSwipe': 1
        });
        if (this.weekMode) return calculatePrevWeekDays.call(this);
        this.chooseMonth('prev_month');
      }
    },
    calendarTouchend(e) {
      this.setData({
        'calendar.leftSwipe': 0,
        'calendar.rightSwipe': 0
      });
    }
  }
});
