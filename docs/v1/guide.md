---
title: 快速开始
---

## 快速接入

::: tip 提示 👇
1.x 版本源码 位于 /src/component/calendar
:::

将 `calendar` 文件夹拷贝至自己的组件目录，页面 `json` 文件中配置组件，组件路径根据项目实际情况填写

```json
{
  "usingComponents": {
    "calendar": "/component/calendar/index"
  }
}
```

在页面 `wxml` 中引入组件，提供了几个自定义事件，数据返回均在 `event` 参数对象中（数据获取可参考小程序官方文档中自定义组件的自定义事件）

```xml
<calendar
  calendarConfig="{{calendarConfig}}"
  bind:onTapDay="onTapDay"
  bind:afterTapDay="afterTapDay"
  bind:onSwipe="onSwipe"
  bind:whenChangeWeek="whenChangeWeek"
  bind:whenChangeMonth="whenChangeMonth"
  bind:afterCalendarRender="afterCalendarRender"
/>
```

其中自定义事件功能对应如下，返回参数的具体格式可运行 `calendarComponent` 页面查看

```js
Page({
  /**
   * 选择日期后执行的事件
   * currentSelect 当前点击的日期
   * allSelectedDays 选择的所有日期（当multi为true时，allSelectedDays有值）
   */
  afterTapDay(e) {
    console.log('afterTapDay', e.detail); // => { currentSelect: {}, allSelectedDays: [] }
  },
  /**
   * 当日历滑动时触发(适用于周/月视图)
   * 可在滑动时按需在该方法内获取当前日历的一些数据
   */
  onSwipe(e) {
    console.log('onSwipe', e.detail);
    const dates = this.calendar.getCalendarDates();
  },
  /**
   * 当改变月份时触发
   * => current 当前年月 / next 切换后的年月
   */
  whenChangeMonth(e) {
    console.log('whenChangeMonth', e.detail);
    // => { current: { month: 3, ... }, next: { month: 4, ... }}
  },
  /**
   * 周视图下当改变周时触发
   * => current 当前周信息 / next 切换后周信息
   */
  whenChangeWeek(e) {
    console.log('whenChangeWeek', e.detail);
    // {
    //    current: { currentYM: {year: 2019, month: 1 }, dates: [{}] },
    //    next: { currentYM: {year: 2019, month: 1}, dates: [{}] },
    //    directionType: 'next_week'
    // }
  }
  /**
   * 日期点击事件（此事件会完全接管点击事件），需自定义配置 takeoverTap 值为真才能生效
   * currentSelect 当前点击的日期
   */
  onTapDay(e) {
    console.log('onTapDay', e.detail); // => { year: 2019, month: 12, day: 3, ...}
  },
  /**
   * 日历初次渲染完成后触发事件，如设置事件标记
   */
  afterCalendarRender(e) {
    console.log('afterCalendarRender', e);
  }
});
```

## 初始化

在 `JSON` 中配置 及 `WXML` 文件中引入后，日历组件自动初始化，若想自定义配置，请参考以下自定义配置

## 自定义配置

自定义配置在页面 `data` 中设置，并传给组件

```js
const conf = {
  data: {
    // 此处为日历自定义配置字段
    calendarConfig: {
      multi: true, // 是否开启多选,
      weekMode: true, // 周视图模式
      theme: 'elegant', // 日历主题，目前共两款可选择，默认 default 及 elegant，自定义主题在 theme 文件夹扩展
      showLunar: true, // 是否显示农历，此配置会导致 setTodoLabels 中 showLabelAlways 配置失效
      inverse: true, // 单选模式下是否支持取消选中,
      chooseAreaMode: true, // 开启日期范围选择模式，该模式下只可选择时间段
      markToday: '今', // 当天日期展示不使用默认数字，用特殊文字标记
      defaultDay: '2018-3-6', // 默认选中指定某天；当为 boolean 值 true 时则默认选中当天，非真值则在初始化时不自动选中日期，
      highlightToday: true, // 是否高亮显示当天，区别于选中样式（初始化时当天高亮并不代表已选中当天）
      takeoverTap: true, // 是否完全接管日期点击事件（日期不会选中），配合 onTapDay() 使用
      preventSwipe: true, // 是否禁用日历滑动切换月份
      firstDayOfWeek: 'Mon', // 每周第一天为周一还是周日，默认按周日开始
      onlyShowCurrentMonth: true, // 日历面板是否只显示本月日期
      hideHeadOnWeekMode: true, // 周视图模式是否隐藏日历头部
      showHandlerOnWeekMode: true, // 周视图模式是否显示日历头部操作栏，hideHeadOnWeekMode 优先级高于此配置
      disableMode: {  // 禁用某一天之前/之后的所有日期
        type: 'after',  // [‘before’, 'after']
        date: '2020-03-24', // 无该属性或该属性值为假，则默认为当天
      },
    }
  }
};
Page(conf);
```
::: warning 警告 ⚠️
日历组件以下两项配置不再使用，请使用 `disableMode`

~~disablePastDay: true, // 是否禁选当天之前的日期~~

~~disableLaterDay: true, // 是否禁选当天之后的日期~~
:::

::: tip 提示 👇
单选模式下双击日历头部中间部分可跳转至当天日期
:::