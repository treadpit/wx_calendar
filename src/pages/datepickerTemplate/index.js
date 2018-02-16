import initDatepicker from '../../template/datepicker/index';
const conf = {
	onShow: function() {
		initDatepicker({
			// showWeek: false,
			// multiSelect: true,
		});
	}
};
Page(conf);
