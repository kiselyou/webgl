import objectPath from 'object-path'

/**
 *
 * @param {string} eventName
 * @param {HTMLElement} element
 * @param {Function} callback
 * @returns {Function}
 */
export const addEventOutsideElement = (eventName, element, callback) => {
  return addEventOutsideElementStrict(document.body, eventName, element, callback)
}

/**
 *
 * @param {HTMLElement} container
 * @param {string} eventName
 * @param {HTMLElement} element
 * @param {Function} callback
 * @returns {Function}
 */
export const addEventOutsideElementStrict = (container, eventName, element, callback) => {
  const func = (e) => {
    const path = e.composedPath()
    for (let el of path) {
      if (element === el) {
        return
      }
    }
    callback(e)
  }

  container.addEventListener(eventName, func, true)
  return func
}

/**
 *
 * @param {string} eventName
 * @param {Function} func
 */
export const removeEventOutsideElement = (eventName, func) => {
  document.body.removeEventListener(eventName, func, true)
}

/**
 *
 * @param {Element} element - Елемент который нужно отобразить в верху или в низую
 * @param {Object|{ elementHeight: number }} options
 * @returns {string}
 */
export const horizontalDirection = (element, options = {}) => {
  const rectElement = element.getBoundingClientRect()

  const elementHeight = objectPath.get(options, ['elementHeight'])
  const elementBottom = elementHeight ? (rectElement.top + elementHeight) : rectElement.bottom

  const topContent = document.body.querySelector('[data-content="top"]') || document.body
  const rectContainer = topContent.getBoundingClientRect()

  if (elementBottom > rectContainer.bottom) {
    return 'up'
  }

  return 'down'
}
