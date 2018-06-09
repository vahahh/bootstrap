/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.1.1): dom/manipulator.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const regexDataKey = /[A-Z]/g

const Manipulator = {
  setChecked(input, val) {
    if (input instanceof HTMLInputElement) {
      input.checked = val
      input.bsChecked = val
    }
  },

  isChecked(input) {
    if (input instanceof HTMLInputElement) {
      return input.bsChecked || input.checked
    }
    throw new Error('INPUT parameter is not an HTMLInputElement')
  },

  setDataAttribute(element, key, value) {
    key = key.replace(regexDataKey, (chr) => chr.toLowerCase())
    element.setAttribute(`data-${key}`, value)
  },

  removeDataAttribute(element, key) {
    key = key.replace(regexDataKey, (chr) => chr.toLowerCase())
    element.removeAttribute(`data-${key}`)
  },

  offset(element) {
    const rect = element.getBoundingClientRect()

    return {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft
    }
  },

  position(element) {
    return {
      top: element.offsetTop,
      left: element.offsetLeft
    }
  },

  toggleClass(element, className) {
    if (typeof element === 'undefined' || element === null) {
      return
    }

    if (element.classList.contains(className)) {
      element.classList.remove(className)
    } else {
      element.classList.add(className)
    }
  }
}

export default Manipulator
