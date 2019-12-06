/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
const CleanWebpackPlugin = require('clean-webpack-plugin');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const Uglifyjs = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩css
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');
// const ImageminPlugin = require('imagemin-webpack-plugin').default; // 压缩图片插件
const MinCssExtractPlugin = require('mini-css-extract-plugin'); // 将CSS提取为独立的文件的插件
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const glob = require('glob');
let path = require('path');
let resolve = function (dir) {
  return path.join(__dirname, '..', dir);
};

let getBasicConfig = () => {
  const srcPath = resolve('src');
  let htmlfiles = glob.sync('src/page/**/main.html'),
    plugins = [],
    entry = {};
  // 遍历page文件夹下面的所有main.html文件
  htmlfiles.forEach(function (item, i) {
    const chunkMatcher = item.match(/page\/(.+)\/main.html$/);
    const chunkName = chunkMatcher[1];
    // es6 模板语法 反引号`
    const mainJSPath = `${srcPath}/page/${chunkName}/main.js`;
    const chunkConfigPath = `${srcPath}/page/${chunkName}/chunk-config.js`;
    // 默认设置页面无入口模块
    let hasMainChunk = false;
    // 如果入口脚本存在，则生成入口chunk
    if (fs.existsSync(mainJSPath)) {
      hasMainChunk = true;
      entry[chunkName] = './src/page/' + chunkName + '/main.js';
    }

    let excludeConfig = [];
    // 如果有exclude配置文件,去读取excludeChunk的配置
    if (fs.existsSync(chunkConfigPath)) {
      excludeConfig = require(chunkConfigPath).excludeChunks;
    }

    plugins.push(
      new HtmlWebpackPlugin({
        template: item,
        filename: chunkName + '.html',
        //
        includeSiblingChunks: true,
        //
        appropriate: true,
        inject: true,
        chunks: hasMainChunk ? ['vendor', 'common', chunkName, 'vue-vendor'] : [],
        excludeChunks: excludeConfig,
        chunksSortMode: 'manual',
        minify: {
          removeComments: true,
          collapseWhitespace: true
        },
        hash: false
      })
    );
  });
  plugins.push(
    // 打包目标目录清理插件
    new CleanWebpackPlugin('docs/*', {
      root: path.resolve(__dirname, '..'),
      // false 全部删除 @true 覆盖不删除 // 启用删除文件
      dry: false
    }),
    // new ImageminPlugin({
    //   pngquant: {
    //     quality: 95 - 100
    //   }
    // }),
    new VueLoaderPlugin(),

    new HappyPack({
      // id 标识符，要和 rules 中指定的 id 对应起来
      id: 'babel',
      // 需要使用的 loader，用法和 rules 中 Loader 配置一样
      // 可以直接是字符串，也可以是对象形式
      loaders: ['babel-loader?cacheDirectory'],
      // 共享进程池
      threadPool: happyThreadPool
    })
  );
  return [entry, plugins];
};

let getBasic = getBasicConfig();
module.exports = {
  mode: process.env.NODE_ENV === 'dev' ? 'development' : 'production',
  // 过上面的配置，我们就可以在业务代码中通过process.env.NODE_ENV拿到环境变量值
  entry: getBasic[0],
  module: {
    rules: [
      {
        test: /\.(vue|js)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src')],
        options: {
          formatter: eslintFriendlyFormatter,
          emitWarning: true
        }
      },

      {
        test: /\.js$/,
        // use: ['babel-loader'],
        use: ['happypack/loader?id=babel'],
        exclude: resolve('node_modules')
      },
      {
        test: /\.vue$/,
        // loader: 'vue-loader',
        use: [{
          loader: 'vue-loader',
          options: {
            js: 'happypack/loader?id=babel'
          }
        }]
      },
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === 'dev' ? 'style-loader' : {
            loader: MinCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              // publicPath: './'
            }
          },
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          process.env.NODE_ENV === 'dev' ? 'style-loader' : {
            loader: MinCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              // publicPath: './'
            }
          },
          {loader: 'css-loader'},
          'postcss-loader',
          {loader: 'less-loader'},
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                resolve('src/assets/css/common.less')
              ]
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    // 合并重复的代码块
    mergeDuplicateChunks: true,
    // 移除父模块中已经存在的模块
    removeAvailableModules: true,
    // runtimeChunk: 'single',
    // 无论 mode 值是什么始终保持文件名
    // occurrenceOrder: true,
    // 代码拆分,目前HtmlWebpackPlugin不支持，暂不开启
    namedModules: true,
    namedChunks: true,
    splitChunks: {
      minSize: 3000,
      // chunks: 'async',
      minChunks: 2,
      name: true,
      cacheGroups: {
        vue: {
          name: 'vue-vendor', // 拆分块的名称
          chunks: 'initial', // initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
          priority: 50, // 该配置项是设置处理的优先级，数值越大越优先处理
          test: /([\/]node_modules[\/]vue)/,
          enforce: true // 如果cacheGroup中没有设置minSize，则据此判断是否使用上层的minSize，true：则使用0，false：使用上层minSize
          // minSize: 1024*10,                 //表示在压缩前的最小模块大小，默认为0；
          // minChunks: 1,                     //表示被引用次数，默认为1；
          // maxAsyncRequests:                 //最大的按需(异步)加载次数，默认为1；
          // maxInitialRequests:               //最大的初始化加载次数，默认为1；
          // reuseExistingChunk: true          //表示可以使用已经存在的块，即如果满足条件的块已经存在就使用已有的，不再创建一个新的块。
        },
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          priority: 40,
          // reuseExistingChunk: false,

          test: /[\\/]node_modules[\\/]/,
 	         enforce: true 
        },
        common: {
          name: 'common', 
	        chunks: 'initial',
          // chunks: 'all',
          // test:/\[\]/,
          priority: 30,
          minChunks: 2,
	        enforce: true
        }
      }
    },
    minimizer: [
      // 优化js压缩
      // new Uglifyjs({
      // parallel: true,
      // sourceMap: true,
      // cache: true,
      // }),
      // CSS资源优化
      new OptimizeCssAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default', {discardComments: {removeAll: true}}]
        },
        canPrint: true
      })
    ]
  },
  plugins: getBasic[1],
  devtool: 'source-map'
};
