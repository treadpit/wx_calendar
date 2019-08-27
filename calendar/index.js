!(function(e) {
  var t = {};
  function a(n) {
    if (t[n]) return t[n].exports;
    var c = (t[n] = { i: n, l: !1, exports: {} });
    return e[n].call(c.exports, c, c.exports, a), (c.l = !0), c.exports;
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
        for (var c in e)
          a.d(
            n,
            c,
            function(t) {
              return e[t];
            }.bind(null, c)
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
    a((a.s = 7));
})([
  function(e, t, a) {
    'use strict';
    let n;
    function c() {
      return n || (n = wx.getSystemInfoSync());
    }
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.getSystemInfo = c),
      (t.isIos = r),
      (t.getCurrentPage = b),
      (t.getComponent = function(e) {
        const t = new o();
        let a = b() || {};
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
          const { startTimestamp: e, endTimestamp: c } = l(t);
          (a = e), (n = c);
        }
        return f(e).filter(e => e < a || e > n);
      }),
      (t.convertEnableAreaToTimestamp = l),
      (t.converEnableDaysToTimestamp = f),
      (t.initialTasks = t.GetDate = t.Slide = t.Logger = void 0);
    class o {
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
    t.Logger = o;
    t.Slide = class {
      isUp(e = {}, t = {}) {
        const { startX: a, startY: n } = e,
          c = t.clientX - a;
        return (
          t.clientY - n < -60 &&
          c < 20 &&
          c > -20 &&
          ((this.slideLock = !1), !0)
        );
      }
      isDown(e = {}, t = {}) {
        const { startX: a, startY: n } = e,
          c = t.clientX - a;
        return t.clientY - n > 60 && c < 20 && c > -20;
      }
      isLeft(e = {}, t = {}) {
        const { startX: a, startY: n } = e,
          c = t.clientX - a,
          o = t.clientY - n;
        return c < -60 && o < 20 && o > -20;
      }
      isRight(e = {}, t = {}) {
        const { startX: a, startY: n } = e,
          c = t.clientX - a,
          o = t.clientY - n;
        return c > 60 && o < 20 && o > -20;
      }
    };
    class s {
      newDate(e, t, a) {
        let n = `${+e}-${+t}-${+a}`;
        return r() && (n = `${+e}/${+t}/${+a}`), new Date(n);
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
    function r() {
      const e = c();
      return /iphone|ios/i.test(e.platform);
    }
    function b() {
      const e = getCurrentPages();
      return e[e.length - 1];
    }
    function l(e = []) {
      const t = new s(),
        a = e[0].split('-'),
        n = e[1].split('-'),
        c = new o();
      return 3 !== a.length || 3 !== n.length
        ? (c.warn('enableArea() 参数格式为: ["2018-2-1", "2018-3-1"]'), {})
        : {
            start: a,
            end: n,
            startTimestamp: t.newDate(a[0], a[1], a[2]).getTime(),
            endTimestamp: t.newDate(n[0], n[1], n[2]).getTime()
          };
    }
    function f(e = []) {
      const t = new o(),
        a = new s(),
        n = [];
      return (
        e.forEach(e => {
          if ('string' != typeof e)
            return t.warn('enableDays()入参日期格式错误');
          const c = e.split('-');
          if (3 !== c.length) return t.warn('enableDays()入参日期格式错误');
          const o = a.newDate(c[0], c[1], c[2]).getTime();
          n.push(o);
        }),
        n
      );
    }
    t.GetDate = s;
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
    const n = {
        lunarInfo: [
          19416,
          19168,
          42352,
          21717,
          53856,
          55632,
          91476,
          22176,
          39632,
          21970,
          19168,
          42422,
          42192,
          53840,
          119381,
          46400,
          54944,
          44450,
          38320,
          84343,
          18800,
          42160,
          46261,
          27216,
          27968,
          109396,
          11104,
          38256,
          21234,
          18800,
          25958,
          54432,
          59984,
          28309,
          23248,
          11104,
          100067,
          37600,
          116951,
          51536,
          54432,
          120998,
          46416,
          22176,
          107956,
          9680,
          37584,
          53938,
          43344,
          46423,
          27808,
          46416,
          86869,
          19872,
          42416,
          83315,
          21168,
          43432,
          59728,
          27296,
          44710,
          43856,
          19296,
          43748,
          42352,
          21088,
          62051,
          55632,
          23383,
          22176,
          38608,
          19925,
          19152,
          42192,
          54484,
          53840,
          54616,
          46400,
          46752,
          103846,
          38320,
          18864,
          43380,
          42160,
          45690,
          27216,
          27968,
          44870,
          43872,
          38256,
          19189,
          18800,
          25776,
          29859,
          59984,
          27480,
          21952,
          43872,
          38613,
          37600,
          51552,
          55636,
          54432,
          55888,
          30034,
          22176,
          43959,
          9680,
          37584,
          51893,
          43344,
          46240,
          47780,
          44368,
          21977,
          19360,
          42416,
          86390,
          21168,
          43312,
          31060,
          27296,
          44368,
          23378,
          19296,
          42726,
          42208,
          53856,
          60005,
          54576,
          23200,
          30371,
          38608,
          19195,
          19152,
          42192,
          118966,
          53840,
          54560,
          56645,
          46496,
          22224,
          21938,
          18864,
          42359,
          42160,
          43600,
          111189,
          27936,
          44448,
          84835,
          37744,
          18936,
          18800,
          25776,
          92326,
          59984,
          27424,
          108228,
          43744,
          41696,
          53987,
          51552,
          54615,
          54432,
          55888,
          23893,
          22176,
          42704,
          21972,
          21200,
          43448,
          43344,
          46240,
          46758,
          44368,
          21920,
          43940,
          42416,
          21168,
          45683,
          26928,
          29495,
          27296,
          44368,
          84821,
          19296,
          42352,
          21732,
          53600,
          59752,
          54560,
          55968,
          92838,
          22224,
          19168,
          43476,
          41680,
          53584,
          62034,
          54560
        ],
        solarMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        Gan: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
        Zhi: [
          '子',
          '丑',
          '寅',
          '卯',
          '辰',
          '巳',
          '午',
          '未',
          '申',
          '酉',
          '戌',
          '亥'
        ],
        Animals: [
          '鼠',
          '牛',
          '虎',
          '兔',
          '龙',
          '蛇',
          '马',
          '羊',
          '猴',
          '鸡',
          '狗',
          '猪'
        ],
        solarTerm: [
          '小寒',
          '大寒',
          '立春',
          '雨水',
          '惊蛰',
          '春分',
          '清明',
          '谷雨',
          '立夏',
          '小满',
          '芒种',
          '夏至',
          '小暑',
          '大暑',
          '立秋',
          '处暑',
          '白露',
          '秋分',
          '寒露',
          '霜降',
          '立冬',
          '小雪',
          '大雪',
          '冬至'
        ],
        sTermInfo: [
          '9778397bd097c36b0b6fc9274c91aa',
          '97b6b97bd19801ec9210c965cc920e',
          '97bcf97c3598082c95f8c965cc920f',
          '97bd0b06bdb0722c965ce1cfcc920f',
          'b027097bd097c36b0b6fc9274c91aa',
          '97b6b97bd19801ec9210c965cc920e',
          '97bcf97c359801ec95f8c965cc920f',
          '97bd0b06bdb0722c965ce1cfcc920f',
          'b027097bd097c36b0b6fc9274c91aa',
          '97b6b97bd19801ec9210c965cc920e',
          '97bcf97c359801ec95f8c965cc920f',
          '97bd0b06bdb0722c965ce1cfcc920f',
          'b027097bd097c36b0b6fc9274c91aa',
          '9778397bd19801ec9210c965cc920e',
          '97b6b97bd19801ec95f8c965cc920f',
          '97bd09801d98082c95f8e1cfcc920f',
          '97bd097bd097c36b0b6fc9210c8dc2',
          '9778397bd197c36c9210c9274c91aa',
          '97b6b97bd19801ec95f8c965cc920e',
          '97bd09801d98082c95f8e1cfcc920f',
          '97bd097bd097c36b0b6fc9210c8dc2',
          '9778397bd097c36c9210c9274c91aa',
          '97b6b97bd19801ec95f8c965cc920e',
          '97bcf97c3598082c95f8e1cfcc920f',
          '97bd097bd097c36b0b6fc9210c8dc2',
          '9778397bd097c36c9210c9274c91aa',
          '97b6b97bd19801ec9210c965cc920e',
          '97bcf97c3598082c95f8c965cc920f',
          '97bd097bd097c35b0b6fc920fb0722',
          '9778397bd097c36b0b6fc9274c91aa',
          '97b6b97bd19801ec9210c965cc920e',
          '97bcf97c3598082c95f8c965cc920f',
          '97bd097bd097c35b0b6fc920fb0722',
          '9778397bd097c36b0b6fc9274c91aa',
          '97b6b97bd19801ec9210c965cc920e',
          '97bcf97c359801ec95f8c965cc920f',
          '97bd097bd097c35b0b6fc920fb0722',
          '9778397bd097c36b0b6fc9274c91aa',
          '97b6b97bd19801ec9210c965cc920e',
          '97bcf97c359801ec95f8c965cc920f',
          '97bd097bd097c35b0b6fc920fb0722',
          '9778397bd097c36b0b6fc9274c91aa',
          '97b6b97bd19801ec9210c965cc920e',
          '97bcf97c359801ec95f8c965cc920f',
          '97bd097bd07f595b0b6fc920fb0722',
          '9778397bd097c36b0b6fc9210c8dc2',
          '9778397bd19801ec9210c9274c920e',
          '97b6b97bd19801ec95f8c965cc920f',
          '97bd07f5307f595b0b0bc920fb0722',
          '7f0e397bd097c36b0b6fc9210c8dc2',
          '9778397bd097c36c9210c9274c920e',
          '97b6b97bd19801ec95f8c965cc920f',
          '97bd07f5307f595b0b0bc920fb0722',
          '7f0e397bd097c36b0b6fc9210c8dc2',
          '9778397bd097c36c9210c9274c91aa',
          '97b6b97bd19801ec9210c965cc920e',
          '97bd07f1487f595b0b0bc920fb0722',
          '7f0e397bd097c36b0b6fc9210c8dc2',
          '9778397bd097c36b0b6fc9274c91aa',
          '97b6b97bd19801ec9210c965cc920e',
          '97bcf7f1487f595b0b0bb0b6fb0722',
          '7f0e397bd097c35b0b6fc920fb0722',
          '9778397bd097c36b0b6fc9274c91aa',
          '97b6b97bd19801ec9210c965cc920e',
          '97bcf7f1487f595b0b0bb0b6fb0722',
          '7f0e397bd097c35b0b6fc920fb0722',
          '9778397bd097c36b0b6fc9274c91aa',
          '97b6b97bd19801ec9210c965cc920e',
          '97bcf7f1487f531b0b0bb0b6fb0722',
          '7f0e397bd097c35b0b6fc920fb0722',
          '9778397bd097c36b0b6fc9274c91aa',
          '97b6b97bd19801ec9210c965cc920e',
          '97bcf7f1487f531b0b0bb0b6fb0722',
          '7f0e397bd07f595b0b6fc920fb0722',
          '9778397bd097c36b0b6fc9274c91aa',
          '97b6b97bd19801ec9210c9274c920e',
          '97bcf7f0e47f531b0b0bb0b6fb0722',
          '7f0e397bd07f595b0b0bc920fb0722',
          '9778397bd097c36b0b6fc9210c91aa',
          '97b6b97bd197c36c9210c9274c920e',
          '97bcf7f0e47f531b0b0bb0b6fb0722',
          '7f0e397bd07f595b0b0bc920fb0722',
          '9778397bd097c36b0b6fc9210c8dc2',
          '9778397bd097c36c9210c9274c920e',
          '97b6b7f0e47f531b0723b0b6fb0722',
          '7f0e37f5307f595b0b0bc920fb0722',
          '7f0e397bd097c36b0b6fc9210c8dc2',
          '9778397bd097c36b0b70c9274c91aa',
          '97b6b7f0e47f531b0723b0b6fb0721',
          '7f0e37f1487f595b0b0bb0b6fb0722',
          '7f0e397bd097c35b0b6fc9210c8dc2',
          '9778397bd097c36b0b6fc9274c91aa',
          '97b6b7f0e47f531b0723b0b6fb0721',
          '7f0e27f1487f595b0b0bb0b6fb0722',
          '7f0e397bd097c35b0b6fc920fb0722',
          '9778397bd097c36b0b6fc9274c91aa',
          '97b6b7f0e47f531b0723b0b6fb0721',
          '7f0e27f1487f531b0b0bb0b6fb0722',
          '7f0e397bd097c35b0b6fc920fb0722',
          '9778397bd097c36b0b6fc9274c91aa',
          '97b6b7f0e47f531b0723b0b6fb0721',
          '7f0e27f1487f531b0b0bb0b6fb0722',
          '7f0e397bd097c35b0b6fc920fb0722',
          '9778397bd097c36b0b6fc9274c91aa',
          '97b6b7f0e47f531b0723b0b6fb0721',
          '7f0e27f1487f531b0b0bb0b6fb0722',
          '7f0e397bd07f595b0b0bc920fb0722',
          '9778397bd097c36b0b6fc9274c91aa',
          '97b6b7f0e47f531b0723b0787b0721',
          '7f0e27f0e47f531b0b0bb0b6fb0722',
          '7f0e397bd07f595b0b0bc920fb0722',
          '9778397bd097c36b0b6fc9210c91aa',
          '97b6b7f0e47f149b0723b0787b0721',
          '7f0e27f0e47f531b0723b0b6fb0722',
          '7f0e397bd07f595b0b0bc920fb0722',
          '9778397bd097c36b0b6fc9210c8dc2',
          '977837f0e37f149b0723b0787b0721',
          '7f07e7f0e47f531b0723b0b6fb0722',
          '7f0e37f5307f595b0b0bc920fb0722',
          '7f0e397bd097c35b0b6fc9210c8dc2',
          '977837f0e37f14998082b0787b0721',
          '7f07e7f0e47f531b0723b0b6fb0721',
          '7f0e37f1487f595b0b0bb0b6fb0722',
          '7f0e397bd097c35b0b6fc9210c8dc2',
          '977837f0e37f14998082b0787b06bd',
          '7f07e7f0e47f531b0723b0b6fb0721',
          '7f0e27f1487f531b0b0bb0b6fb0722',
          '7f0e397bd097c35b0b6fc920fb0722',
          '977837f0e37f14998082b0787b06bd',
          '7f07e7f0e47f531b0723b0b6fb0721',
          '7f0e27f1487f531b0b0bb0b6fb0722',
          '7f0e397bd097c35b0b6fc920fb0722',
          '977837f0e37f14998082b0787b06bd',
          '7f07e7f0e47f531b0723b0b6fb0721',
          '7f0e27f1487f531b0b0bb0b6fb0722',
          '7f0e397bd07f595b0b0bc920fb0722',
          '977837f0e37f14998082b0787b06bd',
          '7f07e7f0e47f531b0723b0b6fb0721',
          '7f0e27f1487f531b0b0bb0b6fb0722',
          '7f0e397bd07f595b0b0bc920fb0722',
          '977837f0e37f14998082b0787b06bd',
          '7f07e7f0e47f149b0723b0787b0721',
          '7f0e27f0e47f531b0b0bb0b6fb0722',
          '7f0e397bd07f595b0b0bc920fb0722',
          '977837f0e37f14998082b0723b06bd',
          '7f07e7f0e37f149b0723b0787b0721',
          '7f0e27f0e47f531b0723b0b6fb0722',
          '7f0e397bd07f595b0b0bc920fb0722',
          '977837f0e37f14898082b0723b02d5',
          '7ec967f0e37f14998082b0787b0721',
          '7f07e7f0e47f531b0723b0b6fb0722',
          '7f0e37f1487f595b0b0bb0b6fb0722',
          '7f0e37f0e37f14898082b0723b02d5',
          '7ec967f0e37f14998082b0787b0721',
          '7f07e7f0e47f531b0723b0b6fb0722',
          '7f0e37f1487f531b0b0bb0b6fb0722',
          '7f0e37f0e37f14898082b0723b02d5',
          '7ec967f0e37f14998082b0787b06bd',
          '7f07e7f0e47f531b0723b0b6fb0721',
          '7f0e37f1487f531b0b0bb0b6fb0722',
          '7f0e37f0e37f14898082b072297c35',
          '7ec967f0e37f14998082b0787b06bd',
          '7f07e7f0e47f531b0723b0b6fb0721',
          '7f0e27f1487f531b0b0bb0b6fb0722',
          '7f0e37f0e37f14898082b072297c35',
          '7ec967f0e37f14998082b0787b06bd',
          '7f07e7f0e47f531b0723b0b6fb0721',
          '7f0e27f1487f531b0b0bb0b6fb0722',
          '7f0e37f0e366aa89801eb072297c35',
          '7ec967f0e37f14998082b0787b06bd',
          '7f07e7f0e47f149b0723b0787b0721',
          '7f0e27f1487f531b0b0bb0b6fb0722',
          '7f0e37f0e366aa89801eb072297c35',
          '7ec967f0e37f14998082b0723b06bd',
          '7f07e7f0e47f149b0723b0787b0721',
          '7f0e27f0e47f531b0723b0b6fb0722',
          '7f0e37f0e366aa89801eb072297c35',
          '7ec967f0e37f14998082b0723b06bd',
          '7f07e7f0e37f14998083b0787b0721',
          '7f0e27f0e47f531b0723b0b6fb0722',
          '7f0e37f0e366aa89801eb072297c35',
          '7ec967f0e37f14898082b0723b02d5',
          '7f07e7f0e37f14998082b0787b0721',
          '7f07e7f0e47f531b0723b0b6fb0722',
          '7f0e36665b66aa89801e9808297c35',
          '665f67f0e37f14898082b0723b02d5',
          '7ec967f0e37f14998082b0787b0721',
          '7f07e7f0e47f531b0723b0b6fb0722',
          '7f0e36665b66a449801e9808297c35',
          '665f67f0e37f14898082b0723b02d5',
          '7ec967f0e37f14998082b0787b06bd',
          '7f07e7f0e47f531b0723b0b6fb0721',
          '7f0e36665b66a449801e9808297c35',
          '665f67f0e37f14898082b072297c35',
          '7ec967f0e37f14998082b0787b06bd',
          '7f07e7f0e47f531b0723b0b6fb0721',
          '7f0e26665b66a449801e9808297c35',
          '665f67f0e37f1489801eb072297c35',
          '7ec967f0e37f14998082b0787b06bd',
          '7f07e7f0e47f531b0723b0b6fb0721',
          '7f0e27f1487f531b0b0bb0b6fb0722'
        ],
        nStr1: [
          '日',
          '一',
          '二',
          '三',
          '四',
          '五',
          '六',
          '七',
          '八',
          '九',
          '十'
        ],
        nStr2: ['初', '十', '廿', '卅'],
        nStr3: [
          '正',
          '二',
          '三',
          '四',
          '五',
          '六',
          '七',
          '八',
          '九',
          '十',
          '冬',
          '腊'
        ],
        lYearDays: function(e) {
          let t,
            a = 348;
          for (t = 32768; t > 8; t >>= 1)
            a += n.lunarInfo[e - 1900] & t ? 1 : 0;
          return a + n.leapDays(e);
        },
        leapMonth: function(e) {
          return 15 & n.lunarInfo[e - 1900];
        },
        leapDays: function(e) {
          return n.leapMonth(e) ? (65536 & n.lunarInfo[e - 1900] ? 30 : 29) : 0;
        },
        monthDays: function(e, t) {
          return t > 12 || t < 1
            ? -1
            : n.lunarInfo[e - 1900] & (65536 >> t)
            ? 30
            : 29;
        },
        solarDays: function(e, t) {
          if (t > 12 || t < 1) return -1;
          const a = t - 1;
          return 1 == +a
            ? (e % 4 == 0 && e % 100 != 0) || e % 400 == 0
              ? 29
              : 28
            : n.solarMonth[a];
        },
        toGanZhiYear: function(e) {
          let t = (e - 3) % 10,
            a = (e - 3) % 12;
          return (
            0 == +t && (t = 10),
            0 == +a && (a = 12),
            n.Gan[t - 1] + n.Zhi[a - 1]
          );
        },
        toAstro: function(e, t) {
          return (
            '魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯'.substr(
              2 * e -
                (t < [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22][e - 1]
                  ? 2
                  : 0),
              2
            ) + '座'
          );
        },
        toGanZhi: function(e) {
          return n.Gan[e % 10] + n.Zhi[e % 12];
        },
        getTerm: function(e, t) {
          if (e < 1900 || e > 2100) return -1;
          if (t < 1 || t > 24) return -1;
          const a = n.sTermInfo[e - 1900],
            c = [
              parseInt('0x' + a.substr(0, 5)).toString(),
              parseInt('0x' + a.substr(5, 5)).toString(),
              parseInt('0x' + a.substr(10, 5)).toString(),
              parseInt('0x' + a.substr(15, 5)).toString(),
              parseInt('0x' + a.substr(20, 5)).toString(),
              parseInt('0x' + a.substr(25, 5)).toString()
            ],
            o = [
              c[0].substr(0, 1),
              c[0].substr(1, 2),
              c[0].substr(3, 1),
              c[0].substr(4, 2),
              c[1].substr(0, 1),
              c[1].substr(1, 2),
              c[1].substr(3, 1),
              c[1].substr(4, 2),
              c[2].substr(0, 1),
              c[2].substr(1, 2),
              c[2].substr(3, 1),
              c[2].substr(4, 2),
              c[3].substr(0, 1),
              c[3].substr(1, 2),
              c[3].substr(3, 1),
              c[3].substr(4, 2),
              c[4].substr(0, 1),
              c[4].substr(1, 2),
              c[4].substr(3, 1),
              c[4].substr(4, 2),
              c[5].substr(0, 1),
              c[5].substr(1, 2),
              c[5].substr(3, 1),
              c[5].substr(4, 2)
            ];
          return parseInt(o[t - 1]);
        },
        toChinaMonth: function(e) {
          if (e > 12 || e < 1) return -1;
          let t = n.nStr3[e - 1];
          return (t += '月');
        },
        toChinaDay: function(e) {
          let t;
          switch (e) {
            case 10:
              t = '初十';
              break;
            case 20:
              t = '二十';
              break;
            case 30:
              t = '三十';
              break;
            default:
              (t = n.nStr2[Math.floor(e / 10)]), (t += n.nStr1[e % 10]);
          }
          return t;
        },
        getAnimal: function(e) {
          return n.Animals[(e - 4) % 12];
        },
        solar2lunar: function(e, t, a) {
          if (e < 1900 || e > 2100) return -1;
          if (1900 == +e && 1 == +t && +a < 31) return -1;
          let c,
            o,
            s = 0,
            r = 0;
          (e = (c = e
            ? new Date(e, parseInt(t) - 1, a)
            : new Date()).getFullYear()),
            (t = c.getMonth() + 1),
            (a = c.getDate());
          let b =
            (Date.UTC(c.getFullYear(), c.getMonth(), c.getDate()) -
              Date.UTC(1900, 0, 31)) /
            864e5;
          for (o = 1900; o < 2101 && b > 0; o++) b -= r = n.lYearDays(o);
          b < 0 && ((b += r), o--);
          const l = new Date();
          let f = !1;
          l.getFullYear() === +e &&
            l.getMonth() + 1 === +t &&
            l.getDate() === +a &&
            (f = !0);
          let d = c.getDay();
          const i = n.nStr1[d];
          0 == +d && (d = 7);
          const h = o;
          s = n.leapMonth(o);
          let u = !1;
          for (o = 1; o < 13 && b > 0; o++)
            s > 0 && o === s + 1 && !1 === u
              ? (--o, (u = !0), (r = n.leapDays(h)))
              : (r = n.monthDays(h, o)),
              !0 === u && o === s + 1 && (u = !1),
              (b -= r);
          0 === b && s > 0 && o === s + 1 && (u ? (u = !1) : ((u = !0), --o)),
            b < 0 && ((b += r), --o);
          const y = o,
            D = b + 1,
            m = t - 1,
            g = n.toGanZhiYear(h),
            p = n.getTerm(e, 2 * t - 1),
            w = n.getTerm(e, 2 * t);
          let T = n.toGanZhi(12 * (e - 1900) + t + 11);
          a >= p && (T = n.toGanZhi(12 * (e - 1900) + t + 12));
          let C = !1,
            M = null;
          +p === a && ((C = !0), (M = n.solarTerm[2 * t - 2])),
            +w === a && ((C = !0), (M = n.solarTerm[2 * t - 1]));
          const k = Date.UTC(e, m, 1, 0, 0, 0, 0) / 864e5 + 25567 + 10,
            L = n.toGanZhi(k + a - 1),
            v = n.toAstro(t, a);
          return {
            lYear: h,
            lMonth: y,
            lDay: D,
            Animal: n.getAnimal(h),
            IMonthCn: (u ? '闰' : '') + n.toChinaMonth(y),
            IDayCn: n.toChinaDay(D),
            cYear: e,
            cMonth: t,
            cDay: a,
            gzYear: g,
            gzMonth: T,
            gzDay: L,
            isToday: f,
            isLeap: u,
            nWeek: d,
            ncWeek: '星期' + i,
            isTerm: C,
            Term: M,
            astro: v
          };
        },
        lunar2solar: function(e, t, a, c) {
          c = !!c;
          const o = n.leapMonth(e);
          if (c && o !== t) return -1;
          if (
            (2100 == +e && 12 == +t && +a > 1) ||
            (1900 == +e && 1 == +t && +a < 31)
          )
            return -1;
          const s = n.monthDays(e, t);
          let r = s;
          if ((c && (r = n.leapDays(e, t)), e < 1900 || e > 2100 || a > r))
            return -1;
          let b = 0;
          for (let t = 1900; t < e; t++) b += n.lYearDays(t);
          let l = 0,
            f = !1;
          for (let a = 1; a < t; a++)
            (l = n.leapMonth(e)),
              f || (l <= a && l > 0 && ((b += n.leapDays(e)), (f = !0))),
              (b += n.monthDays(e, a));
          c && (b += s);
          const d = Date.UTC(1900, 1, 30, 0, 0, 0),
            i = new Date(864e5 * (b + a - 31) + d),
            h = i.getUTCFullYear(),
            u = i.getUTCMonth() + 1,
            y = i.getUTCDate();
          return n.solar2lunar(h, u, y);
        }
      },
      {
        Gan: c,
        Zhi: o,
        nStr1: s,
        nStr2: r,
        nStr3: b,
        Animals: l,
        solarTerm: f,
        lunarInfo: d,
        sTermInfo: i,
        solarMonth: h,
        ...u
      } = n;
    var y = u;
    t.default = y;
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
    var n = b(a(1)),
      c = b(a(5)),
      o = b(a(3)),
      s = b(a(2)),
      r = a(0);
    function b(e) {
      return e && e.__esModule ? e : { default: e };
    }
    const l = new r.GetDate(),
      f = new r.Logger();
    class d extends n.default {
      constructor(e) {
        super(e),
          (this.Component = e),
          (this.getCalendarConfig = (0, o.default)(
            this.Component
          ).getCalendarConfig);
      }
      switchWeek(e, t) {
        return new Promise((a, n) => {
          if ((0, o.default)(this.Component).getCalendarConfig().multi)
            return f.warn('多选模式不能切换周月视图');
          const { selectedDay: s = [], curYear: r, curMonth: b } = this.getData(
            'calendar'
          );
          if (!s.length) return;
          const l = s[0];
          if ('week' === e) {
            if (this.Component.weekMode) return;
            (this.Component.weekMode = !0),
              this.setData({ 'calendar.weekMode': !0 }),
              this.selectedDayWeekAllDays(t || l)
                .then(a)
                .catch(n);
          } else
            (this.Component.weekMode = !1),
              this.setData({ 'calendar.weekMode': !1 }),
              (0, c.default)(this.Component)
                .renderCalendar(r, b, t)
                .then(a)
                .catch(n);
        });
      }
      updateCurrYearAndMonth(e) {
        let { days: t, curYear: a, curMonth: n } = this.getData('calendar');
        const { month: c } = t[0],
          { month: o } = t[t.length - 1],
          s = l.thisMonthDays(a, n),
          r = t[t.length - 1],
          b = t[0];
        return (
          (r.day + 7 > s || (n === c && c !== o)) && 'next' === e
            ? (n += 1) > 12 && ((a += 1), (n = 1))
            : (+b.day <= 7 || (n === o && c !== o)) &&
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
          lastDayInThisMonth: l.thisMonthDays(t, a)
        };
      }
      calculateFirstDay() {
        const { days: e } = this.getData('calendar');
        return { firstDayInThisWeek: e[0].day };
      }
      firstWeekInMonth(e, t, a) {
        const n = [0, 7 - l.dayOfWeek(e, t, 1)];
        return (this.getData('calendar.days') || []).slice(
          0,
          a ? n[1] + 1 : n[1]
        );
      }
      lastWeekInMonth(e, t) {
        const a = l.thisMonthDays(e, t),
          n = [a - l.dayOfWeek(e, t, a), a];
        return (this.getData('calendar.days') || []).slice(n[0] - 1, n[1]);
      }
      initSelectedDay(e) {
        const t = [...e],
          {
            selectedDay: a = [],
            todoLabels: n = [],
            showLabelAlways: c
          } = this.getData('calendar'),
          o = a.map(e => `${+e.year}-${+e.month}-${+e.day}`),
          r = n.map(e => `${+e.year}-${+e.month}-${+e.day}`),
          b = this.getCalendarConfig();
        return (
          t.forEach(e => {
            o.includes(`${+e.year}-${+e.month}-${+e.day}`)
              ? (e.choosed = !0)
              : (e.choosed = !1);
            const t = r.indexOf(`${+e.year}-${+e.month}-${+e.day}`);
            if (-1 !== t) {
              e.showTodoLabel = !!c || !e.choosed;
              const a = n[t];
              e.showTodoLabel && a && a.todoText && (e.todoText = a.todoText);
            }
            b.showLunar &&
              (e.lunar = s.default.solar2lunar(+e.year, +e.month, +e.day));
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
          const c = l.newDate(e.year, e.month, e.day).getTime();
          let s = !1;
          a.length
            ? (+a[0] > +c || +c > +a[1]) && !n.includes(+c) && (s = !0)
            : n.length && !n.includes(+c) && (s = !0),
            s && ((e.disable = !0), (e.choosed = !1));
          const { disablePastDay: r } =
            (0, o.default)(this.Component).getCalendarConfig() || {};
          r && c - t < 0 && !e.disable && (e.disable = !0);
        });
      }
      calculateNextWeekDays() {
        let {
            lastDayInThisWeek: e,
            lastDayInThisMonth: t
          } = this.calculateLastDay(),
          { curYear: a, curMonth: n } = this.getData('calendar'),
          c = [];
        if (t - e >= 7) {
          const { Uyear: t, Umonth: o } = this.updateCurrYearAndMonth('next');
          (a = t), (n = o);
          for (let t = e + 1; t <= e + 7; t++)
            c.push({ year: a, month: n, day: t, week: l.dayOfWeek(a, n, t) });
        } else {
          for (let o = e + 1; o <= t; o++)
            c.push({ year: a, month: n, day: o, week: l.dayOfWeek(a, n, o) });
          const { Uyear: o, Umonth: s } = this.updateCurrYearAndMonth('next');
          (a = o), (n = s);
          for (let o = 1; o <= 7 - (t - e); o++)
            c.push({ year: a, month: n, day: o, week: l.dayOfWeek(a, n, o) });
        }
        (c = this.initSelectedDay(c)),
          this.setEnableAreaOnWeekMode(c),
          this.setData({
            'calendar.curYear': a,
            'calendar.curMonth': n,
            'calendar.days': c
          });
      }
      calculatePrevWeekDays() {
        let { firstDayInThisWeek: e } = this.calculateFirstDay(),
          { curYear: t, curMonth: a } = this.getData('calendar'),
          n = [];
        if (e - 7 > 0) {
          const { Uyear: c, Umonth: o } = this.updateCurrYearAndMonth('prev');
          (t = c), (a = o);
          for (let c = e - 7; c < e; c++)
            n.push({ year: t, month: a, day: c, week: l.dayOfWeek(t, a, c) });
        } else {
          let c = [];
          for (let n = 1; n < e; n++)
            c.push({ year: t, month: a, day: n, week: l.dayOfWeek(t, a, n) });
          const { Uyear: o, Umonth: s } = this.updateCurrYearAndMonth('prev');
          (t = o), (a = s);
          const r = l.thisMonthDays(t, a);
          for (let c = r - Math.abs(e - 7); c <= r; c++)
            n.push({ year: t, month: a, day: c, week: l.dayOfWeek(t, a, c) });
          n = n.concat(c);
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
        return new Promise(t => {
          let { days: a, curYear: n, curMonth: c } = this.getData('calendar'),
            { year: o, month: s, day: r } = e,
            b = this.lastWeekInMonth(o, s);
          const f = 'Mon' === this.getCalendarConfig().firstDayOfWeek,
            d = this.firstWeekInMonth(o, s, f);
          if (
            ((n === o && c === s) || (r = 1),
            n !== o && (o = n),
            c !== s && (s = c),
            d.find(e => e.day === r))
          ) {
            let e = [];
            const t = l.thisMonthDays(o, s - 1),
              { Uyear: r, Umonth: b } = this.updateCurrYearAndMonth('prev');
            (n = r), (c = b);
            for (let a = t - (7 - d.length) + 1; a <= t; a++)
              e.push({ year: n, month: c, day: a, week: l.dayOfWeek(n, c, a) });
            a = e.concat(d);
          } else if (b.find(e => e.day === r)) {
            const e = [];
            if (b && b.length < 7) {
              const { Uyear: t, Umonth: a } = this.updateCurrYearAndMonth(
                'next'
              );
              (n = t), (c = a);
              for (let t = 1, a = 7 - b.length; t <= a; t++)
                e.push({
                  year: n,
                  month: c,
                  day: t,
                  week: l.dayOfWeek(n, c, t)
                });
            }
            a = b.concat(e);
          } else {
            const e = l.dayOfWeek(o, s, r);
            let t = [r - e, r + (6 - e)];
            f && (t = [r + 1 - e, r + (7 - e)]), (a = a.slice(t[0] - 1, t[1]));
          }
          (a = this.initSelectedDay(a)),
            this.setData(
              {
                'calendar.days': a,
                'calendar.empytGrids': [],
                'calendar.lastEmptyGrids': []
              },
              t
            );
        });
      }
    }
    t.default = e => new d(e);
  },
  function(e, t, a) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    var n = r(a(6)),
      c = r(a(1)),
      o = r(a(2)),
      s = a(0);
    function r(e) {
      return e && e.__esModule ? e : { default: e };
    }
    const b = new s.GetDate();
    class l extends c.default {
      constructor(e) {
        super(e), (this.Component = e);
      }
      getCalendarConfig() {
        return this.Component.config;
      }
      renderCalendar(e, t, a) {
        return new Promise(c => {
          this.calculateEmptyGrids(e, t), this.calculateDays(e, t, a);
          const { todoLabels: o } = this.getData('calendar') || {};
          o &&
            o instanceof Array &&
            o.find(e => +e.month == +t) &&
            (0, n.default)(this.Component).setTodoLabels(),
            this.Component.firstRender || c();
        });
      }
      calculateEmptyGrids(e, t) {
        this.calculatePrevMonthGrids(e, t), this.calculateNextMonthGrids(e, t);
      }
      calculatePrevMonthGrids(e, t) {
        let a = [];
        const n = b.thisMonthDays(e, t - 1);
        let c = b.firstDayOfWeek(e, t);
        const s = this.getCalendarConfig() || {};
        if (
          ('Mon' === s.firstDayOfWeek && (0 === c ? (c = 6) : (c -= 1)), c > 0)
        ) {
          const r = n - c,
            { onlyShowCurrentMonth: b } = s,
            { showLunar: l } = this.getCalendarConfig();
          for (let c = n; c > r; c--)
            b
              ? a.push('')
              : a.push({
                  day: c,
                  lunar: l ? o.default.solar2lunar(e, t - 1, c) : null
                });
          this.setData({ 'calendar.empytGrids': a.reverse() });
        } else this.setData({ 'calendar.empytGrids': null });
      }
      calculateNextMonthGrids(e, t) {
        let a = [];
        const n = b.thisMonthDays(e, t);
        let c = b.dayOfWeek(e, t, n);
        const s = this.getCalendarConfig() || {};
        if (
          ('Mon' === s.firstDayOfWeek && (0 === c ? (c = 6) : (c -= 1)),
          6 != +c)
        ) {
          let n = 7 - (c + 1);
          const { onlyShowCurrentMonth: r, showLunar: b } = s;
          for (let c = 1; c <= n; c++)
            r
              ? a.push('')
              : a.push({
                  day: c,
                  lunar: b ? o.default.solar2lunar(e, t + 1, c) : null
                });
          this.setData({ 'calendar.lastEmptyGrids': a });
        } else this.setData({ 'calendar.lastEmptyGrids': null });
      }
      initSelectedDayWhenRender(e, t, a) {
        let n = [];
        const c = this.getCalendarConfig();
        if (c.noDefault) (n = []), (c.noDefault = !1);
        else {
          const c = this.getData('calendar') || {},
            { showLunar: s } = this.getCalendarConfig();
          n = a
            ? [
                {
                  year: e,
                  month: t,
                  day: a,
                  choosed: !0,
                  week: b.dayOfWeek(e, t, a),
                  lunar: s ? o.default.solar2lunar(e, t, a) : null
                }
              ]
            : c.selectedDay;
        }
        return n;
      }
      calculateDays(e, t, a) {
        let n = [];
        const {
            todayTimestamp: c,
            disableDays: r = [],
            enableArea: l = [],
            enableDays: f = [],
            enableAreaTimestamp: d = []
          } = this.getData('calendar'),
          i = b.thisMonthDays(e, t);
        let h = (0, s.converEnableDaysToTimestamp)(f);
        l.length && (h = (0, s.delRepeatedEnableDay)(f, l));
        for (let a = 1; a <= i; a++)
          n.push({
            year: e,
            month: t,
            day: a,
            choosed: !1,
            week: b.dayOfWeek(e, t, a)
          });
        const u = this.initSelectedDayWhenRender(e, t, a),
          y = u.map(e => `${+e.year}-${+e.month}-${+e.day}`),
          D = r.map(e => `${+e.year}-${+e.month}-${+e.day}`);
        n.forEach(e => {
          const t = `${+e.year}-${+e.month}-${+e.day}`;
          y.includes(t) && (e.choosed = !0), D.includes(t) && (e.disable = !0);
          const a = b.newDate(e.year, e.month, e.day).getTime(),
            { disablePastDay: n, showLunar: s } = this.getCalendarConfig();
          s && (e.lunar = o.default.solar2lunar(+e.year, +e.month, +e.day)),
            n &&
              a - c < 0 &&
              !e.disable &&
              ((e.disable = !0), (e.choosed = !1));
          let r = !1;
          d.length
            ? (+d[0] > +a || +a > +d[1]) && !h.includes(+a) && (r = !0)
            : h.length && !h.includes(+a) && (r = !0),
            r && ((e.disable = !0), (e.choosed = !1));
        }),
          this.setData({ 'calendar.days': n, 'calendar.selectedDay': u || [] });
      }
    }
    t.default = e => new l(e);
  },
  function(e, t, a) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    var n,
      c = (n = a(1)) && n.__esModule ? n : { default: n },
      o = a(0);
    const s = new o.Logger();
    class r extends c.default {
      constructor(e) {
        super(e), (this.Component = e);
      }
      showTodoLabels(e, t, a) {
        e.forEach(e => {
          if (this.Component.weekMode)
            t.forEach((n, c) => {
              if (+n.day == +e.day) {
                const n = t[c];
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
        if (!t || !t.days) return s.warn('请等待日历初始化完成后再调用该方法');
        const a = t.days.slice(),
          { curYear: n, curMonth: c } = t,
          {
            circle: r,
            dotColor: b = '',
            pos: l = 'bottom',
            showLabelAlways: f,
            days: d = []
          } = e || this.Component.todoConfig || {},
          { todoLabels: i = [], todoLabelPos: h, todoLabelColor: u } = t,
          y = d.filter(e => +e.year == +n && +e.month == +c);
        let D = i.filter(e => +e.year == +n && +e.month == +c);
        y.concat(D).forEach(e => {
          let t = {};
          (t = this.Component.weekMode
            ? a.find(t => +t.day == +e.day)
            : a[e.day - 1]) &&
            ((t.showTodoLabel = !!f || !t.choosed),
            t.showTodoLabel && e.todoText && (t.todoText = e.todoText));
        });
        const m = {
          'calendar.days': a,
          'calendar.todoLabels': (0, o.uniqueArrayByDate)(d.concat(i))
        };
        r ||
          (l && l !== h && (m['calendar.todoLabelPos'] = l),
          b && b !== u && (m['calendar.todoLabelColor'] = b)),
          (m['calendar.todoLabelCircle'] = r || !1),
          (m['calendar.showLabelAlways'] = f || !1),
          this.setData(m);
      }
      filterTodos(e) {
        const t = this.getData('calendar.todoLabels') || [],
          a = e.map(e => `${e.year}-${e.month}-${e.day}`);
        return t.filter(e => !a.includes(`${e.year}-${e.month}-${e.day}`));
      }
      deleteTodoLabels(e) {
        if (!(e instanceof Array && e.length)) return;
        const t = this.filterTodos(e),
          { days: a, curYear: n, curMonth: c } = this.getData('calendar'),
          o = t.filter(e => n === +e.year && c === +e.month);
        a.forEach(e => {
          e.showTodoLabel = !1;
        }),
          o.forEach(e => {
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
    t.default = e => new r(e);
  },
  function(e, t, a) {
    'use strict';
    var n,
      c = (n = a(4)) && n.__esModule ? n : { default: n },
      o = a(0),
      s = (function(e) {
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
      })(a(8));
    const r = new o.Slide(),
      b = new o.Logger();
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
          this.initComp();
        }
      },
      attached: function() {
        this.initComp();
      },
      methods: {
        initComp() {
          const { calendarConfig: e } = this.data;
          (0, s.default)(this, e), e.theme || this.setDefaultTheme();
        },
        setDefaultTheme() {
          this.setData({ 'calendarConfig.theme': 'default' });
        },
        chooseDate(e) {
          const { type: t } = e.currentTarget.dataset;
          t && this[this.data.handleMap[t]](t);
        },
        chooseYear(e) {
          const { curYear: t, curMonth: a } = this.data.calendar;
          if (!t || !a) return b.warn('异常：未获取到当前年月');
          if (this.weekMode) return console.warn('周视图下不支持点击切换年月');
          let n = +t,
            c = +a;
          'prev_year' === e ? (n -= 1) : 'next_year' === e && (n += 1),
            this.render(t, a, n, c);
        },
        chooseMonth(e) {
          const { curYear: t, curMonth: a } = this.data.calendar;
          if (!t || !a) return b.warn('异常：未获取到当前年月');
          if (this.weekMode) return console.warn('周视图下不支持点击切换年月');
          let n = +t,
            c = +a;
          'prev_month' === e
            ? (c -= 1) < 1 && ((n -= 1), (c = 12))
            : 'next_month' === e && (c += 1) > 12 && ((n += 1), (c = 1)),
            this.render(t, a, n, c);
        },
        render(e, t, a, n) {
          s.whenChangeDate.call(this, {
            curYear: e,
            curMonth: t,
            newYear: a,
            newMonth: n
          }),
            this.setData({ 'calendar.curYear': a, 'calendar.curMonth': n }),
            s.renderCalendar.call(this, a, n);
        },
        tapDayItem(e) {
          const { idx: t, disable: a } = e.currentTarget.dataset;
          if (a) return;
          let { days: n, selectedDay: c, todoLabels: o } =
            this.data.calendar || [];
          const r = this.config || {},
            { multi: b, onTapDay: l } = r,
            f = {
              e: e,
              idx: t,
              onTapDay: l,
              todoLabels: o,
              selectedDays: c,
              currentSelected: {},
              days: n.slice()
            };
          b
            ? s.whenMulitSelect.call(this, f)
            : s.whenSingleSelect.call(this, f);
        },
        doubleClickToToday() {
          if (!this.config.multi && !this.weekMode)
            if (
              (void 0 === this.count ? (this.count = 1) : (this.count += 1),
              this.lastClick)
            ) {
              new Date().getTime() - this.lastClick < 500 &&
                this.count >= 2 &&
                s.jump.call(this),
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
            if (r.isLeft(t, e.touches[0])) {
              if ((this.setData({ 'calendar.leftSwipe': 1 }), this.weekMode))
                return (
                  (this.slideLock = !1),
                  (0, c.default)(this).calculateNextWeekDays()
                );
              this.chooseMonth('next_month'), (this.slideLock = !1);
            }
            if (r.isRight(t, e.touches[0])) {
              if ((this.setData({ 'calendar.rightSwipe': 1 }), this.weekMode))
                return (
                  (this.slideLock = !1),
                  (0, c.default)(this).calculatePrevWeekDays()
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
      (t.getCurrentYM = v),
      (t.getSelectedDay = $),
      (t.cancelAllSelectedDay = S),
      (t.jump = A),
      (t.setTodoLabels = Y),
      (t.deleteTodoLabels = W),
      (t.clearTodoLabels = O),
      (t.getTodoLabels = x),
      (t.disableDay = _),
      (t.enableArea = E),
      (t.enableDays = P),
      (t.setSelectedDays = I),
      (t.getCalendarConfig = j),
      (t.setCalendarConfig = G),
      (t.switchView = U),
      (t.default = t.calculateNextWeekDays = t.calculatePrevWeekDays = t.whenMulitSelect = t.whenSingleSelect = t.renderCalendar = t.whenChangeDate = void 0);
    var n = d(a(9)),
      c = d(a(4)),
      o = d(a(6)),
      s = d(a(1)),
      r = d(a(5)),
      b = d(a(3)),
      l = d(a(2)),
      f = a(0);
    function d(e) {
      return e && e.__esModule ? e : { default: e };
    }
    let i = {},
      h = new f.Logger(),
      u = new f.GetDate(),
      y = null;
    function D(e) {
      e && (i = (0, f.getComponent)(e));
    }
    function m(e, t) {
      return D(t), (y = new s.default(i)).getData(e);
    }
    function g(e, t = () => {}) {
      return new s.default(i).setData(e, t);
    }
    const p = {
        renderCalendar: (e, t, a) =>
          new Promise((n, c) => {
            (0, r.default)(i)
              .renderCalendar(e, t, a)
              .then(() => {
                !(function(e) {
                  e.calendar = {
                    jump: A,
                    switchView: U,
                    disableDay: _,
                    enableArea: E,
                    enableDays: P,
                    getCurrentYM: v,
                    getSelectedDay: $,
                    cancelAllSelectedDay: S,
                    setTodoLabels: Y,
                    getTodoLabels: x,
                    deleteTodoLabels: W,
                    clearTodoLabels: O,
                    setSelectedDays: I,
                    getCalendarConfig: j,
                    setCalendarConfig: G
                  };
                })((0, f.getCurrentPage)()),
                  i.triggerEvent('afterCalendarRender', i),
                  (i.firstRender = !0),
                  (f.initialTasks.flag = 'finished'),
                  f.initialTasks.tasks.length && f.initialTasks.tasks.shift()(),
                  n();
              });
          }),
        whenChangeDate({ curYear: e, curMonth: t, newYear: a, newMonth: n }) {
          i.triggerEvent('whenChangeMonth', {
            current: { year: e, month: t },
            next: { year: a, month: n }
          });
        },
        whenMulitSelect(e = {}) {
          this && this.config && (i = this);
          let { currentSelected: t, selectedDays: a = [] } = e;
          const { days: n, idx: c } = e,
            o = n[c];
          if (o) {
            if (((o.choosed = !o.choosed), o.choosed)) {
              (t = o).cancel = !1;
              const { showLabelAlways: e } = m('calendar');
              e && t.showTodoLabel
                ? (t.showTodoLabel = !0)
                : (t.showTodoLabel = !1),
                a.push(t);
            } else
              (o.cancel = !0),
                (t = o),
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
            if ((0, b.default)(i).getCalendarConfig().takeoverTap)
              return i.triggerEvent('onTapDay', t);
            g({ 'calendar.days': n, 'calendar.selectedDay': a }),
              p.afterTapDay(t, a);
          }
        },
        whenSingleSelect(e = {}) {
          this && this.config && (i = this);
          let { currentSelected: t, selectedDays: a = [] } = e,
            n = [];
          const { days: c = [], idx: s } = e,
            r = (a[0] || {}).day,
            l = (r && c[r - 1]) || {},
            { month: f, year: d } = c[0] || {},
            { calendar: h = {} } = m(),
            u = c[s],
            y = (0, b.default)(i).getCalendarConfig();
          if (((t = u), y.takeoverTap)) return i.triggerEvent('onTapDay', t);
          if ((p.afterTapDay(t), !y.inverse && l.day === u.day)) return;
          if (
            (i.weekMode &&
              c.forEach((e, t) => {
                e.day === r && (c[t].choosed = !1);
              }),
            h.todoLabels &&
              (n = h.todoLabels.filter(e => +e.year === d && +e.month === f)),
            (0, o.default)(i).showTodoLabels(n, c, a),
            !u)
          )
            return;
          const D = { 'calendar.days': c };
          l.day !== u.day
            ? ((l.choosed = !1),
              (u.choosed = !0),
              (h.showLabelAlways && u.showTodoLabel) || (u.showTodoLabel = !1),
              (D['calendar.selectedDay'] = [t]))
            : y.inverse &&
              ((u.choosed = !u.choosed),
              u.choosed &&
                (u.showTodoLabel && h.showLabelAlways
                  ? (u.showTodoLabel = !0)
                  : (u.showTodoLabel = !1)),
              (D['calendar.selectedDay'] = [])),
            g(D);
        },
        afterTapDay(e, t) {
          const a = (0, b.default)(i).getCalendarConfig(),
            { multi: n } = a;
          n
            ? i.triggerEvent('afterTapDay', {
                currentSelected: e,
                selectedDays: t
              })
            : i.triggerEvent('afterTapDay', e);
        },
        jumpToToday() {
          const { year: e, month: t, date: a } = u.todayDate(),
            n = u.todayTimestamp();
          g({
            'calendar.curYear': e,
            'calendar.curMonth': t,
            'calendar.selectedDay': [
              {
                year: e,
                day: a,
                month: t,
                choosed: !0,
                lunar: (0, b.default)(i).getCalendarConfig().showLunar
                  ? l.default.solar2lunar(e, t, a)
                  : null
              }
            ],
            'calendar.todayTimestamp': n
          }),
            p.renderCalendar(e, t, a);
        }
      },
      w = p.whenChangeDate;
    t.whenChangeDate = w;
    const T = p.renderCalendar;
    t.renderCalendar = T;
    const C = p.whenSingleSelect;
    t.whenSingleSelect = C;
    const M = p.whenMulitSelect;
    t.whenMulitSelect = M;
    const k = p.calculatePrevWeekDays;
    t.calculatePrevWeekDays = k;
    const L = p.calculateNextWeekDays;
    function v(e) {
      return (
        D(e), { year: m('calendar.curYear'), month: m('calendar.curMonth') }
      );
    }
    function $(e) {
      return D(e), m('calendar.selectedDay');
    }
    function S(e) {
      D(e);
      const t = [...m('calendar.days')];
      t.map(e => {
        e.choosed = !1;
      }),
        g({ 'calendar.days': t, 'calendar.selectedDay': [] });
    }
    function A(e, t, a, n) {
      D(n);
      const { selectedDay: c = [] } = m('calendar') || {},
        { year: o, month: s, day: r } = c[0] || {};
      if (+o != +e || +s != +t || +r != +a)
        if (e && t) {
          if ('number' != typeof +e || 'number' != typeof +t)
            return h.warn('jump 函数年月日参数必须为数字');
          const n = u.todayTimestamp();
          g(
            {
              'calendar.curYear': e,
              'calendar.curMonth': t,
              'calendar.todayTimestamp': n
            },
            () => {
              if ('number' == typeof +a) return p.renderCalendar(e, t, a);
              p.renderCalendar(e, t);
            }
          );
        } else p.jumpToToday();
    }
    function Y(e, t) {
      D(t), (0, o.default)(i).setTodoLabels(e);
    }
    function W(e, t) {
      D(t), (0, o.default)(i).deleteTodoLabels(e);
    }
    function O(e) {
      D(e), (0, o.default)(i).clearTodoLabels();
    }
    function x(e) {
      return D(e), (0, o.default)(i).getTodoLabels();
    }
    function _(e = [], t) {
      D(t), (0, n.default)(i).disableDays(e);
    }
    function E(e = [], t) {
      D(t), (0, n.default)(i).enableArea(e);
    }
    function P(e = [], t) {
      D(t), (0, n.default)(i).enableDays(e);
    }
    function I(e, t) {
      D(t), (0, n.default)(i).setSelectedDays(e);
    }
    function j(e) {
      D(e), (0, b.default)(i).getCalendarConfig();
    }
    function G(e, t, a) {
      D(a), (0, b.default)(i).setCalendarConfig(e, t);
    }
    function U(...e) {
      return new Promise((t, a) => {
        const n = e[0];
        if (!e[1])
          return (0, c.default)(i)
            .switchWeek(n)
            .then(t)
            .catch(a);
        'string' == typeof e[1]
          ? (D(e[1]),
            (0, c.default)(i)
              .switchWeek(n, e[2])
              .then(t)
              .catch(a))
          : 'object' == typeof e[1] &&
            ('string' == typeof e[2] && D(e[1]),
            (0, c.default)(i)
              .switchWeek(n, e[1])
              .then(t)
              .catch(a));
      });
    }
    function F(e, t) {
      (f.initialTasks.flag = 'process'),
        ((i = e).config = t),
        (function(e) {
          let t = ['日', '一', '二', '三', '四', '五', '六'];
          'Mon' === e && (t = ['一', '二', '三', '四', '五', '六', '日']),
            g({ 'calendar.weeksCh': t });
        })(t.firstDayOfWeek),
        (function(e) {
          if (e && 'string' == typeof e) {
            const t = e.split('-');
            if (t.length < 3)
              return h.warn('配置 jumpTo 格式应为: 2018-4-2 或 2018-04-02');
            A(+t[0], +t[1], +t[2]);
          } else !1 === e ? ((i.config.noDefault = !0), A()) : A();
        })(t.defaultDay),
        h.tips(
          '使用中若遇问题请反馈至 https://github.com/treadpit/wx_calendar/issues ✍️'
        );
    }
    t.calculateNextWeekDays = L;
    t.default = (e, t = {}) => {
      if ('process' === f.initialTasks.flag)
        return f.initialTasks.tasks.push(function() {
          F(e, t);
        });
      F(e, t);
    };
  },
  function(e, t, a) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    var n = s(a(1)),
      c = s(a(3)),
      o = a(0);
    function s(e) {
      return e && e.__esModule ? e : { default: e };
    }
    const r = new o.Logger(),
      b = new o.GetDate();
    class l extends n.default {
      constructor(e) {
        super(e), (this.Component = e);
      }
      enableArea(e = []) {
        const t = this.getData('calendar.enableDays') || [];
        let a = [];
        if (
          (t.length && (a = (0, o.delRepeatedEnableDay)(t, e)), 2 === e.length)
        ) {
          const { start: t, end: n, startTimestamp: c, endTimestamp: s } = (0,
          o.convertEnableAreaToTimestamp)(e);
          if (!t || !n) return;
          if (
            (function(e) {
              const {
                start: t,
                end: a,
                startMonthDays: n,
                endMonthDays: c,
                startTimestamp: o,
                endTimestamp: s
              } = e;
              return t[2] > n || t[2] < 1
                ? (r.warn(
                    'enableArea() 开始日期错误，指定日期不在当前月份天数范围内'
                  ),
                  !1)
                : t[1] > 12 || t[1] < 1
                ? (r.warn('enableArea() 开始日期错误，月份超出1-12月份'), !1)
                : a[2] > c || a[2] < 1
                ? (r.warn(
                    'enableArea() 截止日期错误，指定日期不在当前月份天数范围内'
                  ),
                  !1)
                : a[1] > 12 || a[1] < 1
                ? (r.warn('enableArea() 截止日期错误，月份超出1-12月份'), !1)
                : !(o > s) ||
                  (r.warn('enableArea()参数最小日期大于了最大日期'), !1);
            })({
              start: t,
              end: n,
              startMonthDays: b.thisMonthDays(t[0], t[1]),
              endMonthDays: b.thisMonthDays(n[0], n[1]),
              startTimestamp: c,
              endTimestamp: s
            })
          ) {
            let { days: t = [], selectedDay: n = [] } = this.getData(
              'calendar'
            );
            const o = [...t];
            o.forEach(e => {
              const t = b.newDate(e.year, e.month, e.day).getTime();
              (+c > +t || +t > +s) && !a.includes(+t)
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
                'calendar.days': o,
                'calendar.selectedDay': n,
                'calendar.enableArea': e,
                'calendar.enableAreaTimestamp': [c, s]
              });
          }
        } else
          r.warn(
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
          ? (0, o.delRepeatedEnableDay)(e, t)
          : (0, o.converEnableDaysToTimestamp)(e);
        let { days: c = [], selectedDay: s = [] } = this.getData('calendar');
        const r = c.slice();
        r.forEach(e => {
          const t = b.newDate(e.year, e.month, e.day).getTime();
          let c = !1;
          a.length
            ? (+a[0] > +t || +t > +a[1]) && !n.includes(+t) && (c = !0)
            : n.includes(+t) || (c = !0),
            c
              ? ((e.disable = !0),
                e.choosed &&
                  ((e.choosed = !1),
                  (s = s.filter(
                    t =>
                      `${e.year}-${e.month}-${e.day}` !==
                      `${t.year}-${t.month}-${t.day}`
                  ))))
              : (e.disable = !1);
        }),
          this.setData({
            'calendar.days': r,
            'calendar.selectedDay': s,
            'calendar.enableDays': e,
            'calendar.enableDaysTimestamp': n
          });
      }
      setSelectedDays(e) {
        if (!(0, c.default)(this.Component).getCalendarConfig().multi)
          return r.warn('单选模式下不能设置多日期选中，请配置 multi');
        const { selectedDay: t, days: a, showLabelAlways: n } = this.getData(
          'calendar'
        );
        let s = [];
        if (e) {
          if (e && e.length) {
            s = t && t.length ? (0, o.uniqueArrayByDate)(t.concat(e)) : e;
            const { year: c, month: r } = a[0],
              b = [];
            s.forEach(e => {
              +e.year == +c &&
                +e.month == +r &&
                b.push(`${e.year}-${e.month}-${e.day}`);
            }),
              a.map(e => {
                b.includes(`${e.year}-${e.month}-${e.day}`) &&
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
            (s = a);
        (0, c.default)(this.Component).setCalendarConfig('multi', !0),
          this.setData({ 'calendar.days': a, 'calendar.selectedDay': s });
      }
      disableDays(e) {
        const { disableDays: t = [], days: a } = this.getData('calendar');
        if ('[object Array]' !== Object.prototype.toString.call(e))
          return r.warn('disableDays 参数为数组');
        let n = [];
        if (e.length) {
          const c = (n = (0, o.uniqueArrayByDate)(e.concat(t))).map(
            e => `${e.year}-${e.month}-${e.day}`
          );
          a.forEach(e => {
            const t = `${e.year}-${e.month}-${e.day}`;
            c.includes(t) && (e.disable = !0);
          });
        } else
          a.forEach(e => {
            e.disable = !1;
          });
        this.setData({ 'calendar.days': a, 'calendar.disableDays': n });
      }
    }
    t.default = e => new l(e);
  }
]);
