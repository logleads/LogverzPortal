const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');

const DIST_PATH = path.join(__dirname, './build');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    // publicPath: '/',
    hot: true,
    // contentBase: DIST_PATH,
    compress: false,
    historyApiFallback: true,
    // disableHostCheck: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    }
  },
  devtool: 'eval-cheap-module-source-map',
});
