const conf = {
  data: {
    calendarConfig: {
      multi: true,
      // inverse: 1, // 单选模式下是否可以取消选择
      // defaultDay: '2019-5-19'
      onlyShowCurrentMonth: 1
    },
    calendarConfig2: {
      // multi: true,
      inverse: 1, // 单选模式下是否可以取消选择
      defaultDay: '2019-5-20'
    }
  },
  setTodo() {
    const data = [
      {
        year: '2019',
        month: '6',
        day: '15'
      },
      {
        year: 2019,
        month: 6,
        day: 18,
        todoText: '待办'
      }
    ]

    this.calendar.setTodoLabels(
      {
        // circle: true,
        // pos: 'top',
        days: data
      },
      '#start'
    )
  },
  afterTapDay1(e) {
    console.log('afterTapDay', e.detail)
  },
  whenChangeMonth1(e) {
    console.log('whenChangeMonth', e.detail)
  },
  onTapDay1(e) {
    console.log('onTapDay', e.detail)
  },
  afterCalendarRender1(e) {
    console.log('afterCalendarRender', e)
    this.setTodo()
    this.calendar.disableDay(
      [
        {
          year: '2019',
          month: '6',
          day: '15'
        },
        {
          year: '2019',
          month: '6',
          day: '30'
        }
      ],
      '#start'
    )
  },
  afterCalendarRender2(e) {
    console.log('afterCalendarRender', e)
    this.setTodo()
    this.calendar.disableDay(
      [
        {
          year: '2019',
          month: '5',
          day: '10'
        },
        {
          year: '2019',
          month: '5',
          day: '28'
        }
      ],
      '#end'
    )
    setTimeout(() => {
      this.calendar.disableDay([], '#end')
    }, 2000)
  }
}

Page(conf)
