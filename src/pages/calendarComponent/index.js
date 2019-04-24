import initCalendar, {
  setTodoLabels,
  setSelectedDays,
  getSelectedDay
} from '../../component/calendar/main.js';

const conf = {
  onShow: function() {
    initCalendar({
      multi: true,
      whenChangeMonth(current, next) {
        console.log(current);
        console.log(next);
      },
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
        ];
        // 异步请求
        setTimeout(() => {
          setTodoLabels({
            pos: 'bottom',
            dotColor: '#40',
            days: data
          });
        }, 1000);
        // enableArea(['2018-10-7', '2018-10-28']);
        setTimeout(() => {
          setSelectedDays(data);
        }, 2000);
      }
    });
  },
  jump() {
    // jump(2019, 5, 3);
    console.log(getSelectedDay());
  }
};

Page(conf);
