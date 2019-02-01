<template>
  <d-container fluid class="main-content-container px-4 pb-4">
    <!-- Page Header -->
    <d-row no-gutters class="page-header py-4">
      <!-- Page Title -->
      <d-col col sm="4" class="text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">XSS Platform</span>
      </d-col>
    </d-row>
    <d-row>
      <d-col lg="12">
        <d-card>
          <d-card-body>
            <Tabs size="small">
              <TabPane icon="logo-windows" label="Tasks">
                <XssTasksTable></XssTasksTable>
              </TabPane>
              <TabPane icon="logo-windows" label="HTTP Log">
                <XssHttpLog></XssHttpLog>
              </TabPane>
              <TabPane icon="logo-windows" label="Payload">标签三的内容</TabPane>
            </Tabs>
          </d-card-body>
        </d-card>
      </d-col>
    </d-row>
  </d-container>
</template>

<script>
  import XssTasksTable from './XssTasksTable'
  import XssHttpLog from './XssHttpLog'
  export default {
    name: "XssPlatform",
    components: {
      XssTasksTable,
      XssHttpLog,
    }
  }
</script>

<style>

</style>
