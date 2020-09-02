import todo from '../../component/calendarPlugin/plugins/todo'
import solarLunar from '../../component/calendarPlugin/plugins/solarLunar/index'
import plugin from '../../component/calendarPlugin/plugins/index'

plugin.use(todo).use(solarLunar)

const conf = {
  data: {
    calendarConfig: {
      // showLunar: true,
      // theme: 'elegant'
      // chooseAreaMode: true,
      // firstDayOfWeek: 'Mon',
      // disableMode: {
      //   type: 'after',
      //   date: '2020-03-9'
      // },
      defaultDate: '2020-8-6',
      multi: true,
      autoChoosedWhenJump: true
    },
    actionBtn: [
      {
        text: '跳转指定日期',
        action: 'jump',
        color: 'olive'
      },
      {
        text: '获取当前已选',
        action: 'getSelectedDates',
        color: 'red'
      },
      {
        text: '取消选中日期',
        action: 'cancelSelectedDates',
        color: 'mauve'
      },
      {
        text: '设置待办事项',
        action: 'setTodos',
        color: 'cyan'
      },
      {
        text: '删除指定代办',
        action: 'deleteTodos',
        color: 'pink'
      },
      {
        text: '清空待办事项',
        action: 'clearTodos',
        color: 'red'
      },
      {
        text: '获取所有代办',
        action: 'getTodos',
        color: 'purple'
      },
      {
        text: '禁选指定日期',
        action: 'disableDates',
        color: 'olive'
      },
      {
        text: '指定可选区域',
        action: 'enableArea',
        color: 'pink'
      },
      {
        text: '指定特定可选',
        action: 'enableDates',
        color: 'red'
      },
      {
        text: '选中指定日期',
        action: 'setSelectedDates',
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
  onShow() {
    // setTimeout(() => {
    //   this.calendar.jump({
    //     year: 2020,
    //     month: 9,
    //     date: 5
    //   })
    // }, 5000)
  },
  afterTapDate(e) {
    console.log('afterTapDate', e.detail)
    const calendar = this.selectComponent('#calendar').calendar
    console.log('onShow -> getSelectedDates', calendar.getSelectedDates())
  },
  whenChangeMonth(e) {
    console.log('whenChangeMonth', e.detail)
  },
  whenChangeWeek(e) {
    console.log('whenChangeWeek', e.detail)
  },
  onTapDate(e) {
    console.log('onTapDate', e.detail)
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
    const calendar = this.selectComponent('#calendar').calendar
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
        calendar[action]({ year, month, date })
        break
      }
      case 'getSelectedDates': {
        const selected = calendar[action]()
        if (!selected || !selected.length)
          return this.showToast('当前未选择任何日期')
        this.showToast('请在控制台查看结果')
        console.log('get selected dates: ', selected)
        const rst = selected.map(item => JSON.stringify(item))
        this.setData({
          rst
        })
        break
      }
      case 'cancelSelectedDates':
        const selected = calendar.getSelectedDates()
        calendar[action](selected)
        break
      case 'setTodos': {
        const dates = [
          {
            year,
            month,
            date: this.generateRandomDate('date'),
            todoText: Math.random() * 10 > 5 ? '领奖日' : ''
          }
        ]
        calendar[action]({
          showLabelAlways: true,
          dates
        })
        console.log('set todo: ', dates)
        break
      }
      case 'deleteTodos': {
        const todos = [...calendar.getTodos()]
        if (todos.length) {
          calendar[action]([todos[0]]).then(() => {
            const _todos = [...calendar.getTodos()]
            setTimeout(() => {
              const rst = _todos.map(item => JSON.stringify(item))
              this.setData(
                {
                  rst
                },
                () => {
                  console.log('delete todo: ', todos[0])
                }
              )
            })
          })
        } else {
          this.showToast('没有待办事项')
        }
        break
      }
      case 'clearTodos':
        const todos = [...calendar.getTodos()]
        if (!todos || !todos.length) {
          return this.showToast('没有待办事项')
        }
        calendar[action]()
        break
      case 'getTodos': {
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
      case 'disableDates':
        calendar[action]([
          {
            year,
            month,
            date: this.generateRandomDate('date')
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
      case 'enableDates':
        const dates = [
          `${year}-${month}-${this.generateRandomDate('date')}`,
          `${year}-${month}-${this.generateRandomDate('date')}`,
          `${year}-${month}-${this.generateRandomDate('date')}`,
          `${year}-${month}-${this.generateRandomDate('date')}`,
          `${year}-${month}-${this.generateRandomDate('date')}`
        ]
        calendar[action](dates)
        this.setData({
          rstStr: JSON.stringify(dates)
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
      case 'setSelectedDates':
        const toSet = [
          {
            year,
            month,
            date: this.generateRandomDate('date')
          },
          {
            year,
            month,
            date: this.generateRandomDate('date')
          }
        ]
        calendar[action](toSet)
        break
      case 'getCalendarDates':
        this.showToast('请在控制台查看结果')
        console.log(
          calendar.getCalendarDates({
            lunar: true
          })
        )
        break
      default:
        break
    }
  }
}

Page(conf)
