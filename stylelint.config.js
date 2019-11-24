module.exports = {
  defaultSeverity: 'error',
  extends: 'stylelint-config-wxss',
  plugins: ['stylelint-no-z-index'],
  rules: {
    'at-rule-no-vendor-prefix': true,
    indentation: 4,
    'media-feature-name-no-vendor-prefix': true,
    'no-missing-end-of-source-newline': null,
    'plugin/no-z-index': 2,
    'property-no-vendor-prefix': true,
    'selector-max-compound-selectors': null,
    'selector-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    'selector-type-no-unknown': [true, { ignoreTypes: ['page', 'navigator'] }],
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
    'font-family-no-missing-generic-family-keyword': null
  }
};
