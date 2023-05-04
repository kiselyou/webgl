export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

export function randomArrayElement(array = []) {
  return array[Math.floor(Math.random() * array.length)]
}

export const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
}
