<template>
  <div class="com-page p20">
    <a-row :gutter="[10, 10]">
      <a-col :xs="24" :sm="24" :md="12" :lg="5" :xl="5">
        <VueQrcode
          ref="qrcodeRef"
          :value="linkUrl"
          :size="200"
          :style="{ margin: 'auto' }"
          :imageSettings="{
            src: logoUrl,
            width: 70,
            height: 70,
            excavate: false
          }"
        ></VueQrcode>
        <a-button type="primary" @click="onDown" class="mt10">
          下载二维码
        </a-button>
      </a-col>
      <a-col :xs="24" :sm="24" :md="12" :lg="19" :xl="19">
        <a-form
          :model="form"
          :rules="rules"
          @finish="onFinish"
          label-align="left"
        >
          <a-form-item label="链接url" name="linkUrl">
            <a-input v-model:value="form.linkUrl" placeholder="请填写" />
          </a-form-item>
          <a-form-item label="二维码大小" name="size">
            <a-input-number
              v-model:value="form.size"
              placeholder="请填写"
              :min="50"
            />
          </a-form-item>
          <a-form-item class="form-item--submit">
            <a-button class="submit-btn" type="primary" html-type="submit">
              生成二维码
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import VueQrcode from '@/components/qrcode'
import Logo from '@/assets/images/Icon_512x512-15@1x@1x.png'
const defalutVal = {
  linkUrl: 'https://lgf196.top/react/home',
  size: 200,
  logoUrl: Logo,
  logoW: 70,
  logoH: 70,
  excavate: false
}
export default defineComponent({
  components: {
    VueQrcode
  },
  setup() {
    const linkUrl = ref(defalutVal.linkUrl)
    const logoUrl = ref<string>(Logo)
    const qrcodeRef = ref<HTMLCanvasElement | null>(null)
    const rules = ref({
      linkUrl: [{ required: true, message: '请填写' }],
      size: [{ required: true, message: '请填写' }]
    })
    const form = ref({
      linkUrl: defalutVal.linkUrl,
      size: defalutVal.size
    })

    function onDown() {
      console.log('onDown')
    }

    function onFinish() {
      console.log('onFinish')
    }

    return {
      linkUrl,
      logoUrl,
      qrcodeRef,
      form,
      rules,
      onDown,
      onFinish
    }
  }
})
</script>

<style lang="less" scoped>
// ...
</style>
