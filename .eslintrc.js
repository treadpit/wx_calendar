module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'standard',
  rules: {
    'semi': [2, 'always', { 'omitLastInOneLineBlock': true }],
    'comma-dangle': [2, 'only-multiline'],
    'prefer-promise-reject-errors': 0,
    'space-before-function-paren': 0,
		'arrow-parens': 0,
		"no-tabs": 0
  },
  globals: {
    App: true,
    Page: true,
    getApp: true,
    getCurrentPages: true,
    wx: true,
    location: true,
    WebSocket: true,
    window: true,
    alert: true,
    Location: true,
    my: true,
    Image: true
  },
}
