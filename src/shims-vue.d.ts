/// <reference types="node" />
/// <reference types="vue-router" />
/// <reference types="vue" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production'
    readonly VUE_APP_MODE: 'dev' | 'alpha' | 'preprod' | 'prod'
    readonly NOW: string
  }
}

declare module '*.css'
declare module '*.less'
declare module '*.scss'

declare module 'ant-design-vue/lib/locale-provider/zh_CN'
