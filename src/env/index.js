const path = require('path')
const dotenv = require('dotenv')

const envPaths = (env = 'production') => {
  return [
    '.env',
    `.env.${env}`,
    `.env.${env}.local`
  ].map(fileName => path.resolve(__dirname, '../../', fileName)) // [lowPriority ... highPriority]
}

const cascadeEnvs = (paths = []) => paths.reduce((envs, path) => ({
  ...envs,
  ...dotenv.config({ path }).parsed
}), {})

module.exports = {
  setup: (env, cb = () => {}) => cb(cascadeEnvs(envPaths(env)))
}
