import Vue from 'vue'
import App from './App'


Vue.config.productionTip = false,
Vue.prototype.$baseURL="http://192.168.1.100:8080/",

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
