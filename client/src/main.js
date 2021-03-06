import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Импорт стилей из Bootstrap
require('../node_modules/bootstrap/dist/css/bootstrap.css')
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Подключение Bootstrap
Vue.use(BootstrapVue)
// плагины
Vue.use(IconsPlugin)
import vuetify from '@/plugins/vuetify' 

import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App),
}).$mount('#app')
