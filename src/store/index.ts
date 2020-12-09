import { createStore } from 'vuex'

import app, { AppState } from './modules/app'
import user, { UserState } from './modules/user'

import getters from './getters'

const store = createStore({
  modules: {
    app,
    user
  },
  getters
})

export type RootState = {
  app: AppState
  user: UserState
}

export default store
