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
				choosed: false
			});
		}

		this.setData({
			'calendar.days': days,
		});
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
		const idx = e.currentTarget.dataset.idx;
		const days = this.data.calendar.days;
		days[ idx ].choosed = !days[ idx ].choosed;
		this.setData({
			'calendar.days': days,
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
	},
};

function _getCurrentPage() {
	const pages = getCurrentPages();
	const last = pages.length - 1;
	return pages[ last ];
}

export default () => {
	const self = _getCurrentPage();
	const date = new Date();
	const cur_year = date.getFullYear();
	const cur_month = date.getMonth() + 1;
	const weeks_ch = [ '日', '一', '二', '三', '四', '五', '六' ];
	self.setData({
		calendar: {
			cur_year,
			cur_month,
			weeks_ch,
			hasEmptyGrid: false,
		}
	});
	conf.calculateEmptyGrids.call(self, cur_year, cur_month);
	conf.calculateDays.call(self, cur_year, cur_month);
	self.tapDayItem = conf.tapDayItem.bind(self);
	self.handleCalendar = conf.handleCalendar.bind(self);
	self.chooseYearAndMonth = conf.chooseYearAndMonth.bind(self);
};

