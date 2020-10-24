---
title: 功能一览
---

```js {3-4}
Page({
  doSometing() {
    const calendar = this.selectComponent('#calendar').calendar
    calendar.jump({year:2018, month:6, date:6);
  }
})
```

::: tip 约定
默认以下文档中的 `calendar` 均指向了日历组件
:::

# 预设功能

::: tip 提示 👇
预设功能为一系列插件集合(plugins/preset/index.js)，无需单独引入
:::

## 跳转至指定日期

```js  {4,17}
// 月视图

// 默认跳转至今天
calendar.jump()
// 跳转至某日
calendar
  .jump({
    year: 2019,
    month: 10,
    date: 6
  })
  .then()

// 周视图

// 默认跳转至今天
calendar.weekModeJump()// 跳转至某日
calendar
  .weekModeJump({
    year: 2019,
    month: 10,
    date: 6
  })
  .then()
```

## 获取当前选择的日期

```js {2}
const options = {
  lunar: true // 在配置showLunar为false, 但需返回农历信息时使用该选项，使用此配置需引用农历插件
}
const selectedDay = calendar.getSelectedDates(options)

// => { year: 2019, month: 12, day: 1}
```

## 获取日历当前年月

```js
const ym = calendar.getCurrentYM()

// => { year: 2019, month: 12}
```

## 取消选中日期

```js {9,12}
// 取消指定选中日期
const dates = [
  {
    year: 2020,
    month: 3,
    date: 2
  }
]
calendar.cancelSelectedDates(dates)

// 取消所有选中
calendar.cancelSelectedDates()
```


## 设置选中多个日期

::: tip 提示 👇
该方法仅在多选模式下可用，初始化日历时请配置 multi。参数为数组，不传参则默认全选当前月份所有日期
:::

```js {13}
const toSet = [
  {
    year: 2019,
    month: 3,
    date: 15
  },
  {
    year: 2019,
    month: 3,
    date: 18
  }
]
calendar.setSelectedDates(toSet)
```

## 获取当前日历面板日期

```js
const options = {
  lunar: true // 在配置showLunar为false, 但需返回农历信息。足以次配置需要引入 农历插件
}
const dates = calendar.getCalendarDates(options)
```

## 设置日历配置

::: tip 提示 👇
setCalendarConfig() 不会立即重新渲染日历数据，只会对部分基础配置（如theme, multi等）并且是在下一次渲染时生效
:::

```js {2}
calendar.setCalendarConfig({
  theme: 'elegant',
  ...
});
```

## 获取日历配置

```js
const conf = calendar.getCalendarConfig()
```

## 设置指定日期样式

> 该方法只会对日期生效。

组件样式隔离采用了 `apply-shared` 方案，此模式下页面样式会影响组件样式，使用时需注意页面样式对日历组件样式的覆盖。

```js {7}
// 页面 js 文件
const toSet = [
  {
    year: 2019,
    month: 11,
    date: 19,
    class: 'orange-date other-class' // 页面定义的 class，多个 class 由空格隔开
  }
]
calendar.setDateStyle(toSet)
```

```css
.orange-date {
  background-color: #e8e8e8;
}

.orange-data .default_normal-date {
  color: #333;
}
```

# 需引入插件： plugins/todo.js

## 待办事项

### 设置待办事项

```js
// 待办事项中若有 todoText 字段，则会在待办日期下面显示指定文字，如自定义节日等。

calendar.setTodos({
  // 待办点标记设置
  pos: 'bottom', // 待办点标记位置 ['top', 'bottom']
  dotColor: 'purple', // 待办点标记颜色
  circle: true, // 待办圆圈标记设置（如圆圈标记已签到日期），该设置与点标记设置互斥
  showLabelAlways: true, // 点击时是否显示待办事项（圆点/文字），在 circle 为 true 及当日历配置 showLunar 为 true 时，此配置失效
  dates: [
    {
      year: 2018,
      month: 1,
      date: 1,
      todoText: '待办',
      color: '#f40' // 单独定义代办颜色 (标记点、文字)
    },
    {
      year: 2018,
      month: 5,
      date: 15
    }
  ]
})
```

### 删除待办事项

```js
calendar.deleteTodos([
  {
    year: 2018,
    month: 5,
    date: 12
  }
])
```

### 清空待办事项

```js
calendar.clearTodos()
```

### 获取所有代办日期

```js
calendar.getTodos(options)
```

# 需引入插件： plugins/selectable.js

## 指定可选日期区域

```js
calendar.enableArea(['2018-11-12', '2018-11-30'])
```
## 指定特定可选日期

::: tip 提示 👇
若已使用enableArea() ，则会表现为追加
:::

```js
calendar.enableDates(['2018-11-12', '2018-12-3', '2019-1-3'])
```

## 禁用指定日期

```js
calendar.disableDates(['2018-11-12'])
```

# 需引入插件： plugins/week.js

## 周月视图切换

默认值为 'month'

::: tip 提示 👇
因周视图模式特殊性，该模式下会隐藏年月切换操作栏
:::

```js
// 切换为周视图
calendar.switchView('week').then(() => {});

// 切换为月视图
calendar.switchView().then(() => {});
// 或者
calendar.switchView('month').then(() => {});
```
# 需引入插件： plugins/time-range.js

## 日期范围选择

::: tip 提示 👇
只支持单个连续时间段，调用此方法默认打开 `chooseAreaMode` 配置，非连续性日期选择请调用 `setSelectedDates()`
:::

```js
// 当连续时间为单天时
calendar.chooseDateArea(['2020-10-12']);

// 连续时间段
calendar.chooseDateArea(['2020-10-20', '2020-10-30'])
```

# 需引入插件： plugins/holidays/index.js

::: tip 提示 👇
节假日数据来源：[国务院办公厅_政府信息公开专栏](http://www.gov.cn/zhengce/content/2019-11/21/content_5454164.htm)，目前仅支持了 `2020年份` 的数据，其他数据可按需自行补充 `/plugins/holidays/holidays-map.js`
:::

## 节假日

### 获取日历面板当前年份节假日信息

```js
calendar.getHolidaysOfCurrentYear()
```

### 获取指定年份节假日信息

::: tip 提示 👇
指定年份节假日信息需自行扩展才可查询到
:::

```js
const year = 2020
calendar.getHolidaysOfYear(year)
```

# 需引入插件： plugins/solarLunar.js

## 获取指定日期农历信息

```js
const lunar = calendar.convertSolarLunar({
  year: 2020,
  month: 8,
  date: 30
})

// 或日期字符串

const lunar = calendar.convertSolarLunar('2020-8-30')

```