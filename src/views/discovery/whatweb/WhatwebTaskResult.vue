<template>
    <div>
        <v-card-title>
            <v-list-item-action>
                <v-icon class="teal--text">mdi-clipboard-list-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content class="ml-n4">
                <v-list-item-title class="teal--text">
                    <span>TASK RESULT</span>
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
                <v-btn @click="exportResult(tid)" elevation="0" color="teal" class="ml-4 mr-8 mt-1">
                    <v-icon class="white--text mr-2">mdi-export</v-icon>
                    <span class="white--text">Export</span>
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
                    <template v-slot:item.target="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span class="teal--text" @click="showDetail(item)" v-on="on">{{item['target'] | long}}</span>
                            </template>
                            <span>{{item['target']}}</span>
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

                    <template v-slot:item.c_code="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <div v-on="on">
                                    <span v-if="item['c_code'] !== 'zz'" :class="'mr-2 flag-icon flag-icon-'+item['c_code']"/>
                                    <span v-else class="mr-2 flag-icon flag-icon-us"/>
                                </div>
                            </template>
                            <span>{{item['country']}}</span>
                        </v-tooltip>
                    </template>

                    <template v-slot:item.http_status="{ item }">
                        <v-btn  x-small elevation="0" :color="item['http_status'] === 200 ? 'success' : 'grey lighten-2'">
                            {{item['http_status']}}
                        </v-btn>
                    </template>

                    <template v-slot:item.action="{ item }">
                        <v-icon @click="showDetail(item)" class="teal--text mr-3">mdi-book-open-outline</v-icon>
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
        <v-dialog v-model="dataDialogOpen" width="650px">
            <v-card>
                <v-card-title>
                    <span class="headline teal--text">{{domainWebFP.domain}}</span>
                </v-card-title>
                <v-card-text>
                    <div class="mt-2">
                        <table>
                            <tr v-for="(item, index) in domainWebFP.fp" :key="index">
                                <td>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <div v-on="on">
                                                <span v-if="item['plugin'].length !== 0" class="subtitle-1 mr-8">{{item['plugin'] | long}}</span>
                                                <span v-else class="subtitle-1">-</span>
                                            </div>
                                        </template>
                                        <span>{{item['plugin']}}</span>
                                    </v-tooltip>
                                </td>
                                <td>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <div v-on="on">
                                                <span v-if="item['string'].length !== 0" class="subtitle-1">{{item['string'] | long}}</span>
                                                <span v-else class="subtitle-1">-</span>
                                            </div>
                                        </template>
                                        <span>{{item['string']}}</span>
                                    </v-tooltip>
                                </td>
                            </tr>
                        </table>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1 mr-4 mb-4" text @click="dataDialogOpen = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        name: "WhatwebTaskResult",
        data: () => ({
            spinShow: true,
            tid: "",
            items: [],
            pageCurrent: 1,
            pageSize: 10,
            search: "",
            selected: [],
            headers: [
                { text: 'Domain', value: 'target' },
                { text: 'Country', value: 'c_code' },
                { text: 'IP', value: 'ip' },
                { text: 'Response', value: 'http_status' },
                { text: 'Title', value: 'title' },
                { text: 'Date', value: 'date' },
                { text: 'Action', value: 'action' },
            ],
            deleteMultiDialog: false,
            dataDialogOpen: false,
            domainWebFP: {domain: "", fp: []},
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
                this.$api.discovery.whatwebTaskResult(tid).then(res => {
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
            deleteRes(rid) {
                this.$api.discovery.whatwebTaskResultDelete(rid).then(res => {
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
            showDetail(item) {
                this.dataDialogOpen = true;
                this.domainWebFP['domain'] = item['target'];
                this.domainWebFP['fp'] = item['fingerprint'];
            },
            exportResult(tid) {
                window.open(this.$api.SERVER_ADDER + "/discovery/whatweb/task/export/" + tid)
            }
        }
    }
</script>

<style scoped>

</style>