type handler<T = any, R = void> = (...arg: T[]) => R

export const on = (
  element: Element | HTMLElement | Document | Window,
  event: keyof GlobalEventHandlersEventMap,
  handler: handler
) => {
  if (element && event && handler) {
    element.addEventListener(event, handler, false);
  }
}

export const off = (
  element: Element | HTMLElement | Document | Window,
  event: keyof GlobalEventHandlersEventMap,
  handler: handler
) => {
  if (element && event && handler) {
    element.removeEventListener(event, handler, false);
  }
}

const cubic = (value: number) => Math.pow(value, 3)
const easeInOutCubic = (value: number) => {
  return value < 0.5
  ? cubic(value * 2) / 2
  : 1 - cubic((1 - value) * 2) / 2
}

type scrollToType = {
  el?: HTMLElement
  to: number
  duration?: number
}

export const scrollTo = ({ el, to, duration = 500 }: scrollToType) => {
  const beginTime = new Date().getTime()
  const beginValue = el ? el.scrollTop : window.pageYOffset
  const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16))
  const frameFunc = () => {
    const progress = (new Date().getTime() - beginTime) / duration
    if (progress < 1) {
      const result = beginValue * (1 - easeInOutCubic(progress))
      if (el) {
        el.scrollTop = result
      } else {
        window.scrollTo(0, result)
      }
      rAF(frameFunc)
    } else {
      if (el) {
        el.scrollTop = to
      } else {
        window.scrollTo(0, to)
      }
    }
  }
  rAF(frameFunc)
}