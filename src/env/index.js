const dotenv = require('dotenv')

const envPaths = (env = 'production') => {
  return [
    '.env',
    `.env.${env}`,
    `.env.${env}.local`
  ] // [lowPriority ... highPriority]
}

const cascadeEnvs = (paths = []) => paths.reduce((envs, path) => ({
  ...envs,
  ...dotenv.config({ path }).parsed
}), {})

module.exports = {
  setup: (env, cb = () => {}) => cb(cascadeEnvs(envPaths(env)))
}
