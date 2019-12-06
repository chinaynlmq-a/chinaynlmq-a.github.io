
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseconfig = require('./webpack.base.config');
const path = require('path');
// const packageJson = require('../package.json');
const myIp = require('./units').getIpv4Address();
// 开发路径配置
// const publicPath = `/${packageJson.name}/`;
const publicPath = '/';
function resolve (dir) {
  return path.join(__dirname, '..', dir);
}
let plugins = [];// 插件入口
plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin()
);
let devConfig = {
  output: {
    filename: 'static/js/[name].[hash:8].js',
    chunkFilename: 'static/lib/[name].[hash:8].js',
    hashDigestLength: 10,
    // path: resolve(packageJson.name),
    path: publicPath,
    publicPath
  },
  resolve: {
    extensions: ['.vue', '.js', '.css', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      // 设置配置模块，引用当前环境指定的配置
      '@config$': resolve('/src/config/dev.js')
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
              name: 'static/images/[name].[ext]?[hash:8]'
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
          name: 'static/fonts/[name].[ext]?[hash]'
        }
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    publicPath: `/${publicPath}/`,
    host: myIp,
    compress: true,
    port: 1442,
    hot: true,
    // 代理地址配置
    proxy: {
      'test': {
        
        changeOrigin: true,
        pathRewrite: {
          '': ''
        }
      }
    },
    allowedHosts: ['localhost', '0.0.0.0', '127.0.0.1', myIp, '*'],
    // 是否自动打开浏览器
    open: false,
    openPage: `/index.html`

  },
  plugins: plugins
  // 启动本地服务相关配置
};

module.exports = merge(baseconfig, devConfig);
