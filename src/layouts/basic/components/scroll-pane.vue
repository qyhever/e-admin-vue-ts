<template>
  <Scrollbar>
    <slot></slot>
  </Scrollbar>
</template>

<script lang="ts">
import { defineComponent, ref, unref, nextTick } from 'vue';
import { Scrollbar, ScrollbarType } from '@/components/scrollbar'
export default defineComponent({
  components: {
    Scrollbar
  }
})
</script>

<style lang="less" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  ::v-deep {
    .scrollbar__bar {
      bottom: 0px;
    }
    .scrollbar__wrap {
      height: 49px;
    }
  }
}
</style>