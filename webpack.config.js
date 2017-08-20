let path = require('path');

module.exports = {
  entry: {
    index: './src/index.js',
    // example: './src/example/index.js'
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, "./output/dev")
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