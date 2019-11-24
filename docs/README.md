# 小程序日历

源码见[https://github.com/treadpit/wx_calendar ](https://github.com/treadpit/wx_calendar)

> 建议使用组件方式引入，模板引入方式未维护

### 日历组件(Component)

> 单选模式下双击日历头部中间部分可跳转至当天日期

支持 `Component` 引入 [自定义组件](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/)

#### 1. 引入组件

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
></calendar>
```

其中自定义事件功能对应如下，返回参数的具体格式可运行 `calendarComponent` 页面查看

```js
Page({
  /**
   * 选择日期后执行的事件
   * currentSelect 当前点击的日期
   * allSelectedDays 选择的所有日期（当mulit为true时，allSelectedDays有值）
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

#### 2. 日历组件初始化

在 `JSON` 中配置 及 `WXML` 文件中引入后，日历组件自动初始化，若想自定义配置，请参考以下自定义配置

#### 3. 自定义配置

在页面 `data` 中自定义配置，`@/component/calendar/main.js` 文件中提供了一些 `API` 供调用，`API` 列表参考文末文档

```js
const conf = {
  data: {
    // 此处为日历自定义配置字段
    calendarConfig: {
      /**
       * 初始化日历时指定默认选中日期，如：'2018-3-6' 或 '2018-03-06'
       * 初始化时不默认选中当天，则将该值配置为false。
       */
      multi: true, // 是否开启多选,
      theme: 'elegant', // 日历主题，目前共两款可选择，默认 default 及 elegant，自定义主题在 theme 文件夹扩展
      showLunar: true, // 是否显示农历，此配置会导致 setTodoLabels 中 showLabelAlways 配置失效
      inverse: true, // 单选模式下是否支持取消选中,
      markToday: '今', // 当天日期展示不使用默认数字，用特殊文字标记
      defaultDay: '2018-3-6', // 默认选中指定某天；当为 boolean 值 true 时则默认选中当天，非真值则在初始化时不自动选中日期，
      highlightToday: true, // 是否高亮显示当天，区别于选中样式（初始化时当天高亮并不代表已选中当天）
      takeoverTap: true, // 是否完全接管日期点击事件（日期不会选中），配合 onTapDay() 使用
      disablePastDay: true, // 是否禁选当天之前的日期
      disableLaterDay: true, // 是否禁选当天之后的日期
      firstDayOfWeek: 'Mon', // 每周第一天为周一还是周日，默认按周日开始
      onlyShowCurrentMonth: true, // 日历面板是否只显示本月日期
      hideHeadOnWeekMode: true, // 周视图模式是否隐藏日历头部
      showHandlerOnWeekMode: true // 周视图模式是否显示日历头部操作栏，hideHeadOnWeekMode 优先级高于此配置
    }
  }
};
Page(conf);
```

#### 4. 多日历组件

同一页面如果有多个不同配置的日历组件，可分别定义配置。

组件必须有 ID 属性，在调用提供的各个日历 API 时需注意，最后一个参数为要操作的组件 ID（多个组件模式下必传），表示当前要操作的是哪一个日历组件数据。

具体示例可参考 [/pages/calendarMoreComponent/index 页面](https://github.com/treadpit/wx_calendar/tree/master/src/pages/calendarMoreComponent)

```js
Page({
  data: {
    calendarConfig: {
      multi: true,
      onlyShowCurrentMonth: 1
    },
    calendarConfig2: {
      inverse: 1, // 单选模式下是否可以取消选择
      defaultDay: '2019-5-20'
    }
  },
  doSomething() {
    const todoLabels = this.calendar.getTodoLabels('#calendar1');
    this.calendar.setTodoLabels(
      {
        circle: true,
        days: [
          {
            year: 2018,
            month: 1,
            day: 1,
            todoText: '待办'
          }
        ]
      },
      '#calendar2'
    );
  }
});
```

```xml
<calendar
  id="calendar1"
  calendarConfig="{{calendarConfig}}"
  bind:afterTapDay="afterTapDay"
  bind:whenChangeMonth="whenChangeMonth"
  bind:onTapDay="onTapDay"
  bind:afterCalendarRender="afterCalendarRender"
></calendar>
<calendar
    id="calendar2"
    calendarConfig="{{calendarConfig2}}"
    bind:afterTapDay="afterTapDay"
    bind:whenChangeMonth="whenChangeMonth"
    bind:onTapDay="onTapDay"
    bind:afterCalendarRender="afterCalendarRender"
  ></calendar>
```

#### 日历事件使用说明

在初始化日历后，调用日历暴露的方法可采用 **_两种_** 方式，以 `jump` 函数为例

> 方法在日历渲染完成后，即 `afterCalendarRender()` 后才绑定到页面实例上，故请勿在页面初次 onShow 及之前调用方法。

> 注意页面 **多日历组件** 时方法调用需要的参数 [componentId]，参考 **多日历组件一节** 文档说明，以下示例均以单日历组件为例

- (1) 调用当前页面实例上的方法（暴露的方法均已绑定至小程序页面实例的 `calendar` 对象上）

```js
Page({
  onShow() {
    this.calendar.jump(2018, 6, 6);
  }
})
```

- (2) 手动引入方法

```js
import { jump } from '../../component/calendar/main.js';

