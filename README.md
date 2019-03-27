# 小程序日历

### 思路分析

要实现一个简单的小程序日历，需要先知道几个值：

- 每月有多少天

- 每月第一天、最后一天各星期几

- 每月1号之前应有多少天属于上一个月

- 每月最后一天之后应有多少天属于下一个月

> 每月最多31天，最少28天。


### 引入组件

将 `src/component` 文件夹拷贝至自己的组件目录，页面 `json` 文件中配置组件

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

### 初始化

```js
import initCalendar from '../../component/calendar/main.js';
const conf = {
  onShow: function() {
    initCalendar(); //  自定义配置 initCalendar({ multi: true, ... })
  }
};
Page(conf);
```

更多自定义配置及功能 [请查阅日历文档](http://calendar.isfeer.com)

### 效果图

<div align=center><img src="https://raw.githubusercontent.com/treadpit/wx_calendar/reconstruction/screenshot/calendar-example.png" width="100%" height="auto" alt="日历效果图"/></div>