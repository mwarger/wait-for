const redis = require('redis')
const Bluebird = require('bluebird')
Bluebird.promisifyAll(redis.RedisClient.prototype)
Bluebird.promisifyAll(redis.Multi.prototype)

const debug = require('debug')('wait-for-redis')

const DEFAULTS = {
  connectionString: 'redis://redis',
  maxAttempts: 10,
  delay: 1000
}

function isUsualError(err) {
  return (
    err.code === 'ENOTFOUND' ||
    err.code === 'ECONNREFUSED' ||
    err.code === 'EAI_AGAIN'
  )
}

module.exports = async function waitForRedis(customOptions = {}) {
  const options = Object.assign({}, DEFAULTS, customOptions)
  const { connectionString, delay, maxAttempts } = options

  debug('URI:', connectionString)
  debug('Max attempts:', maxAttempts)
  debug('Delay between attempts (ms):', delay)

  return new Promise(resolve => {
    const client = redis.createClient({
      retry_strategy: function(opts) {
        if (opts.attempt > maxAttempts) {
          debug('Attempt limit exceeded')
          client.quit()
          resolve(false)
          return undefined
        }
        if (opts.error) {
          if (!isUsualError(opts.error)) {
            console.error('[wait-for-redis] error:', opts.error.message)
          }
          debug('error:', opts.error)
          return delay
        }
        return delay
      }
    })
    client.on('ready', () => {
      debug('Redis serveri is ready!')
      client.quit()
      resolve(true)
    })
    client.on('error', err => {
      debug('client error', err)
    })
  })
}
