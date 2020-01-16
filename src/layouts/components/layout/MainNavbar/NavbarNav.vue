<template>
  <d-navbar-nav class="border-left flex-row">
    <li class="nav-item border-right dropdown notifications">
      <a class="nav-link nav-link-icon text-center" v-d-toggle.user-actions>
        <div class="nav-link-icon__wrapper">
          <i class="material-icons">account_box</i>
        </div>
      </a>
      <d-collapse id="user-actions" class="dropdown-menu">
        <d-dropdown-item><i class="material-icons">&#xE7FD;</i>
        <span class="mx-2">{{username}}</span>
        </d-dropdown-item>
        <d-dropdown-item>
          <span @click="settings"><i class="material-icons">&#xE8B8;</i>
          <span class="mx-2">Settings</span></span>
        </d-dropdown-item>
        <d-dropdown-item class="text-danger">
          <span @click="logout">
            <i class="material-icons text-danger">&#xE879;</i>
            <span class="mx-2">Logout</span>
          </span>
        </d-dropdown-item>
      </d-collapse>
    </li>
  </d-navbar-nav>
</template>
<script>
  export default {
    name: 'NavbarNac',
    data() {
      return {
        username: "No one",
      }
    },
    mounted: function () {
      this.$axios.get('who').then(response => {
        let status = response['data']['status'];
        let data = response['data']['result'];
        if (status['status'] === 'success') {
          this.username = data['nick'];
        } else {
          this.$message.error(status.message);
          if (status.code === 10401) {
            window.location.href = "#/login"
          }
        }
      })
    },
    methods: {
      logout() {
        window.localStorage.removeItem('access_token');
        this.$router.push('/login');
      },
      settings() {
        window.open("/#/settings", "_blank")
      },
    },
  }
</script>

<style>
  .nav-link:hover {
    cursor: pointer;
  }
</style>
