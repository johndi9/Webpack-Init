const Webpack           = require('webpack');
const fs                = require('fs');
const path              = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const cssnext           = require('cssnext');
const postcssEasings    = require('postcss-easings');
const autoprefixer      = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const nodeModulesPath   = path.resolve(__dirname, 'node_modules');
const normalizeScssPath = path.resolve(nodeModulesPath, 'normalize.scss');
const buildPath         = path.resolve(__dirname, 'public', 'build');
const mainPath          = path.resolve(__dirname, 'src', 'main.js');
const htmlTemplate      = path.resolve(__dirname, 'src', 'index.html');
const reactPath         = path.resolve(nodeModulesPath, 'react', 'dist');

const autoprefixerBrowsers = ['Android 2.3', 'Android >= 4', 'Chrome >= 20', 'Firefox >= 24', 'Explorer >= 9', 'iOS >= 6', 'Opera >= 12', 'Safari >= 6'];
const sassLoaders = [
  'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
  'postcss-loader',
  'cssnext-loader',
  'sass-loader?outputStyle=expanded&includePaths[]=' + encodeURIComponent(normalizeScssPath)
];

const config = {
  // Makes sure errors in console map to the correct file
  // and line number
  devtool: 'eval-source-map',
  entry: [

    // For hot style updates
    'webpack/hot/dev-server',

    // The script refreshing the browser on none hot updates
    'webpack-dev-server/client?http://localhost:8080',

    // Our application
    mainPath],
  output: {

    // We need to give Webpack a path. It does not actually need it,
    // because files are kept in memory in webpack-dev-server, but an
    // error will occur if nothing is specified. We use the buildPath
    // as that points to where the files will eventually be bundled
    // in production
    path: buildPath,
    filename: 'bundle.js',

    // Everything related to Webpack should go through a build path,
    // localhost:3000/build. That makes proxying easier to handle
    publicPath: '/build/'
  },
  module: {
    noParse: [reactPath],
    preLoaders: [
      {test: /\.jsx?$/, loader: 'eslint-loader', exclude: /node_modules/}
    ],
    loaders: [
      {test: /\.txt/, loader: 'file?name=[path][name].[ext]'},
      {test: /\.gif$/, loader: 'url?limit=10000&mimetype=image/gif'},
      {test: /\.jpg$/, loader: 'url?limit=10000&mimetype=image/jpg'},
      {test: /\.png$/, loader: 'url?limit=10000&mimetype=image/png'},
      {test: /\.woff$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.woff2$/, loader: 'url?limit=10000&mimetype=application/font-woff2'},
      {test: /\.ttf$/, loader: 'file?mimetype=application/vnd.ms-fontobject'},
      {test: /\.eot$/, loader: 'file?mimetype=application/x-font-ttf'},
      {test: /\.svg$/, loader: 'file?mimetype=image/svg+xml'},
      {test: /\.jsx?$/, loaders: ['react-hot', 'jsx-loader?harmony', 'babel-loader'], exclude: [nodeModulesPath]},
      {test: /\.js$/, loaders: ['babel-loader'], exclude: [nodeModulesPath]},
      {test: /\.scss$/, loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))},
    ]
  },
  postcss: [
    autoprefixer({browsers: autoprefixerBrowsers}), postcssEasings, cssnext
  ],
  eslint: {
    configFile: '.eslintrc'
  },
  plugins: [
    new Webpack.optimize.OccurenceOrderPlugin(),
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.NoErrorsPlugin(),
    new Webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('development')}),
    new ExtractTextPlugin('bundle.css', {allChunks: true}),
    new HtmlWebpackPlugin({template: htmlTemplate}),
    new Webpack.optimize.CommonsChunkPlugin('common.js', 2),
  ]
};

module.exports = config;