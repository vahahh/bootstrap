import Util from '../util'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.1.1): dom/polyfill.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/* istanbul ignore next */
const Polyfill = (() => {
  // defaultPrevented is broken in IE.
  // https://connect.microsoft.com/IE/feedback/details/790389/event-defaultprevented-returns-false-after-preventdefault-was-called
  const workingDefaultPrevented = (() => {
    const e = document.createEvent('CustomEvent')
    e.initEvent('Bootstrap', true, true)
    e.preventDefault()
    return e.defaultPrevented
  })()

  let defaultPreventedPreservedOnDispatch = true

  // CustomEvent polyfill for IE (see: https://mzl.la/2v76Zvn)
  if (typeof window.CustomEvent !== 'function') {
    window.CustomEvent = (event, params) => {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: null
      }
      const evt = document.createEvent('CustomEvent')
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
      if (!workingDefaultPrevented) {
        const origPreventDefault = Event.prototype.preventDefault
        evt.preventDefault = () => {
          if (!evt.cancelable) {
            return
          }

          origPreventDefault.call(evt)
          Object.defineProperty(evt, 'defaultPrevented', {
            get() {
              return true
            },
            configurable: true
          })
        }
      }
      return evt
    }

    window.CustomEvent.prototype = window.Event.prototype
  } else {
    // MSEdge resets defaultPrevented flag upon dispatchEvent call if at least one listener is attached
    defaultPreventedPreservedOnDispatch = (() => {
      const e = new CustomEvent('Bootstrap', {
        cancelable: true
      })

      const element = document.createElement('div')
      element.addEventListener('Bootstrap', () => null)

      e.preventDefault()
      element.dispatchEvent(e)
      return e.defaultPrevented
    })()
  }

  // Event constructor shim
  if (!window.Event || typeof window.Event !== 'function') {
    const origEvent = window.Event
    window.Event = (inType, params) => {
      params = params || {}
      const e = document.createEvent('Event')
      e.initEvent(inType, Boolean(params.bubbles), Boolean(params.cancelable))
      return e
    }
    window.Event.prototype = origEvent.prototype
  }

  // matches polyfill (see: https://mzl.la/2ikXneG)
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector
  }

  // closest polyfill (see: https://mzl.la/2vXggaI)
  let closest
  if (!Element.prototype.closest) {
    closest = (element, selector) => {
      let ancestor = element
      do {
        if (ancestor.matches(selector)) {
          return ancestor
        }

        ancestor = ancestor.parentElement
      } while (ancestor !== null && ancestor.nodeType === Node.ELEMENT_NODE)

      return null
    }
  } else {
    closest = (element, selector) => element.closest(selector)
  }

  const supportScopeQuery = (() => {
    const element = document.createElement('div')
    try {
      element.querySelectorAll(':scope *')
    } catch (e) {
      return false
    }

    return true
  })()

  const scopeSelectorRegex = /:scope\b/
  let find = Element.prototype.querySelectorAll
  let findOne = Element.prototype.querySelector

  if (!supportScopeQuery) {
    find = function (selector) {
      if (!scopeSelectorRegex.test(selector)) {
        return this.querySelectorAll(selector)
      }

      const hasId = Boolean(this.id)
      if (!hasId) {
        this.id = Util.getUID('scope')
      }

      let nodeList = null
      try {
        selector = selector.replace(scopeSelectorRegex, `#${this.id}`)
        nodeList = this.querySelectorAll(selector)
      } finally {
        if (!hasId) {
          this.removeAttribute('id')
        }
      }

      return nodeList
    }

    findOne = function (selector) {
      if (!scopeSelectorRegex.test(selector)) {
        return this.querySelector(selector)
      }

      const matches = find.call(this, selector)
      if (typeof matches[0] !== 'undefined') {
        return matches[0]
      }

      return null
    }
  }

  return {
    get defaultPreventedPreservedOnDispatch() {
      return defaultPreventedPreservedOnDispatch
    },
    focusIn: typeof window.onfocusin === 'undefined',
    closest,
    find,
    findOne
  }
})()

export default Polyfill
