[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b33e6266074e4ba585fa802a46ce1b30)](https://app.codacy.com/app/treadpit/wx_calendar?utm_source=github.com&utm_medium=referral&utm_content=treadpit/wx_calendar&utm_campaign=badger)
[![Dependency status](https://img.shields.io/david/treadpit/wx_calendar.svg)](https://david-dm.org/treadpit/wx_calendar)
[![Build Status](https://travis-ci.org/treadpit/wx_calendar.svg?branch=master)](https://travis-ci.org/treadpit/wx_calendar)
[![GitHub issues](https://img.shields.io/github/issues/treadpit/wx_calendar.svg?style=flat-square)](https://github.com/treadpit/wx_calendar/issues)
[![GitHub license](https://img.shields.io/github/license/treadpit/wx_calendar.svg?style=flat-square)](https://github.com/treadpit/wx_calendar/blob/master/LICENSE)

# 小程序日历

### 思路分析

要实现一个日历，就需要先知道几个值：

- 当月有多少天

- 当月第一天星期几


> 根据常识我们得知，每月最多31天，最少28天，日历一排7个格子，则会有5排，但若是该月第一天为星期六，则会产生六排格子才对。

> 小程序没有DOM操作概念，故不能动态的往当月第一天的插入多少个空格子，只能通过在前面加入空格子的循环来控制，具体参考 `wxml` 文件。

### 日历模板引入
> 日历模板面板支持 ***手势左右滑动***；

提供 `template` [模板引入](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxml/template.html)

1. 引入`wxml`及`wxss`
```xml
// example.wxml
<import src="../../template/calendar/index.wxml"/>
<template is="calendar" data="{{...calendar}}" />
```
```css
/* example.wxss */
@import '../../template/calendar/index.wxss';
```

2. 日历组件初始化
```js
import initCalendar, { getSelectedDay } from '../../template/calendar/index';
const conf = {
  onShow: function() {
    initCalendar({
      // multi: true, // 是否开启多选,
      /**
       * 选择日期后执行的事件
       * @param { object } currentSelect 当前点击的日期
       * @param { array } allSelectedDays 选择的所有日期（当mulit为true时，才有allSelectedDays参数）
       */
      afterTapDay: (currentSelect, allSelectedDays) => {
        console.log('当前点击的日期', currentSelect);
        allSelectedDays && console.log('选择的所有日期', allSelectedDays);
        console.log('getSelectedDay方法', getSelectedDay());
      },
      /**
       * 日期点击事件（此事件会完全接管点击事件）
       * @param { object } currentSelect 当前点击的日期
       * @param { object } event 日期点击事件对象
       */
      onTapDay(currentSelect, event) {
        console.log(currentSelect);
        console.log(event);
      },
    });
  }
};
Page(conf);
```
### 日历选择器模板引入

> 日期选择器面板支持 ***手势左右滑动***；

> 此 `template` 带有 `input` 输入框，不影响模板的使用，可配置隐藏；

> 日期选择 input 组件支持直接输入指定日期；

1. 引入`wxml`及`wxss`
```xml
// example.wxml
<import src="../../template/datepicker/index.wxml"/>

<view class="datepicker-box">
	<template is="datepicker" data="{{...datepicker}}" />
</view>
```
```css
/* example.wxss */
@import '../../template/datepicker/index.wxss';
```

2. 日期选择器初始化
```js
import initDatepicker, { getSelectedDay } from '../../template/datepicker/index';
const conf = {
  onShow: function() {
    initDatepicker({
      // showInput: false, // 默认为 true
      // placeholder: '请选择日期', // input 输入框
      // type: 'normal', // [normal 普通单选模式(默认), timearea 时间段选择模式(待开发), multiSelect 多选模式(待完善)]
      /**
       * 选择日期后执行的事件
       * @param { object } currentSelect 当前点击的日期
       */
      afterTapDay: (currentSelect) => {
        console.log('当前点击的日期', currentSelect);
        console.log('getSelectedDay方法', getSelectedDay());
      },
      /**
       * 日期点击事件（此事件会完全接管点击事件）
       * @param { object } currentSelect 当前点击的日期
       * @param {object} event 日期点击事件对象
       */
      onTapDay(currentSelect, event) {
        console.log(currentSelect);
        console.log(event);
      },
    });
  }
};
Page(conf);
```
#### 日期选择器效果图
![日期选择器](https://raw.githubusercontent.com/treadpit/wx_calendar/develop/screenshot/screenshow_datepicker.gif)

#### 日历效果图

![日历效果图](https://raw.githubusercontent.com/treadpit/wx_calendar/develop/screenshot/screenshot_calendar.jpg)

欢迎反馈...
