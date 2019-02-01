<template>
  <d-container fluid class="main-content-container px-4 pb-4">
    <!-- Page Header -->
    <d-row no-gutters class="page-header py-4">
      <!-- Page Title -->
      <d-col col sm="4" class="text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">Data search</span>
        <h3 class="page-title">Search</h3>
      </d-col>
    </d-row>
    <d-row>
      <d-col lg="3">
        <d-card class="card-small mb-12">
          <!-- Card Header -->
          <d-card-header class="border-bottom">
            <h5 class="m-0">结果简介</h5>
          </d-card-header>
          <br>
        </d-card>
      </d-col>
      <d-col lg="9">
        <d-card class="card-small mb-12">
          <!-- Card Header -->
          <d-card-header class="border-bottom">
            <h5 class="m-0">主要面板</h5>
          </d-card-header>
          <d-card-body class="p-0">
            <d-list-group flush>
              <d-list-group-item class="px-3">
                <d-row>
                  <d-col lg="4">
                    <d-list-group flush>
                      <d-list-group-item class="p-0">
                        <h4 class="mr-1 dis-font-ip">127.0.0.1</h4>
                        <span class="d-flex dis-font-org">AS4837 CHINA UNICOM China169 Backbone</span>
                        <span class="d-flex dis-font-city">CN, Zhejiang - Hangzhou</span>
                        <span class="d-flex dis-font-date">Thu Jan 24 12:40:39 UTC 2019</span>
                      </d-list-group-item>
                    </d-list-group>
                  </d-col>
                  <d-col lg="8">
                    <br>
                    <p>Copyright (C) 2015This file is part of YAAW (https://github.com/binux/yaaw).YAAW is free software: you can redistribute it and/or modifyit under the terms of the GNU Lesser General Public License aspublished by the Free Software Foundation, either version 3 ofthe License, or (at your option) any later version.</p>
                  </d-col>
                </d-row>
              </d-list-group-item>
              <d-list-group-item class="px-3">
                <d-row>
                  <d-col lg="4">
                    <d-list-group flush>
                      <d-list-group-item class="p-0">
                        <h4 class="mr-1">127.0.0.1</h4>
                        <span class="d-flex dis-font-org">AS4837 CHINA UNICOM China169 Backbone</span>
                        <span class="d-flex ">CN, Zhejiang - Hangzhou</span>
                        <span class="d-flex">Thu Jan 24 12:40:39 UTC 2019</span>
                      </d-list-group-item>
                    </d-list-group>
                  </d-col>
                  <d-col lg="8">
                    <br>
                    <span>Copyright (C) 2015This file is part of YAAW (https://github.com/binux/yaaw).YAAW is free software: you can redistribute it and/or modifyit under the terms of the GNU Lesser General Public License aspublished by the Free Software Foundation, either version 3 ofthe License, or (at your option) any later version.</span>
                  </d-col>
                </d-row>
              </d-list-group-item>
            </d-list-group>
          </d-card-body>
        </d-card>
      </d-col>
    </d-row>
  </d-container>
</template>

<script>
  export default {
    name: "AssetsSearch"
  }
</script>

<style scoped>
  .dis-font-org {
    color: #000;
    font-size: 10px;
    font-weight: 700;
  }
  .dis-font-ip {
    color: #444;
    font-size: 18px;
    font-weight: 700;
    line-height: 20px;
  }
  .dis-font-city {
    color: #000;
    font-size: 10px;
    font-weight: 400;
    margin-left: 6px;
    line-height: 18px;
    text-decoration: none;
  }
  .dis-font-date {
    color: #aaa;
    font-size: 10px;
    font-weight: 400;
  }

</style>
