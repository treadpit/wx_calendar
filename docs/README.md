# 小程序日历

源码见[https://github.com/treadpit/wx_calendar ](https://github.com/treadpit/wx_calendar)

<p class="tip">日历面板支持手势左右滑动</p>

### 日历模板(Template)

提供 `template` [模板引入](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxml/template.html)

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

#### 3. 日历模板配置

`initCalendar()` 可传入自定义配置

```js
import initCalendar from '../../template/calendar/index';

const conf = { 
  multi: true, // 是否开启多选,
  disablePastDay: true, // 是否禁选过去的日期
  /**
   * 初始化日历时指定默认选中日期，如：'2018-3-6' 或 '2018-03-06'
   * 注意：若想初始化时不默认选中当天，则将该值配置为除 undefined 以外的其他非值即可，如：空字符串, 0 ,false等。
  */
  defaultDay: '2018-3-6', // 初始化后是否默认选中指定日期
  noDefault: true, // 初始化后是否自动选中当天日期，优先级高于defaultDay配置，两者请勿一起配置
  /**
   * 选择日期后执行的事件
   * @param { object } currentSelect 当前点击的日期
   * @param { array } allSelectedDays 选择的所有日期（当mulit为true时，才有allSelectedDays参数）
   */
  afterTapDay: (currentSelect, allSelectedDays) => {},
  /**
   * 当改变月份时触发
   * @param { object } current 当前年月
   * @param { object } next 切换后的年月
   */
  whenChangeMonth: (current, next) => {},
  /**
   * 日期点击事件（此事件会完全接管点击事件）
   * @param { object } currentSelect 当前点击的日期
   * @param { object } event 日期点击事件对象
   */
  onTapDay(currentSelect, event) {},
  /**
   * 日历初次渲染完成后触发事件，如设置事件标记
   * @param { object } ctx 当前页面
   */
  afterCalendarRender(ctx) {},
}

initCalendar(conf);
```

#### 日历事件使用说明

在初始化日历后，调用日历暴露的方法可采用 ***两种*** 方式，以 `jump` 函数为例

 - (1) 手动引入方法
```js
import initCalendar, { jump } from '../../template/calendar/index';

Page({
  onLoad() {
    initCalendar();
  }
  onShow() {
    jump(2018, 6, 6);
  }
})
```

- (2) 调用当前页面实例上的方法
```js
import initCalendar from '../../template/calendar/index';

Page({
  onLoad() {
    initCalendar();
  }
  onShow() {
    this.calendar.jump(2018, 6, 6);
  }
})
```

#### 4. 跳转至指定日期

```js
import { jump } from '../../template/calendar/index';

// 不传入参数则默认跳转至今天
jump();
// 入参必须为数字
jump(2018, 6); // 跳转至2018-6
jump(2018, 6, 6); // 跳转至2018-6-6
```

#### 5. 获取当前选择的日期

```js
import { getSelectedDay } from '../../template/calendar/index';

console.log(getSelectedDay());
```

#### 6. 待办事项

##### 6.1 设置待办标记

```js
import { setTodoLabels } from '../../template/calendar/index';

// 待办事项中若有 todoText 字段，则会在待办日期下面显示指定文字，如自定义节日等。

setTodoLabels({
  pos: 'bottom',
  dotColor: '#40',
  days: [{
    year: 2018,
    month: 1,
    day: 1,
    todoText: '待办'
  }, {
    year: 2018,
    month: 5,
    day: 15,
  }],
 });
```

##### 6.2 删除代办标记

```js
import { deleteTodoLabels } from '../../template/calendar/index';

deleteTodoLabels([{
  year: 2018,
  month: 5,
  day: 12,
}, {
  year: 2018,
  month: 5,
  day: 15,
}]);
```

##### 6.3 清空代办标记

```js
import { clearTodoLabels } from '../../template/calendar/index';

clearTodoLabels();
```

#### 7. 禁选指定日期

```js
import { disableDay } from '../../template/calendar/index';

disableDay([{
  year: 2018,
  month: 7,
  day: 31,
}]);
```

#### 8. 指定可选日期

```js
import { enableArea, enableDays } from '../../template/calendar/index';
// 指定可选时间区域
enableArea(['2018-11-12', '2018-11-30']);
// 指定特定可选日期
enableDays(['2018-11-12', '2018-12-3', '2019-1-3']);
```

#### 9. 周月视图切换

`switchView('week')`，默认值为'month'；

```js
import { switchView } from '../../template/calendar/index';
// 切换为周视图
switchView('week');

// 切换为月视图
switchView();
// 或者
switchView('month');
```

### 日历组件(Component)

支持 `Component` 引入 [自定义组件](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/)

<p class="tip">除引入方式不一致外，日历配置及其他方法调用参考日历模板文档</p>
 
#### 1. 引入组件

```json
{
  "usingComponents": {
    "calendar": "../../component/calendar/index"
  }
}
```

#### 2. 日历组件初始化

```js
import initCalendar from '../../component/calendar/main.js';
const conf = {
  onShow: function() {
    initCalendar(); // 使用默认配置初始化日历
  }
};
Page(conf);
```

### 日期选择器(Template)

> 日期选择 input 组件支持直接输入指定日期

> 日历模板面板支持手势左右滑动

<p class="tip">此 `template` 带有 `input` 输入框，不影响模板的使用，可配置隐藏</p>

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
  },
};
Page(conf);
```

#### 3. 日期选择器配置

```js
import initDatepicker from '../../template/datepicker/index';

const conf = {
  disablePastDay: true, // 是否禁选过去日期
  showInput: false, // 默认为 true
  placeholder: '请选择日期', // input 输入框
  type: 'normal', // [normal 普通单选模式(默认), timearea 时间区域选择模式(待开发), multiSelect 多选模式(待完善)]

  /**
   * 选择日期后执行的事件
   * @param { object } currentSelect 当前点击的日期
   */
  afterTapDay: (currentSelect) => {},

  /**
   * 日期点击事件（此事件会完全接管点击事件）
   * @param { object } currentSelect 当前点击的日期
   * @param {object} event 日期点击事件对象
   */
  onTapDay(currentSelect, event) {},
}

initDatepicker(conf);
```

#### 4. 跳转至今天

```js
import { getSelectedDay, jumpToToday } from '../../template/datepicker/index';

jumpToToday();

```
