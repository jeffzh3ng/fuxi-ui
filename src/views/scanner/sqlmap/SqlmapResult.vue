<template>
    <div>
        <v-card-title>
            <v-list-item-action>
                <v-icon class="teal--text">mdi-clipboard-list-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content class="ml-n4">
                <v-list-item-title class="teal--text">
                    <span>SQLMAP VULNERABILITIES</span>
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
                        item-key="rid"
                        loading-text="Loading... Please wait"
                        :search="search"
                        show-select
                        v-model="selected"
                        no-data-text=""
                >
                    <template v-slot:item.task_name="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">{{item['task_name'] | long}}</span>
                            </template>
                            <span>{{item['task_name']}}</span>
                        </v-tooltip>
                    </template>
                    <template v-slot:item.target="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span @click="resDetail(item['rid'])" v-on="on">{{item['target'] | long}}</span>
                            </template>
                            <span>{{item['target']}}</span>
                        </v-tooltip>
                    </template>

                    <template v-slot:item.dbms="{ item }">
                        <span v-if="item['dbms'].length > 0">{{item['dbms']}}</span>
                        <span v-else>N/A</span>
                    </template>

                    <template v-slot:item.parameter="{ item }">
                        <span v-if="item['parameter'].length > 0">{{item['parameter']}}</span>
                        <span v-else>N/A</span>
                    </template>
                    <template v-slot:item.place="{ item }">
                        <span v-if="item['place'].length > 0">{{item['place']}}</span>
                        <span v-else>N/A</span>
                    </template>

                    <template v-slot:item.result="{ item }">
                        <v-btn :color="item['result'] === 0 ? 'success' : 'error'" text icon x-small>
                            <v-icon>mdi-checkbox-blank-circle</v-icon>
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
                                    <v-list-item @click="resDetail(item['rid'])">
                                        <v-list-item-action>
                                            <v-icon class="teal--text">mdi-book-open-outline</v-icon>
                                        </v-list-item-action>
                                        <v-list-item-content class="ml-n4 mr-4">
                                            <v-list-item-title>
                                                <span class="teal--text">Detail</span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-list-item @click="deleteResult(item['rid'])">
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
        <v-dialog v-model="vulDialogOpen" width="800px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{vulData.name}}</span>
                </v-card-title>
                <v-card-text>
                    <pre>{{vulData.data}}</pre>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="vulDialogOpen = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        name: "SqlmapResult",
        data: () => ({
            spinShow: true,
            tid: "",
            pid: "",
            items: [],
            pageCurrent: 1,
            pageSize: 10,
            search: "",
            selected: [],
            headers: [
                { text: 'Task Name', value: 'task_name' },
                { text: 'URL', value: 'target' },
                { text: 'Vulnerability', value: 'result' },
                { text: 'Place', value: 'place' },
                { text: 'Para', value: 'parameter' },
                { text: 'DBMS', value: 'dbms' },
                { text: 'Date', value: 'date' },
                { text: 'Action', value: 'action' },
            ],
            deleteMultiDialog: false,
            vulDialogOpen: false,
            vulData: {name: "", data: ""}
        }),
        mounted() {
            this.tid = this.$route.query.tid;
            if (this.tid !== undefined) {
                this.getData("?task_id=" + this.tid);
            } else {
                this.getData();
            }
            this.spinShow = false
        },
        methods: {
            getTaskData(tid) {
                this.$api.scanner.sqlmapTaskResult(tid).then(res => {
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
            getAllData() {
                this.$api.scanner.sqlmapResult().then(res => {
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
            getData() {
                if (this.tid !== undefined) {
                    this.getTaskData(this.tid);
                } else {
                    this.getAllData();
                }
            },
            deleteResult(rid) {
                this.$api.scanner.sqlmapResultDelete(rid).then(res => {
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
            resDetail(vid) {
                this.$api.scanner.sqlmapResultDetail(vid).then(res => {
                    this.vulDialogOpen = true;
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if(status['status'] === "success") {
                        this.vulData.name = result['task_name'];
                        this.vulData.data = result;
                    } else {
                        this.$message.error(status['message']);
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>