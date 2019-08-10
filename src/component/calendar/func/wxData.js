class WxData {
  constructor(component) {
    this.Component = component;
  }
  getData(key) {
    if (!key) return this.Component.data;
    if (key.includes('.')) {
      let keys = key.split('.');
      let len = keys.length;
      let tmp = null;
      for (let i = 0; i < len; i++) {
        const v = keys[i];
        if (i === 0) {
          if (this.Component.data[v] !== undefined) {
            tmp = this.Component.data[v];
          }
        } else {
          if (tmp[v] !== undefined) {
            tmp = tmp[v];
          }
        }
      }
      return tmp;
    } else {
      return this.Component.data[key];
    }
  }
  setData(data, cb = () => {}) {
    if (!data) return;
    if (typeof data === 'object') {
      this.Component.setData(data, cb);
    }
  }
}

export default component => new WxData(component);
