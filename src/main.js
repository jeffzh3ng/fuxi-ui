/* eslint-disable */
import Vue from 'vue';
import ShardsVue from 'shards-vue';
import {
  Message as message,
  Button as button,
  Table as table,
  Icon as icon,
  Form as form,
  Input as input,
  FormItem as formItem,
  Select as select,
  Option as option,
  CheckboxGroup as checkboxGroup,
  Checkbox as checkbox,
  Slider as slider,
  Transfer as transfer,
  Page as page,
  Tooltip as tooltip,
  Modal as modal,
  Upload as upload,
  Spin as spin,
} from 'iview';

// Styles
import 'bootstrap/dist/css/bootstrap.css';
import '@/assets/scss/shards-dashboards.scss';
import '@/assets/scss/date-range.scss';
import 'iview/dist/styles/iview.css';

// Core
import App from './App.vue';
import router from './router';
import Axios from 'axios'

// Layouts
import DefaultLayout from './layouts/DefaultLayout.vue';

// Vue.use(iView);
Vue.component('Button', button);
Vue.component('Table', table);
Vue.component('Icon', icon);
Vue.component('FormItem', formItem);
Vue.component('Form', form);
Vue.component('Input', input);
Vue.component('Select', select);
Vue.component('Option', option);
Vue.component('Checkbox', checkbox);
Vue.component('CheckboxGroup', checkboxGroup);
Vue.component('Slider', slider);
Vue.component('Transfer', transfer);
Vue.component('Page', page);
Vue.component('Tooltip', tooltip);
Vue.component('Modal', modal);
Vue.component('Upload', upload);
Vue.component('Spin', spin);

ShardsVue.install(Vue);
Vue.component('default-layout', DefaultLayout);
Vue.config.productionTip = false;

// Axios configurable
let apiPath = window.location.protocol + "//" + window.location.host.split(':')[0] + ":50010/api/v1"; // 测试环境
// let apiPath = window.location.protocol + "//" + window.location.host + "/api/v1"; // 生产环境
Axios.defaults.baseURL = apiPath;
Axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Access-Token']  = token;
    }
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Access-Control-Allow-Headers'] = '*';
    config.headers['Access-Control-Allow-Credentials'] = 'true';
    return config;
  },
  err => {
    return Promise.reject(err);
  });

Axios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response) {
    let status_code = error.response.status;
    if (status_code === 401) {
      window.localStorage.removeItem('access_token');
      message.error('The access token expired');
      router.push('/login')
    } else if (status_code === 500) {
      message.error('500 Internal Server Error');
    } else {
      message.error('Something went wrong');
    }
  } else {
    message.error('Unknown error, Please check your Internet connection');
    router.push('/login')
  }
  return Promise.reject(error.response.data)
});

Vue.prototype.$axios = Axios;
Vue.prototype.$message = message;
Vue.prototype.$Modal = modal;
message.config({duration: 2.5});
Vue.prototype.$eventHub = new Vue();
Vue.prototype.apiPath = apiPath;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
