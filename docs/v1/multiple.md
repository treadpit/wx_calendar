---
title: 多日历组件
---

如果有多个不同配置的日历组件，可分别定义配置。

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