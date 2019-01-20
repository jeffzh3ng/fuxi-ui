import Vue from 'vue';
import Router from 'vue-router';

// DefaultContainer
import DefaultContainer from './layouts/DefaultLayout.vue';

// Login
import Login from './views/Login.vue';

// dashboard
import Dashboard from './views/Dashboard.vue';

// scanner
import AliothNewScan from './views/scanner/alioth/AliothNewScan'
import AliothScans from './views/scanner/alioth/AliothScans'
import NessusNewScan from './views/scanner/nessus/NessusNewScan'

// information gathering
import DomainBuster from './views/info/subdomain/DomainBuster'


Vue.use(Router);

export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: DefaultContainer,
      children: [
        {
          path: '/',
          redirect: '/dashboard',
        },
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: Dashboard,
        },

        // scanner
        {
          path: '/scanner/alioth/new_scan',
          name: 'AliothNewScan',
          component: AliothNewScan,
        },
        {
          path: '/scanner/alioth/scans',
          name: 'AliothScans',
          component: AliothScans,
        },
        {
          path: '/scanner/nessus/new_scan',
          name: 'NessusNewScan',
          component: NessusNewScan,
        },

        {
          path: '/info/subdomain',
          name: 'DomainBuster',
          component: DomainBuster,
        },
      ]
    },
    {
      path: '/login',
      name: "Login",
      component: Login,
    },
  ],
});
