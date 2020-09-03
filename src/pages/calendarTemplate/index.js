import initCalendar, {
  getSelectedDay,
  setTodoLabels,
  switchView
} from '../../template/calendar/index'
const conf = {
  onShow: function() {
    initCalendar({
      // multi: true, // 是否开启多选,
      // defaultDay: '2018-8-8', // 初始化日历时指定默认选中日期，如：'2018-3-6' 或 '2018-03-06'
      /**
       * 选择日期后执行的事件
       * @param { object } currentSelect 当前点击的日期
       * @param { array } allSelectedDays 选择的所有日期（当mulit为true时，才有allSelectedDays参数）
       */
      afterTapDay: (currentSelect, allSelectedDays) => {
        console.log('===============================')
        console.log('当前点击的日期', currentSelect)
        console.log(
          '当前点击的日期是否有事件标记: ',
          currentSelect.hasTodo || false
        )
        allSelectedDays && console.log('选择的所有日期', allSelectedDays)
        console.log('getSelectedDay方法', getSelectedDay())
      },
      whenChangeMonth(current, next) {
        // console.log(current);
        // console.log(next);
      },
      /**
       * 日期点击事件（此事件会完全接管点击事件）
       * @param { object } currentSelect 当前点击的日期
       * @param { object } event 日期点击事件对象
       */
      // onTapDay(currentSelect, event) {
      //   console.log(currentSelect);
      //   console.log(event);
      // },
      /**
       * 日历初次渲染完成后触发事件，如设置事件标记
       */
      afterCalendarRender(ctx) {
        const data = [
          {
            year: '2019',
            month: '3',
            day: '15'
          },
          {
            year: 2019,
            month: 3,
            day: 18,
            todoText: '待办'
          }
        ]
        // 异步请求
        setTimeout(() => {
          setTodoLabels({
            circle: true,
            days: data
          })
        }, 1000)
        // enableArea(['2018-10-7', '2018-10-28']);
      }
    })
  },
  switchView() {
    if (!this.weekMode) {
      switchView('week')
    } else {
      switchView()
    }
  }
}
Page(conf)
