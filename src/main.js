import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import timezonesjson from 'timezones.json'
import App from './App'

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
  render: h => h(App, {
    props: { timezones: timezonesjson }
  })
})
