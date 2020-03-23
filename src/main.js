import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from "./router";
import api from "./components/http"
import message from "./components/message"
import tools from "./components/tools"


Vue.prototype.$message = message;
Vue.prototype.$api = api;
Vue.prototype.$tools = tools;


Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app');
