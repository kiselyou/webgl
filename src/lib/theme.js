import objectPath from 'object-path'

export const THEME_DARK = 'dark'
export const THEME_LIGHT = 'light'

/**
 *
 * @param {Object} [settings]
 * @returns {string}
 */
export const ensureTheme = (settings = {}) => {
  const storageTheme = objectPath.get(settings, ['theme'], null)
  if (storageTheme && [THEME_DARK, THEME_LIGHT].includes(storageTheme)) {
    return storageTheme
  }

  const { matches } = window.matchMedia(`(prefers-color-scheme: ${THEME_DARK})`)
  return matches ? THEME_DARK : THEME_LIGHT
}

/**
 * @param {string} theme
 * @callback systemThemeChange
 */

/**
 *
 * @param {Function} callback
 */
export const onSystemThemeChange = (callback) => {
  window.matchMedia(`(prefers-color-scheme: ${THEME_DARK})`)
    .addEventListener('change', ({ matches }) => callback(matches ? THEME_DARK : THEME_LIGHT))
}
