
/**
* 左滑
* @param {object} e 事件对象
* @returns {boolean} 布尔值
*/
function isLeftSlide(e) {
	const { startX, startY } = this.data.gesture;
	if (this.slideLock) {
		const t = e.touches[ 0 ];
		const deltaX = t.clientX - startX;
		const deltaY = t.clientY - startY;

		if (deltaX < -20 && deltaX > -40 && deltaY < 8 && deltaY > -8) {
			this.slideLock = false;
			return true;
		} else {
			return false;
		}
	}
}
/**
* 右滑
* @param {object} e 事件对象
* @returns {boolean} 布尔值
*/
function isRightSlide(e) {
	const { startX, startY } = this.data.gesture;
	if (this.slideLock) {
		const t = e.touches[ 0 ];
		const deltaX = t.clientX - startX;
		const deltaY = t.clientY - startY;

		if (deltaX > 20 && deltaX < 40 && deltaY < 8 && deltaY > -8) {
			this.slideLock = false;
			return true;
		} else {
			return false;
		}
	}
}

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
				'datepicker.hasEmptyGrid': true,
				'datepicker.empytGrids': empytGrids,
			});
		} else {
			this.setData({
				'datepicker.hasEmptyGrid': false,
				'datepicker.empytGrids': [],
			});
		}
	},
	calculateDays(year, month, curDate) {
		let days = [];

		const thisMonthDays = conf.getThisMonthDays(year, month);

		for (let i = 1; i <= thisMonthDays; i++) {
			days.push({
				day: i,
				choosed: i === curDate,
				year,
				month,
			});
		}

		this.setData({
			'datepicker.days': days,
			'datepicker.selectedDay': [{
				day: curDate,
				choosed: true,
				year,
				month,
			}],
		});
	},
	choosePrevMonth() {
		const { curYear, curMonth } = this.data.datepicker;
		let newMonth = curMonth - 1;
		let newYear = curYear;
		if (newMonth < 1) {
			newYear = curYear - 1;
			newMonth = 12;
		}

		conf.calculateDays.call(this, newYear, newMonth);
		conf.calculateEmptyGrids.call(this, newYear, newMonth);

		this.setData({
			'datepicker.curYear': newYear,
			'datepicker.curMonth': newMonth,
		});
	},
	chooseNextMonth() {
		const { curYear, curMonth } = this.data.datepicker;
		let newMonth = curMonth + 1;
		let newYear = curYear;
		if (newMonth > 12) {
			newYear = curYear + 1;
			newMonth = 1;
		}
		conf.calculateDays.call(this, newYear, newMonth);
		conf.calculateEmptyGrids.call(this, newYear, newMonth);

		this.setData({
			'datepicker.curYear': newYear,
			'datepicker.curMonth': newMonth
		});
	},
	handleCalendar(e) {
		const handle = e.currentTarget.dataset.handle;
		if (handle === 'prev') {
			conf.choosePrevMonth.call(this);
		} else {
			conf.chooseNextMonth.call(this);
		}
	},
	tapDayItem(e) {
		const idx = e.currentTarget.dataset.idx;
		const days = this.data.datepicker.days;
		const key = `datepicker.days[${idx}].choosed`;
		if (this.config.multiSelect) {
			this.setData({
				[ key ]: !days[ idx ].choosed,
			});
		} else if (!this.config.multiSelect && !days[ idx ].choosed) {
			const prev = days.filter(item => item.choosed)[ 0 ];
			const prevKey = prev && `datepicker.days[${prev.day - 1}].choosed`;
			this.setData({
				[ prevKey ]: false,
				[ key ]: true,
				'datepicker.selectedDay': [days[ idx ]],
			});
		}
	},
	chooseYearAndMonth() {
		let pickerYear = [];
		let pickerMonth = [];
		for (let i = 1900; i <= 2100; i++) {
			pickerYear.push(i);
		}
		for (let i = 1; i <= 12; i++) {
			pickerMonth.push(i);
		}
		this.setData({
			'datepicker.showPicker': true,
		});
	},
	init(curYear = '', curMonth = '', curDate = '') {
		const self = _getCurrentPage();
		if (!curYear || !curMonth || !curDate) {
			const date = new Date();
			curYear = date.getFullYear();
			curMonth = date.getMonth() + 1;
			curDate = date.getDate();
		}
		const weeksCh = [ '日', '一', '二', '三', '四', '五', '六' ];
		self.setData({
			datepicker: {
				curYear,
				curMonth,
				weeksCh,
				hasEmptyGrid: false,
				showDatePicker: true,
			}
		});
		conf.calculateEmptyGrids.call(self, curYear, curMonth);
		conf.calculateDays.call(self, curYear, curMonth, curDate);
	},
	triggerDatepicker(e) {
		const value = e.detail.value;
		if (value && typeof value === 'string') {
			const tmp = value.split('-');
			conf.init(+tmp[ 0 ], +tmp[ 1 ], +tmp[ 2 ]);
		} else {
			conf.init();
		}
	},
	closeDatePicker() {
		const selectedDay = this.data.datepicker && this.data.datepicker.selectedDay[0];
		const { year, month, day } = selectedDay;
		const selectedValue = selectedDay && `${year}-${month}-${day}`;
		this.setData({
			'datepicker.showDatePicker': false,
			'datepicker.selectedValue': selectedValue,
		});
	},
	touchstart(e) {
		const t = e.touches[ 0 ];
		const startX = t.clientX;
		const startY = t.clientY;
		this.slideLock = true;
		this.setData({
			'gesture.startX': startX,
			'gesture.startY': startY
		});
	},
	touchmove(e) {
		if (isLeftSlide.call(this, e)) {
			conf.chooseNextMonth.call(this);
		}
		if (isRightSlide.call(this, e)) {
			conf.choosePrevMonth.call(this);
		}
	}
};

function _getCurrentPage() {
	const pages = getCurrentPages();
	const last = pages.length - 1;
	return pages[ last ];
}

export default (config = {}) => {
	const self = _getCurrentPage();
	self.config = config;
	self.setData({
		datepicker: {
			showDatePicker: false,
		}
	});
	self.touchstart = conf.touchstart.bind(self);
	self.touchmove = conf.touchmove.bind(self);
	self.triggerDatepicker = conf.triggerDatepicker.bind(self);
	self.closeDatePicker = conf.closeDatePicker.bind(self);
	self.tapDayItem = conf.tapDayItem.bind(self);
	self.handleCalendar = conf.handleCalendar.bind(self);
	self.chooseYearAndMonth = conf.chooseYearAndMonth.bind(self);
};
