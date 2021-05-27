<template>
  <div v-for="(item, index) in menus" :key="index">
    <SubMenu
      v-if="item.children && item.children.length"
      :key="item.label"
      :disabled="item.disabled"
      popupClassName="context-menu-popup"
    >
      <template #title>
        <div class="p20" @click="() => handler(item)">
          <SvgIcon v-if="item.icon" :icon="item.icon" />
          <span>{{ item.label }}</span>
        </div>
      </template>
      <ContextMenuItem :menus="item.children"></ContextMenuItem>
    </SubMenu>
    <Item v-else :disabled="item.disabled" class="context-menu-item" :key="item.label">
      <div class="p20" @click="() => handler(item)">
        <SvgIcon v-if="item.icon" :icon="item.icon" />
        <span>{{ item.label }}</span>
      </div>
    </Item>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Menu } from 'ant-design-vue'
import { ContextMenuItem } from './types'
import SvgIcon from '../svg-icon/index.vue'

export default defineComponent({
  name: 'ContextMenuItem',
  components: {
    Item: Menu.Item,
    SubMenu: Menu.SubMenu,
    SvgIcon
  },
  props: {
    menus: {
      type: Array as PropType<ContextMenuItem[]>,
      default: () => []
    }
  }
})
</script>
