<template>
    <div>
        <v-card-title>
            <v-list-item-action>
                <v-icon class="teal--text">mdi-clipboard-list-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content class="ml-n4">
                <v-list-item-title class="teal--text">
                    <span>WEBSITE FINGERPRINT</span>
                </v-list-item-title>
            </v-list-item-content>
        </v-card-title>

        <v-row class="mt-n6">
            <v-col cols="4">
                <v-text-field
                        class="ml-6"
                        label="URL"
                        persistent-hint
                        required
                        v-model="scanTestData.url"
                ></v-text-field>
            </v-col>
            <v-col cols="2">
                <v-btn @click="scanTemp" class="mt-3" elevation="0">Start Scan</v-btn>
            </v-col>
            <v-col cols="2">
                <v-btn @click="openAdScanDialog" class="mt-3" color="teal" elevation="0">
                    <span class="white--text">Advanced Scan</span>
                </v-btn>
            </v-col>
            <v-col cols="4">
                <v-btn
                        text
                        @click="taskDialogOpen = true"
                        class="float-right mt-2 mr-6"
                        elevation="0">
                    View Historical Tasks &rarr;
                </v-btn>
            </v-col>
            <v-col cols="12" >
                <v-divider class="mt-n4 ml-6 mr-6"/>
            </v-col>
            <v-col class="mt-n6 ml-6" cols="2">
                <v-select
                        :items="['TITLE', 'DOMAIN','APP', 'IP']"
                        dense
                        v-model="searchOPT.type"
                        outlined
                ></v-select>
            </v-col>
            <v-col class="mt-n6" cols="4">
                <v-text-field
                        outlined
                        dense
                        v-model="searchOPT.keyword"
                        persistent-hint
                        required
                        class="ml-n4"
                        @keyup.enter.native="search"
                        placeholder="Search"
                ></v-text-field>
            </v-col>
            <v-col v-if="searchOPT.type === 'APP'" class="mt-n6" cols="2">
                <v-text-field
                        label="VERSION"
                        placeholder="Default: all"
                        outlined
                        class="ml-n6"
                        dense
                        v-model="searchOPT.extra"
                        persistent-hint
                        @keyup.enter.native="search"
                        required
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="2" class="mt-n6">
                <div class="ml-7">
                    <table>
                        <tr>
                            <td><span class="mr-6 subtitle-2">TOTAL</span></td>
                            <td><span>{{items.length}}</span></td>
                        </tr>
