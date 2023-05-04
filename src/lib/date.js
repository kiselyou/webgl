import moment from 'moment'

export const enDateFormats = {
  formatDDM: 'ddd, MMM D',
  formatDDMY: 'ddd, MMM D YYYY',
  formatDM: 'MMM D',
  formatDMY: 'MMM D, YYYY',
  formatInput: 'MM.DD.YYYY'
}

export const enTimeFormats = {
  formatHM: 'h:mm',
  formatHMA: 'h:mm a',
}

export const ruDateFormats = {
  formatDDM: 'ddd, D MMM',
  formatDDMY: 'ddd, D MMM YYYY',
  formatDM: 'D MMM',
  formatDMY: 'D MMM, YYYY',
  formatInput: 'DD.MM.YYYY'
}

export const ruTimeFormats = {
  formatHM: 'HH:mm',
  formatHMA: 'HH:mm',
}

export const enFormats = {
  ...enDateFormats,
  ...enTimeFormats
}

export const ruFormats = {
  ...ruDateFormats,
  ...ruTimeFormats
}

/**
 *
 * @param {(Date|string|number)} date
 * @param {string} [pattern]
 */
export const dateFormat = (date, pattern = 'YYYY-MM-DD') => {
  return moment(date).format(pattern)
}

/**
 *
 * @param {(string|number|Date|moment.Moment)} date
 * @param {Object} formats
 * @param {(string|number|Date|moment.Moment|null)} [today]
 * @returns {string}
 */
export const ensureDM = (date, formats, today) => {
  const format = isCurrentYear(date, today) ? formats.formatDM : formats.formatDMY
  return dateFormat(date, format)
}

/**
 *
 * @param {(string|number|Date|moment.Moment)} date
 * @param {Object} formats
 * @param {(string|number|Date|moment.Moment|null)} [today]
 * @returns {string}
 */
export const ensureDDM = (date, formats, today) => {
  const format = isCurrentYear(date, today) ? formats.formatDDM : formats.formatDDMY
  return dateFormat(date, format)
}

/**
 *
 * @param {string|number|Date|moment.Moment} date
 * @param {string|number|Date|moment.Moment|null} [today]
 * @returns {boolean}
 */
export const isToday = (date, today) => {
  return moment(date).isSame(moment(today || new Date()), 'day')
}

/**
 *
 * @param {string|number|Date|moment.Moment} date
 * @param {string|number|Date|moment.Moment|null} [today]
 * @returns {boolean}
 */
export const isCurrentYear = (date, today) => {
  return moment(date).isSame(moment(today || new Date()), 'year')
}

/**
 *
 * @param {string|number|Date|moment.Moment} date
 * @param {string|number|Date|moment.Moment|null} [today]
 * @returns {boolean}
 */
export const isYesterday = (date, today) => {
  today = today || new Date()
  return moment(date).isSame(moment(today).subtract(1, 'day'), 'day')
}

/**
 *
 * @param {string|number|Date|moment.Moment} date
 * @param {number} minutesA a < today
 * @param {number} minutesB b > today
 * @param {string|number|Date|moment.Moment|null} [today]
 * @param {string|?} [inclusive]  "()" | "[)" | "(]" | "[]"
 * @returns {boolean}
 */
export const isBetweenMinutes = (date, minutesA, minutesB, today, inclusive = '[]') => {
  today = today || new Date()
  const a = minutesA === 0 ? moment(today) : moment(today).subtract(minutesA, 'minutes')
  const b = minutesB === 0 ? moment(today) : moment(today).add(minutesB, 'minutes')
  return moment(date).isBetween(a, b, 'seconds', inclusive)
}

/**
 *
 * @param {string|number|Date|moment.Moment} date
 * @param { moment.unitOfTime.StartOf} unitOfTime
 * @returns {moment.Moment}
 */
export const endOf = (date, unitOfTime) => {
  return moment(date).endOf(unitOfTime)
}
