const path = require('path')

module.exports = {
  entry: {
    index: "./site/index.js",
    login: "./site/login/index.js",
    register: "./site/register/index.js",
    schedule: "./site/schedule/index.js",
    standings: "./site/standings/index.js",
    gallery: "./site/gallery/index.js",
    "admin_index": "./site/admin/index.js",
    "admin_login": "./site/admin/login/index.js",
    "admin_leagues": "./site/admin/leagues/index.js",
    "admin_teams": "./site/admin/teams/index.js",
    "admin_schedule": "./site/admin/schedule/index.js",
    "admin_gallery": "./site/admin/gallery/index.js"
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