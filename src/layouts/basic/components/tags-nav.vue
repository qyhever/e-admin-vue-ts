<template>
  <div class="tags-nav">tags-nav</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'TagsNav'
})
</script>

<style lang="less" scoped>
  .tags-nav {
    position: relative;
    width: 100%;
    height: @tags-nav-header;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
  }
</style>
