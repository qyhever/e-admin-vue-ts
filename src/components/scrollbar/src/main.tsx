import { HTMLAttributes } from 'vue'
import { addResizeListener, removeResizeListener, ResizeElement } from '@/utils/resize-event'
import scrollbarWidth from '@/utils/scrollbar-width'
import { toObject } from './util'
import Bar from './Bar'
import { isString } from '@/utils/type'
import {
  defineComponent,
  PropType,
  unref,
  reactive,
  ref,
  provide,
  onMounted,
  nextTick,
  onBeforeUnmount
} from 'vue'
import { getSlot } from '@/utils/tsx-helper'
import './index.less'

export default defineComponent({
  name: 'Scrollbar',
  props: {
    native: Boolean,
    wrapStyle: {
      type: Object as PropType<CSSStyleDeclaration | string>,
      default: ''
    },
    wrapClass: {
      type: String,
      required: false
    },
    viewClass: String,
    viewStyle: {
      type: Object as PropType<any>
    },
    noresize: Boolean,
    tag: {
      type: String,
      default: 'div'
    }
  },
  setup(props, { slots }) {
    const resizeRef = ref<ResizeElement | null>(null)
    const wrapElRef = ref<ResizeElement | null>(null)
    provide('scroll-bar-wrap', wrapElRef)
    const state = reactive({
      sizeWidth: '0',
      sizeHeight: '0',
      moveX: 0,
      moveY: 0
    })

    function handleScroll() {
      const warpEl = unref(wrapElRef)
      if (!warpEl) {
        return
      }
      const { scrollTop, scrollLeft, clientHeight, clientWidth } = warpEl

      state.moveY = (scrollTop * 100) / clientHeight
      state.moveX = (scrollLeft * 100) / clientWidth
    }

    function update() {
      const warpEl = unref(wrapElRef)
      if (!warpEl) {
        return
      }
      const { scrollHeight, scrollWidth, clientHeight, clientWidth } = warpEl
      const heightPercentage = (clientHeight * 100) / scrollHeight
      const widthPercentage = (clientWidth * 100) / scrollWidth

      state.sizeHeight = heightPercentage < 100 ? heightPercentage + '%' : ''
      state.sizeWidth = widthPercentage < 100 ? widthPercentage + '%' : ''
    }

    onMounted(() => {
      const { native, noresize } = props
      const resizeEl = unref(resizeRef)
      const warpEl = unref(wrapElRef)
      if (native || !resizeEl || !warpEl) {
        return
      }
      nextTick(update)
      if (!noresize) {
        addResizeListener(resizeEl, update)
        addResizeListener(warpEl, update)
      }
    })

    onBeforeUnmount(() => {
      const { native, noresize } = props
      const resizeEl = unref(resizeRef)
      const warpEl = unref(wrapElRef)
      if (native || !resizeEl || !warpEl) {
        return
      }
      if (!noresize) {
        removeResizeListener(resizeEl, update)
        removeResizeListener(warpEl, update)
      }
    })

    return () => {
      const { native, tag, viewClass, viewStyle, wrapClass, wrapStyle } = props
      let style: string | CSSStyleDeclaration = wrapStyle
      const gutter = scrollbarWidth()

      if (gutter) {
        const gutterWith = `-${gutter}px`
        const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`

        if (Array.isArray(wrapStyle)) {
          style = toObject(wrapStyle) as CSSStyleDeclaration
          style.marginRight = style.marginBottom = gutterWith
        } else if (isString(wrapStyle)) {
          style += gutterStyle
        } else {
          style = gutterStyle
        }
      }

      const Tag = tag
      const view = (
        <Tag class={['scrollbar__view', viewClass]} style={viewStyle} ref={resizeRef}>
          {getSlot(slots)}
        </Tag>
      )
      const wrap = (
        <div
          ref={wrapElRef}
          style={style as HTMLAttributes['style']}
          onScroll={handleScroll}
          class={[wrapClass, 'scrollbar__wrap', gutter ? '' : 'scrollbar__wrap--hidden-default']}
        >
          {[view]}
        </div>
      )
      let nodes: any[] = []
      const { moveX, sizeWidth, moveY, sizeHeight } = state
      if (!native) {
        nodes = [
          wrap,
          <Bar move={moveX} size={sizeWidth}></Bar>,
          <Bar vertical move={moveY} size={sizeHeight}></Bar>
        ]
      } else {
        nodes = [
          <div ref="wrap" class={[wrapClass, 'scrollbar__wrap']} style={style as HTMLAttributes['style']}>
            {[view]}
          </div>
        ]
      }
      return <div class="scrollbar">{nodes}</div>
    }
  }
})
