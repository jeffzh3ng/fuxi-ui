<template>
  <d-container fluid class="main-content-container px-4 pb-4">
    <!-- Page Header -->
    <d-row no-gutters class="page-header py-4">
      <!-- Page Title -->
      <d-col col sm="4" class="text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">POC scan result</span>
        <h3 class="page-title">Vulnerabilities</h3>
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
              <Spin size="large" fix v-if="spinShow"></Spin>
              <table class="table mb-0">
                <thead class="bg-light">
                <tr>
                  <th scope="col" class="border-0 text-center">#</th>
                  <th scope="col" class="border-0">PoC Name</th>
                  <th scope="col" class="border-0 text-center">Target</th>
                  <th scope="col" class="border-0 text-center">Task Name</th>
                  <th scope="col" class="border-0 text-center">Status</th>
                  <th scope="col" class="border-0 text-center">App</th>
                  <th scope="col" class="border-0">Date</th>
                  <th scope="col" class="border-0 text-center">Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in vulItems">
                  <td class="text-center">{{ index + 1 }}</td>
                  <td>
                    <Tooltip max-width="100" placement="top" :content="item.poc_name" theme="light">
                      {{ item.poc_name | longText }}
                    </Tooltip>
                  </td>
                  <td class="text-center">{{ item.target}}</td>
                  <td class="text-center">{{ item.task_name }}</td>
                  <td class="text-center">{{ item.status }}</td>
                  <td class="text-center">{{ item.app }}</td>
                  <td>{{ item.date }}</td>
                  <td class="text-center">
                    <Tooltip placement="top" content="Trash" theme="light">
                      <Icon @click="deleteVul(item.vid)" title="delete poc" size="21" type="md-trash" />
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
    name: "PocVulList",
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
        spinShow: true,
        items: [],
        vulItems: [],
        pageSize: 10,
        pageCurrent: 1,
        taskID: "",
        keyword: "",
      }
    },
    mounted() {
      this.taskID = this.$route.params.tid;
      let resource_url = "scanner/poc/vuls";
      if (this.taskID) {
        resource_url = "scanner/poc/vuls/filter?filter_type=task&filter_key=" + this.taskID;
      }
      this.$axios.get(resource_url).then(response => {
        let res = response.data;
        if (res['status'] === 'success') {
          this.items = res['data'];
          let _start = ( this.pageCurrent - 1 ) * this.pageSize;
          let _end = this.pageCurrent * this.pageSize;
          this.vulItems = this.items.slice(_start,_end);
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
        this.vulItems = this.items.slice(_start,_end);
        this.pageCurrent=currentPage;
      },
      sizeChange(index){
        this.pageSize = index;
        let _start = 0;
        let _end = this.pageSize;
        this.vulItems = this.items.slice(_start,_end);
      },
      deleteVul(tid) {
        this.$Modal.confirm({
          title: 'WARNING',
          content: 'Are you sure you want to delete this item?',
          closable: true,
          okText: 'OK',
          cancelText: 'Cancel',
          onOk: () => {
            this.$axios.delete('scanner/poc/vul/' + tid).then(response => {
              let res = response.data;
              if (res['status'] === 'success') {
                for (let i=0; i< this.items.length;i++){
                  if (this.items[i]['vid'] === tid) {
                    this.items.splice(i,1);
                  }
                }
                let _start = ( this.pageCurrent - 1 ) * this.pageSize;
                let _end = this.pageCurrent * this.pageSize;
                this.vulItems = this.items.slice(_start,_end);
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
        let resource_url = "scanner/poc/vuls/filter?filter_type=search&filter_key=" + this.keyword;
        if (this.taskID) {
          resource_url = "scanner/poc/vuls/filter?tid=" + this.taskID + "&filter_type=task_filter&filter_key=" + this.keyword
        }
        this.$axios.get(resource_url).then(response => {
          let res = response.data;
          if (res['status'] === 'success') {
            this.items = res['data'];
            let _start = 0;
            let _end = this.pageCurrent * this.pageSize;
            this.vulItems = this.items.slice(_start,_end);
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
