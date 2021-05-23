<template>
  <div class="com-page p20">
    <UnControlled
      class="uncontrolled-editor"
      v-model:value="content"
      :options="{
        mode: 'javascript',
        theme: 'material',
        lineNumbers: true
      }"
      :autoScroll="false"
    ></UnControlled>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { UnControlled } from '@/components/codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
require('codemirror/mode/xml/xml')
require('codemirror/mode/javascript/javascript')

const code = `
  // pages/home
  import React, {useEffect,useState} from 'react'
  import { userList } from '@/api/login'
  export type userListType={
      name:string;
      aga:number;
      sex:string
  };
  const App:React.FC=()=>{
    const [result, setResult] = useState<userListType[]>([]);
    useEffect(() => {
      const api=async ()=>{
          let res=await userList({username:'li'});
          setResult(res.data);
      }
      api();
    }, [])
      return (
      <>
          {result.length ?
              result.map((item,index)=>(
                   <p key={index}>{item.name}</p>
              ))
           : null}
      </>)
  }
  `

export default defineComponent({
  components: {
    UnControlled
  },
  setup() {
    const content = ref(code)
    return {
      content
    }
  }
})
</script>

<style lang="less" scoped>
.uncontrolled-editor {
  height: 600px;
  ::v-deep .CodeMirror {
    height: 100%;
  }
}
</style>
