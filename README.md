[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b33e6266074e4ba585fa802a46ce1b30)](https://app.codacy.com/app/treadpit/wx_calendar?utm_source=github.com&utm_medium=referral&utm_content=treadpit/wx_calendar&utm_campaign=badger)
[![Dependency status](https://img.shields.io/david/treadpit/wx_calendar.svg)](https://david-dm.org/treadpit/wx_calendar)
[![Build Status](https://travis-ci.org/treadpit/wx_calendar.svg?branch=master)](https://travis-ci.org/treadpit/wx_calendar)
[![GitHub issues](https://img.shields.io/github/issues/treadpit/wx_calendar.svg?style=flat-square)](https://github.com/treadpit/wx_calendar/issues)
[![GitHub license](https://img.shields.io/github/license/treadpit/wx_calendar.svg?style=flat-square)](https://github.com/treadpit/wx_calendar/blob/master/LICENSE)

# 小程序日历

### 思路分析

要实现一个简单的日历，需要先知道几个值：

- 每月有多少天

- 每月第一天、最后一天各星期几

- 每月1号之前应有多少天属于上一个月

- 每月最后一天之后应有多少天属于下一个月

> 每月最多31天，最少28天。

### 引入 wxml 及 wxss后初始化日历组件直接使用
```js
import initCalendar from '../../template/calendar/index';
const conf = {
  onShow() {
    initCalendar(); // 使用默认配置初始化日历
  }
};
Page(conf);
```

更多配置及功能请 [参考文档](http://calendar.isfeer.com)

### 日历模板效果图

![日历效果图](https://raw.githubusercontent.com/treadpit/wx_calendar/develop/screenshot/screenshot_calendar.gif)

### 日期选择器效果图

![日期选择器](https://raw.githubusercontent.com/treadpit/wx_calendar/develop/screenshot/screenshot_datepicker.gif)
