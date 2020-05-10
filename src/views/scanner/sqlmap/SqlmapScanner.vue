<template>
    <div>
        <v-card-title>
            <v-list-item-action>
                <v-icon class="teal--text">mdi-needle</v-icon>
            </v-list-item-action>
            <v-list-item-content class="ml-n4">
                <v-list-item-title class="teal--text">
                    <span>SQL INJECTION</span>
                </v-list-item-title>
            </v-list-item-content>
        </v-card-title>

        <v-row class="mt-n2">
            <span v-if="!sqlmapAPI" class="error--text ml-8">
                ** The sqlmap api service configuration was not found, you need to configure it
                <a href="/#/settings" class="ml-2">Go to</a>
            </span>
            <v-col cols="12">
                <v-btn
                        icon
                        class="mr-4 ml-6"
                        v-if="selected.length !== 0"
                        @click="deleteMultiDialog = true">
                    <v-icon large color="teal">mdi-delete-outline</v-icon>
                </v-btn>

                <v-btn @click="openNewScanDialog" small color="teal" elevation="0" class="ml-5 mr-12">
                    <span class="white--text">New Scan</span>
                </v-btn>
                <v-select
                        class="float-right mr-4"
                        :items="[10, 20, 50, 100]"
                        dense
                        single-line
                        v-model="pageSize"
                        color="teal"
                        style="width: 60px;"
                />
            </v-col>
            <v-col cols="12" class="mt-n6">
                <v-data-table
                        :headers="headers"
                        :items="items"
                        hide-default-footer
                        :page.sync="pageCurrent"
                        :items-per-page="pageSize"
                        @page-count="pageCount = $event"
                        :loading="spinShow"
                        item-key="tid"
                        loading-text="Loading... Please wait"
                        :search="search"
                        show-select
                        v-model="selected"
                        no-data-text=""
                >
                    <template v-slot:item.name="{ item }">
                        <span @click="getTaskResult(item['tid'])" class="teal--text">{{item['name'] | long}}</span>
                    </template>

                    <template v-slot:item.status="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <div v-on="on">
                                    <v-btn v-if="item.status === 'running'" text icon class="amber--text" x-small>
                                        <v-icon>mdi-checkbox-blank-circle</v-icon>
                                    </v-btn>
                                    <v-btn v-if="item.status === 'waiting'" text icon class="grey--text" x-small>
                                        <v-icon>mdi-checkbox-blank-circle</v-icon>
                                    </v-btn>
                                    <v-btn v-if="item.status === 'completed'" text icon class="teal--text" x-small>
                                        <v-icon>mdi-checkbox-blank-circle</v-icon>
                                    </v-btn>
                                </div>
                            </template>
                            <span>{{item['status'] | capitalize}}</span>
                        </v-tooltip>
                    </template>

                    <template v-slot:item.target="{ item }">
                        <v-btn  x-small elevation="0" color="grey">
                            <span class="white--text">{{item['target'].length}}</span>
                        </v-btn>
                    </template>

                    <template v-slot:item.result="{ item }">
                        <v-btn  x-small elevation="0" :color="item['result'] === 0 ? 'success' : 'error'">
                            {{item['result']}}
                        </v-btn>
                    </template>

                    <template v-slot:item.action="{ item }">
                        <v-menu
                                offset-x
                                transition="slide-x-transition"
                                bottom
                        >
                            <template v-slot:activator="{ on }">
                                <v-btn icon class="mr-1" v-on="on">
                                    <v-icon >mdi-dots-horizontal</v-icon>
                                </v-btn>
                            </template>
                            <v-card>
                                <v-list>
                                    <v-list-item @click="getTaskDetail(item['tid'])">
                                        <v-list-item-action>
                                            <v-icon>mdi-book</v-icon>
                                        </v-list-item-action>
                                        <v-list-item-content class="ml-n4 mr-4">
                                            <v-list-item-title>
                                                <span>Detail</span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-list-item @click="exportResult(item['tid'])">
                                        <v-list-item-action>
                                            <v-icon class="teal--text">mdi-export</v-icon>
                                        </v-list-item-action>
                                        <v-list-item-content class="ml-n4 mr-4">
                                            <v-list-item-title>
                                                <span class="teal--text">Export</span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-list-item @click="rescanTask(item['tid'])">
                                        <v-list-item-action>
                                            <v-icon class="success--text">mdi-reload</v-icon>
                                        </v-list-item-action>
                                        <v-list-item-content class="ml-n4 mr-4">
                                            <v-list-item-title>
                                                <span class="success--text">Rescan</span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-list-item @click="deleteTask(item['tid'])">
                                        <v-list-item-action>
                                            <v-icon class="error--text">mdi-trash-can-outline</v-icon>
                                        </v-list-item-action>
                                        <v-list-item-content class="ml-n4 mr-4">
                                            <v-list-item-title>
                                                <span class="error--text">Delete</span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </v-menu>
                    </template>
                </v-data-table>
            </v-col>
            <v-row v-if="items.length === 0" justify="center" class="grey--text mb-6">
                <h2>No available data</h2>
                <br>
            </v-row>

            <v-col cols="12">
                <div class="float-right mb-4 mt-1 mr-3" >
                    <v-pagination
                            color="teal"
                            v-model="pageCurrent"
                            :length="Math.ceil(items.length / pageSize)"
                            :total-visible="7"
                    ></v-pagination>
                </div>
            </v-col>
        </v-row>
        <v-dialog v-model="newScanMultiDialog" max-width="600">
            <v-card>
                <v-card-title class="headline">
                    <span>SQL Injection</span>
                </v-card-title>
                <v-card-text>
                    <v-col>
                        <v-text-field
                                label="Task Name"
                                v-model="newScanData.name"
                                :rules="[v => !!v || 'Task name is required']"
                                persistent-hint
                                required
                        ></v-text-field>
                    </v-col>
                    <v-row class="ml-1">
                        <v-col cols="5" class="mt-n6">
                            <v-combobox
                                    @change="newScanData.target = ''"
                                    v-model="newScanData.method"
                                    :items="['GET', 'POST']"
                                    label="Request Method"
                            ></v-combobox>
                        </v-col>
                        <v-col cols="5" class="mt-n6 ml-2">
                            <v-combobox
                                    v-model="newScanData.level"
                                    :items="[1, 2, 3, 4, 5]"
                                    label="Level"
                            ></v-combobox>
                        </v-col>
                    </v-row>

                    <v-col class="mt-n4">
                        <v-textarea
                                v-if="newScanData.method === 'GET'"
                                outlined
                                v-model="newScanData.target"
                                :rules="[v => !!v || 'Target is required']"
                                rows="2"
                                label="Target"
                        ></v-textarea>
                        <v-text-field
                                class="mt-n4"
                                v-else
                                label="Target"
                                v-model="newScanData.target"
                                :rules="[v => !!v || 'Target is required']"
                                persistent-hint
                                required
                        ></v-text-field>
                    </v-col>
                    <v-col v-if="newScanData.method === 'POST'" class="mt-n4">
                        <v-textarea
                                outlined
                                v-model="newScanData.body"
                                rows="3"
                                label="Post Body"
                        ></v-textarea>
                    </v-col>
                    <v-col class="mt-n12">
                        <v-text-field
                                label="Cookies"
                                v-model="newScanData.cookie"
                                persistent-hint
                                required
                        ></v-text-field>
                    </v-col>
                    <v-col class="mt-n10">
                        <v-text-field
                                label="Headers"
                                v-model="newScanData.headers"
                                persistent-hint
                                required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="5" class="mt-n6">
                        <v-combobox
                                v-model="newScanData.timeout"
                                :items="[60*5, 60*10, 60*30]"
                                label="Timeout"
                        ></v-combobox>
                    </v-col>
                    <v-col cols="12" class="mt-n4">
                        <v-slider
                                v-model="newScanData.threads"
                                max="15"
                                label="Threads"
                                min="1"
                                thumb-label="always"
                        ></v-slider>
                    </v-col>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="mt-n12" color="grey darken-1" text @click="newScanMultiDialog = false">
                        Cancel
                    </v-btn>
                    <v-btn
                            class="mt-n12"
                            @click="newScan"
                            color="primary darken-1"
                            text>
                        Confirm
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="taskDetailDialog" max-width="600">
            <v-card>
                <v-card-title>
                    <span class="headline">{{taskDetailData.name}}</span>
                </v-card-title>
                <v-card-text>
                    <pre>{{taskDetailData}}</pre>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="taskDetailDialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>

