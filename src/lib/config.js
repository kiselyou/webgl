import mixin from 'mixin-deep'
import clone from 'clone-deep'
import objectPath from 'object-path'
import { THEME_DARK } from '@lib/theme'
import ApiChromeStorage from '@api/ApiChromeStorage'

/**
 *
 * @return {Object}
 */
const config = {
  events: {},
  alarms: {},
  groups: [],
  settings: {
    theme: THEME_DARK,
    systemNotification: false,
    browserNotification: true,
  },
}

/**
 *
 * @param {string} key
 * @param {Array} [path]
 * @param {*} [defaultValue]
 * @returns {Promise<*>}
 */
export const getConfigItem = async (key, path = [], defaultValue = null) => {
  const storageConfig = await ApiChromeStorage.getChromeStorageItem(key)
  const value = objectPath.get(storageConfig, path)
  if (value !== undefined && value !== null) {
    return value
  }

  const mergedConfig = mergeConfigsByProperty(key, config, storageConfig)
  return objectPath.get(mergedConfig, path, defaultValue)
}

/**
 *
 * @param {[]} [keys]
 * @returns {Promise<*>}
 */
export const getConfigItems = async (keys) => {
  const res = {}
  const init = getInitialConfigItem()
  keys = Array.isArray(keys) ? keys : Object.keys(init)
  const storage = (await ApiChromeStorage.getAll()) || {}
  for (let key of keys) {
    if (!init.hasOwnProperty(key)) {
      throw new Error(`Unknown property '${key}'.`)
    }

    if (storage.hasOwnProperty(key)) {
      res[key] = storage[key]
    } else {
      res[key] = init[key]
    }
  }

  return res
}

/**
 *
 * @param {string} key - Cв-во первого уровня которое контролируется.
 * @param {Object} initialConfig - Дефолтный конфиг из которобу будет браться значение в случае если его нет в storage
 * @param {Object|Array|undefined} storageConfig - Значение полученное из storage
 * @returns {*}
 */
export const mergeConfigsByProperty = (key, initialConfig, storageConfig) => {
  const defaultConfig = objectPath.get(initialConfig, [key], {})
  if (Array.isArray(defaultConfig)) {
    return storageConfig === undefined || storageConfig === null ? clone(defaultConfig) : storageConfig
  }
  return mixin(clone(defaultConfig), storageConfig)
}

/**
 *
 * @param {[]} [path]
 * @returns {*}
 */
export const getInitialConfigItem = (path = []) => {
  return objectPath.get(clone(config), path)
}

/**
 *
 * @param {string} key
 * @param {Array} path
 * @param {*} value
 * @returns {Promise<void>}
 */
export const updateConfigItem = async (key, path, value) => {
  if (path.length === 0) {
    return await ApiChromeStorage.setChromeStorageItem(key, value)
  }

  const storageConfig = await getConfigItem(key) || {}
  objectPath.set(storageConfig, path, value)

  return await ApiChromeStorage.setChromeStorageItem(key, storageConfig)
}

/**
 *
 * @param {string} key
 * @param {Array} path
 * @returns {Promise<void>}
 */
export const removeConfigItem = async (key, path = []) => {
  if (path.length === 0) {
    return await ApiChromeStorage.removeChromeStorageItem(key)
  }

  const config = await getConfigItem(key) || {}
  objectPath.del(config, path)
  await ApiChromeStorage.setChromeStorageItem(key, config)
}
