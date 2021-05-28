<template>
  <a-modal v-model:visible="sVisible" @cancel="onCancel" @ok="onOk">
    <div class="cropper-container">
      <div class="img-box">
        <img ref="image" class="cropper-image" alt="404" />
      </div>
      <div class="control-container">
        <div ref="preview" class="preview-box"></div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Cropper from 'cropperjs'
type CropperCompState = {
  instance: Cropper | null
  insideSrc: string
  sVisible: boolean
}

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data(): CropperCompState {
    return {
      instance: null,
      insideSrc: '',
      sVisible: false
    }
  },
  watch: {
    visible(newVal) {
      this.sVisible = newVal
    }
  },
  mounted() {
    this.$nextTick(() => {
      const imageEl = this.$refs.image as HTMLImageElement
      const previewEl = this.$refs.preview as HTMLDivElement
      console.log(imageEl)
      this.instance = new Cropper(imageEl, {
        preview: previewEl,
        checkCrossOrigin: true
      })
    })
  },
  methods: {
    onCancel() {
      console.log('onCancel')
    },
    onOk() {
      console.log('onOk')
    }
  }
})
</script>

<style lang="less" scoped>
// ...
</style>
