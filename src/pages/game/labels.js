

export const labelElement = (text) => {
  const div = document.createElement('div')
  div.textContent = text
  div.style.backgroundColor = 'transparent'
  div.style.willChange = 'transform'
  return div
}
