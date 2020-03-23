<template>
    <div>
        <v-card-title>
            <v-list-item-action>
                <v-icon class="teal--text">mdi-clipboard-list-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content class="ml-n4">
                <v-list-item-title class="teal--text">
                    <span>PORT</span>
                </v-list-item-title>
            </v-list-item-content>
        </v-card-title>

        <v-row class="mt-n2">
            <v-col cols="6">
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

            <v-col cols="6">
                <v-btn @click="sendTargetToWhatweb" elevation="0" color="teal" class="mr-8">
                    <v-icon class="white--text mr-2">mdi-credit-card-scan-outline</v-icon>
                    <span class="white--text">Whatweb</span>
                </v-btn>
                <v-btn @click="sendTargetToPocScanner" elevation="0" color="teal">
                    <v-icon class="white--text mr-2">mdi-credit-card-scan-outline</v-icon>
                    <span class="white--text">PoC Scan</span>
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
            <v-col class="mt-n8 ml-4 mr-4" col="12">
                <v-data-table
                        :headers="headers"
                        :items="items"
                        hide-default-footer
                        :page.sync="pageCurrent"
                        :items-per-page="pageSize"
                        @page-count="pageCount = $event"
                        :loading="spinShow"
                        item-key="hid"
                        loading-text="Loading... Please wait"
                        :search="search"
                        show-select
                        v-model="selected"
                        no-data-text=""
                >

                    <template v-slot:item.name="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">{{item['name'] | long}}</span>
                            </template>
                            <span>{{item['name']}}</span>
                        </v-tooltip>
                    </template>
                    <template v-slot:item.port_str="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">{{item['port_str'] | long}}</span>
                            </template>
                            <span>{{item['port_str']}}</span>
                        </v-tooltip>
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
                                    <v-list-item @click="hostDetail(item['hid'])">
                                        <v-list-item-action>
                                            <v-icon class="teal--text">mdi-book-open-outline</v-icon>
                                        </v-list-item-action>
                                        <v-list-item-content class="ml-n4 mr-4">
                                            <v-list-item-title>
                                                <span class="teal--text">Detail</span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-list-item @click="deleteHost(item['hid'])">
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
        <v-dialog v-model="hostDetailDialogOpen" width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{hostData.name}}</span>
                </v-card-title>
                <v-card-text>
                    <div>
                        <div v-if="hostData.length===0">
                            <h6  class="text-center mt-4">Not Found Open Port</h6>
                            <br>
                            <br>
                        </div>
                        <table id="host_detail_table">
                            <tr v-for="(item, index) in hostData" :key="index">
                                <td><span class="mr-3">{{item['host']}}</span></td>
                                <td><span class="mr-3">{{item['hostname']}}</span></td>
                                <td><span class="mr-3">{{item['port']}}</span></td>
                                <td><span class="mr-3">{{item['name']}}</span></td>
<!--                                <td><span class="mr-3">{{item['extrainfo']}}</span></td>-->
                            </tr>
                        </table>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="hostDetailDialogOpen = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        name: "PortTaskResult",
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
                { text: 'Task Name', value: 'name' },
                { text: 'Hostname', value: 'hostname' },
                { text: 'Host', value: 'host' },
                { text: 'Port', value: 'port_str' },
                { text: 'Date', value: 'date' },
                { text: 'Action', value: 'action' },
            ],
            deleteMultiDialog: false,
            hostDetailDialogOpen: false,
            hostData: {name: "", data: ""}
        }),
        mounted() {
            this.tid = this.$route.query.tid;
            if (this.tid !== undefined) {
                this.getData(this.tid);
            }
            this.spinShow = false
        },
        methods: {
            getData(tid) {
                this.$api.discovery.portTaskResult(tid).then(res => {
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
            deleteHost(hid) {
                this.$api.discovery.portHostDelete(hid).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    if(status['status'] === "success") {
                        this.$message.success(status['message']);
                    } else {
                        this.$message.error(status['message']);
                    }
                    this.getData(this.tid);
                })
            },
            hostDetail(hid) {
                this.$api.discovery.portHostDetail(hid).then(res => {
                    this.hostDetailDialogOpen = true;
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if(status['status'] === "success") {
                        this.hostData = result;
                    } else {
                        this.$message.error(status['message']);
                    }
                })
            },
            sendTargetToPocScanner(){
                let target = [];
                for (let i=0; i<this.items.length; i++) {
                    target.push(this.items[i]['host'])
                }
                window.open("#/scanner/poc/new?target=" + target.join(","), "_bank")
            },
            sendTargetToWhatweb(){
                let target = [];
                for (let i=0; i<this.items.length; i++) {
                    for (let c=0; c<this.items[i]['port'].length; c++) {
                        target.push(this.items[i]['host'] + ":" + this.items[i]['port'][c].toString())
                    }
                }
                window.open("#/discovery/whatweb?target=" + target.join(","), "_bank")
            },
        }
    }
</script>

<style scoped>

</style>