<!--                        <tr>-->
<!--                            <td><span class="mr-6 subtitle-2">SERVER</span></td>-->
<!--                            <td><span>1000</span></td>-->
<!--                        </tr>-->
                    </table>
                </div>
                <div class="ml-6 mt-12">
                    <v-btn @click="exportData" elevation="0">
                        <v-icon class="mr-2">mdi-content-save-move</v-icon>
                        <strong>Export XLS</strong>
                    </v-btn>
                </div>
                <br>
                <br>
                <div class="ml-6 mt-12">
                    <v-btn @click="sendIPToNetworkPortScanner"  elevation="0">
                        <v-icon class="mr-2">mdi-plus</v-icon>
                        <strong >port scan</strong>
                    </v-btn>
                    <v-btn @click="sendDomainToPocScanner" class="mt-4" elevation="0">
                        <v-icon class="mr-2">mdi-plus</v-icon>
                        <strong class="mr-2">poc scan</strong>
                    </v-btn>
                </div>
            </v-col>
            <v-col cols="10" class="mt-n9">
                <WebFingerprintList class="ml-3" v-bind:data="items"/>
            </v-col>
        </v-row>
        <v-dialog class="mt-n12" persistent v-model="scanTestDialogOpen" width="700px">
            <v-card>
                <v-card-title>
                    <span class="headline teal--text">{{scanTestData.url | long}}</span>
                </v-card-title>
                <v-card-text>
                    <span v-if="scanTestData.result.length === 0">
                        Scanning... Please wait
                    </span>
                    <span v-else-if="scanTestData.result === 'None'">
                        No available data was found
                    </span>
                    <div v-else>
                        <div v-for="(item, index) in scanTestData.result" :key="index" class="mr-4 ml-2">
                            <div>
                                <strong class="mr-4 title">[{{item['http_status']}}]</strong>
                                <strong class="title">{{item['domain']}}</strong>
                                <br>
                                <span class="title" v-if="item.title.length !== 0">## {{item['title'] | long}}</span>
                                <span class="teal--text title" v-else>## Title Not Found</span>
                                <br>
                                <span v-if="item['c_code'] !== 'zz'" :class="'mr-2 flag-icon flag-icon-'+item['c_code']"/>
                                <span v-else class="mr-2 flag-icon flag-icon-us"/>
                                <span class="mr-2">{{item['country']}}</span><strong>{{item['ip']}}</strong>
                                <br>
                                <div class="mt-2">
                                    <v-btn x-small elevation="0" class="mr-3 mt-1" color="blue"  v-for="(i, k) in item.fingerprint" :key="k">
                                        <span class="white--text" v-if="i['string'].length === 0">{{i['plugin']}}</span>
                                        <span class="white--text" v-else>{{i['plugin']}} [{{i['string']}}]</span>
                                    </v-btn>
                                </div>
                                <br>
                                <hr v-if="scanTestData.result.length > 1" class="mt-4">
                                <br>
                            </div>
                        </div>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="teal darken-1" class="mr-4 mb-2" text @click="closeTempScan">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="advancedTaskDialogOpen" width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline ml-3 teal--text">Advanced Scan</span>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" class="mt-n3">
                            <v-text-field
                                    label="Task Name"
                                    class="mr-3 ml-3"
                                    :rules="[v => !!v || 'Task name is required']"
                                    persistent-hint
                                    required
                                    v-model="adScanOPT.name"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" class="mt-n4">
                            <v-textarea
                                    label="TARGET"
                                    outlined
                                    rows="5"
                                    dense
                                    class="mr-2 ml-2"
                                    :rules="[v => !!v || 'Target is required']"
                                    v-model="adScanOPT.target"
                                    :placeholder="targetExampleText"
                            ></v-textarea>
                        </v-col>

                        <v-col cols="5" class="mt-n6">
                            <v-select
                                    :items="adScanLevel"
                                    v-model="adScanOPT.level"
                                    outlined
                                    label="LEVEL"
                                    dense
                                    single-line
                                    class="mr-2 ml-2"
                            />
                        </v-col>
                        <v-col v-if="adScanOPT.level === 4" cols="12" class="mt-n11 mr-3 ml-3 mb-4">
                            <span class="error--text">## Makes a lot of HTTP requests per target. URLs from all plugins are attempted.</span>
                            <span class="error--text">This level is recommended for a single target because it takes a lot of time</span>
                        </v-col>

                        <v-col cols="12" class="mt-n10">
                            <v-text-field
                                    label="Header"
                                    class="mr-3 ml-3"
                                    v-model="adScanOPT.header"
                                    persistent-hint
                                    placeholder="Not necessary  e.g. 'Foo:Bar'"
                                    required
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" class="mt-n8">
                            <v-text-field
                                    label="Cookies"
                                    class="mr-3 ml-3"
                                    v-model="adScanOPT.cookies"
                                    persistent-hint
                                    placeholder="Not necessary  e.g. 'name=value; name2=value2'"
                                    required
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" class="mt-n8">
                            <v-slider
                                    class="ml-4 mt-6"
                                    v-model="adScanOPT.threads"
                                    label="Threads"
                                    thumb-label="always"
                            ></v-slider>
                        </v-col>

                        <v-col cols="12">
                            <v-btn @click="adScan" color="teal" class="float-right ml-2 mr-2 mb-4">
                                <span class="white--text">Create</span>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="taskDialogOpen" width="1200px">
            <v-card>
                <v-card-title>
                    <v-list-item-action>
                        <v-icon class="teal--text">mdi-clipboard-list-outline</v-icon>
                    </v-list-item-action>
                    <v-list-item-content class="ml-n4">
                        <v-list-item-title class="teal--text">
                            <span>TASKS</span>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <WhatwebTasks/>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import WhatwebTasks from "./WhatwebTasks"
    import WebFingerprintList from "./WebFingerprintList";
    export default {
        name: "WebFingerprint",
        components: {
            WhatwebTasks,
            WebFingerprintList,
        },
        data: () => ({
            spinShow: true,
            items: [],
            searchOPT: {type: "DOMAIN", keyword: "", extra: ""},
            scanTestDialogOpen: false,
            advancedTaskDialogOpen: false,
            taskDialogOpen: false,
            whatwebExe: false,
            scanTestData: {url: "", result: []},
            targetExampleText: "Example: \nhttps://www.example.com\n192.168.1.1\n192.168.1.1/24\n192.168.100-200\n",
            adScanLevel: [
                {text: "Stealthy", value: 1},
                {text: "Aggressive", value: 3},
                {text: "Heavy", value: 4},
            ],
            adScanOPT: {
                name: "", target: "", level: 3, header: "", cookies: "", threads: 15,
            }
        }),
        mounted() {
            this.exeCheck();
            this.advancedTaskDialogOpen = false;
            this.target = this.$route.query.target;
            this.adScanOPT.name = "whatweb_task_" + this.$tools.getDateTime();
            if (this.target !== undefined) {
                this.adScanOPT.target = this.target.split(",").join("\n");
                this.advancedTaskDialogOpen = true;
            }
            this.getData();
        },
        methods: {
            getData() {
                this.$api.discovery.fpResult().then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if(status['status'] === "success") {
                        this.items = result
                    } else {
                        this.$message.error(status['message']);
                    }
                })
            },
            search() {
                let data = "";
                if(this.searchOPT.keyword.length === 0) {
                    // this.$message.error("Please check you input");
                    this.getData();
                    return
                }
                if(this.searchOPT.extra.length === 0) {
                    data = "?keyword=" + this.searchOPT.type + "&value=" + this.searchOPT.keyword
                } else {
                    data = "?keyword=" + this.searchOPT.type + "&value=" + this.searchOPT.keyword + "||" + this.searchOPT.extra
                }
                this.$api.discovery.fpResult(data).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if(status['status'] === "success") {
                        this.items = result
                    } else {
                        this.$message.error(status['message']);
                    }
                })
            },
            closeTempScan() {
                this.scanTestDialogOpen = false;
                this.scanTestData.url = "";
                this.scanTestData.result = [];
            },
            scanTemp() {
                this.scanTestData.result = [];
                if(!this.whatwebExe) {
                    this.$message.error("Whatweb is not installed, please try again after installation");
                    return
                }
                if(this.scanTestData.url.length === 0) {
                    this.$message.error("URL is required");
                    return
                }
                let data = {target: this.scanTestData.url};
                this.scanTestDialogOpen = true;
                this.$api.discovery.whatwebTempScan(data).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if(status['status'] === "success") {
                        if (result.length === 0) {
                            this.scanTestData.result = "None"
                        } else {
                            this.scanTestData.result = result;
                        }
                    } else {
                        this.$message.error(status['message']);
                    }
                })
            },
            openAdScanDialog() {
                this.advancedTaskDialogOpen = true;
                this.adScanOPT.name = "whatweb_task_" + this.$tools.getDateTime();
                this.adScanOPT.target = "";
                this.adScanOPT.header = "";
                this.adScanOPT.cookies = "";
            },
            adScan() {
                if(!this.whatwebExe) {
                    this.$message.error("Whatweb is not installed, please try again after installation");
                    return
                }
                let data = {
                    name: this.adScanOPT.name,
                    target: this.adScanOPT.target.split("\n").join(","),
                    level: this.adScanOPT.level,
                    header: this.adScanOPT.header,
                    cookie: this.adScanOPT.cookie,
                };
                if (data.name.length === 0 || data.target.length === 0) {
                    this.$message.error("Please check you input");
                    return
                }
                this.advancedTaskDialogOpen = false;
                this.$api.discovery.whatwebAdScan(data).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    if(status['status'] === "success") {
                        this.$message.success(status['message']);
                    } else {
                        this.$message.error(status['message']);
                    }
                    this.adScanOPT =  {
                        name: "whatweb_task_" + this.$tools.getDateTime(),
                        target: "", level: 3, header: "", cookies: ""
                    };
                });
            },
            exportData() {
                let data = "";
                if(this.searchOPT.extra.length === 0) {
                    data = "?keyword=" + this.searchOPT.type + "&value=" + this.searchOPT.keyword
                } else {
                    data = "?keyword=" + this.searchOPT.type + "&value=" + this.searchOPT.keyword + "||" + this.searchOPT.extra
                }
                if(this.searchOPT.keyword.length === 0) {
                    window.open(this.$api.SERVER_ADDER + "/discovery/fp/export/csv?token=" + this.$api.TOKEN)
                } else {
                    window.open(this.$api.SERVER_ADDER + "/discovery/fp/export/csv" + data + "&token=" + this.$api.TOKEN)
                }
            },
            exeCheck() {
                this.$api.setting.settingList().then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if (status['status'] === "success") {
                        for (let i=0; i<result.length; i++) {
                            if (result[i]['key'] === "whatweb_exe") {
                                if (result[i]['value'].length > 0) {
                                    this.whatwebExe = true;
                                }
                            }
                        }
                    } else {
                        this.$message.error(status['message']);
                    }
                });
            },
            sendIPToNetworkPortScanner(){
                let ip = [];
                for (let i=0; i<this.items.length; i++) {
                    ip.push(this.items[i]['ip'])
                }
                window.open("#/discovery/port/new?target=" + ip.join(","), "_bank")
            },
            sendDomainToPocScanner(){
                let target = [];
                for (let i=0; i<this.items.length; i++) {
                    target.push(this.items[i]['domain'])
                }
                window.open("#/scanner/poc/new?target=" + target.join(","), "_bank")
            },
        }
    }
</script>

<style scoped>

</style>