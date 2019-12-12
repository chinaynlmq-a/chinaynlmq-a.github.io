const merge = require('webpack-merge');
const ImageminPlugin = require('imagemin-webpack-plugin').default; // 压缩图片插件
const Uglifyjs = require('uglifyjs-webpack-plugin');
const MinCssExtractPlugin = require('mini-css-extract-plugin'); // 将CSS提取为独立的文件的插件
const baseconfig = require('./webpack.base.config');
let path = require('path');
// const packageJson = require('../package.json');
const publicPath = `https://chinaynlmq-a.github.io/`;

function resolve (dir) {
  return path.join(__dirname, '..', dir);
}
let plugins = [], // 插件组件
  entry = {};// webpack文件入口
plugins.push(
  new MinCssExtractPlugin({
    filename: 'static/css/[name].[hash:8].css',
    chunkFilename: 'static/css/lib/[id].[hash:8].css',
    minify: {
      // 把页面中的注释去掉
      removeComments: true,
      // 把多余的空格去掉
      collapseWhitespace: true
    }
  }),
  new ImageminPlugin({
    pngquant: {
      quality: 95 - 100
    }
  }),
  new Uglifyjs({
    parallel: true,
    sourceMap: true,
    cache: true
  })
);
let prdConfig = {
  entry: entry,
  output: {
    filename: 'static/js/[name].[hash:8].js',
    chunkFilename: 'static/lib/[name].[hash:8].js',
    hashDigestLength: 10,
    // path: resolve('dist/' + packageJson.name),
    path: resolve('docs'),
    publicPath
  },
  resolve: {
    extensions: ['.vue', '.js', '.css', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      '@config$': ''
    }
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240, // 图片文件大小小于limit值;转换成base64
              publicPath,
              name: 'static/images/[name].[hash:8].[ext]'
            }
          }
        ]

      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          publicPath,
          name: 'static/fonts/[name].[hash].[ext]'
        }
      }
    ]
  },
  plugins: plugins,
  performance: {
    hints: 'warning', // 枚举
    maxAssetSize: 30000000, // 整数类型（以字节为单位）
    maxEntrypointSize: 50000000, // 整数类型（以字节为单位）
    assetFilter: function (assetFilename) {
      // 提供资源文件名的断言函数
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  }
};

module.exports = merge(baseconfig, prdConfig);
