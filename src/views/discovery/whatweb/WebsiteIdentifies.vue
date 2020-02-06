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
                        <d-button @click="openAdvancedScanModal = true" size="sm" class="btn-accent ml-4">
                            <strong>Advanced Scan</strong>
                        </d-button>
                    </d-card-header>
                    <d-card-body>
                        <FingerprintList/>
                    </d-card-body>
                </d-card>
            </d-col>
            <Modal
                    footer-hide
                    width="700"
                    v-model="openAdvancedScanModal"
                    title="Advanced Scan">
                <div>
                    <Form
                            ref="formValidate"
                            label-position="left"
                            :label-width="100">
                        <FormItem label="* Task Name" prop="name">
                            <Input v-model="adScanOption.name" placeholder="Enter the task name"/>
                        </FormItem>
                        <FormItem label="* Target" prop="target">
                            <Input
                                    type="textarea"
                                    v-model="adScanOption.target"
                                    :autosize="{minRows: 5,maxRows: 10}"
                                    :placeholder="targetExampleText">
                            </Input>
                        </FormItem>
                        <FormItem label="* Level" prop="level">
                            <label>
                                <Select
                                        v-model="adScanOption.level"
                                        style="width:150px"
                                        placeholder="Level">
                                    <Option value="1">Stealthy</Option>
                                    <Option value="3">Aggressive</Option>
                                    <Option value="4">Heavy</Option>
                                </Select>
                            </label>
                            <p v-if="adScanOption.level === '4' " class="text-danger">* Makes a lot of HTTP requests per target. URLs from all plugins are attempted.</p>
                            <p v-if="adScanOption.level === '4' " class="text-danger">* This level is recommended for a single target because it takes a lot of time</p>
                        </FormItem>
                        <FormItem label="Header">
                            <Input v-model="adScanOption.header" placeholder="Not necessary  e.g. 'Foo:Bar'"/>
                        </FormItem>
                        <FormItem label="Cookies">
                            <Input v-model="adScanOption.cookie" placeholder="Not necessary  e.g. 'name=value; name2=value2'"/>
                        </FormItem>
                        <div class="text-right">
                            <d-button @click="createTask()" size="sm" class="btn-accent ml-auto">
                                <strong >Start Scan</strong>
                            </d-button>
                        </div>
                    </Form>
                </div>
            </Modal>

            <Modal
                    :styles="{top: '20px'}"
                    footer-hide
                    width="700"
                    v-model="openQuicklyScanModal"
                    :title="testTarget">
                <Spin size="large" fix v-if="tempSpinShow">
                    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                    <div>Scanning</div>
                </Spin>
                <div v-for="item in tempItems">
                    <div style="line-height:25px">
                        <h5>
                            <span class="text-fiord-blue mr-2"><strong>[{{item['http_status']}}]</strong></span>
                            <span class="text-fiord-blue"><strong>{{item['domain']}}</strong></span>
                            <span class="ml-3" v-if="item.title.length !== 0">{{item['title']}}</span>
                        </h5>
                        <span class="text-muted fingerprint-ip-span">
                            <strong><i class="material-icons mr-1">language</i>{{item['ip']}}</strong>
                        </span>
                        <br>
                        <span v-if="item.c_code !== 'zz'" :class="'mr-2 flag-icon flag-icon-'+item.c_code"/>
                        <span>{{item['country']}}</span><br>
                        <d-row class="mt-2 ml-2">
                            <Tag class="mr-3" color="blue"  v-for="i in item.fingerprint" :key="i.plugin" :name="i.plugin">
                                <span v-if="i['string'].length === 0">{{i['plugin']}}</span>
                                <span v-else>{{i['plugin']}} [{{i['string']}}]</span>
                            </Tag>
                        </d-row>
                        <br>
                        <hr v-if="tempItems.length > 1" class="mt-4">
                        <br>
                    </div>
                </div>
            </Modal>
        </d-row>
    </d-container>
</template>

<script>
    import FingerprintList from "./FingerprintList";
    export default {
        name: "WebsiteIdentifies",
        components: {
            FingerprintList,
        },
        data() {
            return {
                targetExampleText: "Example: \n192.168.1.1\n192.168.1.1/24\n192.168.100-200\nhttps://www.example.com\n",
                items: [],
                tempItems: [],
                reqApiPath: "discovery/whatweb/task",
                openQuicklyScanModal: false,
                openAdvancedScanModal: false,
                tempSpinShow: true,
                testTarget: "",
                adScanOption: {
                    name: "whatweb_scan_" + this.getDateTime(),
                    target: "",
                    level: "3",
                    cookie: "",
                    header: ""
                }
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData() {},
            getDateTime() {
                let now = new Date();
                let year = now.getFullYear();       //年
                let month = now.getMonth() + 1;     //月
                let day = now.getDate();            //日
                let hh = now.getHours();            //时
                let mm = now.getMinutes();          //分
                let clock = year + "";
                if(month < 10)
                    clock += "0";
                clock += month + "";
                if(day < 10)
                    clock += "0";
                clock += day + "";
                if(hh < 10)
                    clock += "0";
                clock += hh + "";
                if (mm < 10) clock += '0';
                clock += mm;
                return clock.toString();
            },
            quicklyScan() {
                this.tempSpinShow = true;
                if (this.testTarget.length === 0) {
                    this.$message.error("Please enter the target");
                    return
                }
                this.tempItems = [];
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
                    this.tempSpinShow = false;
                    this.testTarget = "";
                });
            },
            createTask(){
                let data = {
                    name: this.adScanOption.name,
                    target: this.adScanOption.target.split("\n").join(","),
                    level: this.adScanOption.level,
                    header: this.adScanOption.header,
                    cookie: this.adScanOption.cookie,
                };
                if (data['name'].length !== 0 && data['target'].length !== 0) {
                    this.$Modal.confirm({
                        title: 'CONFIRM',
                        content: 'Are you sure to add a new scan task?',
                        closable: true,
                        okText: 'OK',
                        cancelText: 'Cancel',
                        onOk: () => {
                            this.$axios.post(this.reqApiPath, data).then(response => {
                                let status = response['data']['status'];
                                if(status['status'] === "success") {
                                    this.$message.success(status['message']);
                                    this.openAdvancedScanModal = false;
                                    this.adScanOption = {
                                        name: "whatweb_scan_" + this.getDateTime(),
                                            target: "",
                                            level: "3",
                                            cookie: "",
                                            header: ""
                                    }
                                } else {
                                    this.$message.error(status['message'])
                                }
                            })
                        }
                    });
                } else {
                    this.$message.error("Please check your input")
                }
            },
        }
    }
</script>

<style scoped>

</style>