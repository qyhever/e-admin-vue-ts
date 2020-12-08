declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare namespace NodeJS {
  interface Process {
    readonly NODE_ENV: 'development' | 'production'
    readonly VUE_APP_MODE: 'dev' | 'alpha' | 'preprod' | 'prod'
    readonly NOW: string
  }
}

declare module '*.css'
declare module '*.less'
declare module '*.scss'
