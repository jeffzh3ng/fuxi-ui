<template>
  <aside :class="['main-sidebar', 'col-12', 'col-md-3', 'col-lg-2', 'px-0', sidebarVisible ? 'open' : '']">
      <div class="main-navbar">
        <nav class="navbar align-items-stretch navbar-light bg-white flex-md-nowrap border-bottom p-0">
          <a class="navbar-brand w-100 mr-0" href="#" style="line-height: 25px;">
            <div class="d-table m-auto">
              <img id="main-logo" class="d-inline-block align-top mr-1" style="max-width: 25px;" src="@/assets/images/shards-dashboards-logo.svg" alt="Shards Dashboard">
              <span v-if="!hideLogoText" class="d-none d-md-inline ml-1">Megrez Scanner</span>
            </div>
          </a>
          <a class="toggle-sidebar d-sm-inline d-md-none d-lg-none" @click="handleToggleSidebar()">
            <i class="material-icons">&#xE5C4;</i>
          </a>
        </nav>
      </div>

      <form action="#" class="main-sidebar__search w-100 border-right d-sm-flex d-md-none d-lg-none">
        <div class="input-group input-group-seamless ml-3">
          <div class="input-group-prepend">
            <div class="input-group-text">
              <i class="fas fa-search"></i>
            </div>
          </div>
          <input class="navbar-search form-control" type="text" placeholder="Search for something..." aria-label="Search">
        </div>
      </form>

      <div class="nav-wrapper">
          <d-nav class="flex-column">
            <li v-for="(item, navItemIdx) in items" :key="navItemIdx" class="nav-item dropdown">
              <div v-if="item.tag">
                <h6 class="nav-title">{{ item.title }}</h6>
              </div>
              <div v-else>
                <d-link :class="['nav-link', item.items && item.items.length ? 'dropdown-toggle' : '']" :to="item.to" v-d-toggle="`snc-${navItemIdx}`">
                  <!--<div class="item-icon-wrapper" v-if="item.htmlBefore" v-html="item.htmlBefore"></div>-->
                  <i class="material-icons">{{ item.icon }}</i>
                  <span v-if="item.title">{{ item.title }}</span>
                  <!--<div class="item-icon-wrapper" v-if="item.htmlAfter" v-html="item.htmlAfter"></div>-->
                </d-link>
                <d-collapse v-if="item.items && item.items.length" :id="`snc-${navItemIdx}`" class="dropdown-menu dropdown-menu-small" accordion="sidebar-items-accordion">
                  <d-dropdown-item v-for="(subItem, subItemIdx) in item.items" :key="subItemIdx" :href="subItem.href" :to="subItem.to">
                    <i class="material-icons">{{ subItem.icon }}</i>
                    {{ subItem.title }}
                  </d-dropdown-item>
                </d-collapse>
              </div>
            </li>
          </d-nav>
      </div>
  </aside>
</template>

<script>
export default {
  name: 'main-sidebar',
  props: {
    /**
      * Whether to hide the logo text, or not.
      */
    hideLogoText: {
      type: Boolean,
      default: false,
    },
    /**
     * The menu items.
     */
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      sidebarVisible: false,
    };
  },
  created() {
    this.$eventHub.$on('toggle-sidebar', this.handleToggleSidebar);
  },
  beforeDestroy() {
    this.$eventHub.$off('toggle-sidebar');
  },
  methods: {
    handleToggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible;
    },
  },
};
</script>

<style lang="scss">
  .main-sidebar {
    .item-icon-wrapper {
      display: inline-block;
    }
    .dropdown-menu {
      display: block;
    }
    .nav-title {
      text-transform: uppercase;
      margin: 0;
      font-size: .625rem;
      letter-spacing: .125rem;
      padding: 1px 1.5625rem;
      font-weight: 500;
      color: #9ea8b9;
      border-bottom: 1px solid #e1e5eb;
    }
  }
</style>
