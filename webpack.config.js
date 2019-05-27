var webpack = require('webpack');
var path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

var src_dir = __dirname + '/src';

var VENDOR_LIBS = ['lodash', 'nanoid', 'react', 'prop-types', 'react-dom', 'gun', 'react-bootstrap'];

var production = process.env.NODE_ENV === 'production';

console.log('is production:', production);

webpackConfig = {
  entry: {
    bundle: './src/index.js',
    vendor: VENDOR_LIBS
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor','manifest']
    }),
    new FilterWarningsPlugin({
      exclude: /Critical dependency: the request of a dependency is an expression/
    }),
    new HTMLWebpackPlugin({
      template: 'src/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  watchOptions: {
   ignored:['data', 'data.json', 'radata', 'ossl']
  }
};

if(!production) {
  webpackConfig.devServer = {
    host: process.env.BIND || '127.0.0.1',
    port: '8080',
    headers: { 'Access-Control-Allow-Origin': '*' }
  };
  // Source maps
  webpackConfig.devtool = 'inline-source-map';
}

module.exports = webpackConfig;
