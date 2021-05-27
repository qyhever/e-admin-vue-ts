<template>
  <div class="com-page p20">
    <div ref="container" class="container" @contextmenu="onContainerRightClick">
      <div>content</div>
      <!-- <transition name="com-zoom-in-top">
        <div class="popup" v-show="visible" :style="{ top: top + 'px', left: left + 'px' }">popup</div>
      </transition> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import createContextMenu from '@/components/context-menu/create-context-menu'
export default defineComponent({
  setup() {
    const container = ref<HTMLDivElement>()
    const visible = ref(false)
    const top = ref(0)
    const left = ref(0)

    function onContainerRightClick(e: MouseEvent) {
      createContextMenu({
        event: e,
        menus: [
          {
            label: '编辑',
            handler() {
              console.log('edit')
            }
          },
          {
            label: '复制标题',
            handler() {
              console.log('copy')
            }
          }
        ]
      })
    }

    onMounted(() => {
      // if (container.value) {
      //   container.value.addEventListener('contextmenu', e => {
      //     console.log(e)
      //     top.value = e.clientY
      //     left.value = e.clientX
      //     e.preventDefault()
      //     visible.value = true
      //   })
      //   container.value.addEventListener('click', () => {
      //     visible.value = false
      //   })
      // }
    })
    return {
      container,
      visible,
      top,
      left,
      onContainerRightClick
    }
  }
})
</script>

<style lang="less" scoped>
.container {
  height: 400px;
}
.popup {
  z-index: 99999;
  position: fixed;
  width: 100px;
  height: 100px;
  border: 1px solid #eee;
}
</style>
