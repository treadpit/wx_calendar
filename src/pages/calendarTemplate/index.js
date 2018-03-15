import initCalendar, { getSelectedDay } from '../../template/calendar/index';
const conf = {
  onShow: function() {
    initCalendar({
      // multi: true, // 是否开启多选,
      /**
       * 选择日期后执行的事件
       * @param { object } currentSelect 当前点击的日期
       * @param { array } allSelectedDays 选择的所有日期（当mulit为true时，才有allSelectedDays参数）
       */
      onTapDay: (currentSelect, allSelectedDays) => {
        console.log('当前点击的日期', currentSelect);
        allSelectedDays && console.log('选择的所有日期', allSelectedDays);
        console.log('getSelectedDay方法', getSelectedDay());
      }
    });
  }
};
Page(conf);
