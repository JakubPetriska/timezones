import Vue from 'vue'
import App from './App'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'

Vue.config.productionTip = false
Vue.use(VueMaterial)

Vue.material.registerTheme('default', {
  primary: 'light-green',
  accent: {
    color: 'pink',
    hue: 400
  },
  warn: 'red'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
