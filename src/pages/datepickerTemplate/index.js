import initDatepicker from '../../template/datepicker/index';
const conf = {
	onShow: function() {
		initDatepicker({
			placeholder: '请选择日期',
			type: 'normal', // [normal 普通单选模式, timearea 时间段选择模式, multiSelect 多选模式],
		});
	}
};
Page(conf);
