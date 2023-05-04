import { getConfigItem } from '@lib/config'
import { unique } from '@lib/array'

export const SUPPORTED_KEYS = [

]
const debugSettings = { loaded: false, keys: [] }

export const getKeys = async () => {
  if (debugSettings.loaded === false) {
    debugSettings.loaded = true
    debugSettings.keys = await getConfigItem('debugConfig', ['debugKeys'], [])
  }

  return debugSettings.keys
}

export const enableDebug = (key) => {
  debugSettings.keys.push(key)
  debugSettings.keys = unique(debugSettings.keys)
}

export const disableDebug = (key) => {
  const index = debugSettings.keys.indexOf(key)
  if (index >= 0) {
    debugSettings.keys.splice(index, 1)
  }
}

/**
 *
 * @param {string} key
 * @param {...*} payload
 * @returns {Promise<void>}
 */
export const debug = async (key, ...payload) => {
  for (let key in payload) {
    if (typeof payload[key] === 'function') {
      payload[key] = payload[key]()
    }
  }

  const keys = await getKeys()
  if (keys.includes(key)) {
    log('[' + key + ']', ...payload)
  }
}

export const log = (...payload) => {
  console['log'](...payload)
}
