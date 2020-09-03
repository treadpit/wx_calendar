const conf = {
  data: {
    calendarConfig: {
      showLunar: true
      // chooseAreaMode: true,
      // firstDayOfWeek: 'Mon',
      // disableMode: {
      //   type: 'after',
      //   date: '2020-03-9'
      // },
      // defaultDay: '2020-3-6'
      // multi: true
    },
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
        text: '取消选中日期',
        action: 'cancelSelectedDates',
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
        color: 'pink'
      },
      {
        text: '获取自定义配置',
        action: 'getConfig',
        color: 'olive'
      },
      {
        text: '获取日历面板日期',
        action: 'getCalendarDates',
        color: 'purple'
      }
    ]
  },
  afterTapDay(e) {
    console.log('afterTapDay', e.detail)
  },
  whenChangeMonth(e) {
    console.log('whenChangeMonth', e.detail)
  },
  whenChangeWeek(e) {
    console.log('whenChangeWeek', e.detail)
  },
  onTapDay(e) {
    console.log('onTapDay', e.detail)
  },
  afterCalendarRender(e) {
    console.log('afterCalendarRender', e)
    // this.calendar.switchView('week').then(() => {
    //   this.calendar.jump(2020, 3, 1).then(date => {}); // 跳转至某日
    // });
  },
  onSwipe(e) {
    console.log('onSwipe', e)
  },
  showToast(msg) {
    if (!msg || typeof msg !== 'string') return
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 1500
    })
  },
  generateRandomDate(type) {
    let random = ~~(Math.random() * 10)
    switch (type) {
      case 'year':
        random = 201 * 10 + ~~(Math.random() * 10)
        break
      case 'month':
        random = (~~(Math.random() * 10) % 9) + 1
        break
      case 'date':
        random = (~~(Math.random() * 100) % 27) + 1
        break
      default:
        break
    }
    return random
  },
  handleAction(e) {
    const { action, disable } = e.currentTarget.dataset
    if (disable) {
      this.showToast('抱歉，还不支持～😂')
    }
    this.setData({
      rst: []
    })
    const calendar = this.calendar
    const { year, month } = calendar.getCurrentYM()
    switch (action) {
      case 'config':
        calendar
          .setCalendarConfig({
            showLunar: false,
            theme: 'elegant',
            multi: true
          })
          .then(conf => {
            console.log('设置成功：', conf)
          })
        break
      case 'getConfig':
        const config = calendar.getCalendarConfig()
        this.showToast('请在控制台查看结果')
        console.log('自定义配置: ', config)
        break
      case 'jump': {
        const year = this.generateRandomDate('year')
        const month = this.generateRandomDate('month')
        const date = this.generateRandomDate('date')
        calendar[action](year, month, date)
        break
      }
      case 'getSelectedDay': {
        const selected = calendar[action]()
        if (!selected || !selected.length)
          return this.showToast('当前未选择任何日期')
        this.showToast('请在控制台查看结果')
        console.log('get selected days: ', selected)
        const rst = selected.map(item => JSON.stringify(item))
        this.setData({
          rst
        })
        break
      }
      case 'cancelSelectedDates':
        calendar[action]([
          {
            year: 2020,
            month: 3,
            day: 3
          }
        ])
        break
      case 'setTodoLabels': {
        const days = [
          {
            year,
            month,
            day: this.generateRandomDate('date'),
            todoText: Math.random() * 10 > 5 ? '领奖日' : ''
          }
        ]
        calendar[action]({
          showLabelAlways: true,
          days
        })
        console.log('set todo labels: ', days)
        break
      }
      case 'deleteTodoLabels': {
        const todos = [...calendar.getTodoLabels()]
        if (todos && todos.length) {
          todos.length = 1
          calendar[action](todos)
          const _todos = [...calendar.getTodoLabels()]
          setTimeout(() => {
            const rst = _todos.map(item => JSON.stringify(item))
            this.setData(
              {
                rst
              },
              () => {
                console.log('set todo labels: ', todos)
              }
            )
          })
        } else {
          this.showToast('没有待办事项')
        }
        break
      }
      case 'clearTodoLabels':
        const todos = [...calendar.getTodoLabels()]
        if (!todos || !todos.length) {
          return this.showToast('没有待办事项')
        }
        calendar[action]()
        break
      case 'getTodoLabels': {
        const selected = calendar[action]()
        if (!selected || !selected.length)
          return this.showToast('未设置待办事项')
        const rst = selected.map(item => JSON.stringify(item))
        rst.map(item => JSON.stringify(item))
        this.setData({
          rst
        })
        break
      }
      case 'disableDay':
        calendar[action]([
          {
            year,
            month,
            day: this.generateRandomDate('date')
          }
        ])
        break
      case 'enableArea': {
        let sDate = this.generateRandomDate('date')
        let eDate = this.generateRandomDate('date')
        if (sDate > eDate) {
          ;[eDate, sDate] = [sDate, eDate]
        }
        const area = [`${year}-${month}-${sDate}`, `${year}-${month}-${eDate}`]
        calendar[action](area)
        this.setData({
          rstStr: JSON.stringify(area)
        })
        break
      }
      case 'enableDays':
        const days = [
          `${year}-${month}-${this.generateRandomDate('date')}`,
          `${year}-${month}-${this.generateRandomDate('date')}`,
          `${year}-${month}-${this.generateRandomDate('date')}`,
          `${year}-${month}-${this.generateRandomDate('date')}`,
          `${year}-${month}-${this.generateRandomDate('date')}`
        ]
        calendar[action](days)
        this.setData({
          rstStr: JSON.stringify(days)
        })
        break
      case 'switchView':
        if (!this.week) {
          calendar[action]('week')
          this.week = true
        } else {
          calendar[action]()
          this.week = false
        }
        break
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
        ]
        calendar[action](toSet)
        break
      case 'getCalendarDates':
        this.showToast('请在控制台查看结果')
        console.log(calendar.getCalendarDates())
        break
      default:
        break
    }
  }
}

Page(conf)
