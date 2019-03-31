<template>
  <d-container fluid class="main-content-container px-4 pb-4">
    <!-- Page Header -->
    <d-row no-gutters class="page-header py-4">
      <!-- Page Title -->
      <d-col col sm="4" class="text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">Json Hijack Task List</span>
        <h3 class="page-title">Json Hijacker</h3>
      </d-col>
    </d-row>

    <div class="row">
      <div class="col">
        <div class="card card-small mb-4">
          <div class="card-header border-bottom">
            <Input
                class="mr-2"
                v-model="keyword"
                @keyup.enter.native="searchRes"
                suffix="ios-search"
                placeholder="Search"
                style="width: auto" />
            <Button @click="addTaskModal = true">
              <i class="material-icons">library_add</i>
              New Task
            </Button>
            <Modal
                v-model="addTaskModal"
                scrollable
                footer-hide
                title="New Json Hijack Task">
              <div>
                <d-form class="quick-post-form">
                  <div class="form-group">
                    <d-input v-model="taskDataValue.name" class="form-control" placeholder="Task name" />
                  </div>
                  <div class="form-group">
                    <d-textarea v-model="taskDataValue.path" class="form-control" placeholder="Hijacker path" />
                  </div>
                  <div class="form-group text-right">
                    <Button @click="newTask">
                      <i class="material-icons">library_add</i>
                      Submit
                    </Button>
                  </div>
                </d-form>
              </div>
            </Modal>
          </div>
          <div class="card-body p-0 pb-3">
            <div>
              <Spin size="large" fix v-if="spinShow"></Spin>
              <table class="table mb-0">
                <thead class="bg-light">
                <tr>
                  <th scope="col" class="border-0 text-center">#</th>
                  <th scope="col" class="border-0">Task Name</th>
                  <th scope="col" class="border-0 text-center">Site</th>
                  <th scope="col" class="border-0 text-center">Count</th>
                  <th scope="col" class="border-0 text-center">Link</th>
                  <th scope="col" class="border-0">Date</th>
                  <th scope="col" class="border-0 text-center">Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in taskItems">
                  <td class="text-center">{{ index + 1 }}</td>
                  <td><a
                      style="text-decoration:none;color:#42b983;"
                      @click="getTaskRes(item.tid)">{{ item.name }}</a></td>
                  <td>{{ item.target}}</td>
                  <td class="text-center">{{ item.count }}</td>
                  <td class="text-center">
                    <a
                        target="_blank"
                        style="text-decoration:none;font-weight:bold;"
                        :href="'/phishing/' + item.tid" >click</a>
                  </td>
                  <td>{{ item.date }}</td>
                  <td class="text-center">
                    <Tooltip placement="top" content="Trash" theme="light">
                      <Icon @click="deleteTask(item.tid)" title="delete poc" size="21" type="md-trash" />
                    </Tooltip>
                  </td>
                </tr>
                </tbody>
                <Modal
                    v-model="taskResModal"
                    scrollable
                    footer-hide
                    title="Json Hijack Result">
                  <div>
                    <div>
                      <Table :columns="columns" :data="taskTableData">
                      </Table>
                      <Page
                          class="p-2"
                          :total="getRowCount(resItems)"
                          show-elevator
                          show-total
                          show-sizer
                          :page-size="pageSize"
                          @on-page-size-change="resSizeChange"
                          @on-change="resPageChange"/>
                    </div>
                  </div>
                </Modal>
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
    name: "JsonHijacker",
    data() {
      return {
        spinShow: true,
        items: [],
        addTaskModal: false,
        taskResModal: false,
        taskItems: [],
        resItems: [],
        taskTableData: [],
        pageSize: 10,
        pageCurrent: 1,
        keyword: "",
        taskDataValue: {
          name: "",
          path: "",
        },
        columns: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              let res = params.row.res;
              if (res) {
                return h('div', {style:{marginLeft:'25px'}}, res)
              } else {
                return h('div', {style:{marginLeft:'25px'}}, "Null")
              }
            }
          },
          {
            title: 'Index',
            key: 'index',
            width: 70,
          },
          {
            title: 'IP',
            key: 'ip',
            width: 180,
          },
          {
            title: 'Date',
            key: 'date',
            width: 300,
          },
        ],
      }
    },
    mounted() {
      this.getTaskData()
    },
    methods: {
      getTaskData() {
        this.$axios.get("/tools/json/task").then(response => {
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
      getTaskResData(tid) {
        this.$axios.get("/tools/json/task/" + tid).then(response => {
          let res = response.data;
          if (res['status'] === 'success') {
            this.resItems = res['data'];
            let _start = ( this.pageCurrent - 1 ) * this.pageSize;
            let _end = this.pageCurrent * this.pageSize;
            this.taskTableData = this.resItems.slice(_start,_end);
          } else {
            this.$message.error(res['message'])
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
      resPageChange(currentPage) {
        let _start = ( currentPage - 1 ) * this.pageSize;
        let _end = currentPage * this.pageSize;
        this.taskTableData = this.resItems.slice(_start,_end);
        this.pageCurrent=currentPage;
      },
      resSizeChange(index){
        this.pageSize = index;
        let _start = 0;
        let _end = this.pageSize;
        this.taskTableData = this.resItems.slice(_start,_end);
      },
      newTask(){
        if (this.taskDataValue.name.length===0|| this.taskDataValue.path.length===0) {
          this.$message.error("Please check your input data");
          return
        }
        this.$axios.post("/tools/json/task", this.taskDataValue).then(response => {
          let res = response.data;
          if(res.status === "success") {
            this.$message.success(res['message']);
            this.taskDataValue = {
              name: "",
              path: "",
            };
            this.addTaskModal = false;
            this.getTaskData()
          } else {
            this.$message.error(res['message']);
            this.addTaskModal = false
          }
        });
        this.addTaskModal = false
      },
      getTaskRes(tid){
        this.taskResModal = true;
        this.getTaskResData(tid);
      },
      deleteTask(tid) {
        this.$Modal.confirm({
          title: 'WARNING',
          content: 'Are you sure you want to delete this item?',
          closable: true,
          okText: 'OK',
          cancelText: 'Cancel',
          onOk: () => {
            this.$axios.delete('/tools/json/task/' + tid).then(response => {
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
      searchRes() {
        this.$axios.get("/tools/json/search?filter_key=" + this.keyword).then(response => {
          let res = response.data;
          if (res['status'] === 'success') {
            this.items = res['data'];
            let _start = 0;
            let _end = this.pageCurrent * this.pageSize;
            this.taskItems = this.items.slice(_start,_end);
            this.spinShow = false;
          } else {
            this.$message.error(res['message'])
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
