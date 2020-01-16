<template>
    <d-container fluid class="main-content-container px-4 pb-4">
        <!-- Page Header -->
        <d-row no-gutters class="page-header py-4">
            <!-- Page Title -->
            <d-col col sm="4" class="text-center text-sm-left mb-4 mb-sm-0">
                <span class="text-uppercase page-subtitle">Online host</span>
                <h3 class="page-title">{{ taskName }} - {{onlineHostCount}}</h3>
            </d-col>
        </d-row>
        <div class="row">
            <div class="col">
                <div class="card card-small mb-4">
                    <div class="card-header border-bottom">
                        <Input
                                v-model="keyword"
                                @keyup.enter.native="searchRes"
                                suffix="ios-search"
                                placeholder="Search"
                                style="width: auto" />
                    </div>
                    <div class="card-body p-0 pb-3">
                        <div>
                            <Spin size="large" fix v-if="spinShow"/>
                            <table class="table mb-0">
                                <thead class="bg-light">
                                <tr>
                                    <th scope="col" class="border-0 text-center">#</th>
                                    <th scope="col" class="border-0">Task Name</th>
                                    <th scope="col" class="border-0">Host</th>
                                    <th scope="col" class="border-0">Hostname</th>
                                    <th scope="col" class="border-0">Open Port</th>
                                    <th scope="col" class="border-0">Date</th>
                                    <th scope="col" class="border-0 text-center">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item, index) in taskItems">
                                    <td >{{ index + 1 }}</td>
                                    <td ><span @click="getTaskDetail(item.tid)">{{ item.name | longText }}</span></td>
                                    <td ><span @click="getHostDetail(item.hid)" class="text-success">{{ item.host }}</span></td>
                                    <td >{{ item.hostname }}</td>
                                    <td >{{ item.port_str | longText }}</td>
                                    <td>{{ item.date }}</td>
                                    <td class="text-center">
                                        <Tooltip placement="left" content="Detail" theme="light">
                                            <Icon @click="getHostDetail(item.hid)" title="task detail" size="21" type="md-clipboard" class="mr-3" />
                                        </Tooltip>

                                        <Tooltip placement="top" content="Trash" theme="light">
                                            <Icon @click="deleteTask(item.hid)" title="delete" size="21" type="md-trash" />
                                        </Tooltip>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <Modal
                                :styles="{top: '20px'}"
                                footer-hide
                                width="700"
                                v-model="hostDetailModal"
                                title="Task detail">
                            <div>
                                <table id="host_detail_table">
                                    <div v-if="hostDetail.length===0">
                                        <h6  class="text-center mt-4">Not Found Open Port</h6>
                                        <br>
                                        <br>
                                    </div>
                                    <tr v-for="item in hostDetail">
                                        <td><span class="mr-3">{{item['host']}}</span></td>
                                        <td><span class="mr-3">{{item['hostname']}}</span></td>
                                        <td><span class="mr-3">{{item['port']}}</span></td>
                                        <td><span class="mr-3">{{item['name']}}</span></td>
<!--                                        <td><span class="mr-3">{{item['date']}}</span></td>-->
                                        <td><span class="mr-3">{{item['extrainfo']}}</span></td>
                                    </tr>
                                </table>
                            </div>
                        </Modal>
                        <Modal
                                :styles="{top: '20px'}"
                                footer-hide
                                width="700"
                                v-model="taskDetailModal"
                                title="Task detail">
                            <div>
                                <table id="task_detail_table">
                                    <tr>
                                        <td><strong class="mr-4">Task Name</strong></td>
                                        <td><span>{{taskDetail.name}}</span></td>
                                    </tr>
                                    <tr>
                                        <td><strong class="mr-4">Status</strong></td>
                                        <td><span>{{taskDetail.status}}</span></td>
                                    </tr>
                                    <tr>
                                        <td><strong class="mr-4">Owner</strong></td>
                                        <td><span>{{taskDetail.op}}</span></td>
                                    </tr>
                                    <tr>
                                        <td><strong class="mr-4">Online Host</strong></td>
                                        <td><span>{{taskDetail.online}}</span></td>
                                    </tr>
                                    <tr>
                                        <td><strong class="mr-4">Option</strong></td>
                                        <td><span>{{taskDetail.option}}</span></td>
                                    </tr>
                                    <tr>
                                        <td><strong class="mr-4">Port</strong></td>
                                        <td><span>{{taskDetail.port}}</span></td>
                                    </tr>
                                    <tr>
                                        <td><strong class="mr-4">Target</strong></td>
                                        <td><p>{{taskDetail.target}}</p></td>
                                    </tr>
                                    <tr>
                                        <td><strong class="mr-4">Last Modified</strong></td>
                                        <td><span>{{taskDetail.date}}</span></td>
                                    </tr>
                                    <tr>
                                        <td><strong class="mr-4">End date</strong></td>
                                        <td><span>{{taskDetail.end_date}}</span></td>
                                    </tr>
                                </table>
                            </div>
                        </Modal>
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
                    </div>
                </div>
            </div>
        </div>
    </d-container>
