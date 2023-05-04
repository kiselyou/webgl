import op from 'object-path'
import objectPath from 'object-path'

export const moveMutable = (array, fromIndex, toIndex) => {
  const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = toIndex < 0 ? array.length + toIndex : toIndex

    const [item] = array.splice(fromIndex, 1)
    array.splice(endIndex, 0, item)
  }
}

export const moveImmutable = (array, fromIndex, toIndex) => {
  const newArray = [...array]
  moveMutable(newArray, fromIndex, toIndex)
  return newArray
}

export const appendImmutable = (array, prevIndex, data) => {
  const newArray = [...array]
  newArray.splice(prevIndex, 0, data)
  return newArray
}

export const appendAfterImmutable = (array, prevIndex, data) => {
  const newArray = [...array]
  newArray.splice(prevIndex + 1, 0, data)
  return newArray
}

/**
 *
 * @param {Object[]} items
 * @param {string} property
 * @param {string|number} value
 * @returns {number|?}
 */
export const findObjectIndex = (items, property, value) => {
  for (let index = 0; index < items.length; index++) {
    if (items[index][property] === value) {
      return index
    }
  }
  return null
}

/**
 *
 * @param {Object[]} items
 * @param {Function} callback
 * @returns {number|?}
 */
export const findIndex = (items, callback) => {
  for (let index = 0; index < items.length; index++) {
    if (callback(items[index], index)) {
      return index
    }
  }
  return null
}

export const shuffle = (array) => {
  const arr = Array.from(array)
  return arr.sort(() => Math.random() - 0.5)
}

export const unique = (arr, key = null) => {
  return Array.from(arr).filter((value, index, self) => {
    if (key) {
      for (let i = 0; i < self.length; i++) {
        if (self[i][key] === value[key]) {
          return i === index
        }
      }
      return false
    }
    return self.indexOf(value) === index
  })
}

/**
 *
 * @param {Array} arr
 * @param {string} property
 * @param {*} value
 * @returns {Array}
 */
export const filterByObjectProperty = (arr, property, value) => {
  return arr.filter((item) => item[property] === value) || []
}

/**
 *
 * @param {Array} arr
 * @param {string} property
 * @param {*} value
 * @returns {Array}
 */
export const excludeByObjectProperty = (arr, property, value) => {
  return arr.filter((item) => item[property] !== value) || []
}

/**
 *
 * @param {Array} arr
 * @param {string} property
 * @param {*} value
 * @returns {Object|null}
 */
export const selectFirstByObjectProperty = (arr, property, value) => {
  return arr.find((item) => item[property] === value) || null
}

/**
 *
 * @param {Array} arr
 * @param {number} direction -1|1
 * @param {[]|string|null} [path] - set property name if item is object to sort it before comparison.
 * @return {Array}
 */
export const arraySort = (arr, direction, path = []) => {
  const desc = direction === -1 ?  1 : -1
  const asc =  direction === -1 ? -1 :  1

  if (path) {
    return arr.sort((a, b) => {
      return objectPath.get(a, path) < objectPath.get(b, path) ? desc : asc
    })
  } else {
    return arr.sort((a, b) => a < b ? desc : asc)
  }
}

export const arrayFlatByProperty = (items, prop) => {
  let res = []
  for (let item of items) {
    const newItem = { ...item }
    if (newItem.hasOwnProperty(prop)) {
      const children = [ ...newItem[prop] ]
      delete newItem[prop]
      res.push(newItem)
      res = res.concat(arrayFlatByProperty(children, prop))
    } else {
      res.push(newItem)
    }
  }
  return res
}

/**
 *
 * @param {[]} a
 * @param {[]} b
 * @return {boolean}
 */
export const isArraysEqual = (a, b) => {
  return Array.isArray(a) && Array.isArray(b) && JSON.stringify(a) === JSON.stringify(b)
}

/**
 *
 * @param {Object[]} arr
 * @param {string|[]} groupPath
 * @returns {Object.<string, Object>}
 */
export const groupByPath = (arr, groupPath) => {
  const tmp = {}
  for (let value of arr) {
    const key = op.get(value, groupPath, null)
    if (!tmp.hasOwnProperty(key)) {
      tmp[key] = []
    }
    tmp[key].push(value)
  }
  return tmp
}

/**
 *
 * @param {Object[]} arr
 * @param {string|[]} groupPath
 * @param {Function} callback
 * @param {Object[]} arr
 */
export const selectByPath = (arr, groupPath, callback) => {
  const res = []
  const tmp = groupByPath(arr, groupPath)
  for (let [key, group] of Object.entries(tmp)) {
    res.push(callback(group, key))
  }
  return res
}
