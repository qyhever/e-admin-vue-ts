<template>
  <transition name="com-zoom-in-top" appear>
    <Menu
      v-if="visible"
      :class="`context-menu ${menuClass}`"
      mode="vertical"
      :style="{
        width: width + 'px',
        top: position.x + 'px',
        left: position.y + 'px'
      }"
    >
      <MenuItem :menus="menus"></MenuItem>
    </Menu>
  </transition>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Menu } from 'ant-design-vue'
import { Position, ContextMenuItem } from './types'
import MenuItem from './menu-item.vue'

export default defineComponent({
  name: 'ContextMenu',
  components: {
    Menu,
    MenuItem
  },
  props: {
    width: {
      type: Number,
      default: 160
    },
    menuClass: {
      type: String,
      default: ''
    },
    position: {
      type: Object as PropType<Position>,
      default: () => ({ x: 0, y: 0 })
    },
    menus: {
      type: Array as PropType<ContextMenuItem[]>,
      default: () => []
    }
  },
  data() {
    return {
      visible: false
    }
  }
})
</script>
