<template>
  <d-container fluid class="main-content-container px-4 pb-4">
    <!-- Page Header -->
    <d-row no-gutters class="page-header py-4">
      <!-- Page Title -->
      <d-col col sm="4" class="text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">Discovery Tasks Management</span>
        <h3 class="page-title">Discovery</h3>
      </d-col>
    </d-row>
    <div class="row">
      <div class="col">
        <div class="card card-small mb-4">
          <div class="card-header border-bottom">
            <Input suffix="ios-search" placeholder="Search" class="mr-3" style="width: auto" />
            <Button @click="addTaskModal = true">
              <i class="material-icons">library_add</i>
              New Task
            </Button>
          </div>
          <Modal
              v-model="addTaskModal"
              scrollable
              footer-hide
              title="New Task">
            <div>
              <d-form>
                <Form label-position="left" :model="discoveryTaskData" ref="discoveryTaskData" :rules="ruleNewTaskValidate" :label-width="80">
                  <FormItem label="Name" prop="name">
                    <Input v-model="discoveryTaskData.name" placeholder="Enter your name"></Input>
                  </FormItem>
                  <FormItem label="Description" prop="desc">
                    <Input
                        v-model="discoveryTaskData.desc"
                        type="textarea"
                        :autosize="{minRows: 1,maxRows: 3}"
                        placeholder="Description"/>
                  </FormItem>
                  <FormItem label="Targets" prop="target">
                    <Input
                        v-model="discoveryTaskData.target"
                        type="textarea"
                        :autosize="{minRows: 2,maxRows: 5}"
                        placeholder="Enter target..."/>
                  </FormItem>
                  <FormItem label="Plugins" prop="plugin">
                    <CheckboxGroup v-model="discoveryPlugin">
                      <Checkbox label="  Subdomain Enumeration"></Checkbox>
                      <Checkbox label="  Network Port Scanner"></Checkbox>
                      <Checkbox label="  WEB Directory Scanner"></Checkbox>
                    </CheckboxGroup>
                  </FormItem>
                </Form>
                <br>
                <d-form-row>
                  <d-col md="12" class="form-group ">
                    <Button @click="newDiscoveryTask" type="primary" shape="circle"><i class="material-icons">near_me</i> Launch</Button>
                  </d-col>
                </d-form-row>
              </d-form>
            </div>
          </Modal>
          <div class="card-body p-0 pb-3">
            <div>
              <Spin size="large" fix v-if="spinShow"></Spin>
              <table class="table mb-0">
                <thead class="bg-light">
                <tr>
                  <th scope="col" class="border-0 text-center">#</th>
                  <th scope="col" class="border-0">Task Name</th>
                  <th scope="col" class="border-0 text-center">Plugin</th>
                  <th scope="col" class="border-0 text-center">Status</th>
                  <th scope="col" class="border-0">Start Date</th>
                  <th scope="col" class="border-0">Last Modified</th>
                  <th scope="col" class="border-0 text-center">Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in taskItems">
                  <td class="text-center">{{ index + 1 }}</td>
                  <td>{{ item.name }}</td>
                  <td class="text-center">
                    <Poptip word-wrap width="200" trigger="hover" :content="item.plugin | pluginShow">
                      <Tag color="success">Show</Tag>
                    </Poptip>
                  </td>
                  <td class="text-center">{{ item.status | capitalize }}</td>
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
    name: "DiscoveryTask",
    filters: {
      pluginShow: function (value) {
        if (!value) return '';
        return value.replace(/,/g, " ")
      }
    },
    data() {
      return {
        spinShow: true,
        items: [],
        taskItems: [],
        pageSize: 10,
        pageCurrent: 1,
        addTaskModal: false,
        discoveryPlugin: [],
        discoveryTaskData: {
          name: "",
          target: "",
          plugin: "",
          desc: "",
        },
        ruleNewTaskValidate: {
          name: [
            { required: true, message: 'The name cannot be empty', trigger: 'blur' }
          ],
          target: [
            { required: true, message: 'The target cannot be empty', trigger: 'blur' }
          ],
          plugin: [
            { required: true, message: 'The plugin cannot be empty', trigger: 'blur' }
          ],
        }
      }
    },
    mounted() {
      this.$axios.get("discovery/tasks").then(response => {
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
      newDiscoveryTask() {
        let plugins = [];
        for (let i=0; i< this.discoveryPlugin.length;i++){
          plugins.push(this.discoveryPlugin[i].replace(/ /g, ""))
        }
        this.discoveryTaskData['plugin'] = plugins.join(",");
        if (this.discoveryTaskData['name'].length !== 0 &&
          this.discoveryTaskData['target'].length !== 0 &&
          this.discoveryTaskData['plugin'].length !== 0) {
          this.$Modal.confirm({
            title: 'New Task',
            content: 'Are you sure to add a new task?',
            closable: true,
            okText: 'OK',
            cancelText: 'Cancel',
            onOk: () => {
              this.$axios.post("discovery/task", this.discoveryTaskData).then(response => {
                let res = response.data;
                if(res.status === "success") {
                  this.discoveryTaskData = {};
                  this.discoveryPlugin = [];
                  this.addTaskModal = false;
                  this.$message.success(res['message']);
                  this.$axios.get("discovery/tasks").then(response => {
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
                } else {
                  this.$message.error(res['message'])
                }
              })
            }
          });
        } else {
          this.$message.error(" Please check input data")
        }
      },
      deleteTask(tid) {
        this.$Modal.confirm({
          title: 'WARNING',
          content: 'Are you sure you want to delete this item?',
          closable: true,
          okText: 'OK',
          cancelText: 'Cancel',
          onOk: () => {
            this.$axios.delete('discovery/task/' + tid).then(response => {
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
