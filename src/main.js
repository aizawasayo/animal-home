import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
// import DatetimePicker from 'vuetify-datetime-picker'
import { Cascader, DatePicker, TimePicker } from 'view-design'
import 'view-design/dist/styles/iview.css'

// 按需引入和注册viewUI的级联选择器
Vue.component('Cascader', Cascader)
Vue.component('TimePicker', TimePicker)
Vue.component('DatePicker', DatePicker)

// 导入全局注册组件
import '@/components'

import * as filters from './filters' // global filters

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
