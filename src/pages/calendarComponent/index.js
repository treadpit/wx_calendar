const conf = {
  data: {
    calendarConfig: {},
    actionBtn: [
      {
        text: '跳转指定日期',
        action: 'jump',
        color: 'olive'
      },
      {
        text: '获取当前已选',
        action: 'getSelectedDay',
        color: 'red'
      },
      {
        text: '取消所有选中',
        action: 'cancelAllSelectedDay',
        color: 'mauve'
      },
      {
        text: '设置待办事项',
        action: 'setTodoLabels',
        color: 'cyan'
      },
      {
        text: '删除指定代办',
        action: 'deleteTodoLabels',
        color: 'pink'
      },
      {
        text: '清空待办事项',
        action: 'clearTodoLabels',
        color: 'red'
      },
      {
        text: '获取所有代办',
        action: 'getTodoLabels',
        color: 'purple'
      },
      {
        text: '禁选指定日期',
        action: 'disableDay',
        color: 'olive'
      },
      {
        text: '指定可选区域',
        action: 'enableArea',
        color: 'pink'
      },
      {
        text: '指定特定可选',
        action: 'enableDays',
        color: 'red'
      },
      {
        text: '选中指定日期',
        action: 'setSelectedDays',
        color: 'cyan'
      },
      {
        text: '周月视图切换',
        action: 'switchView',
        color: 'orange'
      },
      {
        text: '自定义配置',
        action: 'config',
        color: 'grey',
        disable: true
      }
    ]
  },
  afterTapDay(e) {
    console.log('afterTapDay', e.detail);
  },
  whenChangeMonth(e) {
    console.log('whenChangeMonth', e.detail);
  },
  onTapDay(e) {
    console.log('onTapDay', e.detail);
  },
  afterCalendarRender(e) {
    console.log('afterCalendarRender', e);
  },
  showToast(msg) {
    if (!msg || typeof msg !== 'string') return;
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 1500
    });
  },
  generateRandomDate(type) {
    let random = ~~(Math.random() * 10);
    switch (type) {
      case 'year':
        random = 201 * 10 + ~~(Math.random() * 10);
        break;
      case 'month':
        random = (~~(Math.random() * 10) % 9) + 1;
        break;
      case 'date':
        random = (~~(Math.random() * 100) % 27) + 1;
        break;
      default:
        break;
    }
    return random;
  },
  handleAction(e) {
    const { action, disable } = e.currentTarget.dataset;
    if (disable) {
      this.showToast('抱歉，还不支持～😂');
    }
    this.setData({
      rst: []
    });
    const calendar = this.calendar;
    const { year, month } = calendar.getCurrentYM();
    switch (action) {
      case 'config':
        break;
      case 'jump': {
        const year = this.generateRandomDate('year');
        const month = this.generateRandomDate('month');
        const date = this.generateRandomDate('date');
        calendar[action](year, month, date);
        break;
      }
      case 'getSelectedDay': {
        const selected = calendar[action]();
        if (!selected || !selected.length)
          return this.showToast('当前未选择任何日期');
        const rst = selected.map(item => JSON.stringify(item));
        this.setData({
          rst
        });
        break;
      }
      case 'cancelAllSelectedDay':
        calendar[action]();
        break;
      case 'setTodoLabels': {
        calendar[action]({
          showLabelAlways: true,
          days: [
            {
              year,
              month,
              day: this.generateRandomDate('date')
            }
          ]
        });
        break;
      }
      case 'deleteTodoLabels': {
        const todos = [...calendar.getTodoLabels()];
        if (todos && todos.length) {
          todos.length = 1;
          calendar[action](todos);
          const _todos = [...calendar.getTodoLabels()];
          setTimeout(() => {
            const rst = _todos.map(item => JSON.stringify(item));
            rst.map(item => JSON.stringify(item));
            this.setData({
              rst
            });
          });
        } else {
          this.showToast('没有待办事项');
        }
        break;
      }
      case 'clearTodoLabels':
        const todos = [...calendar.getTodoLabels()];
        if (!todos || !todos.length) {
          return this.showToast('没有待办事项');
        }
        calendar[action]();
        break;
      case 'getTodoLabels': {
        const selected = calendar[action]();
        if (!selected || !selected.length)
          return this.showToast('未设置待办事项');
        const rst = selected.map(item => JSON.stringify(item));
        rst.map(item => JSON.stringify(item));
        this.setData({
          rst
        });
        break;
      }
      case 'disableDay':
        calendar[action]([
          {
            year,
            month,
            day: this.generateRandomDate('date')
          }
        ]);
        break;
      case 'enableArea':
        calendar[action]([`${year}-${month}-9`, `${year}-${month}-26`]);
        break;
      case 'enableDays':
        calendar[action]([
          `${year}-${month}-${this.generateRandomDate('date')}`,
          `${year}-${month}-${this.generateRandomDate('date')}`,
          `${year}-${month}-${this.generateRandomDate('date')}`,
          `${year}-${month}-${this.generateRandomDate('date')}`,
          `${year}-${month}-${this.generateRandomDate('date')}`
        ]);
        break;
      case 'switchView':
        if (!this.week) {
          calendar[action]('week');
          this.week = true;
        } else {
          calendar[action]();
          this.week = false;
        }
        break;
      case 'setSelectedDays':
        const toSet = [
          {
            year,
            month,
            day: this.generateRandomDate('date')
          },
          {
            year,
            month,
            day: this.generateRandomDate('date')
          }
        ];
        calendar[action](toSet);
        break;
      default:
        break;
    }
  }
};

Page(conf);
