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
