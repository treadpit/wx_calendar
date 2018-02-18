
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
		let day;
		let selectMonth;
		let selectYear;
		const thisMonthDays = conf.getThisMonthDays(year, month);
		const selectedDay = this.data.datepicker.selectedDay;
		if (selectedDay && selectedDay.length) {
			day = selectedDay[ 0 ].day;
			selectMonth = selectedDay[ 0 ].month;
			selectYear = selectedDay[ 0 ].year;
		}
		for (let i = 1; i <= thisMonthDays; i++) {
			days.push({
				day: i,
				choosed: curDate ? (i === curDate) : (year === selectYear && month === selectMonth && i === day),
				year,
				month,
			});
		}
		const tmp = {
			'datepicker.days': days,
		};
		if (curDate) {
			tmp[ 'datepicker.selectedDay' ] = [ {
				day: curDate,
				choosed: true,
				year,
				month,
			} ];
		}
		this.setData(tmp);
	},
	/**
	 * 初始化日历选择器
	 * @param {number} curYear
	 * @param {number} curMonth
	 * @param {number} curDate
	 */
	init(curYear = 2018, curMonth = 1, curDate = 1) {
		const self = _getCurrentPage();
		if (!curYear || !curMonth || !curDate) {
			const date = new Date();
			curYear = date.getFullYear();
			curMonth = date.getMonth() + 1;
			curDate = date.getDate();
		}
		const weeksCh = [ '日', '一', '二', '三', '四', '五', '六' ];
		self.setData({
			'datepicker.curYear': curYear,
			'datepicker.curMonth': curMonth,
			'datepicker.weeksCh': weeksCh,
			'datepicker.hasEmptyGrid': false,
			'datepicker.showDatePicker': true,
		});
		conf.calculateEmptyGrids.call(self, curYear, curMonth);
		conf.calculateDays.call(self, curYear, curMonth, curDate);
	},
	/**
	 * 点击输入框调起日历选择器
	 * @param {object} e  事件对象
	 */
	showDatepicker(e) {
		const value = e.detail.value;
		if (value && typeof value === 'string') {
			const tmp = value.split('-');
			conf.init(+tmp[ 0 ], +tmp[ 1 ], +tmp[ 2 ]);
		} else {
			conf.init();
		}
	},
	/**
	 * 当输入日期时
	 * @param {object} e  事件对象
	 */
	onInputDate(e) {
		this.inputTimer && clearTimeout(this.inputTimer);
		this.inputTimer = setTimeout(() => {
			console.log(e);
			const v = e.detail.value;
			const _v = (v && v.split('-')) || [];
			const RegExpYear = /^\d{4}$/;
			const RegExpMonth = /^(([0]?[1-9])|([1][0-2]))$/;
			const RegExpDay = /^(([0]?[1-9])|([1-2][0-9])|(3[0-1]))$/;
			if (_v && _v.length === 3) {
				if (RegExpYear.test(_v[0]) && RegExpMonth.test(_v[1]) && RegExpDay.test(_v[2])) {
					conf.init(+_v[0], +_v[1], +_v[2]);
				}
			}
		}, 500);
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
		const { curYear, curMonth, days } = this.data.datepicker;
		const key = `datepicker.days[${idx}].choosed`;
		const selectedValue = `${curYear}-${curMonth}-${days[ idx ].day}`;
		if (this.config.type === 'timearea') {
			this.setData({
				[ key ]: !days[ idx ].choosed,
			});
		} else if (this.config.type === 'normal' && !days[ idx ].choosed) {
			const prev = days.filter(item => item.choosed)[ 0 ];
			const prevKey = prev && `datepicker.days[${prev.day - 1}].choosed`;
			this.setData({
				[ prevKey ]: false,
				[ key ]: true,
				'datepicker.selectedValue': selectedValue,
				'datepicker.selectedDay': [ days[ idx ] ],
			});
		}
	},
	/**
	 * 关闭日历选择器
	 */
	closeDatePicker() {
		this.setData({
			'datepicker.showDatePicker': false,
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
	if (!config.type) config.type = 'normal';
	self.config = config;
	self.setData({
		datepicker: {
			showDatePicker: false,
			showInput: (config.showInput === true || config.showInput === undefined),
			placeholder: config.placeholder || '请选择日期',
		}
	});
	self.touchstart = conf.touchstart.bind(self);
	self.touchmove = conf.touchmove.bind(self);
	self.showDatepicker = conf.showDatepicker.bind(self);
	self.onInputDate = conf.onInputDate.bind(self);
	self.closeDatePicker = conf.closeDatePicker.bind(self);
	self.tapDayItem = conf.tapDayItem.bind(self);
	self.handleCalendar = conf.handleCalendar.bind(self);
};

/**
 * 获取已选择的日期
*/
export const getSelectedDay = () => {
	const self = _getCurrentPage();
	return self.data.datepicker.selectedDay;
};
