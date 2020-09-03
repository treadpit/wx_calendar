import { dateUtil } from './utils/index'

export function calcTargetYMInfo() {
  return {
    right: dateUtil.getPrevMonthInfo,
    left: dateUtil.getNextMonthInfo,
    prev_month: dateUtil.getPrevMonthInfo,
    next_month: dateUtil.getNextMonthInfo,
    prev_year: dateUtil.getPrevYearInfo,
    next_year: dateUtil.getNextYearInfo
  }
}
