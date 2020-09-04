---
title: 日期选择器模板
---

::: warning 警告 ⚠️
仅提供部分简单功能，且不再维护，建议使用日历组件自行重写此选择器。此 `template` 带有 `input` 输入框，不影响模板的使用，可配置隐藏
:::

## 引入

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

## 初始化

```js
import initDatepicker from '../../template/datepicker/index';
const conf = {
  onShow: function() {
    initDatepicker(); // 使用默认配置初始化日历选择器
  }
};
Page(conf);
```

## 配置

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
  }
};

initDatepicker(conf);
```
