class WxData {
  constructor(component) {
    this.Component = component
  }
  getData(key) {
    const data = this.Component.data
    if (!key) return data
    if (key.includes('.')) {
      let keys = key.split('.')
      const tmp = keys.reduce((prev, next) => {
        return prev[next]
      }, data)
      return tmp
    } else {
      return this.Component.data[key]
    }
  }
  setData(data) {
    return new Promise((resolve, reject) => {
      if (!data) return reject('no data to set')
      if (typeof data === 'object') {
        this.Component.setData(data, () => {
          resolve(data)
        })
      }
    })
  }
}

export default WxData
