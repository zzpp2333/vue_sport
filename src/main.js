import Vue from 'vue'
import App from './App.vue'
import router from './router'
//引入store
import store from '@/store'
import './plugins/element.js'
import './plugins/ajax.js'
// 添加全局样式
import './assets/css/global.css'
// 引入iconfont
import './assets/font/iconfont.css'
// 引入自定义指令
import '@/utils/permission'

// 导入axios 使用axios进行跨域
import axios from 'axios'

// 七牛云测试域名 30天过期
Vue.prototype.$qiniu = 'http://rc6rp8gha.hn-bkt.clouddn.com/' 
// 挂载axios
//Vue.prototype.$http = axios 
// Vue.prototype.$ajax = axios
// 设置后端访问根路径
// axios.defaults.baseURL = "http://localhost:9000"

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
