[![Build Status](https://travis-ci.org/treadpit/wx_calendar.svg?branch=master)](https://travis-ci.org/treadpit/wx_calendar)

# 小程序日历

### 思路分析

要实现一个日历，就需要先知道几个值：

- 当月有多少天

- 当月第一天星期几


> 根据常识我们得知，每月最多31天，最少28天，日历一排7个格子，则会有5排，但若是该月第一天为星期六，则会产生六排格子才对。

> 小程序没有DOM操作概念，故不能动态的往当月第一天的插入多少个空格子，只能通过在前面加入空格子的循环来控制，具体参考 `wxml` 文件。

### 日历模板引入

提供 `template` [模板引入](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxml/template.html)

1. 引入`wxml`及`wxss`
```xml
// example.wxml
<import src="../../template/index.wxml"/>
<template is="calendar" data="{{...calendar}}" />

// example.wxss
@import '../../template/index.wxss';
```
2. 日历组件初始化
```js
// example.js

import initCalendar from '../../template/index';
const conf = {
	onShow: function(){
		initCalendar(); // 初始化日历
	}
}
Page(conf);

```
#### 效果图

![](https://ws1.sinaimg.cn/large/9274759egy1fjhx2haqexg208t0fptb1.jpg)

欢迎反馈...
