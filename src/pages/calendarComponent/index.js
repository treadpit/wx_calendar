import { setTodoLabels, enableArea } from '../../component/calendar/main.js';

const conf = {
  data: {
    calendarConfig: {
      // multi: true,
      // inverse: 1, // 单选模式下是否可以取消选择
      defaultDay: '2019-5-19'
      // disablePastDay: 1
    },
    calendarConfig2: {
      // multi: true,
      // inverse: 1, // 单选模式下是否可以取消选择
      defaultDay: '2019-5-20'
      // disablePastDay: 1
    }
  },
  onShow: function() {
    // initCalendar();
  },
  setTodo() {
    const data = [
      {
        year: '2019',
        month: '5',
        day: '15'
      },
      {
        year: 2019,
        month: 5,
        day: 18,
        todoText: '待办'
      }
    ];
    // 异步请求
    setTimeout(() => {
      setTodoLabels({
        // circle: true,
        days: data
      });
    }, 1000);
    enableArea(['2019-5-7', '2019-10-28']);
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
  }
};

Page(conf);
