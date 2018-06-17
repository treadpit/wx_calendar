# 小程序日历

### 思路分析

要实现一个日历，就需要先知道几个值：

- 当月有多少天

- 当月第一天星期几


> 根据常识我们得知，每月最多31天，最少28天，日历一排7个格子，则会有5排，但若是该月第一天为星期六，则会产生六排格子才对。

> 小程序没有DOM操作概念，故不能动态的往当月第一天的插入多少个空格子，只能通过在前面加入空格子的循环来控制，具体参考 `wxml` 文件。

### 日历模板引入
> 日历模板面板支持 ***手势左右滑动***；

> 提供跳转至今天方法`jumpToToday`；

> 设置日期待办事项标记 `setTodoLabels`；

> 删除指定日期待办事项标记 `deleteTodoLabels`；

> 清空所有日期待办事项标记 `clearTodoLabels`；

> 提供周月视图切换 `switchView('week')`，默认值为'month'；

提供 `template` [模板引入](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxml/template.html)

1. 引入`wxml`及`wxss`
```xml
// example.wxml
<import src="../../template/calendar/index.wxml"/>
<view class="calendar-wrap">
   <template is="calendar" data="{{...calendar}}" />
</view>
```
```css
/* example.wxss */
@import '../../template/calendar/index.wxss';
```

2. 日历组件初始化
```js
import initCalendar, { getSelectedDay, jumpToToday, switchView, setTodoLabels, deleteTodoLabels, clearTodoLabels } from '../../template/calendar/index';
const conf = {
  onShow: function() {
    initCalendar({
      // multi: true, // 是否开启多选,
      // disablePastDay: true, // 是否禁选过去日期
      /**
       * 选择日期后执行的事件
       * @param { object } currentSelect 当前点击的日期
       * @param { array } allSelectedDays 选择的所有日期（当mulit为true时，才有allSelectedDays参数）
       */
      afterTapDay: (currentSelect, allSelectedDays) => {
        console.log('===============================');
        console.log('当前点击的日期', currentSelect);
        console.log('当前点击的日期是否有事件标记: ', currentSelect.hasTodo || false);
        allSelectedDays && console.log('选择的所有日期', allSelectedDays);
        console.log('getSelectedDay方法', getSelectedDay());
      },
      /**
       * 日期点击事件（此事件会完全接管点击事件）
       * @param { object } currentSelect 当前点击的日期
       * @param { object } event 日期点击事件对象
       */
      // onTapDay(currentSelect, event) {
      //   console.log(currentSelect);
      //   console.log(event);
      // },
      /**
       * 日历初次渲染完成后触发事件，如设置事件标记
       */
      afterCalendarRender() {
        setTodoLabels({
          pos: 'bottom',
          dotColor: '#40',
          days: [{
            year: 2018,
            month: 5,
            day: 12,
          }, {
            year: 2018,
            month: 5,
            day: 15,
          }],
        });
      },
    });
  },
  deleteTodo() {
    // 指定需要删除待办标识的日期
    deleteTodoLabels([{
      year: 2018,
      month: 5,
      day: 12,
    }, {
      year: 2018,
      month: 5,
      day: 15,
    }]);

    // clearTodoLabels();
  },
  /**
   * 周、月视图切换
   */
  switchView() {
    if (!this.weekView) {
      this.weekView = true;
      switchView('week');
    } else {
      this.weekView = false;
      switchView('month');
    }
  },
  /**
   * 跳转至今天
   */
  jump() {
    jumpToToday();
  },
};
Page(conf);
```
### 日历选择器模板引入
> 日历模板面板支持 ***手势左右滑动***；

> 提供跳转至今天方法`jumpToToday`；

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
import initDatepicker, { getSelectedDay, jumpToToday } from '../../template/datepicker/index';
const conf = {
  onShow: function() {
    initDatepicker({
      // disablePastDay: true, // 是否禁选过去日期
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
  },
  /**
   * 跳转至今天
   */
  jump() {
    jumpToToday();
  }
};
Page(conf);
```
#### 日期选择器效果图
![日期选择器](https://raw.githubusercontent.com/treadpit/wx_calendar/develop/screenshot/screenshow_datepicker.gif)

#### 日历效果图

![日历效果图](https://raw.githubusercontent.com/treadpit/wx_calendar/develop/screenshot/screenshot_calendar.jpg)

欢迎反馈...
