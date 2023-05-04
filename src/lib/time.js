export const SECOND = 1000
export const MINUTE = SECOND * 60
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24

/**
 * @param {number} number
 * @return {number}
 */
export const seconds = (number) => {
  return number * SECOND
}

/**
 * @param {number} number
 * @return {number}
 */
export const minutes = (number) => {
  return number * MINUTE
}

/**
 * @param {number} number
 * @return {number}
 */
export const hours = (number) => {
  return number * HOUR
}

/**
 * @param {number} number
 * @return {number}
 */
export const days = (number) => {
  return number * DAY
}

export const getSeconds = (time) => {
  return (time / SECOND) - (60 * getMinutes(time))
}

export const getMinutes = (time) => {
  return Math.floor(time / SECOND / 60)
}

export const getHours = (time) => {
  return Math.floor(time / SECOND / 60 / 60)
}

export const timeFormat = (time) => {
  const hr = getHours(time)
  const mn = getMinutes(time)
  const sc = getSeconds(time)
  let res = []
  if (hr > 0) {
    res.push(hr > 9 ? `${hr}` : `0${hr}`)
    res.push(mn > 9 ? `${mn}` : `0${mn}`)
    res.push(sc > 9 ? `${sc}` : `0${sc}`)
    return res.join(':')
  }
  if (mn > 0) {
    res.push(`00`)
    res.push(mn > 9 ? `${mn}` : `0${mn}`)
    res.push(sc > 9 ? `${sc}` : `0${sc}`)
    return res.join(':')
  }

  res.push(`00`)
  res.push(`00`)
  res.push(sc > 9 ? `${sc}` : `0${sc}`)
  return res.join(':')
}
