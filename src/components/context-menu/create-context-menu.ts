import { h, createApp, ComponentPublicInstance } from 'vue'
import { omit } from 'lodash'
import ContextMenu from './index'
// import ContextMenu from './context-menu.vue'
import { CreateContextOptions, ContextMenuProps } from './types'

export type ContextMenuInstance = {
  open(opts: ContextMenuProps): void
  close(): void
  destroy(): void
}

// const defaultProps = {
//   width: 160,
//   menuClass: '',
//   postion: { x: 0, y: 0 },
//   menus: [] as ContextMenuItem[]
// }

let instance: ContextMenuInstance | null = null

function newInstance(options: ContextMenuProps, callback: (ins: ContextMenuInstance) => void) {
  const div = document.createElement('div')
  div.className = 'context-menu-wrapper-root'
  document.body.appendChild(div)
  const app = createApp({
    data() {
      return {
        props: {
          ...options,
          ref: 'contextMenu'
        }
      }
    },
    mounted(this: ComponentPublicInstance) {
      const self = this // eslint-disable-line
      this.$nextTick(() => {
        callback({ // eslint-disable-line
          open(opts: ContextMenuProps) {
            self.props = {
              ...self.props,
              ...opts
            }
            ;(self.$refs as any).contextMenu.visible = true
          },
          close() {
            ;(self.$refs as any).contextMenu.visible = false
          },
          destroy() {
            app && app.unmount(div)
            if (div.parentNode) {
              div.parentNode.removeChild(div)
            }
          }
        })
      })
    },
    render() {
      // const props = {
      //   ...options,
      //   ref: 'contextMenu'
      // }
      return h(ContextMenu, this.props)
    }
  })
  app.mount(div)
}

function getInstance(options: ContextMenuProps, callback: (ins: ContextMenuInstance) => void) {
  if (instance) {
    callback(instance)
    return
  }
  newInstance(options, ins => {
    instance = ins
    callback(ins)
  })
}

export default function createContextMenu(options: CreateContextOptions) {
  const { event } = options
  event.preventDefault()
  const props = Object.assign({}, omit(options, ['event']), {
    position: {
      x: event.clientX,
      y: event.clientY
    }
  })
  getInstance(props, ins => {
    ins.open()
  })
}
