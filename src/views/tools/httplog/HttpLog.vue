<template>
  <d-container fluid class="main-content-container px-4 pb-4">
    <!-- Page Header -->
    <d-row no-gutters class="page-header py-4">
      <!-- Page Title -->
      <d-col col sm="4" class="text-center text-sm-left mb-4 mb-sm-0">
        <!--<span class="text-uppercase page-subtitle">The record is only saved for 48 hours </span>-->
        <h3 class="page-title">HTTP Request</h3>
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
                placeholder="Search" style="width: auto" class="mr-3" />
            <p class="p-2"><strong><font size="1">Example:</font></strong><code><font size="1">{{httpUsage}}</font></code></p>
            <div>
              <Spin size="large" fix v-if="spinShow"></Spin>
              <Table :columns="columns" :data="httpLogItems">
                <template slot="action" slot-scope="{ row }">
                  <Icon @click="deleteHttpLog(row.hid)" title="delete poc" size="15" type="md-trash" />
                </template>
              </Table>
            </div>
          </div>

          <Page
              class="p-2"
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
  </d-container>
</template>

<script>
  export default {
    name: "XssHttpLog",
    data() {
      return {
        spinShow: true,
        items: [],
        httpLogItems: [],
        pageSize: 10,
        pageCurrent: 1,
        keyword: "",
        httpUsage: "http://" + window.location.host + "/http?data=your_data",
        columns: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              let data = params.row.data;
              if (data) {
                return h('div', {style:{marginLeft:'25px'}}, data)
              } else {
                return h('div', {style:{marginLeft:'25px'}}, "Null")
              }
            }
          },
          {
            title: 'IP',
            key: 'ip',
            width: 200,
          },
          {
            title: 'Content',
            key: 'new_data',
          },
          {
            title: 'Date',
            key: 'date',
            width: 200,
          },
          {
            title: 'Action',
            slot: 'action',
            width: 150,
            align: 'center'
          }
        ],
      }
    },
    mounted() {
      this.$axios.get("tools/xss/httplog").then(response => {
        let res = response.data;
        if (res['status'] === 'success') {
          // this.items = res['data'];
          for (let i=0; i<res['data'].length; i++) {
            res['data'][i]['new_data'] = res['data'][i]['data'].substring(0, 60) + "...";
            this.items.push(res['data'][i])
          }
          let _start = ( this.pageCurrent - 1 ) * this.pageSize;
          let _end = this.pageCurrent * this.pageSize;
          this.httpLogItems = this.items.slice(_start,_end);
          this.spinShow = false;
        } else {
          this.$message.error(res['message']);
          this.spinShow = false;
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
        this.httpLogItems = this.items.slice(_start,_end);
        this.pageCurrent=currentPage;
      },
      sizeChange(index){
        this.pageSize = index;
        let _start = 0;
        let _end = this.pageSize;
        this.httpLogItems = this.items.slice(_start,_end);
      },
      deleteHttpLog(hid){
        this.$axios.delete('tools/xss/httplog/' + hid).then(response => {
          let res = response.data;
          if (res['status'] === 'success') {
            for (let i=0; i< this.items.length;i++){
              if (this.items[i]['hid'] === hid) {
                this.items.splice(i,1);
              }
            }
            let _start = ( this.pageCurrent - 1 ) * this.pageSize;
            let _end = this.pageCurrent * this.pageSize;
            this.httpLogItems = this.items.slice(_start,_end);
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message)
          }
        });
      },
      searchRes() {
        this.spinShow = true;
        this.items = [];
        this.httpLogItems = [];
        this.$axios.get("tools/xss/httplog/search?filter_key=" + this.keyword).then(response => {
          let res = response.data;
          if (res['status'] === 'success') {
            this.items = res['data'];
            let _start = 0;
            let _end = this.pageCurrent * this.pageSize;
            this.httpLogItems = this.items.slice(_start,_end);
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
