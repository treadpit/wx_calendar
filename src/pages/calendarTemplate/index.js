import initCalendar from '../../template/calendar/index';
const conf = {
  onShow: function() {
    initCalendar({
      multi: true, // 是否开启多选
    });
  }
};
Page(conf);
