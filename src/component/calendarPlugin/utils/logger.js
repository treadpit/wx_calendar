export default class Logger {
  info(msg) {
    console.log(
      '%cInfo: %c' + msg,
      'color:#FF0080;font-weight:bold',
      'color: #FF509B'
    )
  }
  warn(msg) {
    console.log(
      '%cWarn: %c' + msg,
      'color:#FF6600;font-weight:bold',
      'color: #FF9933'
    )
  }
  tips(msg) {
    console.log(
      '%cTips: %c' + msg,
      'color:#00B200;font-weight:bold',
      'color: #00CC33'
    )
  }
}
