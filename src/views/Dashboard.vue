<template>
  <d-container fluid class="main-content-container px-4 pb-4">
    <!-- Page Header -->
    <d-row no-gutters class="page-header py-4">
      <!-- Page Title -->
      <d-col col sm="4" class="text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">Dashboard</span>
      </d-col>
    </d-row>
    <d-row>
      <d-col lg="12">
        <a>this is dashboard page</a>
        <Button @click="test_api">测试接口</Button>
      </d-col>
    </d-row>
  </d-container>
</template>

<script>
  export default {
    name: "Dashboard",
    methods: {
      test_api(){
        this.$axios.get('hello').then(response => {
          let res = response.data;
          console.log('a');
          if (res['status'] === 'success') {
            this.$message.success(res.message);
            console.log(res);
          } else {
            this.$message.error(res.message);
            console.log(res);
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