</template>

<script>
    export default {
        name: "OnlineHost",
        filters: {
            longText: function (value) {
                if (!value) return '';
                if (value.length > 30) {
                    return value.substring(0,30) + "..."
                } else {
                    return value
                }
            }
        },
        data() {
            return {
                reqApiPath: "/discovery/port/task/host",
                spinShow: true,
                items: [],
                taskItems: [],
                pageSize: 10,
                pageCurrent: 1,
                keyword: "",
                taskID: "",
                taskName: "",
                onlineHostCount: 0,
                hostDetail: [],
                taskDetail: {},
                hostDetailModal: false,
                taskDetailModal: false
            }
        },
        mounted() {
            this.taskID = this.$route.query.tid;
            this.getTaskName();
            this.getData()
        },
        methods: {
            getData() {
                this.$axios.get(this.reqApiPath + "/" + this.taskID).then(response => {
                    this.spinShow = false;
                    let status = response['data']['status'];
                    let data = response['data']['result'];
                    if (status['status'] === 'success') {
                        this.items = data;
                        let _start = ( this.pageCurrent - 1 ) * this.pageSize;
                        let _end = this.pageCurrent * this.pageSize;
                        this.taskItems = this.items.slice(_start,_end);
                        this.spinShow = false;
                    } else {
                        this.$message.error(status['message'])
                    }
                })
            },
            getHostDetail(hid) {
                this.hostDetailModal = true;
                this.$axios.get("/discovery/port/host/" + hid).then(response => {
                    let status = response['data']['status'];
                    let data = response['data']['result'];
                    if (status['status'] === 'success') {
                        this.hostDetail = data
                    } else {
                        this.$message.error(status['message'])
                    }
                })
            },
            getTaskDetail (tid) {
                this.$axios.get("/discovery/port/task/" + tid).then(response => {
                    let status = response['data']['status'];
                    let data = response['data']['result'];
                    this.taskDetailModal = true;
                    if (status['status'] === 'success') {
                        this.taskDetail = data;
                        if (data['port'].length === 0) {
                            this.taskDetail.port = 'default'
                        } else {
                            this.taskDetail.port = data['port'].join(", ");
                        }
                        this.taskDetail.target = data['target'].join(", ");
                    } else {
                        this.$message.error(status.message)
                    }
                });
            },
            getTaskName() {
                this.$axios.get("/discovery/port/task/" + this.taskID).then(response => {
                    let status = response['data']['status'];
                    let data = response['data']['result'];
                    if (status['status'] === 'success') {
                        this.taskName = data['name'];
                        this.onlineHostCount = data['online']
                    } else {
                        this.taskName = "Online Host";
                        this.$message.error(status['message'])
                    }
                })
            },
            getRowCount (items) {
                return items.length
            },
            pageChange(currentPage) {
                let _start = ( currentPage - 1 ) * this.pageSize;
                let _end = currentPage * this.pageSize;
                this.taskItems = this.items.slice(_start,_end);
                this.pageCurrent=currentPage;
            },
            sizeChange(index){
                this.pageSize = index;
                let _start = 0;
                let _end = this.pageSize;
                this.taskItems = this.items.slice(_start,_end);
            },
            deleteTask(hid) {
                this.$Modal.confirm({
                    title: 'WARNING',
                    content: 'Are you sure you want to delete this item?',
                    closable: true,
                    okText: 'OK',
                    cancelText: 'Cancel',
                    onOk: () => {
                        this.$axios.delete("/discovery/port/host/" + hid).then(response => {
                            let status = response['data']['status'];
                            if (status['status'] === 'success') {
                                this.getData()
                            } else {
                                this.$message.error(status.message)
                            }
                        });
                    },
                });
            },
            searchRes() {
                this.$axios.get(this.reqApiPath  + "/" + this.taskID + "?search=" + this.keyword).then(response => {
                    let status = response['data']['status'];
                    let data = response['data']['result'];
                    if (status['status'] === 'success') {
                        this.items = data;
                        let _start = ( this.pageCurrent - 1 ) * this.pageSize;
                        let _end = this.pageCurrent * this.pageSize;
                        this.taskItems = this.items.slice(_start,_end);
                        this.spinShow = false;
                    } else {
                        this.$message.error(status['message'])
                    }
                })
            },
        }
    }
</script>

<style scoped>
    #task_detail_table {
        font-size: 15px;
        border-collapse: separate;
        border-spacing: 5px 10px;
    }
    #host_detail_table {
        font-size: 13px;
        border-collapse: separate;
        border-spacing: 3px 8px;
    }
</style>
