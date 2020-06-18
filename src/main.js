// @ts-nocheck
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false
Vue.prototype.$icons = {
  '01d': 'sunny', 
  '01n': 'night',
  '02d': 'partly-cloudy',
  '02n': 'night-partly-cloudy',
  '03d': 'cloudy',
  '03n': 'cloudy',
  '04d': 'cloudy-alert',
  '04n': 'cloudy-alert',
  '09d': 'rainy',
  '09n': 'rainy',
  '10d': 'pouring',
  '10n': 'pouring',
  '11d': 'lightning',
  '11n': 'lightning',
  '13d': 'snowy',
  '13n': 'snowy',
  '50d': 'fog',
  '50n': 'fog'
}

new Vue({
  vuetify,
  render: h => h(App),
}).$mount('#app')
