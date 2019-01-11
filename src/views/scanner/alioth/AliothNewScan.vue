<template>
  <d-container fluid class="main-content-container px-4 pb-4">
    <!-- Page Header -->
    <d-row no-gutters class="page-header py-4">
      <!-- Page Title -->
      <d-col col sm="4" class="text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">New Scan</span>
      </d-col>
    </d-row>
    <d-row>
      <d-col lg="12">
        <d-card class="card-small mb-4">
          <!-- Card Header -->
          <d-card-header class="border-bottom">
            <h6 class="m-0">任务信息</h6>
          </d-card-header>
          <br>
          <d-row>
            <d-col md="3"></d-col>
            <d-col md="6" class="form-group">
              <Form :label-width="80" label-position="left">
                <FormItem label="任务名称">
                  <Input placeholder="Enter something..."></Input>
                </FormItem>
              </Form>
            </d-col>
            <d-col md="3"></d-col>
          </d-row>
        </d-card>
      </d-col>
    </d-row>
  </d-container>
</template>

<script>
  export default {
    name: "AliothNewScan"
  }
</script>

<style scoped>

</style>
