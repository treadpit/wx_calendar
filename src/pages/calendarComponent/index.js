import initCalendar from '../../component/calendar/main.js';

const conf = {
  onShow: function() {
    initCalendar();
  }
};

Page(conf);
