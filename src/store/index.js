import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage'

const USER_KEY = 'user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // user => {token   refresh_token}
    user: getItem(USER_KEY) // token  当前登录用户状态
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      // 为了刷新页面 不丢失token数据 需要本地存储  持久化
      setItem(USER_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
