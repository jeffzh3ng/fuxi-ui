<template>
  <d-container fluid class="main-content-container px-4 pb-4">
    <!-- Page Header -->
    <d-row no-gutters class="page-header py-4">
      <!-- Page Title -->
      <d-col col sm="4" class="text-center text-sm-left mb-4 mb-sm-0">
        <h3 class="page-title">Network Port Scanner</h3>
      </d-col>
    </d-row>
    <d-row>
      <d-col lg="8">
        <d-card class="card-small mb-12">
          <!-- Card Header -->
          <d-card-header class="border-bottom">
            <h5 class="m-0">New scan</h5>
          </d-card-header>
          <br>
          <d-row class="justify-content-center">
            <d-col md="10" sm="10" lg="10">
              <Form
                  ref="formValidate"
                  label-position="left"
                  :label-width="100">
                <FormItem label="* Name" prop="name">
                  <Input v-model="newTaskData.taskName" placeholder="Enter task name"/>
                </FormItem>
                <FormItem label="* Target" prop="target">
                  <Input
                          type="textarea"
                          v-model="newTaskData.targetList"
                          :autosize="{minRows: 5,maxRows: 10}"
                          :placeholder=targetExampleText>
                  </Input>
                </FormItem>
                <FormItem label="* Port" prop="port">
                  <label>
                    <Select
                        style="width:200px"
                        @on-change="changePortSelect"
                        v-model="newTaskData.portSelect"
                        placeholder="Default">
                      <Option value="default">Default</Option>
                      <Option value="customize">Customize</Option>
                    </Select>
                  </label>
                  <Input
                          v-if=isCustomizePortList
                          class="pt-1"
                          v-model="newTaskData.portCustomizeList"
                          type="textarea"
                          :autosize="{minRows: 2,maxRows: 5}"
                          placeholder="Example: 22,23,80,8080,8081,6379 ..."/>
                </FormItem>
                <FormItem label="Options" prop="options">
                  <label>
                    <Select
                        style="width:150px"
                        v-model="newTaskData.optionID"
                        placeholder="Options">
                      <Option value="10001">Default</Option>
                      <Option value="10001">-sT -T4</Option>
                      <Option value="10002">-Pn</Option>
                    </Select>
                  </label>
                </FormItem>

                <FormItem>
                  <div class="text-right">
                    <d-button @click="createTask" size="sm" class="btn-accent ml-auto">
                      <i class="material-icons mr-1">add_box</i>
                      <strong>Save</strong>
                    </d-button>
                  </div>
                </FormItem>
              </Form>
            </d-col>
          </d-row>
        </d-card>
      </d-col>
      <d-col lg="4">

      </d-col>
    </d-row>
  </d-container>
</template>

<script>
  export default {
    name: "NewPortScan",
    data () {
      return {
        targetExampleText: "Example: \n192.168.1.1\n192.168.1.1/24\n192.168.100-200\nwww.example.com\n",
        isCustomizePortList: false,
        newTaskData: {
          taskName: "port_scan_" + this.getDateTime(),
          targetList: "",
          portSelect: "default",
          portCustomizeList: "",
          optionID: "10001"
        }

      }
    },
    mounted: function () {
    },
    methods: {
      changePortSelect(value){
        this.isCustomizePortList = value === "customize";
      },
      getDateTime() {
        let now = new Date();
        let year = now.getFullYear();       //年
        let month = now.getMonth() + 1;     //月
        let day = now.getDate();            //日
        let hh = now.getHours();            //时
        let mm = now.getMinutes();          //分
        let clock = year + "";
        if(month < 10)
          clock += "0";
        clock += month + "";
        if(day < 10)
          clock += "0";
        clock += day + "";
        if(hh < 10)
          clock += "0";
        clock += hh + "";
        if (mm < 10) clock += '0';
        clock += mm;
        return clock.toString();
      },
      createTask(){
        let port = [];
        if (this.newTaskData.portSelect !== "default") {
          port = this.newTaskData.portCustomizeList.split("\n").join(",");
        }
        let data = {
          name: this.newTaskData.taskName,
          target: this.newTaskData.targetList.split("\n").join(","),
          port: port,
          option: this.newTaskData.optionID
        };
        if (data['name'].length !== 0 && data['target'].length !== 0) {
          this.$Modal.confirm({
            title: 'CONFIRM',
            content: 'Are you sure to add a new scan task?',
            closable: true,
            okText: 'OK',
            cancelText: 'Cancel',
            onOk: () => {
              this.$axios.post("/discovery/port/task", data).then(response => {
                let status = response['data']['status'];
                if(status['status'] === "success") {
                  this.$message.success(status['message']);
                  this.$router.push('/discovery/port/tasks');
                } else {
                  this.$message.error(status['message'])
                }
              })
            }
          });
        } else {
          this.$message.error(" Please check input data")
        }
      },
    }
  }
</script>

<style>
</style>
