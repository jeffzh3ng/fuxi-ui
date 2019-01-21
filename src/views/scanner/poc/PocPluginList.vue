<template>
  <d-container fluid class="main-content-container px-4 pb-4">
    <!-- Page Header -->
    <d-row no-gutters class="page-header py-4">
      <!-- Page Title -->
      <d-col col sm="4" class="text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">POC upload & Management</span>
        <h3 class="page-title">PoC List</h3>
      </d-col>
    </d-row>
    <div class="row">
      <div class="col">
        <div class="card card-small mb-4">
          <div class="card-header border-bottom">
            <Input suffix="ios-search" placeholder="Search" style="width: auto" class="mr-3" />
            <Button @click="addPocModal = true">
              <i class="material-icons">library_add</i>
              New PoC
            </Button>
          </div>
          <Modal
              v-model="addPocModal"
              draggable
              scrollable
              footer-hide
              title="New PoC">
            <div>
              <Upload
                  multiple
                  :on-error="uploadPocFailed"
                  :on-success="uploadPocSuccess"
                  type="drag"
                  :action="upload_api">
                <div style="padding: 20px 0">
                  <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                  <p>Click or drag pocs here to upload</p>
                </div>
              </Upload>
            </div>
          </Modal>
          <div class="card-body p-0 pb-3">
              <div>
                <Spin size="large" fix v-if="spinShow"></Spin>
                <table class="table mb-0">
                  <thead class="bg-light">
                  <tr>
                    <th scope="col" class="border-0 text-center">#</th>
                    <th scope="col" class="border-0">PoC Name</th>
                    <th scope="col" class="border-0">Type</th>
                    <th scope="col" class="border-0">Author</th>
                    <th scope="col" class="border-0">Date</th>
                    <th scope="col" class="border-0 text-center">Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item, index) in pluginItems">
                    <td class="text-center">{{ index + 1 }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.type }}</td>
                    <td>{{ item.author }}</td>
                    <td>{{ item.date }}</td>
                    <td class="text-center">
                      <Tooltip placement="top" content="Get detail" theme="light">
                        <Icon @click="getPocDetail(item.pid)" title="get code" size="21" type="md-code" class="mr-2" />
                      </Tooltip>
                      <Tooltip placement="top" content="Delete" theme="light">
                        <Icon @click="deletePoC(item.pid)" title="delete poc" size="21" type="md-trash" />
                      </Tooltip>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <Modal
                    :styles="{top: '20px'}"
                    footer-hide
                    width="700"
                    v-model="getPocCodeModal"
                    :title="pocDetail.filename">
                  <div>
                    <pre v-highlightjs="pocDetail.poc"><code class="python"></code></pre>
                  </div>
                </Modal>
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
  import 'highlight.js/styles/a11y-light.css'
  import Vue from 'vue'
  import VueHighlightJS from 'vue-highlightjs'
  Vue.use(VueHighlightJS);

  export default {
    name: "PocPluginList",
    data() {
      return {
        spinShow: true,
        items: [],
        pluginItems: [],
        pageSize: 10,
        pageCurrent: 1,
        addPocModal: false,
        getPocCodeModal: false,
        pocDetail: "",
        upload_api: this.apiPath + "/scanner/poc/upload"
      }
    },
    mounted() {
      this.$axios.get("scanner/poc/plugins").then(response => {
        let resPlugin = response.data;
        if (resPlugin['status'] === 'success') {
          this.items = resPlugin['data'];
          let _start = ( this.pageCurrent - 1 ) * this.pageSize;
          let _end = this.pageCurrent * this.pageSize;
          this.pluginItems = this.items.slice(_start,_end);
          this.spinShow = false;
        } else {
          this.$message.error(resPlugin['message'])
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
        this.pluginItems = this.items.slice(_start,_end);
        this.pageCurrent=currentPage;
      },
      sizeChange(index){
        this.pageSize = index;
        let _start = 0;
        let _end = this.pageSize;
        this.pluginItems = this.items.slice(_start,_end);
      },
      uploadPocFailed(Error, file, fileList) {
        let filename = fileList['name'];
        this.$message.error("Failed to upload: " + filename)
      },
      uploadPocSuccess() {
        this.$axios.get("scanner/poc/plugins").then(response => {
          let resPlugin = response.data;
          if (resPlugin['status'] === 'success') {
            this.items = [];
            this.items = resPlugin['data'];
          } else {
            this.$message.error(resPlugin['message'])
          }
        })
      },
      deletePoC(pid) {
        this.$axios.delete('scanner/poc/plugin/' + pid).then(response => {
          let resDeleteRes = response.data;
          if (resDeleteRes['status'] === 'success') {
            for (let i=0; i< this.items.length;i++){
              if (this.items[i]['pid'] === pid) {
                this.items.splice(i,1);
              }
            }
            let _start = ( this.pageCurrent - 1 ) * this.pageSize;
            let _end = this.pageCurrent * this.pageSize;
            this.pluginItems = this.items.slice(_start,_end);
            this.$message.success(resDeleteRes.message);
          } else {
            this.$message.error(resDeleteRes.message)
          }
        });
      },
      getPocDetail (pid) {
        this.$axios.get('scanner/poc/plugin/' + pid).then(response => {
          let res = response.data;
          if (res['status'] === 'success') {
            this.pocDetail = res['data'];
            this.getPocCodeModal = true
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
