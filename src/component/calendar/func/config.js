class Config {
  constructor(component) {
    this.Component = component;
  }
  getCalendarConfig() {
    return this.Component.config;
  }
  setCalendarConfig(key, value) {
    this.Component.config[key] = value;
  }
}

export default component => new Config(component);
