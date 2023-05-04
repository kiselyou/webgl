/**
 *
 * @returns {string}
 */
export const mode = (process.env.MODE || 'development')

/**
 *
 * @returns {boolean}
 */
export const isProd = mode === 'production'

/**
 *
 * @returns {boolean}
 */
export const isDev = !isProd

/**
 *
 * @returns {string}
 */
export const version = process.env.VERSION
