let chooseYear = null
let chooseMonth = null
const conf = {
  data: {
    hasEmptyGrid: false,
    showPicker: false
  },
  onLoad() {
    const date = new Date()
    const curYear = date.getFullYear()
    const curMonth = date.getMonth() + 1
    const weeksCh = ['日', '一', '二', '三', '四', '五', '六']
    this.calculateEmptyGrids(curYear, curMonth)
    this.calculateDays(curYear, curMonth)
    this.setData({
      curYear,
      curMonth,
      weeksCh
    })
  },
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate()
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay()
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month)
    let empytGrids = []
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i)
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      })
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      })
    }
  },
  calculateDays(year, month) {
    let days = []

    const thisMonthDays = this.getThisMonthDays(year, month)

    for (let i = 1; i <= thisMonthDays; i++) {
      days.push({
        day: i,
        choosed: false
      })
    }

    this.setData({
      days
    })
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle
    const curYear = this.data.curYear
    const curMonth = this.data.curMonth
    if (handle === 'prev') {
      let newMonth = curMonth - 1
      let newYear = curYear
      if (newMonth < 1) {
        newYear = curYear - 1
        newMonth = 12
      }

      this.calculateDays(newYear, newMonth)
      this.calculateEmptyGrids(newYear, newMonth)

      this.setData({
        curYear: newYear,
        curMonth: newMonth
      })
    } else {
      let newMonth = curMonth + 1
      let newYear = curYear
      if (newMonth > 12) {
        newYear = curYear + 1
        newMonth = 1
      }

      this.calculateDays(newYear, newMonth)
      this.calculateEmptyGrids(newYear, newMonth)

      this.setData({
        curYear: newYear,
        curMonth: newMonth
      })
    }
  },
  tapDayItem(e) {
    const idx = e.currentTarget.dataset.idx
    const days = this.data.days
    days[idx].choosed = !days[idx].choosed
    this.setData({
      days
    })
  },
  chooseYearAndMonth() {
    const curYear = this.data.curYear
    const curMonth = this.data.curMonth
    let pickerYear = []
    let pickerMonth = []
    for (let i = 1900; i <= 2100; i++) {
      pickerYear.push(i)
    }
    for (let i = 1; i <= 12; i++) {
      pickerMonth.push(i)
    }
    const idxYear = pickerYear.indexOf(curYear)
    const idxMonth = pickerMonth.indexOf(curMonth)
    this.setData({
      pickerValue: [idxYear, idxMonth],
      pickerYear,
      pickerMonth,
      showPicker: true
    })
  },
  pickerChange(e) {
    const val = e.detail.value
    chooseYear = this.data.pickerYear[val[0]]
    chooseMonth = this.data.pickerMonth[val[1]]
  },
  tapPickerBtn(e) {
    const type = e.currentTarget.dataset.type
    const o = {
      showPicker: false
    }
    if (type === 'confirm') {
      o.curYear = chooseYear
      o.curMonth = chooseMonth
      this.calculateEmptyGrids(chooseYear, chooseMonth)
      this.calculateDays(chooseYear, chooseMonth)
    }

    this.setData(o)
  },
  onShareAppMessage() {
    return {
      title: '小程序日历',
      desc: '还是新鲜的日历哟',
      path: 'pages/index/index'
    }
  }
}

Page(conf)
