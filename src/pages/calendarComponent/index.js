const conf = {
  data: {
    calendarConfig: {}
  },
  setTodo() {
    const data = [
      {
        year: '2019',
        month: '8',
        day: '15'
      },
      {
        year: 2019,
        month: 8,
        day: 18,
        todoText: '待办'
      }
    ];
    // 异步请求
    setTimeout(() => {
      this.calendar.setTodoLabels({
        // showLabelAlways: true,
        days: data
      });
    }, 1000);
    this.calendar.enableArea(['2019-8-7', '2019-9-28']);
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
    this.setTodo();
    console.log('afterCalendarRender', e);
  }
};

Page(conf);
