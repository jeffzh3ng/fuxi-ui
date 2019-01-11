import Vue from 'vue';
import Router from 'vue-router';

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
  mode: 'history',
  // base: process.env.BASE_URL,
  base: '/',
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
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
  ],
});
