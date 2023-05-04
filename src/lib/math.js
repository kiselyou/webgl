import { hours, HOUR } from '@lib/time'

export const calcSpeedTime = (distance, speed) => {
  return msToHours(distance / speed)
}

export const calcSpeedDistance = (speed, time) => {
  return speed * hoursToMs(time)
}

export const msToHours = (ms) => {
  return hours(ms)
}

export const hoursToMs = (hr) => {
  return hr / HOUR
}

export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}
