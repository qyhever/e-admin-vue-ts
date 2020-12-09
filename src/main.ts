import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './router/permission'
import './assets/icons'
import initPlugin from './plugins'

const app = createApp(App)

app.use(router)
app.use(store)
initPlugin(app)

app.mount('#app')

if (process.env.NODE_ENV !== 'development') {
  console.log(`latest delopy: %c${process.env.NOW}`, 'color: #67C23A')
}
