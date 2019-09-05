<template>
  <d-container fluid class="main-content-container px-4 pb-4">
    <!-- Page Header -->
    <d-row no-gutters class="page-header py-4">
      <!-- Page Title -->
      <d-col col sm="4" class="text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">Test for XSS vulnerabilities</span>
        <h3 class="page-title">XSS Hunter</h3>
      </d-col>
    </d-row>
    <d-row>
      <d-col lg="12">
        <d-card>
          <d-card-body>
            <Tabs size="small">
              <TabPane icon="logo-windows" label="Records">
                <XSSRecords/>
              </TabPane>
              <TabPane icon="logo-windows" label="Payload">
                <XssPayloads/>
              </TabPane>
            </Tabs>
          </d-card-body>
        </d-card>
      </d-col>
    </d-row>
  </d-container>
</template>

<script>
  import XSSRecords from './XSSRecords'
  import XssPayloads from './XssPayloads'
  export default {
    name: "XssPlatform",
    components: {
      XSSRecords,
      XssPayloads,
    }
  }
</script>

<style>

</style>
