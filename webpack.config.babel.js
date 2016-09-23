const path = require('path');
const webpack = require('webpack');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react',
};

const reactMotionExternal = {
  root: 'ReactMotion',
  commonjs2: 'react-motion',
  commonjs: 'react-motion',
  amd: 'react-motion',
};

module.exports = {
  module: {
    loaders: [
      { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader', },
    ],
  },
  output: {
    libraryTarget: 'umd',
    library: 'ReactSpinningNumbers',
  },
  externals: {
    'react': reactExternal,
    'react-motion': reactMotionExternal,
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modules: [
      'node_modules',
    ],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(nodeEnv),
      },
    }),
  ],
};