Page({
  onShow() {
    jump(2018, 6, 6);
  }
})
```

#### 5. 跳转至指定日期

```js
// 默认跳转至今天
this.calendar.jump();
// 入参为 number
this.calendar.jump(2019, 10); // 跳转至某月
this.calendar.jump(2019, 10, 6); // 跳转至某日
```

#### 6. 获取当前选择的日期

```js
const selectedDay = this.calendar.getSelectedDay();

// => { year: 2019, month: 12, day: 1}
```

#### 7. 获取日历当前年月

```js
const ym = this.calendar.getCurrentYM();

// => { year: 2019, month: 12}
```

#### 8. 取消所有选中日期

```js
this.calendar.cancelAllSelectedDay();
```

#### 9. 待办事项

##### 9.1 设置待办事项

```js
// 待办事项中若有 todoText 字段，则会在待办日期下面显示指定文字，如自定义节日等。

this.calendar.setTodoLabels({
  // 待办点标记设置
  pos: 'bottom', // 待办点标记位置 ['top', 'bottom']
  dotColor: '#40', // 待办点标记颜色
  circle: true, // 待办圆圈标记设置（如圆圈标记已签到日期），该设置与点标记设置互斥
  showLabelAlways: true, // 点击时是否显示待办事项（圆点/文字），在 circle 为 true 及当日历配置 showLunar 为 true 时，此配置失效
  days: [
    {
      year: 2018,
      month: 1,
      day: 1,
      todoText: '待办'
    },
    {
      year: 2018,
      month: 5,
      day: 15
    }
  ]
});
```

##### 9.2 删除待办事项

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

##### 9.3 清空待办事项

```js
this.calendar.clearTodoLabels();
```

##### 9.4 获取所有代办日期

```js
this.calendar.getTodoLabels();
```

#### 10. 禁选指定日期

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

#### 11. 指定可选日期

```js
// 指定可选时间区域
this.calendar.enableArea(['2018-11-12', '2018-11-30']);

// 指定特定可选日期
// 注：若已调用enableArea() ，则会表现为追加
this.calendar.enableDays(['2018-11-12', '2018-12-3', '2019-1-3']);
```

#### 12. 设置选中多个日期

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

#### 13. 获取当前日历面板日期

```js
const dates = this.calendar.getCalendarDates();
```

#### 14. 周月视图切换

`switchView('week')`，默认值为'month'；

> `switchView()` 返回 `Promise`

> 切换视图时可传入指定日期，如: {year: 2019, month: 1, day: 3}

> 因周视图模式特殊性，该模式下会隐藏年月切换操作栏

```js
// 切换为周视图
this.calendar.switchView('week').then(() => {});
this.calendar.switchView('week', {
  year: 2019,
  month: 11,
  day: 13
}).then(() => {});

// 切换为月视图
this.calendar.switchView().then(() => {});
// 或者
this.calendar.switchView('month').then(() => {});
```

#### 15. 设置指定日期样式

[`experimental` 分支](https://github.com/treadpit/wx_calendar/tree/experimental) 增加了实验性方法: `setDateStyle()`。

> 该方法只会对日期生效。

因使用 `style` 注入的方式过于繁重，组件样式隔离采用了 `apply-shared` 方案，此模式下页面样式会影响组件样式，使用时需注意页面样式对日历组件样式的覆盖。

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
/* 页面 css 文件 */
.orange-date {
  color: #f40;
}
```

### 日历模板(Template)

提供 `template` [模板引入](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxml/template.html)

<p class="tip">不建议使用该方式，不做维护及新功能扩展。除引入方式不一致外，日历配置及其他方法调用参考日历组件文档（部分新功能不支持）</p>

#### 1. 引入`wxml`及`wxss`

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

#### 2. 日历模板初始化

```js
import initCalendar from '../../template/calendar/index';
const conf = {
  onShow: function() {
    initCalendar(); // 使用默认配置初始化日历
  }
};
Page(conf);
```

### 日期选择器(Template)

<p class="tip">仅提供部分简单功能，且不再维护，建议使用日历组件自行重写此选择器。此 `template` 带有 `input` 输入框，不影响模板的使用，可配置隐藏</p>

#### 1. 引入`wxml`及`wxss`

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

#### 2. 日期选择器初始化

```js
import initDatepicker from '../../template/datepicker/index';
const conf = {
  onShow: function() {
    initDatepicker(); // 使用默认配置初始化日历选择器
  }
};
Page(conf);
```

#### 3. 日期选择器配置

> 此处 config 配置参考日历组件
>
> 不同之处在于增加两个函数 showDatepicker/closeDatepicker, 控制开/关选择器面板
>
> 打开面板跳转至指定日期，使用 showDatepicker()，参数形如：'2019-2-12'，不传则默认为当天

```js
import initDatepicker, {
  showDatepicker,
  closeDatepicker,
  getSelectedDay
} from '../../template/datepicker/index';

const conf = {
  afterTapDay: currentSelect => {
    console.log('当前点击的日期', currentSelect);
    console.log('getSelectedDay方法', getSelectedDay());
  }
};

initDatepicker(conf);
```
