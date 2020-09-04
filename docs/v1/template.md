---
title: 日历模板
---

日历模板使用的是小程序模板语法，[模板资料参考](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxml/template.html)

::: warning 警告 ⚠️
不建议使用该方式，不做维护及新功能扩展。除引入方式不一致外，日历配置及其他方法调用参考日历组件文档（部分新功能不支持）
:::

## 引入

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

## 初始化

```js
import initCalendar from '../../template/calendar/index';
const conf = {
  onShow: function() {
    initCalendar(); // 使用默认配置初始化日历
  }
};
Page(conf);
```