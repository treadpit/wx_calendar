const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/component/calendar/index.js',
  output: {
    path: path.resolve(__dirname, 'calendar-dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
