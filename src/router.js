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
import PocVulList from './views/scanner/poc/PocVulList'

import NessusNewScan from './views/scanner/nessus/NessusNewScan'

// Discovery & information gathering
import DiscoveryTask from './views/discovery/DiscoveryTask'
import AssetsSearch from './views/discovery/AssetsSearch'

// Pentest tools
import XssPlatform from './views/tools/xss/XssPlatform'

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
          path: '/scanner/poc/vuls',
          name: 'PocVulList',
          component: PocVulList,
        },
        {
          path: '/scanner/poc/vul/:tid',
          name: 'PocVulListFilter',
          component: PocVulList,
        },
        {
          path: '/scanner/nessus/new_scan',
          name: 'NessusNewScan',
          component: NessusNewScan,
        },
        {
          path: '/tools/xss',
          name: 'XssPlatform',
          component: XssPlatform,
        },

        {
          path: '/assets/search',
          name: 'AssetsSearch',
          component: AssetsSearch,
        },


        {
          path: '/discovery',
          name: 'DiscoveryTask',
          component: DiscoveryTask,
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
