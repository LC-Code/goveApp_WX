import Vue from 'vue'
import App from './App'


Vue.config.productionTip = false,
// Vue.prototype.$baseURL="http://192.168.1.100:8080/",
Vue.prototype.$baseURL = "http://123.57.176.18:11010/"

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
