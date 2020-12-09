import { Module, ActionContext } from 'vuex'
import { getUserInfo, getAccessMenus } from '@/api/global'
import {
  getUserInfo as getLocalUserInfo,
  setUserInfo,
  removeUserInfo,
  removeToken,
  removeTagNav,
  setAccessMenus,
  getAccessMenus as getLocalAccessMenus,
  removeAccessMenus
} from '@/utils/local'
import { RootState } from '../index'

export type UserState = {
  currentUser: object
  resourceList: any[]
  accessMenus: any[]
}

export default {
  namespaced: true,

  state: {
    currentUser: getLocalUserInfo() || {},
    resourceList: [],
    accessMenus: getLocalAccessMenus() || []
  },

  mutations: {
    SET_USERINFO(state, data) {
      state.currentUser = data || {}
      setUserInfo(data)
    },
    SET_RESOURCE_LIST(state, data) {
      state.resourceList = data
    },
    SET_ACCESS_MENUS(state, data) {
      state.accessMenus = data || []
      setAccessMenus(data)
    }
  },
  actions: {
    async GetUserInfo({ commit }) {
      const user = await getUserInfo()
      commit('SET_USERINFO', user)
    },
    async GetAccessMenus({ commit }) {
      const menus = await getAccessMenus()
      commit('SET_ACCESS_MENUS', menus)
    },
    async GetUserData({ commit }: ActionContext<UserState, RootState>) {
      const [user, menus] = await Promise.all([
        getUserInfo(),
        getAccessMenus()
      ])
      commit('SET_ACCESS_MENUS', menus)
      commit('SET_USERINFO', user)
    },
    Logout({ commit }: ActionContext<UserState, RootState>) {
      return new Promise((resolve) => {
        commit('SET_USERINFO', {})
        removeUserInfo()
        // commit('SET_RESOURCE_LIST', [])
        commit('SET_ACCESS_MENUS', [])
        removeAccessMenus()
        removeToken()
        removeTagNav()
        resolve()
      })
    }
  }
}  as Module<UserState, RootState>
