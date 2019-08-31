class Config {
  constructor(component) {
    this.Component = component;
  }
  getCalendarConfig() {
    if (!this.Component || !this.Component.config) return {};
    return this.Component.config;
  }
  setCalendarConfig(key, value) {
    if (!this.Component || !this.Component.config) return;
    this.Component.config[key] = value;
  }
}

export default component => new Config(component);
