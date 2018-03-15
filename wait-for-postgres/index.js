const { Client } = require('pg')
const debug = require('debug')('wait-for-postgres')

const DEFAULTS = {
  connectionString: 'postgres://postgres@localhost/imm',
  maxAttempts: 30,
  delay: 1000
}

function delayPromise(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function isUsualError(err) {
  return err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED'
}

module.exports = async function waitForPostgres(customOptions = {}) {
  const options = Object.assign({}, DEFAULTS, customOptions)
  const { connectionString, delay, maxAttempts } = options

  debug('URI:', connectionString)
  debug('Max attempts:', maxAttempts)
  debug('Delay between attempts (ms):', delay)

  let attempt = 0

  while (attempt++ < maxAttempts) {
    debug('Attempt #%d', attempt)
    const client = new Client({ connectionString: connectionString })
    try {
      await client.connect()
      await client.query('SELECT 1')
      debug('Postgres available!')
      await client.end()
      return true
    } catch (err) {
      if (!isUsualError(err)) {
        console.error('[wait-for-postgres] error:', err.message)
      }
      debug('error:', err)
      await delayPromise(delay)
    }
  }
  debug('Attempt limit exceeded')
  return false
}
