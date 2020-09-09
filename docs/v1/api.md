---
title: 功能一览
---


## 日历事件使用说明

在初始化日历后，调用日历暴露的方法可采用 **_两种_** 方式，以 `jump` 函数为例

> 方法在日历渲染完成后，即 `afterCalendarRender()` 后才绑定到页面实例上，故请勿直接在页面初次 onShow 及之前调用方法。

> 注意页面 **多日历组件** 时方法调用需要的参数 [componentId]，参考 **多日历组件一节** 文档说明，以下示例均以单日历组件为例

- (1) 调用当前页面实例上的方法（方法均已挂载至小程序页面实例的 `calendar` 对象上）

```js
/**
 * 获取当前页面实例的方法
 * 1. 原生小程序开发，Page() 入参对象上的函数，this直接指向当前页面实例
 * 2. Taro3.0.5及以上版本中可使用 getCurrentInstance() 获取当前页面实例
 * 3. 通用方法则直接调用小程序函数 getCurrentPages()，取数组最后一个即为当前页面实例
**/
Page({
  doSometing() {
    this.calendar.jump(2018, 6, 6);
  }
})
```

- (2) 手动引入

```js
import { jump } from '../../component/calendar/main.js';

Page({
  doSometing() {
    jump(2018, 6, 6);
  }
})
```

## 跳转至指定日期

```js
// 默认跳转至今天
this.calendar.jump();
// 入参为 number
this.calendar.jump(2019, 10); // 跳转至某月
this.calendar.jump(2019, 10, 6).then(date => {}); // 跳转至某日
```

## 获取当前选择的日期

```js
const options = {
  lunar: true // 在配置showLunar为false, 但需返回农历信息时使用该选项
}
const selectedDay = this.calendar.getSelectedDay(options);

// => { year: 2019, month: 12, day: 1}
```

## 获取日历当前年月

```js
const ym = this.calendar.getCurrentYM();

// => { year: 2019, month: 12}
```

## 取消选中日期

```js
// 取消指定选中日期
const dates = [
  {
    year: 2020,
    month: 3,
    day: 2
  }
];
this.calendar.cancelSelectedDates(dates);

// 取消所有选中
this.calendar.cancelSelectedDates();
```

## 待办事项

### 设置待办事项

```js
// 待办事项中若有 todoText 字段，则会在待办日期下面显示指定文字，如自定义节日等。

this.calendar.setTodoLabels({
  // 待办点标记设置
  pos: 'bottom', // 待办点标记位置 ['top', 'bottom']
  dotColor: 'purple', // 待办点标记颜色
  circle: true, // 待办圆圈标记设置（如圆圈标记已签到日期），该设置与点标记设置互斥
  showLabelAlways: true, // 点击时是否显示待办事项（圆点/文字），在 circle 为 true 及当日历配置 showLunar 为 true 时，此配置失效
  days: [
    {
      year: 2018,
      month: 1,
      day: 1,
      todoText: '待办',
      color: '#f40' // 单独定义代办颜色 (标记点、文字)
    },
    {
      year: 2018,
      month: 5,
      day: 15
    }
  ]
});
```

### 删除待办事项

```js
this.calendar.deleteTodoLabels([
  {
    year: 2018,
    month: 5,
    day: 12
  },
  {
    year: 2018,
    month: 5,
    day: 15
  }
]);
```

### 清空待办事项

```js
this.calendar.clearTodoLabels();
```

### 获取所有代办日期

```js
const options = {
  lunar: true // 在配置showLunar为false, 但需返回农历信息时使用该选项
}
this.calendar.getTodoLabels(options);
```

## 禁选指定日期

注意：若入参为空数组，则清空所有禁选日期

```js
this.calendar.disableDay([
  {
    year: 2018,
    month: 7,
    day: 31
  }
]);
```

## 指定可选日期

```js
// 指定可选时间区域
this.calendar.enableArea(['2018-11-12', '2018-11-30']);

// 指定特定可选日期
// 注：若已调用enableArea() ，则会表现为追加
this.calendar.enableDays(['2018-11-12', '2018-12-3', '2019-1-3']);
```

## 设置选中多个日期

<p class="tip">该方法仅在多选模式下可用，初始化日历时请配置 multi。参数为数组，不传参则默认全选当前月份所有日期</p>

```js
const toSet = [
  {
    year: '2019',
    month: '3',
    day: '15'
  },
  {
    year: 2019,
    month: 3,
    day: 18
  }
];
this.calendar.setSelectedDays(toSet);
```

## 获取当前日历面板日期

```js
const options = {
  lunar: true // 在配置showLunar为false, 但需返回农历信息时使用该选项
}
const dates = this.calendar.getCalendarDates(options);
```

## 周月视图切换

`switchView('week')`，默认值为'month'；

> 因周视图模式特殊性，该模式下会隐藏年月切换操作栏

```js
// 切换为周视图
this.calendar.switchView('week').then(() => {});

// 切换为月视图
this.calendar.switchView().then(() => {});
// 或者
this.calendar.switchView('month').then(() => {});
```

## 设置日历配置

::: tip 提示 👇
setCalendarConfig() 不会立即重新渲染日历数据，只会对部分基础配置（如theme, multi等）并且是在下一次渲染时生效
:::

```js
this.calendar.setCalendarConfig({
  theme: 'elegant',
  ...
});
```

## 获取日历配置

```js
const conf = this.calendar.getCalendarConfig();
```

## 日期范围选择

> 调用此方法默认打开 `chooseAreaMode`，非连续性日期选择请调用 `setSelectedDays()`

> 目前只支持单个连续时间段

```js
// 当连续时间为单天时
this.calendar.chooseDateArea(['2019-12-12']);

// 连续时间段
this.calendar.chooseDateArea(['2019-12-28', '2020-1-10']).then(dates => {
  console.log('choosed dates: ', dates);
});
```

## 设置指定日期样式

> 该方法只会对日期生效。

组件样式隔离采用了 `apply-shared` 方案，此模式下页面样式会影响组件样式，使用时需注意页面样式对日历组件样式的覆盖。

```js
// 页面 js 文件
const toSet = [
  {
    year: 2019,
    month: 11,
    day: 19,
    class: 'orange-date other-class' // 页面定义的 class，多个 class 由空格隔开
  }
];
this.calendar.setDateStyle(toSet);
```

```css
.orange-date {
  background-color: #e8e8e8;
}

.orange-data .default_normal-date {
  color: #333;
}
```