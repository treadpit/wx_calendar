import WxData from './wxData'

class Config extends WxData {
  constructor(component) {
    super(component)
    this.Component = component
  }
  getCalendarConfig() {
    if (!this.Component || !this.Component.config) return {}
    return this.Component.config
  }
  setCalendarConfig(config) {
    return new Promise((resolve, reject) => {
      if (!this.Component || !this.Component.config) {
        reject('异常：未找到组件配置信息')
        return
      }
      let conf = { ...this.Component.config, ...config }

      this.Component.config = conf
      this.setData(
        {
          calendarConfig: conf
        },
        () => {
          resolve(conf)
        }
      )
    })
  }
}

export default component => new Config(component)
