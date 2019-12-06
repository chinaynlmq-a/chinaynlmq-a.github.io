const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    autoprefixer({
      // 不移除属性，例如： -webpack-box-orient
      remove: false
    })
  ]
};
