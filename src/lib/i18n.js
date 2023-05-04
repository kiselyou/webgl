
/**
 *
 * @param {string} key
 * @param {(string|Array)} [substitutions]
 * @returns {string|null}
 */
export const i18n = (key, substitutions) => {
  if (chrome.i18n) {
    try {
      return chrome.i18n.getMessage(key, substitutions)
    } catch (e) {}
  }
  return null
}
