---
title: 快速开始
---

## 引入组件

将 `calendar` 文件夹拷贝至自己的组件目录，页面 `json` 文件中配置组件，组件路径根据项目实际情况填写

``` json {3}
{
  "usingComponents": {
    "calendar": "/component/calendar/index"
  }
}
```

在页面 `wxml` 中引入组件

```xml
<calendar />
```

此时运行小程序，可以看到日历组件已经渲染出来了，可以做一些简单的操作。

## 自定义事件

另外日历组件提供一些自定义事件，其中自定义事件功能对应如下，返回参数的具体格式可运行 `demo` 中 `pages/calendarV2/index` 页面查看

``` xml {2-6}
<calendar
  bind:takeoverTap="takeoverTap"
  bind:afterTapDate="afterTapDate"
  bind:afterCalendarRender="afterCalendarRender"
  bind:onSwipe="onSwipe"
  bind:whenChangeMonth="whenChangeMonth"
/>
```

```js
Page({
  /**
   * 日历初次渲染完成后触发事件，如设置事件标记
   */
  afterCalendarRender(e) {
    console.log('afterCalendarRender', e)
  },
  /**
   * 日期点击事件（此事件会完全接管点击事件），需自定义配置 takeoverTap 值为真才能生效
   * currentSelect 当前点击的日期
   */
  takeoverTap(e) {
    console.log('takeoverTap', e.detail) // => { year: 2019, month: 12, date: 3, ...}
  },
  /**
   * 选择日期后执行的事件
   */
  afterTapDate(e) {
    console.log('afterTapDate', e.detail) // => { year: 2019, month: 12, date: 3, ...}
  },
  /**
   * 当日历滑动时触发(适用于周/月视图)
   * 可在滑动时按需在该方法内获取当前日历的一些数据
   */
  onSwipe(e) {
    console.log('onSwipe', e.detail)
  },
  /**
   * 当改变月份时触发
   * => current 当前年月 / next 切换后的年月
   */
  whenChangeMonth(e) {
    console.log('whenChangeMonth', e.detail)
    // => { current: { month: 3, ... }, next: { month: 4, ... }}
  }
})
```


## 自定义配置

组件支持一系列配置，自定义配置需手动传给组件，如：

``` xml {2}
<calendar
  config="{{calendarConfig}}"
  bind:takeoverTap="takeoverTap"
  bind:afterTapDate="afterTapDate"
  bind:afterCalendarRender="afterCalendarRender"
  bind:onSwipe="onSwipe"
  bind:whenChangeMonth="whenChangeMonth"
/>
```

```js
const conf = {
  data: {
    // 此处为日历自定义配置字段
    calendarConfig: {
      multi: true, // 是否开启多选,
      weekMode: true, // 周视图模式
      theme: 'elegant', // 日历主题，目前共两款可选择，默认 default 及 elegant，自定义主题色在参考 /theme 文件夹
      showLunar: true, // 是否显示农历，此配置会导致 setTodoLabels 中 showLabelAlways 配置失效
      inverse: true, // 单选模式下是否支持取消选中,
      markToday: '今', // 当天日期展示不使用默认数字，用特殊文字标记
      takeoverTap: true, // 是否完全接管日期点击事件（日期不会选中)
      emphasisWeek: true, // 是否高亮显示周末日期
      chooseAreaMode: true, // 开启日期范围选择模式，该模式下只可选择时间段
      showHolidays: true, // 显示法定节假日班/休情况，需引入holidays插件
      showFestival: true, // 显示节日信息（如教师节等），需引入holidays插件
      highlightToday: true, // 是否高亮显示当天，区别于选中样式（初始化时当天高亮并不代表已选中当天）
      defaultDate: '2018-3-6', // 默认选中指定某天，如需选中需配置 autoChoosedWhenJump: true
      preventSwipe: true, // 是否禁用日历滑动切换月份
      firstDayOfWeek: 'Mon', // 每周第一天为周一还是周日，默认按周日开始
      onlyShowCurrentMonth: true, // 日历面板是否只显示本月日期
      autoChoosedWhenJump: true, // 设置默认日期及跳转到指定日期后是否需要自动选中
      disableMode: {
        // 禁用某一天之前/之后的所有日期
        type: 'after', // [‘before’, 'after']
        date: '2020-3-24' // 无该属性或该属性值为假，则默认为当天
      },
      ... // 更多配置待接入
    }
  }
}
Page(conf)
```
为了赋予日历组件更多能力，小历同学2.0使用了简单的插件系统，比如需要使用设置代办事项相关功能，则必须手动引入todo插件才可使用相关功能，这点与1.x有很大区别，插件的使用请参考下一节 [引入插件](./plugin.md)
