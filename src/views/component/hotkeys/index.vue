<template>
  <div class="com-page p20">hotkeys</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useHotkeys } from '@/hooks'
export default defineComponent({
  setup() {
    useHotkeys('ctrl+d', event => {
      event.preventDefault()
      console.log(event)
    })
  }
})
</script>

<style lang="less" scoped>
// ...
</style>
