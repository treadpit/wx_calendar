export const noop = () => {};
export const isFn = fn => typeof fn === 'function';
let wId = 0;
global.wx = {
  getSystemInfoSync: () => {
    return {
      model: 'iPhone 5',
      pixelRatio: 2,
      windowWidth: 320,
      windowHeight: 504,
      system: 'iOS 10.0.1',
      language: 'zh',
      version: '6.6.3',
      screenWidth: 320,
      screenHeight: 568,
      SDKVersion: '2.4.0',
      brand: 'devtools',
      fontSizeSetting: 16,
      batteryLevel: 100,
      statusBarHeight: 20,
      platform: 'ios'
    };
  }
};
global.Page = ({ data, ...rest }) => {
  const page = {
    data,
    setData: jest.fn(function(newData, cb) {
      this.data = {
        ...this.data,
        ...newData
      };

      cb && cb();
    }),
    onLoad: noop,
    onReady: noop,
    onUnLoad: noop,
    __wxWebviewId__: wId++,
    ...rest
  };
  global.wxPageInstance = page;
  return page;
};
