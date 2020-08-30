class Config {
  constructor(component) {
    this.Component = component
  }
  getConf() {
    if (!this.Component || !this.Component.data.config) return {}
    return this.Component.data.config
  }
  setConf(config) {
    return new Promise((resolve, reject) => {
      if (!this.Component || !this.Component.data.config) {
        reject('异常：未找到组件配置信息')
        return
      }
      let conf = { ...this.Component.data.config, ...config }
      this.Component.setData(
        {
          config: conf
        },
        () => {
          resolve(conf)
        }
      )
    })
  }
}

export const setConfig = (config, compoent) => {
  return new Promise((resolve, reject) => {
    const configInstance = new Config(compoent)
    configInstance.setConf(config).then(resolve, reject)
  })
}

export const getConfig = compoent => {
  const configInstance = new Config(compoent)
  return configInstance.getConf()
}
