import Vue from 'vue'
import Router from 'vue-router'

import DashboardLayout from "./layout/DashboardLayout";
import Login from "./views/Login";
import Dashboard from "./views/dashboard/Dashboard";
import Temp from "./views/Temp";
import Settings from "./views/setting/Settings";

import PocTaskManagement from "./views/scanner/poc/PocTaskManagement";
import PocPluginManagement from "./views/scanner/poc/PocPluginManagement";
import PocVulnerabilities from "./views/scanner/poc/PocVulnerabilities";
import SqlmapScanner from "./views/scanner/sqlmap/SqlmapScanner";
import SqlmapResult from "./views/scanner/sqlmap/SqlmapResult";

import NewPoCTask from "./views/scanner/poc/NewPoCTask";
import NewNetPortScan from "./views/discovery/port/NewNetPortScan";
import PortTaskManagement from "./views/discovery/port/PortTaskManagement";
import PortTaskResult from "./views/discovery/port/PortTaskResult";
import WebFingerprint from "./views/discovery/whatweb/WebFingerprint";
import WhatwebTaskResult from "./views/discovery/whatweb/WhatwebTaskResult";
import SubdomainNewTask from "./views/discovery/subdomain/SubdomainNewTask";
import SubdomainTaskManagement from "./views/discovery/subdomain/SubdomainTaskManagement";
import SubdomainResult from "./views/discovery/subdomain/SubdomainResult";

import JsonpHijacker from "./views/exploit/jsonp/JsonpHijacker";
import JsonpTaskResult from "./views/exploit/jsonp/JsonpTaskResult";
import XSSHunter from "./views/exploit/xss/XSSHunter";
import XSSTaskResult from "./views/exploit/xss/XSSTaskResult";
import HTTPLogger from "./views/exploit/http/HTTPLogger";


const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
};

Vue.use(Router);

export default new Router({
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      component: DashboardLayout,
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: Dashboard
        },{
          path: '/temp',
          name: 'Temp',
          component: Temp
        },{
          path: '/settings',
          name: 'Settings',
          component: Settings
        },{
          path: '/scanner/poc/new',
          name: 'NewPoCTask',
          component: NewPoCTask
        },{
          path: '/scanner/poc/tasks',
          name: 'PocTaskManagement',
          component: PocTaskManagement
        },{
          path: '/scanner/poc/plugin',
          name: 'PocPluginManagement',
          component: PocPluginManagement
        },{
          path: '/scanner/poc/vul',
          name: 'PocVulnerabilities',
          component: PocVulnerabilities
        },{
          path: '/scanner/sqlmap/tasks',
          name: 'SqlmapScanner',
          component: SqlmapScanner
        },{
          path: '/scanner/sqlmap/result',
          name: 'SqlmapResult',
          component: SqlmapResult
        },{
          path: '/discovery/port/new',
          name: 'NewNetPortScan',
          component: NewNetPortScan
        },{
          path: '/discovery/port/tasks',
          name: 'PortTaskManagement',
          component: PortTaskManagement
        },{
          path: '/discovery/port/result',
          name: 'PortTaskResult',
          component: PortTaskResult
        },{
          path: '/discovery/whatweb',
          name: 'WebFingerprint',
          component: WebFingerprint
        },{
          path: '/discovery/whatweb/task',
          name: 'WhatwebTaskResult',
          component: WhatwebTaskResult
        },{
          path: '/discovery/subdomain/new',
          name: 'SubdomainNewTask',
          component: SubdomainNewTask
        },{
          path: '/discovery/subdomain/tasks',
          name: 'SubdomainTaskManagement',
          component: SubdomainTaskManagement
        },{
          path: '/discovery/subdomain/result',
          name: 'SubdomainResult',
          component: SubdomainResult
        },

        {
          path: '/exploit/jsonp/tasks',
          name: 'JsonpHijacker',
          component: JsonpHijacker
        },{
          path: '/exploit/jsonp/result',
          name: 'JsonpTaskResult',
          component: JsonpTaskResult
        },{
          path: '/exploit/xss/tasks',
          name: 'XSSHunter',
          component: XSSHunter
        },{
          path: '/exploit/xss/result',
          name: 'XSSTaskResult',
          component: XSSTaskResult
        },{
          path: '/exploit/http/result',
          name: 'HTTPLogger',
          component: HTTPLogger
        }
      ]
    },
    {
      path: '/login',
      component: Login
    }
  ]
});
