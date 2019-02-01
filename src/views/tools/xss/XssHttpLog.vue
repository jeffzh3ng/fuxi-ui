<template>
  <div>
    <div>
      <Spin size="large" fix v-if="spinShow"></Spin>
      <p class="p-1"><strong><font size="1">数据接收方式</font></strong><code><font size="1">{{httpUsage}}</font></code></p>
      <Table :columns="columns" :data="httpLogItems">
        <template slot="action" slot-scope="{ row }">
          <Icon @click="deleteHttpLog(row.hid)" title="delete poc" size="15" type="md-trash" />
        </template>
      </Table>
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
            title: 'Refer',
            key: 'refer',
          },
          {
            title: 'IP',
            key: 'ip',
          },
          {
            title: 'Date',
            key: 'date',
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
          this.items = res['data'];
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
      }
    }
  }
</script>

<style scoped>

</style>
