<template>
  <section class="basic-layout header-fixed slidebar-fixed tag-fixed" :class="{mobile, collapsed}">
    <HeaderBar></HeaderBar>
    <!-- <section class="layout-content">
      <SlideBar></SlideBar>
      <div class="layout-content__inner">
        <TagsNav></TagsNav>
        <main class="main">
          <router-view/>
        </main>
        <FooterBar class="footer"></FooterBar>
      </div>
    </section> -->
    <router-view/>
  </section>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import { mapGetters } from 'vuex'
import { useStore } from '@/store'
import HeaderBar from './headerbar.vue'
import { isMobile } from '@/utils/system'
import './index.less'
export default defineComponent({
  name: 'BasicLayout',
  components: {
    HeaderBar
  },
  setup() {
    const mobile = ref(false)
    const store = useStore()
    const onResize = () => {
      const val = isMobile()
      mobile.value = val
      store.commit('app/TOGGLE_SLIDE_BAR', val)
    }
    onMounted(() => {
      window.addEventListener('resize', onResize)
    })
    onBeforeUnmount(() => {
      window.removeEventListener('resize', onResize)
    })
    return {
      mobile
    }
  },
  computed: {
    ...mapGetters(['collapsed'])
  }
})
</script>
