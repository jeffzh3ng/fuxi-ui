<template>
  <d-container fluid class="main-content-container px-4 pb-4">
    <!-- Page Header -->
    <d-row no-gutters class="page-header py-4">
      <!-- Page Title -->
      <d-col col sm="4" class="text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">POC upload & Management</span>
        <h3 class="page-title">PoC Task List</h3>
      </d-col>
    </d-row>
    <div class="row">
      <div class="col">
        <div class="card card-small mb-4">
          <div class="card-header border-bottom">
            <Input suffix="ios-search" placeholder="Search" style="width: auto" />
          </div>
          <div class="card-body p-0 pb-3">
            <div>
              <Spin size="large" fix v-if="spinShow"></Spin>
              <table class="table mb-0">
                <thead class="bg-light">
                <tr>
                  <th scope="col" class="border-0 text-center">#</th>
                  <th scope="col" class="border-0">Task Name</th>
                  <th scope="col" class="border-0 text-center">Frequency</th>
                  <th scope="col" class="border-0 text-center">Status</th>
                  <th scope="col" class="border-0 text-center">Vul Count</th>
                  <th scope="col" class="border-0">Start Date</th>
                  <th scope="col" class="border-0">Last Modified</th>
                  <th scope="col" class="border-0 text-center">Action</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in taskItems">
                  <td class="text-center">{{ index + 1 }}</td>
                  <td>{{ item.name }}</td>
                  <td class="text-center">{{ item.freq | capitalize }}</td>
                  <td class="text-center">{{ item.status | capitalize }}</td>
                  <td class="text-center">{{ item.vul_count }}</td>
                  <td>{{ item.date }}</td>
                  <td>{{ item.end_date }}</td>
                  <td class="text-center">
                    <Tooltip placement="top" content="Trash" theme="light">
                      <Icon @click="deleteTask(item.tid)" title="delete poc" size="21" type="md-trash" />
                    </Tooltip>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
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
        </div>
      </div>
    </div>
  </d-container>
</template>

<script>
  export default {
    name: "PocScans",
    data() {
      return {
        spinShow: true,
        items: [],
        taskItems: [],
        pageSize: 10,
        pageCurrent: 1,
      }
    },
    mounted() {
      this.$axios.get("scanner/poc/tasks").then(response => {
        let res = response.data;
        if (res['status'] === 'success') {
          this.items = res['data'];
          let _start = ( this.pageCurrent - 1 ) * this.pageSize;
          let _end = this.pageCurrent * this.pageSize;
          this.taskItems = this.items.slice(_start,_end);
          this.spinShow = false;
        } else {
          this.$message.error(res['message'])
        }
      })
    },
    methods: {
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
      deleteTask(tid) {
        this.$Modal.confirm({
          title: 'WARNING',
          content: 'Are you sure you want to delete this item?',
          closable: true,
          okText: 'OK',
          cancelText: 'Cancel',
          onOk: () => {
            this.$axios.delete('scanner/poc/task/' + tid).then(response => {
              let res = response.data;
              if (res['status'] === 'success') {
                for (let i=0; i< this.items.length;i++){
                  if (this.items[i]['tid'] === tid) {
                    this.items.splice(i,1);
                  }
                }
                let _start = ( this.pageCurrent - 1 ) * this.pageSize;
                let _end = this.pageCurrent * this.pageSize;
                this.taskItems = this.items.slice(_start,_end);
                this.$message.success(res.message);
              } else {
                this.$message.error(res.message)
              }
            });
          },
          // onCancel: () => {
          //   this.$message.info('取消了删除');
          // }
        });
      },
    }
  }
</script>

<style scoped>

</style>
