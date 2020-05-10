<template>
    <div>
        <v-card-title>
            <v-list-item-action>
                <v-icon class="teal--text">mdi-clipboard-list-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content class="ml-n4">
                <v-list-item-title class="teal--text">
                    <span>POC PLUGIN MANAGEMENT</span>
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
                        :nudge-width="300"
                        offset-x
                        transition="slide-x-transition"
                        bottom
                >
                    <template v-slot:activator="{ on }">
                        <v-btn elevation="0" v-on="on"  class="ml-4 mr-4">
                            <span>New Plugin</span>
                        </v-btn>
                    </template>
                    <v-card>
                        <v-col cols="12">
                            <v-file-input class="ml-4 mr-4 mt-2"
                                          multiple
                                          v-model="pocFiles"
                                          label="Click here to select plugin file">
                            </v-file-input>
                            <v-btn small @click="uploadPlugin" color="teal" class="ml-6 mr-4 mb-2">
                                <span class="white--text">Upload</span>
                            </v-btn>
                        </v-col>
                    </v-card>
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
                        loading-text="Loading... Please wait"
                        :search="search"
                        show-select
                        v-model="selected"
                        no-data-text=""
                >
                    <template v-slot:item.name="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span class="teal--text" @click="getPluginVul(item['pid'])" v-on="on">{{item.name | long}}</span>
                            </template>
                            <span>{{item.name}}</span>
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
                                    <v-list-item @click="pluginCode(item['pid'])">
                                        <v-list-item-action>
                                            <v-icon>mdi-alpha-c-circle-outline</v-icon>
                                        </v-list-item-action>
                                        <v-list-item-content class="ml-n4 mr-4">
                                            <v-list-item-title>
                                                <span>Code</span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-list-item @click="deletePlugin(item['pid'])">
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
        <v-dialog v-model="codeDialogOpen" width="800px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{pluginCodeData.name}}</span>
                </v-card-title>
                <v-card-text>
                    <pre>{{pluginCodeData.code}}</pre>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="codeDialogOpen = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        name: "PocPluginManagement",
        data: () => ({
            spinShow: true,
            pocFiles: null,
            items: [],
            pageCurrent: 1,
            pageSize: 10,
            search: "",
            selected: [],
            headers: [
                { text: 'Plugin Name', value: 'name' },
                { text: 'Type', value: 'type' },
                { text: 'APP', value: 'app' },
                { text: 'Date', value: 'date' },
                { text: 'OP', value: 'op' },
                { text: 'Action', value: 'action' },
            ],
            deleteMultiDialog: false,
            codeDialogOpen: false,
            pluginCodeData: {name: "", code: ""},
        }),
        mounted() {
            this.getData();
            this.spinShow = false
        },
        methods: {
            getData() {
                this.$api.scanner.pocPluginList().then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if(status['status'] === "success") {
                        this.items = result;
                    } else {
                        this.$message.error(status['message']);
                    }
                })
            },
            deletePlugin(tid) {
                this.$api.scanner.pocPluginDelete(tid).then(res => {
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
            pluginCode(pid) {
                this.pluginCodeData.name = "Loading";
                this.pluginCodeData.code = "";

                this.$api.scanner.pocPluginCode(pid).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    this.codeDialogOpen = true;
                    if(status['status'] === "success") {
                        this.pluginCodeData.name = result['name'];
                        this.pluginCodeData.code = result['poc'];
                    } else {
                        this.$message.error(status['message']);
                    }
                })
            },
            uploadPlugin() {
                if (!this.pocFiles) {
                    this.$message.error("please select plugin files");
                    return
                }
                for (let i=0; i<this.pocFiles.length; i++) {
                    let formData = new FormData();
                    formData.append('file', this.pocFiles[i]);
                    this.$api.scanner.pocPluginUpload(formData).then(res => {
                        let response = res.data;
                        let status = response['status'];
                        if(status['status'] === "success") {
                            this.$message.success(status['message']);
                        } else {
                            this.$message.error(status['message']);
                        }
                        this.getData();
                    })
                }
                this.pocFiles = null
            },
            getPluginVul(tid){
                window.open('#/scanner/poc/vul?pid=' + tid, "_blank");
            },
        }
    }
</script>

<style scoped>

</style>