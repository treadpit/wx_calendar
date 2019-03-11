import initCalendar, {
  setTodoLabels,
  setSelectedDays
} from '../../component/calendar/main.js';

const conf = {
  onShow: function() {
    initCalendar({
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
  }
};

Page(conf);
