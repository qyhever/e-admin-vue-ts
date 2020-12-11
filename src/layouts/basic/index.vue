<template>
  <section class="basic-layout header-fixed slidebar-fixed tag-fixed" :class="{mobile, collapsed}">
    <HeaderBar></HeaderBar>
    <section class="layout-content">
      <SlideBar></SlideBar>
      <div class="layout-content__inner">
        <!-- <TagsNav></TagsNav> -->
        <main class="main">
          <router-view/>
        </main>
        <FooterBar class="footer"></FooterBar>
      </div>
    </section>
    <router-view/>
  </section>
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
import HeaderBar from './headerbar.vue'
import SlideBar from './slidebar.vue'
import FooterBar from '@/components/footerbar/index.vue'
import useMobile from './useMobile'
import './index.less'

export default defineComponent({
  name: 'BasicLayout',
  components: {
    HeaderBar,
    SlideBar,
    FooterBar
  },
  setup() {
    const mobile = useMobile()
    return {
      mobile
    }
  },
  computed: {
    ...mapGetters(['collapsed'])
  }
})
</script>
