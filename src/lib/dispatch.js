import ApiTab from '@api/ApiTab'
import ApiMessage from '@api/ApiMessage'
import { updateConfigItem } from '@lib/config'

/**
 * 1. Обновить во всех табах включаяя активную.
 * 2. Обновить во всех табах кроме активной. Параметр: excludeActiveTab
 *
 * @param {string} key
 * @param {string} property
 * @param {*} value
 * @param {boolean} [excludeActiveTab] - Default is FALSE. Set TRUE to prevent dispatch event for active tab.
 * @return {Promise.<void>}
 */
export const dispatchPropOnBackground = async (key, property, value, excludeActiveTab = false) => {
  const tabs = await ApiTab.getTabs()
  for (let tab of tabs) {
    if (excludeActiveTab === true && tab.active === true) {
      continue
    }
    ApiMessage.sendMessageToTab(tab.id, 'dispatch-prop-glob-background', { key, property, value })
  }
}

/**
 * 1. Удалить во всех табах включаяя активную.
 * 2. Удалить во всех табах кроме активной. Параметр: excludeActiveTab
 *
 * @param {string} key
 * @param {string} property
 * @param {boolean} [excludeActiveTab] - Default is FALSE. Set TRUE to prevent dispatch event for active tab.
 * @return {Promise.<void>}
 */
export const removePropOnBackground = async (key, property, excludeActiveTab = false) => {
  const tabs = await ApiTab.getTabs()
  for (let tab of tabs) {
    if (excludeActiveTab === true && tab.active === true) {
      continue
    }
    ApiMessage.sendMessageToTab(tab.id, 'remove-prop-glob-background', { key, property })
  }
}

/**
 * 1. Сохранить в сторедже.
 * 2. Обновить во всех табах включаяя активную.
 * 3. Обновить во всех табах кроме активной. Параметр: excludeActiveTab
 *
 * @param {string} key
 * @param {string} property
 * @param {*} value
 * @param {boolean} [excludeActiveTab] - Default is FALSE. Set TRUE to prevent dispatch event for active tab.
 * @return {Promise.<void>}
 */
export const saveAndDispatchPropOnBackground = async (key, property, value, excludeActiveTab = false) => {
  await updateConfigItem(key, [property], value)
  await dispatchPropOnBackground(key, property, value, excludeActiveTab)
}

/**
 * 1. Обновить во всех табах включаяя активную.
 * 2. Обновить во всех табах кроме активной. Параметр: excludeActiveTab
 *
 * @param {string} key
 * @param {*} value
 * @param {boolean} [excludeActiveTab] - Default is FALSE. Set TRUE to prevent dispatch event for current tab.
 * @return {Promise.<void>}
 */
export const dispatchStoreOnBackground = async (key, value, excludeActiveTab = false) => {
  const tabs = await ApiTab.getTabs()

  for (let tab of tabs) {
    if (excludeActiveTab === true && tab.active === true) {
      continue
    }

    ApiMessage.sendMessageToTab(tab.id, 'dispatch-store-glob-background', { key, value })
  }
}

/**
 * 1. Сохранить в сторедже.
 * 2. Обновить во всех табах включаяя активную.
 * 3. Обновить во всех табах кроме активной. Параметр: excludeActiveTab
 *
 * @param {string} key
 * @param {*} value
 * @param {boolean} [excludeActiveTab] - Default is FALSE. Set TRUE to prevent dispatch event for current tab.
 * @return {Promise.<void>}
 */
export const saveAndDispatchStoreOnBackground = async (key, value, excludeActiveTab = false) => {
  await updateConfigItem(key, [], value)
  await dispatchStoreOnBackground(key, value, excludeActiveTab)
}

/**
 * 1. Обновить во всех табах включаяя текщую.
 * 2. Обновить во всех табах кроме текущей. Параметр: excludeCurrentTab
 *
 * @param {string} key
 * @param {string} property
 * @param {*} value
 * @param {boolean} [excludeCurrentTab] - Default is FALSE. Set TRUE to prevent dispatch event for current tab.
 * @return {void}
 */
