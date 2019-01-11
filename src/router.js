import Vue from 'vue';
import Router from 'vue-router';

import VueTest from './views/test/VueTest.vue';
import VueTest2 from './views/test/VueTest2.vue';
import VueTest3 from './views/test/VueTest3.vue';

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
      redirect: '/test1',
    },
    {
      path: '/test1',
      name: 'vue-test-1',
      component: VueTest,
    },
    {
      path: '/test2',
      name: 'vue-test-2',
      component: VueTest2,
    },
    {
      path: '/test3',
      name: 'vue-test-3',
      component: VueTest3,
    },
  ],
});
