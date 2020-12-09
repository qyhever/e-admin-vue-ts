import { RootState } from './index'
const getters = {
  loading: (state: RootState) => state.app.loading,
  collapsed: (state: RootState) => state.app.collapsed,
  user: (state: RootState) => state.user.currentUser,
  resourceList: (state: RootState) => state.user.resourceList,
  accessMenus: (state: RootState) => state.user.accessMenus
}
export default getters
