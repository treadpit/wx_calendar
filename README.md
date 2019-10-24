[![Build Status](https://travis-ci.org/treadpit/wx_calendar.svg?branch=master)](https://travis-ci.org/treadpit/wx_calendar)
[![GitHub issues](https://img.shields.io/github/issues/treadpit/wx_calendar.svg?style=flat-square)](https://github.com/treadpit/wx_calendar/issues)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b33e6266074e4ba585fa802a46ce1b30)](https://app.codacy.com/app/treadpit/wx_calendar?utm_source=github.com&utm_medium=referral&utm_content=treadpit/wx_calendar&utm_campaign=badger)
![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/treadpit/wx_calendar?style=flat-square)
[![GitHub license](https://img.shields.io/github/license/treadpit/wx_calendar.svg?style=flat-square)](https://github.com/treadpit/wx_calendar/blob/master/LICENSE)

# 小程序日历

### 引入组件

在 `json` 文件中配置组件

```json
{
  "usingComponents": {
    "calendar": "/component/calendar/index"
  }
}
```

在 `wxml` 中引入组件

```xml
<calendar calendarConfig="{{calendarConfig}}"></calendar>
```

### 自定义配置初始化日历

```js
const conf = {
  data: {
    calendarConfig: {
      // 配置内置主题
      theme: 'elegant'
    }
  },
  doSomeThing() {
    // 调用日历方法
    this.calendar.enableArea(['2018-10-7', '2018-10-28']);
  }
};
Page(conf);
```

更多自定义配置及功能 [请查阅日历文档](https://treadpit.github.io/wx_calendar)

### 效果图

<div align=center><img src="https://raw.githubusercontent.com/treadpit/wx_calendar/master/screenshot/calendar-example.png" width="100%" height="auto" alt="日历效果图"/></div>