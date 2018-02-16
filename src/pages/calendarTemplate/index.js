import initCalendar from '../../template/calendar/index';
const conf = {
	onShow: function() {
		initCalendar();
	}
};
Page(conf);
