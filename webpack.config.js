let path = require('path');

module.exports = {
  entry: {
    index: './src/example/index.js',
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, "./output/example")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  devtool: '#module-source-map'
}