<template>
    <div>
        <d-button size="sm" class="btn-accent ml-auto ml-1">
            <i class="material-icons mr-1">library_add</i>
            <strong>New User</strong>
        </d-button>
        <table class="table mt-2">
            <thead class="bg-light">
                <tr>
                    <th scope="col" class="border-0 text-center">#</th>
                    <th scope="col" class="border-0">Name</th>
                    <th scope="col" class="border-0">Nick</th>
                    <th scope="col" class="border-0">Role</th>
                    <th scope="col" class="border-0">E-Mail</th>
                    <th scope="col" class="border-0">Date</th>
                    <th scope="col" class="border-0 text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in tableData">
                    <td class="text-center">{{ index + 1 }}</td>
                    <td>{{item['username']}}</td>
                    <td>{{item['nick']}}</td>
                    <td>{{item['role']}}</td>
                    <td>{{item['email']}}</td>
                    <td>{{item['date']}}</td>
                    <td class="text-center">
                        <Tooltip placement="top" content="Delete" theme="light">
                            <Icon class="mx-3" title="Delete" size="21" type="ios-trash" />
                        </Tooltip>
                    </td>
                </tr>
            </tbody>
        </table>
        <br>
        <Page
                class="mx-4"
                :total="getRowCount(items)"
                show-elevator
                show-total
                show-sizer
                :page-size="pageSize"
                @on-page-size-change="sizeChange"
                @on-change="pageChange"/>
    </div>
</template>

<script>
    export default {
        name: "AccountManage",
        data() {
            return {
                items: [],
                tableData: [],
                pageSize: 10,
                pageCurrent: 1,
                reqApiPath: "/settings/user",
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getRowCount(items) {
                return items.length
            },
            pageChange(currentPage) {
                let _start = (currentPage - 1) * this.pageSize;
                let _end = currentPage * this.pageSize;
                this.tableData = this.items.slice(_start, _end);
                this.pageCurrent = currentPage;
            },
            sizeChange(index) {
                this.pageSize = index;
                let _start = 0;
                let _end = this.pageSize;
                this.tableData = this.items.slice(_start, _end);
            },
            getData() {
                this.$axios.get(this.reqApiPath).then(response => {
                    let status = response['data']['status'];
                    let data = response['data']['result'];
                    if (status['status'] === 'success') {
                        this.items = data;
                        let _start = (this.pageCurrent - 1) * this.pageSize;
                        let _end = this.pageCurrent * this.pageSize;
                        this.tableData = this.items.slice(_start, _end);
                        this.spinShow = false
                    } else {
                        this.$message.error(status['message']);
                        this.spinShow = false
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>