const conf = {
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = conf.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        'calendar.hasEmptyGrid': true,
        'calendar.empytGrids': empytGrids,
      });
    } else {
      this.setData({
        'calendar.hasEmptyGrid': false,
        'calendar.empytGrids': [],
      });
    }
  },
  calculateDays(year, month) {
    let days = [];

    const thisMonthDays = conf.getThisMonthDays(year, month);

    for (let i = 1; i <= thisMonthDays; i++) {
      days.push({
        day: i,
        year: year,
        mon: month
      });
    }

    this.setData({
      'calendar.days': days,
    });
    // conf.refreshCalendar.call(this);
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.calendar.cur_year;
    const cur_month = this.data.calendar.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      conf.calculateDays.call(this, newYear, newMonth);
      conf.calculateEmptyGrids.call(this, newYear, newMonth);

      this.setData({
        'calendar.cur_year': newYear,
        'calendar.cur_month': newMonth,
      });

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      conf.calculateDays.call(this, newYear, newMonth);
      conf.calculateEmptyGrids.call(this, newYear, newMonth);

      this.setData({
        'calendar.cur_year': newYear,
        'calendar.cur_month': newMonth
      });
    }
  },
  tapDayItem(e) {
    var days = this.data.calendar.days;
    var selectedDays = this.data.calendar.selectedDays;
    var mon = this.data.calendar.cur_month;
    var year = this.data.calendar.cur_year;
    var day = e.currentTarget.dataset.day;

    var data = { year: year, day: day, mon: mon, type: 1 };
    var flag = false;

    for (var j = 0; j < selectedDays.length; j++) {
      var d = selectedDays[j];
      if (d.day == data.day && d.mon == data.mon && d.year == data.year) {
        d.type += 1;
        if (d.type > 3) {
          selectedDays.splice(j, 1);;
        }
        flag = true;
        break;
      }
    };
    if (!flag) {
      selectedDays.push(data);
    }
    selectedDays.sort(function (a, b) {
      if (a.mon == b.mon) {
        return a.day - b.day
      } else {
        return a.mon - b.mon
      }
    });
    this.setData({
      "calendar.selectedDays": selectedDays
    });
    conf.refreshCalendar.call(this);
  },
  refreshCalendar() {
    var days = this.data.calendar.days;
    var selectedDays = this.data.calendar.selectedDays;
    // console.log(selectedDays)

    for (var i = 0; i < days.length; i++) {
      var flag = false;
      for (var j = 0; j < selectedDays.length; j++) {
        var d = selectedDays[j];
        // console.log(days[i])
        if (d.day == days[i].day && d.mon == days[i].mon && d.year == days[i].year) {
          days[i].type = d.type;
          flag = true;
          break;
        }
      }
      if (!flag) {
        days[i].type = 0;
      }
    }
    // console.log(days)
    var selectDayNum = 0;
    for (var j = 0; j < selectedDays.length; j++) {
      var d = selectedDays[j];
      if (d.type == 1) {
        selectDayNum++;
      } else {
        selectDayNum = selectDayNum + 0.5;
      }
    }
    this.setData({
      "calendar.selectDaysNum": selectDayNum,
      "calendar.days": days
    });
    
  },
  showDaysDetail(e) {
    var isShowDetail = this.data.calendar.isShowDetail;
    this.setData({
      "calendar.isShowDetail": !isShowDetail
    });
  },
  chooseYearAndMonth() {
    let picker_year = [],
      picker_month = [];
    for (let i = 1900; i <= 2100; i++) {
      picker_year.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      picker_month.push(i);
    }
    this.setData({
      'calendar.showPicker': true,
    });
  }
};

function _getCurrentPage() {
  const pages = getCurrentPages();
  const last = pages.length - 1;
  return pages[last];
}

export default () => {
  const self = _getCurrentPage();
  const date = new Date();
  const cur_year = date.getFullYear();
  const cur_month = date.getMonth() + 1;
  const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
  self.setData({
    calendar: {
      cur_year,
      cur_month,
      weeks_ch,
      hasEmptyGrid: false,
      selectedDays: [],
      typeIndex: 0,
      selectDaysNum: 0
    },
  });
  conf.calculateEmptyGrids.call(self, cur_year, cur_month);
  conf.calculateDays.call(self, cur_year, cur_month);
  self.tapDayItem = conf.tapDayItem.bind(self);
  self.handleCalendar = conf.handleCalendar.bind(self);
  self.chooseYearAndMonth = conf.chooseYearAndMonth.bind(self);
  self.showDaysDetail = conf.showDaysDetail.bind(self);
  self.refreshCalendar = conf.refreshCalendar.bind(self);
};

