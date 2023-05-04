export const SCROLL_Y = 'scrollable_y'

export const scrollYToElement = (el, offset = 0) => {
  el.closest(`.${SCROLL_Y}`).scrollTop = (el.offsetTop - el.offsetHeight) - offset
}
