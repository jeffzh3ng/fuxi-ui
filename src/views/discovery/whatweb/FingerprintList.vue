<template>
    <div>
        <d-row class="border-bottom py-3 ">
            <d-col col sm="4" class="d-flex">
                <Input @keyup.enter.native="resultFilter()" v-model="filterData.filterKeyword">
                    <Select v-model="filterData.selectData" slot="prepend" style="width: 80px">
                        <Option value="domain">Domain</Option>
                        <Option value="ip">IP</Option>
                        <Option value="app">APP</Option>
                    </Select>
                </Input>
            </d-col>
            <d-col col sm="2" class="d-flex">
                <Input @keyup.enter.native="resultFilter()" v-if="filterData.selectData==='app'" v-model="filterData.filterKeyword2" placeholder="Version: Default: all"/>
            </d-col>
            <d-col col sm="6">
                <d-button @click="getTask()" size="sm" class="d-flex btn-white ml-auto mr-auto ml-sm-auto mr-sm-0 mt-3 mt-sm-0">
                    View Historical Tasks &rarr;
                </d-button>
            </d-col>
            <Modal footer-hide
                    width="1000"
                    v-model="openTaskModal"
                    title="WhatWeb Online Scan">
                <div>
                    <table class="table mb-0">
                        <thead class="bg-light">
                        <tr>
                            <th scope="col" class="border-0 text-center">#</th>
                            <th scope="col" class="border-0">Task Name</th>
                            <th scope="col" class="border-0">Status</th>
                            <th scope="col" class="border-0 text-center">Target</th>
                            <th scope="col" class="border-0 text-center">Level</th>
                            <th scope="col" class="border-0">Last Modified</th>
                            <th scope="col" class="border-0">End Date</th>
                            <th scope="col" class="border-0 text-center">OP</th></tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in taskTableData">
                                <td class="text-center">{{ index + 1 }}</td>
                                <td>
                                    <Tooltip placement="top">
                                        {{ item.name }}
                                        <div slot="content">
                                            <p v-for="target in item.target">{{target}}</p>
                                        </div>
                                    </Tooltip>
                                </td>
                                <td class="text-center">{{ item.status }}</td>
                                <td class="text-center">
                                    <Tooltip placement="top">
                                        {{ item.target_count }}
                                        <div slot="content">
                                            <p v-for="target in item.target">{{target}}</p>
                                        </div>
                                    </Tooltip>
                                </td>
                                <td class="text-center">{{ item.level }}</td>
                                <td>{{ item.date }}</td>
                                <td>{{ item.end_date }}</td>
                                <td class="text-center">{{ item.op }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if="taskItems.length===0">
                        <h6  class="text-center mt-4">No Data</h6>
                        <br>
                    </div>
                    <Page
                            class="mx-4 mt-3"
                            :total="getRowCount(taskItems)"
                            show-elevator
                            show-total
                            show-sizer
                            :page-size="taskPageSize"
                            @on-page-size-change="sizeTaskChange"
                            @on-change="pageTaskChange"/>
                </div>
            </Modal>
        </d-row>
        <d-row class="border-bottom py-2" name="top">
            <d-col col sm="2" class="d-flex mt-3 mb-sm-0">
                <div>
                    <table id="task_detail_table">
                        <tr>
                            <td>
                                <span class="text-muted fingerprint-ip-span">
                                    <strong><i class="material-icons mr-1">language</i>TOTAL</strong>
                                </span>
                            </td>
                            <td>
                                <span class="fingerprint-ip-span ml-4">
                                    {{getRowCount(items)}}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span class="text-muted fingerprint-ip-span">
                                    <strong><i class="material-icons mr-1">language</i>SERVER</strong>
                                </span>
                            </td>
                            <td>
                                <span class="fingerprint-ip-span ml-4">
                                    {{getRowCount(items)}}
                                </span>
                            </td>
                        </tr>

                    </table>
                    <br>
                    <div>
                        <d-button size="sm" class="btn-white ml-auto">
                            <i class="material-icons mr-1">save_alt</i>
                            <strong>Export XLS</strong>
                        </d-button>
                    </div>
                </div>
            </d-col>
            <d-col col sm="10">
                <div  v-for="item in tableData">
                    <div class="mt-3">
                        <h5>
                            <span class="text-fiord-blue"><strong>{{item['domain']}}</strong></span>
                            <span class="ml-4" v-if="item.title.length !== 0">{{item['title']}}</span>
                        </h5>
                        <span class="text-muted fingerprint-ip-span">
                            <strong><i class="material-icons mr-1">language</i>{{item['ip']}}</strong>
                        </span><br>
                        <span v-if="item.c_code !== 'zz'" :class="'mr-2 flag-icon flag-icon-'+item.c_code"/><span>{{item['country']}}</span><br>
                        <span class="text-muted">Added on {{item['date']}}</span><br>
                        <d-row class="ml-2 mt-2">
                            <d-col col sm="6">
                                <Tag class="mr-3" color="blue"  v-for="i in item.fingerprint" :key="i.plugin" :name="i.plugin">
                                    <span v-if="i['string'].length === 0">{{i['plugin']}}</span>
                                    <span v-else>{{i['plugin']}} [{{i['string']}}]</span>
                                </Tag>
                            </d-col>
                            <d-col col sm="6">
                                <span class="text-muted fingerprint-ip-span"><strong>Request:</strong></span>
                                <p>{{item['request']}}</p>
                            </d-col>
                        </d-row>
                        <br>
                        <hr class="mt-4">
                    </div>
                </div>
                <div v-if="items.length===0">
                    <h6  class="text-center mt-4">No Data</h6>
                    <br>
                </div>
                <Page
                        class="mx-4 mt-3"
                        :total="getRowCount(items)"
                        show-elevator
                        show-total
                        show-sizer
                        :page-size="pageSize"
                        @on-page-size-change="sizeChange"
                        @on-change="pageChange"/>
            </d-col>
        </d-row>
    </div>
</template>

<script>
    export default {
        name: "FingerprintList",
        data() {
            return {
                reqApiPath: "discovery/fp/search",
                spinShow: true,
                items: [],
                taskItems: [],
                taskTableData: [],
                tableData: [],
                taskPageSize: 10,
                taskPageCurrent: 1,
                pageSize: 10,
                pageCurrent: 1,
                openTaskModal: false,
                filterData: {
                    selectData: "domain",
                    filterKeyword: "",
                    filterKeyword2: "",
                }
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData() {
                this.$axios.get(this.reqApiPath).then(response => {
                    let status = response['data']['status'];
                    let data = response['data']['result'];
                    if (status['status'] === 'success') {
                        this.items = data;
                        let _start = ( this.pageCurrent - 1 ) * this.pageSize;
                        let _end = this.pageCurrent * this.pageSize;
                        this.tableData = this.items.slice(_start,_end);
                        console.log(this.tableData);
                        this.spinShow = false
                    } else {
                        this.$message.error(status['message']);
                        this.spinShow = false
                    }
                });
            },
            getRowCount (items) {
                return items.length
            },
            pageTaskChange(currentPage) {
                let _start = ( currentPage - 1 ) * this.taskPageSize;
                let _end = currentPage * this.taskPageSize;
                this.taskTableData = this.taskItems.slice(_start,_end);
                this.taskPageCurrent=currentPage;
                window.scrollTo(0,0)
            },
            sizeTaskChange(index){
                this.taskPageSize = index;
                let _start = 0;
                let _end = this.taskPageSize;
                this.taskTableData = this.taskItems.slice(_start,_end);
            },
            pageChange(currentPage) {
                let _start = ( currentPage - 1 ) * this.pageSize;
                let _end = currentPage * this.pageSize;
                this.tableData = this.items.slice(_start,_end);
                this.pageCurrent =currentPage;
                window.scrollTo(0,0)
            },
            sizeChange(index){
                this.pageSize = index;
                let _start = 0;
                let _end = this.pageSize;
                this.tableData = this.items.slice(_start,_end);
            },
            getTask() {
                this.openTaskModal = true;
                this.$axios.get("discovery/whatweb/task").then(response => {
                    let status = response['data']['status'];
                    let data = response['data']['result'];
                    if (status['status'] === 'success') {
                        this.taskItems = data;
                        for(let i=0;i<this.taskItems.length;i++) {
                            this.taskItems[i]['target_count'] = this.taskItems[i]['target'].length;
                        }
                        let _start = ( this.pageCurrent - 1 ) * this.pageSize;
                        let _end = this.pageCurrent * this.pageSize;
                        this.taskTableData = this.taskItems.slice(_start,_end);
                        this.spinShow = false
                    } else {
                        this.$message.error(status['message']);
                        this.spinShow = false
                    }
                });
            },
            resultFilter() {
                console.log(this.filterData);
                let url = this.reqApiPath;
                if(this.filterData.filterKeyword2.length === 0) {
                    url = this.reqApiPath + "?keyword=" + this.filterData.selectData + "&value=" + this.filterData.filterKeyword
                } else {
                    url = this.reqApiPath + "?keyword=" + this.filterData.selectData + "&value=" + this.filterData.filterKeyword + "||" + this.filterData.filterKeyword2
                }
                this.$axios.get(url).then(response => {
                    let status = response['data']['status'];
                    let data = response['data']['result'];
                    if (status['status'] === 'success') {
                        this.items = data;
                        let _start = ( this.pageCurrent - 1 ) * this.pageSize;
                        let _end = this.pageCurrent * this.pageSize;
                        this.tableData = this.items.slice(_start,_end);
                        this.spinShow = false;
                        this.$message.info("Filtration completed");
                    } else {
                        this.$message.error(status['message']);
                        this.spinShow = false
                    }
                });
                // this.filterData.filterKeyword = "";
                // this.filterData.filterKeyword2 = ""
            }
        }
    }
</script>

<style scoped>
    .fingerprint-ip-span{
        font-size: 15px;
        color: #3D5170;
    }

</style>