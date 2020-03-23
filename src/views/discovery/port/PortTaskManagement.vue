<template>
    <div>
        <v-card-title>
            <v-list-item-action>
                <v-icon class="teal--text">mdi-clipboard-list-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content class="ml-n4">
                <v-list-item-title class="teal--text">
                    <span>PORT SCAN TASK MANAGEMENT</span>
                </v-list-item-title>
            </v-list-item-content>
        </v-card-title>

        <v-row class="mt-n2">
            <v-col cols="8">
                <v-btn
                        icon
                        class="mr-4 ml-6"
                        v-if="selected.length !== 0"
                        @click="deleteMultiDialog = true">
                    <v-icon large color="teal">mdi-delete-outline</v-icon>
                </v-btn>
                <v-dialog v-model="deleteMultiDialog" max-width="370">
                    <v-card>
                        <v-card-title class="headline">
                            <span style="color: #FFC107">Warning</span>
                        </v-card-title>
                        <v-card-text>
                            Are you sure the you want to remove this item ？
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="grey darken-1" text @click="deleteMultiDialog = false">
                                Cancel
                            </v-btn>
                            <v-btn
                                    color="primary darken-1"
                                    text>
                                Confirm
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-menu
                        :close-on-content-click="false"
                        :nudge-width="200"
                        offset-x
                        transition="slide-x-transition"
                        bottom
                >
                    <template v-slot:activator="{ on }">
                        <v-btn elevation="0" v-on="on"  class="ml-4 mr-4">
                            <span>Search</span>
                        </v-btn>
                    </template>
                    <v-text-field
                            class="mr-4 ml-4 mb-4"
                            color="teal"
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Search"
                            single-line
                            hide-details
                    ></v-text-field>
                </v-menu>
            </v-col>
            <v-col cols="4">
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
            <v-col class="mt-n8 ml-4 mr-4" col="12">
                <v-data-table
                        :headers="headers"
                        :items="items"
                        hide-default-footer
                        :page.sync="pageCurrent"
                        :items-per-page="pageSize"
                        @page-count="pageCount = $event"
                        :loading="spinShow"
                        item-key="tid"
                        dense
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

                    <template v-slot:item.online="{ item }">
                        <v-btn  x-small elevation="0" :color="item['online'] === 0 ? 'grey lighten-3' : 'success'">
                            {{item['online']}}
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
                                    <v-list-item @click="exportResult(item['tid'])">
                                        <v-list-item-action>
                                            <v-icon>mdi-export</v-icon>
                                        </v-list-item-action>
                                        <v-list-item-content class="ml-n4 mr-4">
                                            <v-list-item-title>
                                                <span>Export</span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-list-item @click="getTaskDetail(item['tid'])">
                                        <v-list-item-action>
                                            <v-icon class="orange--text">mdi-book</v-icon>
                                        </v-list-item-action>
                                        <v-list-item-content class="ml-n4 mr-4">
                                            <v-list-item-title>
                                                <span class="orange--text">Detail</span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-list-item @click="rescanTask(item['tid'])">
                                        <v-list-item-action>
                                            <v-icon class="teal--text">mdi-reload</v-icon>
                                        </v-list-item-action>
                                        <v-list-item-content class="ml-n4 mr-4">
                                            <v-list-item-title>
                                                <span class="teal--text">Rescan</span>
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
                <v-row v-if="items.length === 0" justify="center" class="grey--text mb-12">
                    <h2>No available data</h2>
                    <br>
                </v-row>
                <v-divider/>
                <v-row>
                    <v-col cols="12">
                        <div class="float-right mb-4 mt-1 mr-3">
                            <v-pagination
                                    color="teal"
                                    v-model="pageCurrent"
                                    :length="Math.ceil(items.length / pageSize)"
                                    :total-visible="7"
                            ></v-pagination>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-dialog v-model="taskDetailDialogOpen" width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{taskDetail.name}}</span>
                </v-card-title>
                <v-card-text>
                    <div>
                        <table class="subtitle-1">
                            <tr>
                                <td><strong class="teal--text">Task Name</strong></td>
                                <td><span class="ml-8">{{taskDetail.name}}</span></td>
                            </tr>
                            <tr>
                                <td><strong class="teal--text">Task ID</strong></td>
                                <td><span class="ml-8">{{taskDetail.task_id}}</span></td>
                            </tr>
                            <tr>
                                <td><strong class="teal--text">Status</strong></td>
                                <td>
                                    <v-btn class="ml-8" x-small elevation="0" color="grey lighten-3">
                                        {{taskDetail['status']}}
                                    </v-btn>
                                </td>
                            </tr>
                            <tr>
                                <td><strong class="teal--text">Owner</strong></td>
                                <td><span class="ml-8">{{taskDetail.op}}</span></td>
                            </tr>
                            <tr>
                                <td><strong class="teal--text">Online Host</strong></td>
                                <td>
                                    <v-btn class="ml-8" x-small elevation="0" color="grey lighten-3">
                                        {{taskDetail['online']}}
                                    </v-btn>
                                </td>
                            </tr>
                            <tr>
                                <td><strong class="teal--text">Option</strong></td>
                                <td><span class="ml-8">{{taskDetail.option}}</span></td>
                            </tr>
                            <tr>
                                <td><strong class="teal--text">Port</strong></td>
                                <td><span class="ml-8">{{taskDetail.port}}</span></td>
                            </tr>
                            <tr>
                                <td><strong class="mr-4 teal--text">Target</strong></td>
                                <td><span class="ml-8">{{taskDetail.target}}</span></td>
                            </tr>
                            <tr>
                                <td><strong class="teal--text">Last Modified</strong></td>
                                <td><span class="ml-8">{{taskDetail.date}}</span></td>
                            </tr>
                            <tr>
                                <td><strong class="teal--text">End date</strong></td>
                                <td><span class="ml-8">{{taskDetail.end_date}}</span></td>
                            </tr>
                        </table>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="taskDetailDialogOpen = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        name: "PortTaskManagement",
        data: () => ({
            spinShow: true,
            items: [],
            pageCurrent: 1,
            pageSize: 10,
            search: "",
            selected: [],
            headers: [
                { text: 'Task Name', value: 'name' },
                { text: 'Status', value: 'status' },
                { text: 'Online', value: 'online' },
                { text: 'Create Date', value: 'date' },
                { text: 'Last Modified', value: 'end_date' },
                { text: 'OP', value: 'op' },
                { text: 'Action', value: 'action' },
            ],
            deleteMultiDialog: false,
            taskDetailDialogOpen: false,
            taskData: {name: "", data: ""},
            taskDetail: {
                name: "",
                target: "",
                port: "",
                option: "",
                op: "",
                status: "",
                date: "",
                end_date: "",
                task_id: "",
                online: 0
            },
        }),
        mounted() {
            this.getData();
            this.spinShow = false
        },
        methods: {
            getData() {
                this.$api.discovery.portTaskList().then(res => {
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
            deleteTask(tid) {
                this.$api.discovery.portTaskDelete(tid).then(res => {
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
                this.$api.discovery.portTaskRescan(tid).then(res => {
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
            getTaskDetail(tid) {
                this.taskDetailDialogOpen = true;
                this.taskDetail = {
                    name: "Loading... Please wait",
                    target: "",
                    port: "",
                    option: "",
                    op: "",
                    status: "",
                    date: "",
                    end_date: "",
                    task_id: "",
                    online: 0
                };
                this.$api.discovery.portTaskDetail(tid).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if(status['status'] === "success") {
                        this.taskDetail = result;
                        if (result['port'].length === 0) {
                            this.taskDetail.port = 'default'
                        } else {
                            this.taskDetail.port = result['port'].join(", ");
                        }
                        this.taskDetail.target = result['target'].join(", ");
                    } else {
                        this.$message.error(status['message']);
                    }
                })
            },
            getTaskResult(tid){
                window.open('#/discovery/port/result?tid=' + tid, "_blank");
            },
            exportResult(tid) {
                window.open(this.$api.SERVER_ADDER + "/discovery/port/export/" + tid  + "?token=" + this.$api.TOKEN)
            },

        }
    }
</script>

<style scoped>

</style>