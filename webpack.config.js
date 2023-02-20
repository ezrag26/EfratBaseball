const path = require('path')
const dotenv = require('dotenv')
const webpack = require('webpack')

const envPaths = (env = 'production') => {
  return [
    './.env',
    `./.env.${env}`,
    `./.env.${env}.local`
  ] // [lowPriority ... highPriority]
}

const cascadeEnvs = (paths = []) => paths.reduce((envs, path) => ({
  ...envs,
  ...dotenv.config({ path }).parsed
}), {})

const stringifyValues = (obj = {}) => {
  return Object.keys(obj).reduce((acc, key) => ({
    ...acc,
    [key]: JSON.stringify(obj[key])
  }), {})
}

module.exports = (env, argv) => {
  const envVariables = cascadeEnvs(envPaths(argv.mode))

  return {
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
      publicPath: '/dist',
      filename: "[name]_bundle.js",
      clean: true
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
    plugins: [
      // values must be stringified, even strings (https://webpack.js.org/plugins/define-plugin/#usage)
      new webpack.DefinePlugin(stringifyValues(envVariables))
    ],
    devServer: {
      static: {
        directory: path.resolve(__dirname, "public"),
      },
      proxy: {
        '/api': {
          target: 'http://localhost:8010', // make .env variable and use that?
          pathRewrite: { '^/api': '' },
        },
      },
      server: 'https',
    }
  }
}
