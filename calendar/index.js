!(function(e) {
  var t = {};
  function a(n) {
    if (t[n]) return t[n].exports;
    var o = (t[n] = { i: n, l: !1, exports: {} });
    return e[n].call(o.exports, o, o.exports, a), (o.l = !0), o.exports;
  }
  (a.m = e),
    (a.c = t),
    (a.d = function(e, t, n) {
      a.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: n });
    }),
    (a.r = function(e) {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(e, '__esModule', { value: !0 });
    }),
    (a.t = function(e, t) {
      if ((1 & t && (e = a(e)), 8 & t)) return e;
      if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
      var n = Object.create(null);
      if (
        (a.r(n),
        Object.defineProperty(n, 'default', { enumerable: !0, value: e }),
        2 & t && 'string' != typeof e)
      )
        for (var o in e)
          a.d(
            n,
            o,
            function(t) {
              return e[t];
            }.bind(null, o)
          );
      return n;
    }),
    (a.n = function(e) {
      var t =
        e && e.__esModule
          ? function() {
              return e.default;
            }
          : function() {
              return e;
            };
      return a.d(t, 'a', t), t;
    }),
    (a.o = function(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (a.p = ''),
    a((a.s = 6));
})([
  function(e, t, a) {
    'use strict';
    let n;
    function o() {
      return n || (n = wx.getSystemInfoSync());
    }
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.getSystemInfo = o),
      (t.isIos = l),
      (t.getCurrentPage = d),
      (t.getComponent = function(e) {
        const t = new s();
        let a = d() || {};
        if (a.selectComponent && 'function' == typeof a.selectComponent) {
          if (e) return a.selectComponent(e);
          t.warn('请传入组件ID');
        } else t.warn('该基础库暂不支持多个小程序日历组件');
      }),
      (t.uniqueArrayByDate = function(e = []) {
        let t = {},
          a = [];
        e.forEach(e => {
          t[`${e.year}-${e.month}-${e.day}`] = e;
        });
        for (let e in t) a.push(t[e]);
        return a;
      }),
      (t.delRepeatedEnableDay = function(e = [], t = []) {
        let a, n;
        if (2 === t.length) {
          const { startTimestamp: e, endTimestamp: o } = c(t);
          (a = e), (n = o);
        }
        return i(e).filter(e => e < a || e > n);
      }),
      (t.convertEnableAreaToTimestamp = c),
      (t.converEnableDaysToTimestamp = i),
      (t.initialTasks = t.GetDate = t.Slide = t.Logger = void 0);
    class s {
      info(e) {
        console.log(
          '%cInfo: %c' + e,
          'color:#FF0080;font-weight:bold',
          'color: #FF509B'
        );
      }
      warn(e) {
        console.log(
          '%cWarn: %c' + e,
          'color:#FF6600;font-weight:bold',
          'color: #FF9933'
        );
      }
      tips(e) {
        console.log(
          '%cTips: %c' + e,
          'color:#00B200;font-weight:bold',
          'color: #00CC33'
        );
      }
    }
    t.Logger = s;
    t.Slide = class {
      isUp(e = {}, t = {}) {
        const { startX: a, startY: n } = e,
          o = t.clientX - a;
        return (
          t.clientY - n < -60 &&
          o < 20 &&
          o > -20 &&
          ((this.slideLock = !1), !0)
        );
      }
      isDown(e = {}, t = {}) {
        const { startX: a, startY: n } = e,
          o = t.clientX - a;
        return t.clientY - n > 60 && o < 20 && o > -20;
      }
      isLeft(e = {}, t = {}) {
        const { startX: a, startY: n } = e,
          o = t.clientX - a,
          s = t.clientY - n;
        return o < -60 && s < 20 && s > -20;
      }
      isRight(e = {}, t = {}) {
        const { startX: a, startY: n } = e,
          o = t.clientX - a,
          s = t.clientY - n;
        return o > 60 && s < 20 && s > -20;
      }
    };
    class r {
      newDate(e, t, a) {
        let n = `${+e}-${+t}-${+a}`;
        return l() && (n = `${+e}/${+t}/${+a}`), new Date(n);
      }
      thisMonthDays(e, t) {
        return new Date(e, t, 0).getDate();
      }
      firstDayOfWeek(e, t) {
        return new Date(Date.UTC(e, t - 1, 1)).getDay();
      }
      dayOfWeek(e, t, a) {
        return new Date(Date.UTC(e, t - 1, a)).getDay();
      }
      todayDate() {
        const e = new Date();
        return {
          year: e.getFullYear(),
          month: e.getMonth() + 1,
          date: e.getDate()
        };
      }
      todayTimestamp() {
        const { year: e, month: t, date: a } = this.todayDate();
        return this.newDate(e, t, a).getTime();
      }
    }
    function l() {
      const e = o();
      return /iphone|ios/i.test(e.platform);
    }
    function d() {
      const e = getCurrentPages();
      return e[e.length - 1];
    }
    function c(e = []) {
      const t = new r(),
        a = e[0].split('-'),
        n = e[1].split('-'),
        o = new s();
      return 3 !== a.length || 3 !== n.length
        ? (o.warn('enableArea() 参数格式为: ["2018-2-1", "2018-3-1"]'), {})
        : {
            start: a,
            end: n,
            startTimestamp: t.newDate(a[0], a[1], a[2]).getTime(),
            endTimestamp: t.newDate(n[0], n[1], n[2]).getTime()
          };
    }
    function i(e = []) {
      const t = new s(),
        a = new r(),
        n = [];
      return (
        e.forEach(e => {
          if ('string' != typeof e)
            return t.warn('enableDays()入参日期格式错误');
          const o = e.split('-');
          if (3 !== o.length) return t.warn('enableDays()入参日期格式错误');
          const s = a.newDate(o[0], o[1], o[2]).getTime();
          n.push(s);
        }),
        n
      );
    }
    t.GetDate = r;
    t.initialTasks = { flag: 'finished', tasks: [] };
  },
  function(e, t, a) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    var n = class {
      constructor(e) {
        this.Component = e;
      }
      getData(e) {
        if (!e) return this.Component.data;
        if (e.includes('.')) {
          let t = e.split('.'),
            a = t.length,
            n = null;
          for (let e = 0; e < a; e++) {
            const a = t[e];
            0 === e
              ? void 0 !== this.Component.data[a] &&
                (n = this.Component.data[a])
              : (n = void 0 !== n[a] ? n[a] : null);
          }
          return n;
        }
        return this.Component.data[e];
      }
      setData(e, t = () => {}) {
        e && 'object' == typeof e && this.Component.setData(e, t);
      }
    };
    t.default = n;
  },
  function(e, t, a) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    class n {
      constructor(e) {
        this.Component = e;
      }
      getCalendarConfig() {
        return this.Component.config;
      }
      setCalendarConfig(e, t) {
        this.Component.config[e] = t;
      }
    }
    t.default = e => new n(e);
  },
  function(e, t, a) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    var n = l(a(1)),
      o = l(a(4)),
      s = l(a(2)),
      r = a(0);
    function l(e) {
      return e && e.__esModule ? e : { default: e };
    }
    const d = new r.GetDate(),
      c = new r.Logger();
    class i extends n.default {
      constructor(e) {
        super(e), (this.Component = e);
      }
      switchWeek(e, t) {
        return new Promise((a, n) => {
          if ((0, s.default)(this.Component).getCalendarConfig().multi)
            return c.warn('多选模式不能切换周月视图');
          const { selectedDay: r = [], curYear: l, curMonth: d } = this.getData(
            'calendar'
          );
          if (!r.length) return;
          const i = r[0];
          if ('week' === e) {
            if (this.Component.weekMode) return;
            (this.Component.weekMode = !0),
              this.setData({ 'calendar.weekMode': !0 }),
              this.selectedDayWeekAllDays(t || i)
                .then(a)
                .catch(n);
          } else
            (this.Component.weekMode = !1),
              this.setData({ 'calendar.weekMode': !1 }),
              (0, o.default)(this.Component)
                .renderCalendar(l, d, t)
                .then(a)
                .catch(n);
        });
      }
      updateCurrYearAndMonth(e) {
        let { days: t, curYear: a, curMonth: n } = this.getData('calendar');
        const { month: o } = t[0],
          { month: s } = t[t.length - 1],
          r = d.thisMonthDays(a, n),
          l = t[t.length - 1],
          c = t[0];
        return (
          (l.day + 7 > r || (n === o && o !== s)) && 'next' === e
            ? (n += 1) > 12 && ((a += 1), (n = 1))
            : (+c.day <= 7 || (n === s && o !== s)) &&
              'prev' === e &&
              (n -= 1) <= 0 &&
              ((a -= 1), (n = 12)),
          { Uyear: a, Umonth: n }
        );
      }
      calculateLastDay() {
        const { days: e, curYear: t, curMonth: a } = this.getData('calendar');
        return {
          lastDayInThisWeek: e[e.length - 1].day,
          lastDayInThisMonth: d.thisMonthDays(t, a)
        };
      }
      calculateFirstDay() {
        const { days: e } = this.getData('calendar');
        return { firstDayInThisWeek: e[0].day };
      }
      firstWeekInMonth(e, t) {
        const a = [1, 6 - d.dayOfWeek(e, t, 1) + 1];
        return (this.getData('calendar.days') || []).slice(a[0] - 1, a[1]);
      }
      lastWeekInMonth(e, t) {
        const a = d.thisMonthDays(e, t),
          n = [a - d.dayOfWeek(e, t, a), a];
        return (this.getData('calendar.days') || []).slice(n[0] - 1, n[1]);
      }
      initSelectedDay(e) {
        const t = [...e],
          {
            selectedDay: a = [],
            todoLabels: n = [],
            showLabelAlways: o
          } = this.getData('calendar'),
          s = a.map(e => `${+e.year}-${+e.month}-${+e.day}`),
          r = n.map(e => `${+e.year}-${+e.month}-${+e.day}`);
        return (
          t.forEach(e => {
            s.includes(`${+e.year}-${+e.month}-${+e.day}`)
              ? (e.choosed = !0)
              : (e.choosed = !1);
            const t = r.indexOf(`${+e.year}-${+e.month}-${+e.day}`);
            if (-1 !== t) {
              e.showTodoLabel = !!o || !e.choosed;
              const a = n[t];
              e.showTodoLabel && a && a.todoText && (e.todoText = a.todoText);
            }
          }),
          t
        );
      }
      setEnableAreaOnWeekMode(e) {
        let {
          todayTimestamp: t,
          enableAreaTimestamp: a = [],
          enableDaysTimestamp: n = []
        } = this.getData('calendar');
        e.forEach(e => {
          const o = d.newDate(e.year, e.month, e.day).getTime();
          let r = !1;
          a.length
            ? (+a[0] > +o || +o > +a[1]) && !n.includes(+o) && (r = !0)
            : n.length && !n.includes(+o) && (r = !0),
            r && ((e.disable = !0), (e.choosed = !1));
          const { disablePastDay: l } =
            (0, s.default)(this.Component).getCalendarConfig() || {};
          l && o - t < 0 && !e.disable && (e.disable = !0);
        });
      }
      calculateNextWeekDays() {
        let {
            lastDayInThisWeek: e,
            lastDayInThisMonth: t
          } = this.calculateLastDay(),
          { curYear: a, curMonth: n } = this.getData('calendar'),
          o = [];
        if (t - e >= 7) {
          const { Uyear: t, Umonth: s } = this.updateCurrYearAndMonth('next');
          (a = t), (n = s);
          for (let t = e + 1; t <= e + 7; t++)
            o.push({ year: a, month: n, day: t, week: d.dayOfWeek(a, n, t) });
        } else {
          for (let s = e + 1; s <= t; s++)
            o.push({ year: a, month: n, day: s, week: d.dayOfWeek(a, n, s) });
          const { Uyear: s, Umonth: r } = this.updateCurrYearAndMonth('next');
          (a = s), (n = r);
          for (let s = 1; s <= 7 - (t - e); s++)
            o.push({ year: a, month: n, day: s, week: d.dayOfWeek(a, n, s) });
        }
        (o = this.initSelectedDay(o)),
          this.setEnableAreaOnWeekMode(o),
          this.setData({
            'calendar.curYear': a,
            'calendar.curMonth': n,
            'calendar.days': o
          });
      }
      calculatePrevWeekDays() {
        let { firstDayInThisWeek: e } = this.calculateFirstDay(),
          { curYear: t, curMonth: a } = this.getData('calendar'),
          n = [];
        if (e - 7 > 0) {
          const { Uyear: o, Umonth: s } = this.updateCurrYearAndMonth('prev');
          (t = o), (a = s);
          for (let o = e - 7; o < e; o++)
            n.push({ year: t, month: a, day: o, week: d.dayOfWeek(t, a, o) });
        } else {
          let o = [];
          for (let n = 1; n < e; n++)
            o.push({ year: t, month: a, day: n, week: d.dayOfWeek(t, a, n) });
          const { Uyear: s, Umonth: r } = this.updateCurrYearAndMonth('prev');
          (t = s), (a = r);
          const l = d.thisMonthDays(t, a);
          for (let o = l - Math.abs(e - 7); o <= l; o++)
            n.push({ year: t, month: a, day: o, week: d.dayOfWeek(t, a, o) });
          n = n.concat(o);
        }
        (n = this.initSelectedDay(n)),
          this.setEnableAreaOnWeekMode(n),
          this.setData({
            'calendar.curYear': t,
            'calendar.curMonth': a,
            'calendar.days': n
          });
      }
      selectedDayWeekAllDays(e) {
        return new Promise((t, a) => {
          let { days: n, curYear: o, curMonth: s } = this.getData('calendar'),
            { year: r, month: l, day: c } = e,
            i = this.lastWeekInMonth(r, l);
          const h = this.firstWeekInMonth(r, l);
          if (
            ((o === r && s === l) || (c = 1),
            o !== r && (r = o),
            s !== l && (l = s),
            h.find(e => e.day === c))
          ) {
            let e = [];
            const t = d.thisMonthDays(r, l - 1),
              { Uyear: a, Umonth: c } = this.updateCurrYearAndMonth('prev');
            (o = a), (s = c);
            for (let a = t - (7 - h.length) + 1; a <= t; a++)
              e.push({ year: o, month: s, day: a, week: d.dayOfWeek(o, s, a) });
            n = e.concat(h);
          } else if (i.find(e => e.day === c)) {
            const e = [];
            if (i && i.length < 7) {
              const { Uyear: t, Umonth: a } = this.updateCurrYearAndMonth(
                'next'
              );
              (o = t), (s = a);
              for (let t = 1, a = 7 - i.length; t <= a; t++)
                e.push({
                  year: o,
                  month: s,
                  day: t,
                  week: d.dayOfWeek(o, s, t)
                });
            }
            n = i.concat(e);
          } else {
            const e = d.dayOfWeek(r, l, c),
              t = [c - e, c + (6 - e)];
            n = n.slice(t[0] - 1, t[1]);
          }
          (n = this.initSelectedDay(n)),
            this.setData(
              {
                'calendar.days': n,
                'calendar.empytGrids': [],
                'calendar.lastEmptyGrids': []
              },
              t
            );
        });
      }
    }
    t.default = e => new i(e);
  },
  function(e, t, a) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    var n = r(a(5)),
      o = r(a(1)),
      s = a(0);
    function r(e) {
      return e && e.__esModule ? e : { default: e };
    }
    const l = new s.GetDate();
    class d extends o.default {
      constructor(e) {
        super(e), (this.Component = e);
      }
      getCalendarConfig() {
        return this.Component.config;
      }
      renderCalendar(e, t, a) {
        return new Promise((o, s) => {
          this.calculateEmptyGrids(e, t), this.calculateDays(e, t, a);
          const { todoLabels: r } = this.getData('calendar') || {};
          r &&
            r instanceof Array &&
            r.find(e => +e.month == +t) &&
            (0, n.default)(this.Component).setTodoLabels(),
            this.Component.firstRender || o();
        });
      }
      calculateEmptyGrids(e, t) {
        this.calculatePrevMonthGrids(e, t), this.calculateNextMonthGrids(e, t);
      }
      calculatePrevMonthGrids(e, t) {
        let a = [];
        const n = l.thisMonthDays(e, t - 1);
        let o = l.firstDayOfWeek(e, t);
        const s = this.getCalendarConfig() || {};
        if (
          ('Mon' === s.firstDayOfWeek && (0 === o ? (o = 6) : (o -= 1)), o > 0)
        ) {
          const e = n - o,
            { onlyShowCurrentMonth: t } = s;
          for (let o = n; o > e; o--) t ? a.push('') : a.push(o);
          this.setData({ 'calendar.empytGrids': a.reverse() });
        } else this.setData({ 'calendar.empytGrids': null });
      }
      calculateNextMonthGrids(e, t) {
        let a = [];
        const n = l.thisMonthDays(e, t);
        let o = l.dayOfWeek(e, t, n);
        const s = this.getCalendarConfig() || {};
        if (
          ('Mon' === s.firstDayOfWeek && (0 === o ? (o = 6) : (o -= 1)),
          6 != +o)
        ) {
          let e = 7 - (o + 1);
          const { onlyShowCurrentMonth: t } = s;
          for (let n = 1; n <= e; n++) t ? a.push('') : a.push(n);
          this.setData({ 'calendar.lastEmptyGrids': a });
        } else this.setData({ 'calendar.lastEmptyGrids': null });
      }
      initSelectedDayWhenRender(e, t, a) {
        let n = [];
        const o = this.getCalendarConfig();
        if (o.noDefault) (n = []), (o.noDefault = !1);
        else {
          const o = this.getData('calendar') || {};
          n = a
            ? [
                {
                  year: e,
                  month: t,
                  day: a,
                  choosed: !0,
                  week: l.dayOfWeek(e, t, a)
                }
              ]
            : o.selectedDay;
        }
        return n;
      }
      calculateDays(e, t, a) {
        let n = [];
        const {
            todayTimestamp: o,
            disableDays: r = [],
            enableArea: d = [],
            enableDays: c = [],
            enableAreaTimestamp: i = []
          } = this.getData('calendar'),
          h = l.thisMonthDays(e, t);
        let u = (0, s.converEnableDaysToTimestamp)(c);
        d.length && (u = (0, s.delRepeatedEnableDay)(c, d));
        for (let a = 1; a <= h; a++)
          n.push({
            year: e,
            month: t,
            day: a,
            choosed: !1,
            week: l.dayOfWeek(e, t, a)
          });
        const y = this.initSelectedDayWhenRender(e, t, a),
          f = y.map(e => `${+e.year}-${+e.month}-${+e.day}`),
          m = r.map(e => `${+e.year}-${+e.month}-${+e.day}`);
        n.forEach(e => {
          const t = `${+e.year}-${+e.month}-${+e.day}`;
          f.includes(t) && (e.choosed = !0), m.includes(t) && (e.disable = !0);
          const a = l.newDate(e.year, e.month, e.day).getTime(),
            { disablePastDay: n } = this.getCalendarConfig();
          n && a - o < 0 && !e.disable && ((e.disable = !0), (e.choosed = !1));
          let s = !1;
          i.length
            ? (+i[0] > +a || +a > +i[1]) && !u.includes(+a) && (s = !0)
            : u.length && !u.includes(+a) && (s = !0),
            s && ((e.disable = !0), (e.choosed = !1));
        }),
          this.setData({ 'calendar.days': n, 'calendar.selectedDay': y || [] });
      }
    }
    t.default = e => new d(e);
  },
  function(e, t, a) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    var n,
      o = (n = a(1)) && n.__esModule ? n : { default: n },
      s = a(0);
    const r = new s.Logger();
    class l extends o.default {
      constructor(e) {
        super(e), (this.Component = e);
      }
      showTodoLabels(e, t, a) {
        e.forEach(e => {
          if (this.Component.weekMode)
            t.forEach((n, o) => {
              if (+n.day == +e.day) {
                const n = t[o];
                (n.hasTodo = !0),
                  (n.todoText = e.todoText),
                  a &&
                    a.length &&
                    +a[0].day == +e.day &&
                    (n.showTodoLabel = !0);
              }
            });
          else {
            const n = t[e.day - 1];
            if (!n) return;
            (n.hasTodo = !0),
              (n.todoText = e.todoText),
              a &&
                a.length &&
                +a[0].day == +e.day &&
                (t[a[0].day - 1].showTodoLabel = !0);
          }
        });
      }
      setTodoLabels(e) {
        e && (this.Component.todoConfig = e);
        const t = this.getData('calendar');
        if (!t || !t.days) return r.warn('请等待日历初始化完成后再调用该方法');
        const a = t.days.slice(),
          { curYear: n, curMonth: o } = t,
          {
            circle: l,
            dotColor: d = '',
            pos: c = 'bottom',
            showLabelAlways: i,
            days: h = []
          } = e || this.Component.todoConfig || {},
          { todoLabels: u = [], todoLabelPos: y, todoLabelColor: f } = t,
          m = h.filter(e => +e.year == +n && +e.month == +o);
        let D = u.filter(e => +e.year == +n && +e.month == +o);
        m.concat(D).forEach(e => {
          let t = {};
          (t = this.Component.weekMode
            ? a.find(t => +t.day == +e.day)
            : a[e.day - 1]) &&
            ((t.showTodoLabel = !!i || !t.choosed),
            t.showTodoLabel && e.todoText && (t.todoText = e.todoText));
        });
        const p = {
          'calendar.days': a,
          'calendar.todoLabels': (0, s.uniqueArrayByDate)(h.concat(u))
        };
        l ||
          (c && c !== y && (p['calendar.todoLabelPos'] = c),
          d && d !== f && (p['calendar.todoLabelColor'] = d)),
          (p['calendar.todoLabelCircle'] = l || !1),
          (p['calendar.showLabelAlways'] = i || !1),
          this.setData(p);
      }
      filterTodos(e) {
        const t = this.getData('calendar.todoLabels') || [],
          a = e.map(e => `${e.year}-${e.month}-${e.day}`);
        return t.filter(e => !a.includes(`${e.year}-${e.month}-${e.day}`));
      }
      deleteTodoLabels(e) {
        if (!(e instanceof Array && e.length)) return;
        const t = this.filterTodos(e),
          { days: a, curYear: n, curMonth: o } = this.getData('calendar'),
          s = t.filter(e => n === +e.year && o === +e.month);
        a.forEach(e => {
          e.showTodoLabel = !1;
        }),
          s.forEach(e => {
            a[e.day - 1].showTodoLabel = !a[e.day - 1].choosed;
          }),
          this.setData({ 'calendar.days': a, 'calendar.todoLabels': t });
      }
      clearTodoLabels() {
        const { days: e = [] } = this.getData('calendar'),
          t = [].concat(e);
        t.forEach(e => {
          e.showTodoLabel = !1;
        }),
          this.setData({ 'calendar.days': t, 'calendar.todoLabels': [] });
      }
      getTodoLabels() {
        return this.getData('calendar.todoLabels') || [];
      }
    }
    t.default = e => new l(e);
  },
  function(e, t, a) {
    'use strict';
    var n,
      o = (n = a(3)) && n.__esModule ? n : { default: n },
      s = a(0),
      r = (function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
          for (var a in e)
            if (Object.prototype.hasOwnProperty.call(e, a)) {
              var n =
                Object.defineProperty && Object.getOwnPropertyDescriptor
                  ? Object.getOwnPropertyDescriptor(e, a)
                  : {};
              n.get || n.set ? Object.defineProperty(t, a, n) : (t[a] = e[a]);
            }
        return (t.default = e), t;
      })(a(7));
    const l = new s.Slide(),
      d = new s.Logger();
    Component({
      options: { multipleSlots: !0 },
      properties: { calendarConfig: { type: Object, value: {} } },
      data: {
        handleMap: {
          prev_year: 'chooseYear',
          prev_month: 'chooseMonth',
          next_month: 'chooseMonth',
          next_year: 'chooseYear'
        }
      },
      lifetimes: {
        attached: function() {
          (0, r.default)(this, this.data.calendarConfig);
        }
      },
      attached: function() {
        (0, r.default)(this, this.data.calendarConfig);
      },
      methods: {
        chooseDate(e) {
          const { type: t } = e.currentTarget.dataset;
          t && this[this.data.handleMap[t]](t);
        },
        chooseYear(e) {
          const { curYear: t, curMonth: a } = this.data.calendar;
          if (!t || !a) return d.warn('异常：未获取到当前年月');
          if (this.weekMode) return console.warn('周视图下不支持点击切换年月');
          let n = +t,
            o = +a;
          'prev_year' === e ? (n -= 1) : 'next_year' === e && (n += 1),
            this.calculate(t, a, n, o);
        },
        chooseMonth(e) {
          const { curYear: t, curMonth: a } = this.data.calendar;
          if (!t || !a) return d.warn('异常：未获取到当前年月');
          if (this.weekMode) return console.warn('周视图下不支持点击切换年月');
          let n = +t,
            o = +a;
          'prev_month' === e
            ? (o -= 1) < 1 && ((n -= 1), (o = 12))
            : 'next_month' === e && (o += 1) > 12 && ((n += 1), (o = 1)),
            this.render(t, a, n, o);
        },
        render(e, t, a, n) {
          r.whenChangeDate.call(this, {
            curYear: e,
            curMonth: t,
            newYear: a,
            newMonth: n
          }),
            this.setData({ 'calendar.curYear': a, 'calendar.curMonth': n }),
            r.renderCalendar.call(this, a, n);
        },
        tapDayItem(e) {
          const { idx: t, disable: a } = e.currentTarget.dataset;
          if (a) return;
          let { days: n, selectedDay: o, todoLabels: s } =
            this.data.calendar || [];
          const l = this.config || {},
            { multi: d, onTapDay: c } = l,
            i = {
              e: e,
              idx: t,
              onTapDay: c,
              todoLabels: s,
              selectedDays: o,
              currentSelected: {},
              days: n.slice()
            };
          d
            ? r.whenMulitSelect.call(this, i)
            : r.whenSingleSelect.call(this, i);
        },
        doubleClickToToday() {
          if (!this.config.multi && !this.weekMode)
            if (
              (void 0 === this.count ? (this.count = 1) : (this.count += 1),
              this.lastClick)
            ) {
              new Date().getTime() - this.lastClick < 500 &&
                this.count >= 2 &&
                r.jump.call(this),
                (this.count = void 0),
                (this.lastClick = void 0);
            } else this.lastClick = new Date().getTime();
        },
        calendarTouchstart(e) {
          const t = e.touches[0],
            a = t.clientX,
            n = t.clientY;
          (this.slideLock = !0),
            this.setData({ 'gesture.startX': a, 'gesture.startY': n });
        },
        calendarTouchmove(e) {
          const { gesture: t } = this.data;
          if (this.slideLock) {
            if (l.isLeft(t, e.touches[0])) {
              if ((this.setData({ 'calendar.leftSwipe': 1 }), this.weekMode))
                return (
                  (this.slideLock = !1),
                  (0, o.default)(this).calculateNextWeekDays()
                );
              this.chooseMonth('next_month'), (this.slideLock = !1);
            }
            if (l.isRight(t, e.touches[0])) {
              if ((this.setData({ 'calendar.rightSwipe': 1 }), this.weekMode))
                return (
                  (this.slideLock = !1),
                  (0, o.default)(this).calculatePrevWeekDays()
                );
              this.chooseMonth('prev_month'), (this.slideLock = !1);
            }
          }
        },
        calendarTouchend(e) {
          this.setData({ 'calendar.leftSwipe': 0, 'calendar.rightSwipe': 0 });
        }
      }
    });
  },
  function(e, t, a) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.getCurrentYM = L),
      (t.getSelectedDay = v),
      (t.cancelAllSelectedDay = $),
      (t.jump = S),
      (t.setTodoLabels = W),
      (t.deleteTodoLabels = O),
      (t.clearTodoLabels = A),
      (t.getTodoLabels = _),
      (t.disableDay = x),
      (t.enableArea = Y),
      (t.enableDays = E),
      (t.setSelectedDays = P),
      (t.getCalendarConfig = j),
      (t.setCalendarConfig = G),
      (t.switchView = U),
      (t.default = t.calculateNextWeekDays = t.calculatePrevWeekDays = t.whenMulitSelect = t.whenSingleSelect = t.renderCalendar = t.whenChangeDate = void 0);
    var n = i(a(8)),
      o = i(a(3)),
      s = i(a(5)),
      r = i(a(1)),
      l = i(a(4)),
      d = i(a(2)),
      c = a(0);
    function i(e) {
      return e && e.__esModule ? e : { default: e };
    }
    let h = {},
      u = new c.Logger(),
      y = new c.GetDate(),
      f = null;
    function m(e) {
      e && (h = (0, c.getComponent)(e));
    }
    function D(e, t) {
      return m(t), (f = new r.default(h)).getData(e);
    }
    function p(e, t = () => {}) {
      return new r.default(h).setData(e, t);
    }
    const g = {
        renderCalendar: (e, t, a) =>
          new Promise((n, o) => {
            (0, l.default)(h)
              .renderCalendar(e, t, a)
              .then(() => {
                !(function(e) {
                  e.calendar = {
                    jump: S,
                    switchView: U,
                    disableDay: x,
                    enableArea: Y,
                    enableDays: E,
                    getCurrentYM: L,
                    getSelectedDay: v,
                    cancelAllSelectedDay: $,
                    setTodoLabels: W,
                    getTodoLabels: _,
                    deleteTodoLabels: O,
                    clearTodoLabels: A,
                    setSelectedDays: P,
                    getCalendarConfig: j,
                    setCalendarConfig: G
                  };
                })((0, c.getCurrentPage)()),
                  h.triggerEvent('afterCalendarRender', h),
                  (h.firstRender = !0),
                  (c.initialTasks.flag = 'finished'),
                  c.initialTasks.tasks.length && c.initialTasks.tasks.shift()(),
                  n();
              });
          }),
        whenChangeDate({ curYear: e, curMonth: t, newYear: a, newMonth: n }) {
          h.triggerEvent('whenChangeMonth', {
            current: { year: e, month: t },
            next: { year: a, month: n }
          });
        },
        whenMulitSelect(e = {}) {
          this && this.config && (h = this);
          let { currentSelected: t, selectedDays: a = [] } = e;
          const { days: n, idx: o } = e,
            s = n[o];
          if (s) {
            if (((s.choosed = !s.choosed), s.choosed)) {
              (t = s).cancel = !1;
              const { showLabelAlways: e } = D('calendar');
              e && t.showTodoLabel
                ? (t.showTodoLabel = !0)
                : (t.showTodoLabel = !1),
                a.push(t);
            } else
              (s.cancel = !0),
                (t = s),
                (a = a.filter(
                  e =>
                    `${e.year}-${e.month}-${e.day}` !==
                    `${t.year}-${t.month}-${t.day}`
                )),
                e.todoLabels &&
                  e.todoLabels.forEach(e => {
                    `${t.year}-${t.month}-${t.day}` ===
                      `${e.year}-${e.month}-${e.day}` && (t.showTodoLabel = !0);
                  });
            if ((0, d.default)(h).getCalendarConfig().takeoverTap)
              return h.triggerEvent('onTapDay', t);
            p({ 'calendar.days': n, 'calendar.selectedDay': a }),
              g.afterTapDay(t, a);
          }
        },
        whenSingleSelect(e = {}) {
          this && this.config && (h = this);
          let { currentSelected: t, selectedDays: a = [] } = e,
            n = [];
          const { days: o = [], idx: r } = e,
            l = (a[0] || {}).day,
            c = (l && o[l - 1]) || {},
            { month: i, year: u } = o[0] || {},
            { calendar: y = {} } = D(),
            f = o[r],
            m = (0, d.default)(h).getCalendarConfig();
          if (((t = f), m.takeoverTap)) return h.triggerEvent('onTapDay', t);
          if ((g.afterTapDay(t), !m.inverse && c.day === f.day)) return;
          if (
            (h.weekMode &&
              o.forEach((e, t) => {
                e.day === l && (o[t].choosed = !1);
              }),
            y.todoLabels &&
              (n = y.todoLabels.filter(e => +e.year === u && +e.month === i)),
            (0, s.default)(h).showTodoLabels(n, o, a),
            !f)
          )
            return;
          const b = { 'calendar.days': o };
          c.day !== f.day
            ? ((c.choosed = !1),
              (f.choosed = !0),
              (y.showLabelAlways && f.showTodoLabel) || (f.showTodoLabel = !1),
              (b['calendar.selectedDay'] = [t]))
            : m.inverse &&
              ((f.choosed = !f.choosed),
              f.choosed &&
                (f.showTodoLabel && y.showLabelAlways
                  ? (f.showTodoLabel = !0)
                  : (f.showTodoLabel = !1)),
              (b['calendar.selectedDay'] = [])),
            p(b);
        },
        afterTapDay(e, t) {
          const a = (0, d.default)(h).getCalendarConfig(),
            { multi: n } = a;
          n
            ? h.triggerEvent('afterTapDay', {
                currentSelected: e,
                selectedDays: t
              })
            : h.triggerEvent('afterTapDay', e);
        },
        jumpToToday() {
          const { year: e, month: t, date: a } = y.todayDate();
          p({
            'calendar.curYear': e,
            'calendar.curMonth': t,
            'calendar.selectedDay': [
              { year: e, day: a, month: t, choosed: !0 }
            ],
            'calendar.todayTimestamp': y.todayTimestamp()
          }),
            g.renderCalendar(e, t, a);
        }
      },
      b = g.whenChangeDate;
    t.whenChangeDate = b;
    const w = g.renderCalendar;
    t.renderCalendar = w;
    const T = g.whenSingleSelect;
    t.whenSingleSelect = T;
    const C = g.whenMulitSelect;
    t.whenMulitSelect = C;
    const M = g.calculatePrevWeekDays;
    t.calculatePrevWeekDays = M;
    const k = g.calculateNextWeekDays;
    function L(e) {
      return (
        m(e), { year: D('calendar.curYear'), month: D('calendar.curMonth') }
      );
    }
    function v(e) {
      return m(e), D('calendar.selectedDay');
    }
    function $(e) {
      m(e);
      const t = [...D('calendar.days')];
      t.map(e => {
        e.choosed = !1;
      }),
        p({ 'calendar.days': t, 'calendar.selectedDay': [] });
    }
    function S(e, t, a, n) {
      m(n);
      const { selectedDay: o = [] } = D('calendar') || {},
        { year: s, month: r, day: l } = o[0] || {};
      if (+s != +e || +r != +t || +l != +a)
        if (e && t) {
          if ('number' != typeof +e || 'number' != typeof +t)
            return u.warn('jump 函数年月日参数必须为数字');
          const n = y.todayTimestamp();
          p(
            {
              'calendar.curYear': e,
              'calendar.curMonth': t,
              'calendar.todayTimestamp': n
            },
            () => {
              if ('number' == typeof +a) return g.renderCalendar(e, t, a);
              g.renderCalendar(e, t);
            }
          );
        } else g.jumpToToday();
    }
    function W(e, t) {
      m(t), (0, s.default)(h).setTodoLabels(e);
    }
    function O(e, t) {
      m(t), (0, s.default)(h).deleteTodoLabels(e);
    }
    function A(e) {
      m(e), (0, s.default)(h).clearTodoLabels();
    }
    function _(e) {
      return m(e), (0, s.default)(h).getTodoLabels();
    }
    function x(e = [], t) {
      m(t), (0, n.default)(h).disableDays(e);
    }
    function Y(e = [], t) {
      m(t), (0, n.default)(h).enableArea(e);
    }
    function E(e = [], t) {
      m(t), (0, n.default)(h).enableDays(e);
    }
    function P(e, t) {
      m(t), (0, n.default)(h).setSelectedDays(e);
    }
    function j(e) {
      m(e), (0, d.default)(h).getCalendarConfig();
    }
    function G(e, t, a) {
      m(a), (0, d.default)(h).setCalendarConfig(e, t);
    }
    function U(...e) {
      return new Promise((t, a) => {
        const n = e[0];
        if (!e[1])
          return (0, o.default)(h)
            .switchWeek(n)
            .then(t)
            .catch(a);
        'string' == typeof e[1]
          ? (m(e[1]),
            (0, o.default)(h)
              .switchWeek(n, e[2])
              .then(t)
              .catch(a))
          : 'object' == typeof e[1] &&
            ('string' == typeof e[2] && m(e[1]),
            (0, o.default)(h)
              .switchWeek(n, e[1])
              .then(t)
              .catch(a));
      });
    }
    function I(e, t) {
      (c.initialTasks.flag = 'process'),
        ((h = e).config = t),
        (function(e) {
          let t = ['日', '一', '二', '三', '四', '五', '六'];
          'Mon' === e && (t = ['一', '二', '三', '四', '五', '六', '日']),
            p({ 'calendar.weeksCh': t });
        })(t.firstDayOfWeek),
        (function(e) {
          if (e && 'string' == typeof e) {
            const t = e.split('-');
            if (t.length < 3)
              return u.warn('配置 jumpTo 格式应为: 2018-4-2 或 2018-04-02');
            S(+t[0], +t[1], +t[2]);
          } else !1 === e ? ((h.config.noDefault = !0), S()) : S();
        })(t.defaultDay),
        u.tips(
          '使用中若遇问题请反馈至 https://github.com/treadpit/wx_calendar/issues ✍️'
        );
    }
    t.calculateNextWeekDays = k;
    t.default = (e, t = {}) => {
      if ('process' === c.initialTasks.flag)
        return c.initialTasks.tasks.push(function() {
          I(e, t);
        });
      I(e, t);
    };
  },
  function(e, t, a) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    var n = r(a(1)),
      o = r(a(2)),
      s = a(0);
    function r(e) {
      return e && e.__esModule ? e : { default: e };
    }
    const l = new s.Logger(),
      d = new s.GetDate();
    class c extends n.default {
      constructor(e) {
        super(e), (this.Component = e);
      }
      enableArea(e = []) {
        const t = this.getData('calendar.enableDays') || [];
        let a = [];
        if (
          (t.length && (a = (0, s.delRepeatedEnableDay)(t, e)), 2 === e.length)
        ) {
          const { start: t, end: n, startTimestamp: o, endTimestamp: r } = (0,
          s.convertEnableAreaToTimestamp)(e);
          if (!t || !n) return;
          if (
            (function(e) {
              const {
                start: t,
                end: a,
                startMonthDays: n,
                endMonthDays: o,
                startTimestamp: s,
                endTimestamp: r
              } = e;
              return t[2] > n || t[2] < 1
                ? (l.warn(
                    'enableArea() 开始日期错误，指定日期不在当前月份天数范围内'
                  ),
                  !1)
                : t[1] > 12 || t[1] < 1
                ? (l.warn('enableArea() 开始日期错误，月份超出1-12月份'), !1)
                : a[2] > o || a[2] < 1
                ? (l.warn(
                    'enableArea() 截止日期错误，指定日期不在当前月份天数范围内'
                  ),
                  !1)
                : a[1] > 12 || a[1] < 1
                ? (l.warn('enableArea() 截止日期错误，月份超出1-12月份'), !1)
                : !(s > r) ||
                  (l.warn('enableArea()参数最小日期大于了最大日期'), !1);
            })({
              start: t,
              end: n,
              startMonthDays: d.thisMonthDays(t[0], t[1]),
              endMonthDays: d.thisMonthDays(n[0], n[1]),
              startTimestamp: o,
              endTimestamp: r
            })
          ) {
            let { days: t = [], selectedDay: n = [] } = this.getData(
              'calendar'
            );
            const s = [...t];
            s.forEach(e => {
              const t = d.newDate(e.year, e.month, e.day).getTime();
              (+o > +t || +t > +r) && !a.includes(+t)
                ? ((e.disable = !0),
                  e.choosed &&
                    ((e.choosed = !1),
                    (n = n.filter(
                      t =>
                        `${e.year}-${e.month}-${e.day}` !==
                        `${t.year}-${t.month}-${t.day}`
                    ))))
                : e.disable && (e.disable = !1);
            }),
              this.setData({
                'calendar.days': s,
                'calendar.selectedDay': n,
                'calendar.enableArea': e,
                'calendar.enableAreaTimestamp': [o, r]
              });
          }
        } else
          l.warn(
            'enableArea()参数需为时间范围数组，形如：["2018-8-4" , "2018-8-24"]'
          );
      }
      enableDays(e = []) {
        const {
          enableArea: t = [],
          enableAreaTimestamp: a = []
        } = this.getData('calendar');
        let n = [];
        n = t.length
          ? (0, s.delRepeatedEnableDay)(e, t)
          : (0, s.converEnableDaysToTimestamp)(e);
        let { days: o = [], selectedDay: r = [] } = this.getData('calendar');
        const l = o.slice();
        l.forEach(e => {
          const t = d.newDate(e.year, e.month, e.day).getTime();
          let o = !1;
          a.length
            ? (+a[0] > +t || +t > +a[1]) && !n.includes(+t) && (o = !0)
            : n.includes(+t) || (o = !0),
            o
              ? ((e.disable = !0),
                e.choosed &&
                  ((e.choosed = !1),
                  (r = r.filter(
                    t =>
                      `${e.year}-${e.month}-${e.day}` !==
                      `${t.year}-${t.month}-${t.day}`
                  ))))
              : (e.disable = !1);
        }),
          this.setData({
            'calendar.days': l,
            'calendar.selectedDay': r,
            'calendar.enableDays': e,
            'calendar.enableDaysTimestamp': n
          });
      }
      setSelectedDays(e) {
        if (!(0, o.default)(this.Component).getCalendarConfig().multi)
          return l.warn('单选模式下不能设置多日期选中，请配置 multi');
        const { selectedDay: t, days: a, showLabelAlways: n } = this.getData(
          'calendar'
        );
        let r = [];
        if (e) {
          if (e && e.length) {
            r = t && t.length ? (0, s.uniqueArrayByDate)(t.concat(e)) : e;
            const { year: o, month: l } = a[0],
              d = [];
            r.forEach(e => {
              +e.year == +o &&
                +e.month == +l &&
                d.push(`${e.year}-${e.month}-${e.day}`);
            }),
              a.map(e => {
                d.includes(`${e.year}-${e.month}-${e.day}`) &&
                  ((e.choosed = !0),
                  n && e.showTodoLabel
                    ? (e.showTodoLabel = !0)
                    : (e.showTodoLabel = !1));
              });
          }
        } else
          a.map(e => {
            (e.choosed = !0), (e.showTodoLabel = !1);
          }),
            (r = a);
        (0, o.default)(this.Component).setCalendarConfig('multi', !0),
          this.setData({ 'calendar.days': a, 'calendar.selectedDay': r });
      }
      disableDays(e) {
        const { disableDays: t = [], days: a } = this.getData('calendar');
        if ('[object Array]' !== Object.prototype.toString.call(e))
          return l.warn('disableDays 参数为数组');
        let n = [];
        if (e.length) {
          const o = (n = (0, s.uniqueArrayByDate)(e.concat(t))).map(
            e => `${e.year}-${e.month}-${e.day}`
          );
          a.forEach(e => {
            const t = `${e.year}-${e.month}-${e.day}`;
            o.includes(t) && (e.disable = !0);
          });
        } else
          a.forEach(e => {
            e.disable = !1;
          });
        this.setData({ 'calendar.days': a, 'calendar.disableDays': n });
      }
    }
    t.default = e => new c(e);
  }
]);
