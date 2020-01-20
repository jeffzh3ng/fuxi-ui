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
                        <Input v-model="testTarget" placeholder="Enter site or ip to test: ww.example.com" style="width: 250px" class="mr-2"/>
                        <d-button size="sm" class="btn-white ml-auto mr-4">
                            <strong @click="quicklyScan">Start Scan</strong>
                        </d-button>
                        <d-button size="sm" class="btn-accent ml-2">
                            <strong>Advanced Scan</strong>
                        </d-button>
                    </d-card-header>
                    <d-card-body>
                        Developing...
                    </d-card-body>
                </d-card>
            </d-col>
            <Modal
                    :styles="{top: '20px'}"
                    footer-hide
                    width="700"
                    v-model="openQuicklyScanModal"
                    :title="testTarget">
                <div v-for="item in tempItems">
                    <pre>{{item}}</pre>
                </div>
            </Modal>
        </d-row>
    </d-container>
</template>

<script>
    export default {
        name: "WebsiteIdentifies",
        data() {
            return {
                items: [],
                tempItems: [],
                reqApiPath: "discovery/whatweb/task",
                openQuicklyScanModal: false,
                testTarget: "",
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData() {},
            quicklyScan() {
                if (this.testTarget.length === 0) {
                    this.$message.error("Please enter the target");
                    return
                }
                this.openQuicklyScanModal = true;
                let data = {target: this.testTarget};
                this.$axios.post(this.reqApiPath + "/test", data).then(response => {
                    let status = response['data']['status'];
                    let data = response['data']['result'];
                    if (status['status'] === 'success') {
                        this.tempItems = data
                    } else {
                        this.$message.error(status.message)
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>