let systemInfo;
export function getSystemInfo() {
  if (systemInfo) return systemInfo;
  systemInfo = wx.getSystemInfoSync();
  return systemInfo;
}

export function info(msg) {
  console.log(
    '%cInfo: %c' + msg,
    'color:#FF0080;font-weight:bold',
    'color: #FF509B'
  );
}

export function warn(msg) {
  console.log(
    '%cWarn: %c' + msg,
    'color:#FF6600;font-weight:bold',
    'color: #FF9933'
  );
}

export function tips(msg) {
  console.log(
    '%cTips: %c' + msg,
    'color:#00B200;font-weight:bold',
    'color: #00CC33'
  );
}

export function isIos() {
  const sys = getSystemInfo();
  return /iphone|ios/i.test(sys.platform);
}

/**
 * 获取当前页面实例
 */
export function getCurrentPage() {
  const pages = getCurrentPages();
  const last = pages.length - 1;
  return pages[last];
}

export function getComponent(componentId) {
  let page = getCurrentPage() || {};
  if (page.selectComponent && typeof page.selectComponent === 'function') {
    if (componentId) {
      return page.selectComponent(componentId);
    } else {
      warn('请传入组件ID');
    }
  } else {
    warn('该基础库暂不支持多个小程序日历组件');
  }
}

/**
 * new Date 区分平台
 * @param {number} year
 * @param {number} month
 * @param {number} day
 */
export function newDate(year, month, day) {
  let cur = `${+year}-${+month}-${+day}`;
  if (isIos()) {
    cur = `${+year}/${+month}/${+day}`;
  }
  return new Date(cur);
}

/**
 * 计算指定月份共多少天
 * @param {number} year 年份
 * @param {number} month  月份
 */
export function getThisMonthDays(year, month) {
  return new Date(year, month, 0).getDate();
}

/**
 * 计算指定月份第一天星期几
 * @param {number} year 年份
 * @param {number} month  月份
 */
export function getFirstDayOfWeek(year, month) {
  return new Date(Date.UTC(year, month - 1, 1)).getDay();
}

/**
 * 计算指定日期星期几
 * @param {number} year 年份
 * @param {number} month  月份
 * @param {number} date 日期
 */
export function getDayOfWeek(year, month, date) {
  return new Date(Date.UTC(year, month - 1, date)).getDay();
}

/**
 * 日期数组根据日期去重
 * @param {array} array 数组
 */
export function uniqueArrayByDate(array = []) {
  let uniqueObject = {};
  let uniqueArray = [];
  array.forEach(item => {
    uniqueObject[`${item.year}-${item.month}-${item.day}`] = item;
  });
  for (let i in uniqueObject) {
    uniqueArray.push(uniqueObject[i]);
  }
  return uniqueArray;
}

/**
 * 指定可选日期及可选日期数组去重
 * @param {array} enableDays 特定可选日期数组
 * @param {array} enableArea 可选日期区域数组
 */
export function delRepeatedEnableDay(enableDays = [], enableArea = []) {
  let _startTimestamp;
  let _endTimestamp;
  if (enableArea.length === 2) {
    const { startTimestamp, endTimestamp } = convertEnableAreaToTimestamp(
      enableArea
    );
    _startTimestamp = startTimestamp;
    _endTimestamp = endTimestamp;
  }
  const enableDaysTimestamp = converEnableDaysToTimestamp(enableDays);
  const tmp = enableDaysTimestamp.filter(
    item => item < _startTimestamp || item > _endTimestamp
  );
  return tmp;
}

/**
 *  指定日期区域转时间戳
 * @param {array} timearea 时间区域
 */
export function convertEnableAreaToTimestamp(timearea = []) {
  const start = timearea[0].split('-');
  const end = timearea[1].split('-');
  const startTimestamp = newDate(start[0], start[1], start[2]).getTime();
  const endTimestamp = newDate(end[0], end[1], end[2]).getTime();
  return {
    start,
    end,
    startTimestamp,
    endTimestamp
  };
}

/**
 *  指定特定日期数组转时间戳
 * @param {array} enableDays 指定时间数组
 */
export function converEnableDaysToTimestamp(enableDays = []) {
  const enableDaysTimestamp = [];
  enableDays.forEach(item => {
    if (typeof item !== 'string') return warn('enableDays()入参日期格式错误');
    const tmp = item.split('-');
    if (tmp.length !== 3) return warn('enableDays()入参日期格式错误');
    const timestamp = newDate(tmp[0], tmp[1], tmp[2]).getTime();
    enableDaysTimestamp.push(timestamp);
  });
  return enableDaysTimestamp;
}

// 同一页面多个日历组件按先后顺序渲染
export const initialTasks = {
  flag: 'finished', // process 处理中，finished 处理完成
  tasks: []
};
