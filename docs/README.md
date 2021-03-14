---
home: true
heroImage: ./hero-image.png
actionText: 尝鲜2.0版小历同学 →
actionLink: /v2/guide/
features:
  - title: 关于2.0版本
    details: 小历同学在设计之初其实只是一个简单展示组件，功能迭代后愈发臃肿，故对其做了重构，就基础功能而言组件体积减少达70%。

  - title: 使用差异
    details: 与1.x版本的小历同学相比，组件的引入方式及功能调用上均发生了较大的变化（如部分方法名及入参），对于新项目建议采用2.0。

  - title: 插件系统
    details: 在小历同学2.0中，支持按需引入对应插件，如设置代办、农历信息、周视图等。

footer: MIT Licensed | Copyright © 2019-present treadpit
---

```js {2,4,7}
// 引入插件安装器
import plugin from '/component/v2/plugins/index'
// 引入所需插件
import todo from '/component/v2/plugins/todo'

// 按需安装插件，支持链式调用
plugin.use(todo)

Page({
  data: {
    calendarConfig: {
      theme: 'elegant'
    }
  }
})
```

#### 插件一览表

> 插件位于 `/src/component/v2/plugins` 目录下，可按需取舍

| 插件     | 描述                         | 文件                      |
| :------- | :--------------------------- | :------------------------ |
| 待办标记 | 可设置日期标记，如待办事项等 | /plugins/todo             |
| 农历     | 日期支持显示农历属性         | /plugins/solarLunar/index |
| 周视图   | 日历可切换为周视图模式       | /plugins/week             |
| 日期可选 | 禁用或启用指定日期的可选状态 | /plugins/selectable       |
| 节假日   | 显示节假日信息，可自定义     | /plugins/holidays/index   |
