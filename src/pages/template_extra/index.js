import initCalendar from '../../template/calendar';
const conf = {
  onShow: function () {
    initCalendar();
    
    this.setData({
      'calendar.selectedDays': [{ year: 2018, mon: 2, day: 1, type: 3 }]
    })
    //console.log(this)
    this.refreshCalendar.call(this);
  }
};
Page(conf);
