# 小程序日历

源码见[https://github.com/treadpit/wx_calendar ](https://github.com/treadpit/wx_calendar)

> 建议使用组件方式引入，模板引入方式未维护

### 日历组件(Component)

> 单选模式下双击日历头部中间部分可跳转至当天日期

支持 `Component` 引入 [自定义组件](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/)

#### 1. 引入组件

在页面 `json` 文件中配置组件

```json
{
  "usingComponents": {
    "calendar": "../../component/calendar/index"
  }
}
```

在页面 `wxml` 中引入组件
```xml
<calendar calendar="{{calendar}}" gesture="{{gesture}}"></calendar>
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

#### 3. 自定义配置

`initCalendar()` 可传入自定义配置

```js
import initCalendar from '../../component/calendar/main.js';

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
   * @param { object } ctx 当前页面实例
   */
  afterCalendarRender(ctx) {},
}

initCalendar(conf);
```

#### 日历事件使用说明

在初始化日历后，调用日历暴露的方法可采用 ***两种*** 方式，以 `jump` 函数为例

 - (1) 手动引入方法

```js
import initCalendar, { jump } from '../../component/calendar/main.js';

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
import initCalendar from '../../component/calendar/main.js';

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
import { jump } from '../../component/calendar/main.js';

// 不传入参数则默认跳转至今天
jump();
// 入参必须为数字
jump(2018, 6); // 跳转至2018-6
jump(2018, 6, 6); // 跳转至2018-6-6
```

#### 5. 获取当前选择的日期

```js
import { getSelectedDay } from '../../component/calendar/main.js';

console.log(getSelectedDay());
```

#### 6. 待办事项

##### 6.1 设置待办标记

```js
import { setTodoLabels } from '../../component/calendar/main.js';

// 待办事项中若有 todoText 字段，则会在待办日期下面显示指定文字，如自定义节日等。

setTodoLabels({
  // 待办点标记设置
  pos: 'bottom', // 待办点标记位置 ['top', 'bottom']
  dotColor: '#40', // 待办点标记颜色
  // 待办圆圈标记设置（如圆圈标记已签到日期），该设置与点标记设置互斥
  circle: true, // 待办
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
import { deleteTodoLabels } from '../../component/calendar/main.js';

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
import { clearTodoLabels } from '../../component/calendar/main.js';

clearTodoLabels();
```

##### 6.4 获取所有代办日期
```js
import { getTodoLabels } from '../../component/calendar/main.js';

getTodoLabels();
```

#### 7. 禁选指定日期

```js
import { disableDay } from '../../component/calendar/main.js';

disableDay([{
  year: 2018,
  month: 7,
  day: 31,
}]);
```

#### 8. 指定可选日期

```js
import { enableArea, enableDays } from '../../component/calendar/main.js';
// 指定可选时间区域
enableArea(['2018-11-12', '2018-11-30']);
// 指定特定可选日期
enableDays(['2018-11-12', '2018-12-3', '2019-1-3']);
```

#### 9. 选中指定日期

<p class="tip">该方法仅在多选模式下可用，初始化日历时请配置 multi。参数为数组，不传参则默认全选当前月份所有日期</p>

```js
import { setSelectedDays } from '../../component/calendar/main.js';
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
]
setSelectedDays(toSet);
```

#### 10. 周月视图切换

`switchView('week')`，默认值为'month'；

```js
import { switchView } from '../../component/calendar/main.js';
// 切换为周视图
switchView('week');

// 切换为月视图
switchView();
// 或者
switchView('month');
```

### 日历模板(Template)

提供 `template` [模板引入](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxml/template.html)

<p class="tip">除引入方式不一致外，日历配置及其他方法调用参考日历组件文档</p>

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

> 此处config配置参考日历组件
> 
> 不同之处在于增加两个函数 showDatepicker/closeDatepicker, 控制开/关选择器面板
> 
> 打开面板跳转至指定日期，使用showDatepicker()，参数形如：'2019-2-12'，不传则默认为当天

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
  },
};

initDatepicker(conf);
```