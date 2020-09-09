---
title: 安装插件
---

## 装载

插件的使用是比较简单的，引入安装即可。

组件提供了插件安装器，需要使用该安装器提供的 `use(plugin)` 方法来进行插件的安装。

```js
// 引入插件安装器
import plugin from '/component/v2/plugins/index'

// 设置代办
import todo from '/component/v2/plugins/todo'
// 禁用/启用可选状态
import selectable from '/component/v2/plugins/selectable'
// 农历相关功能
import solarLunar from '/component/v2/plugins/solarLunar/index'

// 开始安装，支持链式调用

plugin
  .use(todo)
  .use(solarLunar)
  .use(selectable)
```

到这里插件已经装载完成，可以使用相关功能，值得注意的是，与 1.x 版本不同的是，组件预设能力及插件提供的一些能力均挂载在日历组件本身上（1.x 版本挂载在当前页面实例上）。

## 使用

基于上述提到的原因，所以在使用日历组件提供的能力时，需要获得当前日历组件的实例


::: tip 提示 👇
相关方法均挂载在日历组件实例上的 `calendar` 对象上
:::

> 获取日历组件实例参考[selectComponent](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/events.html)

```js {4}
Page({
  doSometing() {
    // 获取日历组件上的 calendar 对象
    const calendar = this.selectComponent('#calendar').calendar
    // 调用 calendar 对象上的方法
    calendar.jump({year:2018, month:6, date:6);
  }
})
```

更多能力参考下一节 [功能一览](./api.md)。