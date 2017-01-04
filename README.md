# 小程序日历

### 诞生背景
小程序很火，但是现有的很多web插件都是操作DOM的，导致不能直接使用，最近需要弄个小程序日历，故而分享出来，大家相互交流。

### 思路分析

要实现一个日历，就需要先知道几个值：

- 当月有多少天

- 当月第一天星期几


> 根据常识我们得知，每月最多31天，最少28天，日历一排7个格子，则会有5排，但若是该月第一天为星期六，则会产生六排格子才对。

> 小程序不能操作DOM，故不能动态的往当月第一天的插入多少个空格子，只能通过在前面加入空格子的循环来控制，具体参考 `wxml` 文件。

### 代码展示

由上面的分析就知道该怎么操作了，下面提出代码：

#### js文件

```
const conf = {
  data: {
    // hasEmptyGrid 变量控制是否渲染空格子，若当月第一天是星期天，就不应该渲染空格子
    hasEmptyGrid: false 
  },
  // 控制scroll-view高度
  getSystemInfo() {
    try {
      const res = wx.getSystemInfoSync();
      this.setData({
        scrollViewHeight: res.windowHeight * res.pixelRatio || 667
      });
    } catch (e) {
      console.log(e);
    }
  },
  // 获取当月共多少天
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  // 获取当月第一天星期几
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  // 计算当月1号前空了几个格子
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  // 绘制当月天数占的格子
  calculateDays(year, month) {
    let days = [];
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push(i);
    }
    this.setData({
      days
    });
  },
  // 初始化数据
  onLoad(options) {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    this.getSystemInfo();
    this.setData({
      cur_year,
      cur_month,
      weeks_ch
    })
  },
  // 切换控制年月
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
  },
  onShareAppMessage() {
    return {
      title: '小程序日历',
      desc: '还是新鲜的日历哟',
      path: 'pages/index/index'
    }
  }
};

Page(conf);

```

#### wxml文件

```
<scroll-view scroll-y="true" class="flex box box-tb box-pack-center box-align-center" style="height: {{scrollViewHeight*2}}rpx">
  <view class="calendar pink-color box box-tb">
        <view class="top-handle fs28 box box-lr box-align-center box-pack-center">
            <view class="prev box box-rl" bindtap="handleCalendar" data-handle="prev">
                <view class="prev-handle box box-lr box-align-center box-pack-center">《</view>
            </view>
            <view class="date-area box box-lr box-align-center box-pack-center">{{cur_year || "--"}} 年 {{cur_month || "--"}} 月</view>
            <view class="next box box-lr" bindtap="handleCalendar" data-handle="next">
                <view class="next-handle box box-lr box-align-center box-pack-center">》</view>
            </view>
        </view>
        <view class="weeks box box-lr box-pack-center box-align-center">
            <view class="flex week fs28" wx:for="{{weeks_ch}}" wx:key="{{index}}" data-idx="{{index}}">{{item}}</view>
        </view>
        <view class="days box box-lr box-wrap">
            <view wx:if="{{hasEmptyGrid}}" class="grid white-color box box-align-center box-pack-center" wx:for="{{empytGrids}}" wx:key="{{index}}" data-idx="{{index}}">
            </view>
            <view class="grid white-color box box-align-center box-pack-center" wx:for="{{days}}" wx:key="{{index}}" data-idx="{{index}}">
                <view class="day {{index >= 5 && index <= 13 ? 'border-radius pink-bg' : ''}} box box-align-center box-pack-center">{{item}}</view>
            </view>
        </view>
    </view>
</scroll-view>
```

#### wxss文件
```
 // 为节省篇幅，略过...

```

#### 效果图

![效果图](http://ww1.sinaimg.cn/large/0060lm7Tgw1fbepj3gggej30ah0il74n.jpg)


欢迎反馈issue，还可以start和fork哦😉