import Vue from 'vue';
import Router from 'vue-router';

// DefaultContainer
import DefaultContainer from './layouts/DefaultLayout.vue';

// Login
import Login from './views/Login.vue';

// dashboard
import Dashboard from './views/Dashboard.vue';

// scanner
import PocNewScan from './views/scanner/poc/PocNewScan'
import PocScans from './views/scanner/poc/PocScans'
import PocPluginList from './views/scanner/poc/PocPluginList'
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
          path: '/scanner/poc/new_scan',
          name: 'PocNewScan',
          component: PocNewScan,
        },
        {
          path: '/scanner/poc/scans',
          name: 'PocScans',
          component: PocScans,
        },
        {
          path: '/scanner/poc/plugin',
          name: 'PocPluginList',
          component: PocPluginList,
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
