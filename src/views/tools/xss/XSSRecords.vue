<template>
  <div>
    <Button @click="openNewProjectModal = true" size="small">New project</Button>
    <Modal
        v-model="openNewProjectModal"
        scrollable
        footer-hide
        title="New Project">
      <div>
        <d-row>
          <d-col lg="12" md="12" sm="12">
            <span>Project Name</span>
            <Input v-model="newProjectValue.name" class="pt-1" placeholder="Enter something..."/>
          </d-col>
          <d-col class="pt-2"  lg="12" md="12" sm="12">
            <span>Payload</span>
            <Select v-model="newProjectValue.payload" filterable>
              <Option v-for="item in payloadItems" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </d-col>
          <d-col class="pt-4 text-right" lg="12" md="12" sm="12">
            <Button @click="newXSSProject">
              <i class="material-icons mr-1">add_box</i>
              Submit
            </Button>
          </d-col>
        </d-row>
      </div>
    </Modal>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <table class="table mt-2">
      <thead class="bg-light">
      <tr>
        <th scope="col" class="border-0 text-center"><font size="2">#</font></th>
        <th scope="col" class="border-0"><font size="2">Name</font></th>
        <th scope="col" class="border-0"><font size="2">Payload</font></th>
        <th scope="col" class="border-0"><font size="2">Path</font></th>
        <th scope="col" class="border-0"><font size="2">Req</font></th>
        <th scope="col" class="border-0"><font size="2">Date</font></th>
        <th scope="col" class="border-0 text-center"><font size="2">Actions</font></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in tableData">
        <td class="text-center">{{ index + 1 }}</td>
        <td><a
            style="text-decoration:none;color:#42b983;"
            @click="openProjectRes(item.name, item.path)">{{ item.name }}</a></td>
        <td>{{ item.payload_name }}</td>
        <td>
          <span @click="openJsPath(item.path)">
            sdas
          </span>
        </td>
        <td>{{ item.count }}</td>
        <td>{{ item.date }}</td>
        <td class="text-center">
          <Tooltip placement="top" content="Trash" theme="light">
            <Icon @click="deleteProject(item.id)" title="delete poc" size="21" type="md-trash" />
          </Tooltip>
        </td>
      </tr>
      </tbody>
      <Modal
          v-model="openProjectResModal"
          scrollable
          footer-hide
          title="Result">
        <div>
          sss
        </div>
      </Modal>
    </table>
    <div v-if="items.length === 0">
      <d-row>
        <d-col lg="12" md="12" sm="12">
          <h6 class="text-center pt-1">No data</h6>
        </d-col>
      </d-row>
    </div>
    <Page
        class="p-1 mx-3"
        size="small"
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
    name: "XSSRecords",
    data() {
      return {
        spinShow: true,
        items: [],
        tableData: [],
        payloadItems: [],
        pageSize: 10,
        pageCurrent: 1,
        reqApiPath: "/tools/xss/projects",
        reqPayloadApiPath: "/tools/xss/payloads",
        openNewProjectModal: false,
        openProjectResModal: false,
        newProjectValue: {
          name: "",
          payload: "",
        }
      }
    },
    mounted() {
      this.getData();
      this.getPayloadData()
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
          let res = response.data;
          if (res['status'] === 'success') {
            this.items = res['data'];
            let _start = (this.pageCurrent - 1) * this.pageSize;
            let _end = this.pageCurrent * this.pageSize;
            this.tableData = this.items.slice(_start, _end);
            this.spinShow = false
          } else {
            this.$message.error(res['message']);
            this.spinShow = false
          }
        })
      },
      getPayloadData() {
        this.$axios.get(this.reqPayloadApiPath).then(response => {
          let res = response.data;
          if (res['status'] === 'success') {
            this.payloadItems = res['data'];
          } else {
            this.$message.error(res['message']);
          }
        })
      },
      newXSSProject(){
        if (this.newProjectValue.name.length===0||this.newProjectValue.payload.length===0) {
          return
        }
        this.$axios.post("/tools/xss/project", this.newProjectValue).then(response => {
          let res = response.data;
          if (res['status'] === 'success') {
            this.$message.success(res['message']);
            this.openNewProjectModal = false;
            this.newProjectValue.name = "";
            this.newProjectValue.payload = "";
            this.getData();
          } else {
            this.$message.error(res['message']);
            this.openNewProjectModal = false;
            this.getData()
          }
        })
      },
      openJsPath(path){
        window.open("http://" + window.location.host + "/x/" + path)
      },
      deleteProject(pid) {
        this.$Modal.confirm({
          title: 'WARNING',
          content: 'Are you sure you want to delete this item?',
          closable: true,
          okText: 'OK',
          cancelText: 'Cancel',
          onOk: () => {
            this.$axios.delete("/tools/xss/project/" + pid).then(response => {
              let res = response.data;
              if (res['status'] === 'success') {
                this.$message.success(res['message']);
                this.getData()
              } else {
                this.$message.error(res['message']);
                this.getData()
              }
            })
          }});
      },
      openProjectRes(task, salt) {
        window.open('#/tools/xss/data?salt=' + salt + "&task="+ task);
      }
    }
  }
</script>

<style scoped>

</style>
