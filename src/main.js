/* eslint-disable */
import Vue from 'vue';
import ShardsVue from 'shards-vue';
// import {
//   Message as message,
//   Button as button,
//   Table as table,
//   Icon as icon,
//   Form as form,
//   Input as input,
//   FormItem as formItem,
//   Select as select,
// } from 'iview';
import iView from 'iview';
// Styles
import 'bootstrap/dist/css/bootstrap.css';
import '@/assets/scss/shards-dashboards.scss';
import '@/assets/scss/date-range.scss';
import 'iview/dist/styles/iview.css';

// Core
import App from './App.vue';
import router from './router';

// Layouts
import Default from './layouts/Default.vue';

Vue.use(iView);
// iview import
// Vue.component('Button', button);
// Vue.component('Table', table);
// Vue.component('Icon', icon);
// Vue.component('Form', form);
// Vue.component('Input', input);
// Vue.component('Select', select);
// Vue.component('FormItem', formItem);
// Vue.prototype.$message = message;


ShardsVue.install(Vue);
// Vue.use(iView);
Vue.component('default-layout', Default);

Vue.config.productionTip = false;
Vue.prototype.$eventHub = new Vue();

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
