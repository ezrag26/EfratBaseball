const path = require('path')

module.exports = {
  entry: {
    index: "./site/index.js",
    login: "./site/login/index.js",
    register: "./site/register/index.js",
    schedule: "./site/schedule/index.js",
    standings: "./site/standings/index.js",
    gallery: "./site/gallery/index.js",
    "admin_login": "./site/admin/login/index.js"
  },
  output: {
    path: path.resolve(__dirname, "public", "dist"),
    filename: "[name]_bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: { loader: 'babel-loader' },
        exclude: /node_modules/
      }
    ]
  },
  devServer: {
    publicPath: "/dist",
    contentBase: "./public"
  }
}