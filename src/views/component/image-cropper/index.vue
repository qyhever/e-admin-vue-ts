<template>
  <div class="com-page p20">
    <CropImage :visible="visible"></CropImage>
    <a-button type="primary" @click="onClick">确定</a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import CropImage from '@/components/cropper/index.vue'

export default defineComponent({
  components: {
    CropImage
  },
  setup() {
    const visible = ref(false)

    function onClick() {
      visible.value = true
    }

    return {
      visible,
      onClick
    }
  }
})
</script>

<style lang="less" scoped>
// ...
</style>