</template>

<script>
    export default {
        name: "SqlmapScanner",
        data: () => {
            return {
                spinShow: true,
                sqlmapAPI: true,
                items: [],
                pageCurrent: 1,
                pageSize: 10,
                search: "",
                selected: [],
                headers: [
                    { text: 'Task Name', value: 'name' },
                    { text: 'Status', value: 'status' },
                    { text: 'Method', value: 'method' },
                    { text: 'Target', value: 'target' },
                    { text: 'Vulnerable', value: 'result' },
                    { text: 'Create Date', value: 'date' },
                    { text: 'Last Modified', value: 'end_date' },
                    { text: 'OP', value: 'op' },
                    { text: 'Action', value: 'action' },
                ],
                deleteMultiDialog: false,
                newScanMultiDialog: false,
                taskDetailDialog: false,
                newScanData: {
                    name: "", target: "", method: "GET", body: "",
                    cookie: "", headers: "", level: 1, db: true, threads: 10, timeout: 300
                },
                taskDetailData: {

                }
            }
        },
        mounted() {
            if (this.$route.query.task !== undefined) {
                this.newScanMultiDialog = true
            }
            this.sqlmapAPICheck();
            this.getData();
        },
        methods: {
            getData() {
                this.$api.scanner.sqlmapTaskList().then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if(status['status'] === "success") {
                        this.items = result
                    } else {
                        this.$message.error(status['message']);
                    }
                    this.spinShow = false;
                })
            },
            openNewScanDialog() {
                this.newScanData.name = "sqlmap_" + this.$tools.getDateTime();
                this.newScanMultiDialog = true;
            },
            newScan() {
                if (this.newScanData.name.length === 0 || this.newScanData.target.length === 0) {
                    this.$message.error("Please check you input");
                    return
                }
                let target = this.newScanData.target.split("\n");
                let data = {
                    name: this.newScanData.name,
                    target: "",
                    method: this.newScanData.method,
                    body: this.newScanData.body,
                    cookie: this.newScanData.cookie,
                    headers: this.newScanData.headers,
                    level: this.newScanData.level,
                    threads: this.newScanData.threads,
                    timeout: this.newScanData.timeout,
                    db_banner: this.newScanData.db,
                };
                if (this.newScanData.method === 'POST') {
                    data.target = target[0]
                } else {
                    data.target = target.join(",")
                }
                this.$api.scanner.sqlmapNewTask(data).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    if (status['status'] === "success") {
                        this.$message.success(status['message']);
                        this.newScanMultiDialog = false;
                        this.getData();
                        this.newScanData = {
                            name: "", target: "", method: "GET", body: "",
                            cookie: "", headers: "", level: 1, db: true,
                        };
                    } else {
                        this.$message.error(status['message']);
                    }
                    this.spinShow = false;
                })
            },
            deleteTask(tid) {
                this.$api.scanner.sqlmapTaskDelete(tid).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    if(status['status'] === "success") {
                        this.$message.success(status['message']);
                    } else {
                        this.$message.error(status['message']);
                    }
                    this.getData();
                })
            },
            rescanTask(tid) {
                this.$api.scanner.sqlmapTaskRescan(tid).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    if(status['status'] === "success") {
                        this.$message.success(status['message']);
                    } else {
                        this.$message.error(status['message']);
                    }
                    this.getData();
                })
            },
            getTaskDetail(tid){
                this.taskDetailDialog = true;
                this.taskDetailData = {};
                this.$api.scanner.sqlmapTaskDetail(tid).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if(status['status'] === "success") {
                        this.taskDetailData = result;
                    } else {
                        this.$message.error(status['message']);
                    }
                    this.getData();
                })
            },
            sqlmapAPICheck() {
                this.$api.setting.settingList().then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if (status['status'] === "success") {
                        this.sqlmapAPI = false;
                        for (let i=0; i<result.length; i++) {
                            if (result[i]['key'] === "nmap_exe") {
                                if (result[i]['value'].length > 0) {
                                    this.sqlmapAPI = true;
                                }
                            }
                        }
                    } else {
                        this.$message.error(status['message']);
                    }
                });
            },
            getTaskResult(tid){
                window.open('#/scanner/sqlmap/result?tid=' + tid, "_blank");
            },
            exportResult(tid) {
                window.open(this.$api.SERVER_ADDER + "/scanner/sqlmap/export/" + tid  + "?token=" + this.$api.TOKEN)
            },
        }
    }
</script>

<style scoped>

</style>