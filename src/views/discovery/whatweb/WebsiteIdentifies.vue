<template>
    <d-container fluid class="main-content-container px-4 pb-4">
        <!-- Page Header -->
        <d-row no-gutters class="page-header py-4">
            <!-- Page Title -->
            <d-col col sm="4" class="text-center text-sm-left mb-4 mb-sm-0">
                <span class="text-uppercase page-subtitle">what is that website</span>
                <h3 class="page-title">WhatWeb Online Scan</h3>
            </d-col>
        </d-row>
        <d-row>
            <d-col>
                <d-card class="card-small mb-12">
                    <!-- Card Header -->
                    <d-card-header class="border-bottom">
<!--                        <d-input placeholder="www.example.com" />-->
                        <Input placeholder="Enter site or ip to test: ww.example.com" style="width: 250px" class="mr-1"/>
                        <d-button size="sm" class="btn-accent ml-auto mr-4">
                            <strong>Start Scan</strong>
                        </d-button>
                        <d-button size="sm" class="btn-white ml-2">
                            <strong>Advanced Scan</strong>
                        </d-button>
                    </d-card-header>
                    <d-card-body>
                        Developing...
                    </d-card-body>
                </d-card>
            </d-col>
        </d-row>
    </d-container>
</template>

<script>
    export default {
        name: "WebsiteIdentifies"
    }
</script>

<style scoped>

</style>