import preset from './preset/index'

export default {
  installed: [...preset],
  use(plugin) {
    if (typeof plugin !== 'function') return
    const info = plugin() || {}
    const { name } = info
    if (
      name &&
      name !== 'methods' &&
      !this.installed.some(p => p[0] === name)
    ) {
      this.installed.unshift([name, info])
    }
    return this
  }
}
