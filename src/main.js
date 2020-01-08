import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/utils/validation.js'
// 加载 rem适配
import 'amfe-flexible'
// 加载注册 vant 组件模块
import './utils/register-vant.js'
//  加载全局样式
import './styles/index.less'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
