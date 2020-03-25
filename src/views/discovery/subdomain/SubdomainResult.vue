<template>
    <div>
        <v-card-title>
            <v-list-item-action>
                <v-icon class="teal--text">mdi-clipboard-list-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content class="ml-n4">
                <v-list-item-title class="teal--text">
                    <span>SUBDOMAIN LIST</span>
                </v-list-item-title>
            </v-list-item-content>
        </v-card-title>

        <v-row class="mt-n2">
            <v-col cols="4">
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

            <v-col cols="8">
                <v-btn @click="sendTargetToPortScanner" elevation="0" color="teal" class="mr-8">
                    <v-icon class="white--text mr-2">mdi-credit-card-scan-outline</v-icon>
                    <span class="white--text">Port Scan</span>
                </v-btn>
                <v-btn @click="sendTargetToWhatweb" elevation="0" color="teal" class="mr-8">
                    <v-icon class="white--text mr-2">mdi-credit-card-scan-outline</v-icon>
                    <span class="white--text">Whatweb Scanner</span>
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
                        item-key="rid"
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
                    <template v-slot:item.title="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">{{item['title'] | long}}</span>
                            </template>
                            <span>{{item['title']}}</span>
                        </v-tooltip>
                    </template>

                    <template v-slot:item.response="{ item }">
                        <v-btn  x-small elevation="0" :color="item['response'] === 200 ? 'success' : 'grey lighten-2'">
                            {{item['response']}}
                        </v-btn>
                    </template>

                    <template v-slot:item.action="{ item }">
                        <v-icon @click="deleteRes(item['rid'])" class="error--text">mdi-trash-can-outline</v-icon>
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
    </div>
</template>

<script>
    export default {
        name: "SubdomainResult",
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
                // { text: 'Task Name', value: 'name' },
                // { text: 'domain', value: 'domain' },
                { text: 'subdomain', value: 'subdomain' },
                { text: 'Title', value: 'title' },
                { text: 'IP', value: 'ip' },
                { text: 'Response', value: 'response' },
                // { text: 'Date', value: 'date' },
                { text: 'Action', value: 'action' },
            ],
            deleteMultiDialog: false,
        }),
        mounted() {
            this.tid = this.$route.query.tid;
            if (this.tid === undefined) {
                this.getData()
            } else {
                this.getData(this.tid);
            }
        },
        methods: {
            getDataWithTID(tid) {
                this.$api.discovery.subdomainResultList(tid).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if(status['status'] === "success") {
                        this.items = result
                    } else {
                        this.$message.error(status['message']);
                    }
                    this.spinShow = false
                })
            },
            getData(tid="") {
                if (tid.length === 0) {
                    this.$api.discovery.subdomainResultList().then(res => {
                        let response = res.data;
                        let status = response['status'];
                        let result = response['result'];
                        if(status['status'] === "success") {
                            this.items = result
                        } else {
                            this.$message.error(status['message']);
                        }
                        this.spinShow = false
                    })
                } else {
                    this.getDataWithTID(tid)
                }
            },
            deleteRes(rid) {
                this.$api.discovery.subdomainResultDelete(rid).then(res => {
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
            sendTargetToPocScanner(){
                let target = [];
                for (let i=0; i<this.items.length; i++) {
                    target.push(this.items[i]['subdomain'])
                }
                window.open("#/scanner/poc/new?target=" + target.join(","), "_bank")
            },
            sendTargetToWhatweb(){
                let target = [];
                for (let i=0; i<this.items.length; i++) {
                    target.push(this.items[i]['subdomain'])
                }
                window.open("#/discovery/whatweb?target=" + target.join(","), "_bank")
            },
            sendTargetToPortScanner(){
                let target = [];
                for (let i=0; i<this.items.length; i++) {
                    if (this.items[i]['ip'] !== "0.0.0.0" && this.items[i]['ip'] !== "127.0.0.1") {
                        target.push(this.items[i]['ip'])
                    }
                }
                window.open("#/discovery/port/new?target=" + target.join(","), "_bank")
            },
        }
    }
</script>

<style scoped>

</style>