export const dispatchPropOnContent = (key, property, value, excludeCurrentTab = false) => {
  ApiMessage.sendBackgroundMessage('dispatch-prop-glob-content', { key, property, value, excludeCurrentTab })
}

/**
 * 1. Удалить во всех табах включаяя текщую.
 * 2. Удалить во всех табах кроме текущей. Параметр: excludeCurrentTab
 *
 * @param {string} key
 * @param {string} property
 * @param {boolean} [excludeCurrentTab] - Default is FALSE. Set TRUE to prevent dispatch event for current tab.
 * @return {void}
 */
export const removePropOnContent = (key, property, excludeCurrentTab = false) => {
  ApiMessage.sendBackgroundMessage('remove-prop-glob-content', { key, property, excludeCurrentTab })
}

/**
 * 1. Сохранить в сторедже.
 * 2. Обновить во всех табах включаяя текщую.
 * 3. Обновить во всех табах кроме текущей. Параметр: excludeCurrentTab
 *
 * @param {string} key
 * @param {string} property
 * @param {*} value
 * @param {boolean} [excludeCurrentTab] - Default is FALSE. Set TRUE to prevent dispatch event for current tab.
 * @return {Promise.<void>}
 */
export const saveAndDispatchPropOnContent = async (key, property, value, excludeCurrentTab = false) => {
  await updateConfigItem(key, [property], value)
  dispatchPropOnContent(key, property, value, excludeCurrentTab)
}

/**
 * 1. Обновить во всех табах включаяя текщую.
 * 2. Обновить во всех табах кроме текущей. Параметр: excludeCurrentTab
 *
 * @param {string} key
 * @param {*} value
 * @param {boolean} [excludeCurrentTab] - Default is FALSE. Set TRUE to prevent dispatch event for current tab.
 * @return {void}
 */
export const dispatchStoreOnContent = (key, value, excludeCurrentTab = false) => {
  ApiMessage.sendBackgroundMessage('dispatch-store-glob-content', { key, value, excludeCurrentTab })
}

/**
 * 1. Сохранить в сторедже.
 * 2. Обновить во всех табах включаяя текщую.
 * 3. Обновить во всех табах кроме текущей. Параметр: excludeCurrentTab
 *
 * @param {string} key
 * @param {*} value
 * @param {boolean} [excludeCurrentTab] - Default is FALSE. Set TRUE to prevent dispatch event for current tab.
 * @return {void}
 */
export const saveAndDispatchStoreOnContent = async (key, value, excludeCurrentTab = false) => {
  await updateConfigItem(key, [], value)
  dispatchStoreOnContent(key, value, excludeCurrentTab)
}











/**
 *
 * @param {string} key
 * @param {string} property
 * @param {*} value
 * @return {void}
 */
export const dispatchPropOnPopup = (key, property, value) => {
  ApiMessage.sendBackgroundMessage('dispatch-prop-glob-popup', { key, property, value })
}

/**
 *
 * @param {string} key
 * @param {string} property
 * @return {void}
 */
export const removePropOnPopup = (key, property) => {
  ApiMessage.sendBackgroundMessage('remove-prop-glob-popup', { key, property })
}


/**
 *
 * @param {string} key
 * @param {*} value
 * @return {void}
 */
export const dispatchStoreOnPopup = (key, value) => {
  ApiMessage.sendBackgroundMessage('dispatch-store-glob-popup', { key, value })
}

/**
 *
 * @param {string} key
 * @param {string} property
 * @param {*} value
 * @return {Promise.<void>}
 */
export const saveAndDispatchPropOnPopup = async (key, property, value) => {
  await updateConfigItem(key, [property], value)
  dispatchPropOnPopup(key, property, value)
}

/**
 * 1. Сохранить в сторедже.
 * 2. Обновить во всех табах включаяя текщую.
 * 3. Обновить во всех табах кроме текущей. Параметр: excludeCurrentTab
 *
 * @param {string} key
 * @param {*} value
 * @return {void}
 */
export const saveAndDispatchStoreOnPopup = async (key, value) => {
  await updateConfigItem(key, [], value)
  dispatchStoreOnPopup(key, value)
}
