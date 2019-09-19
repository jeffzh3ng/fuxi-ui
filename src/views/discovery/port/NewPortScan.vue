<template>
  <d-container fluid class="main-content-container px-4 pb-4">
    <!-- Page Header -->
    <d-row no-gutters class="page-header py-4">
      <!-- Page Title -->
      <d-col col sm="4" class="text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">New Scan</span>
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
                <FormItem label="Name" prop="name">
                  <Input v-model="newTaskData.taskName" placeholder="Enter task name"></Input>
                </FormItem>
                <FormItem label="Target" prop="target">
                  <Input
                      type="textarea"
                      v-model="newTaskData.targetList"
                      :autosize="{minRows: 5,maxRows: 10}"
                      placeholder="Enter target.."></Input>
                </FormItem>
                <FormItem label="Port" prop="port">
                  <Select
                      style="width:200px"
                      @on-change="changePortSelect"
                      v-model="newTaskData.portSelect"
                      placeholder="Default">
                    <Option value="default">Default</Option>
                    <Option value="customize">Customize</Option>
                  </Select>
                  <Input
                      v-if=isCustomizePortList
                      class="pt-1"
                      v-model="newTaskData.portCustomizeList"
                      type="textarea"
                      :autosize="{minRows: 2,maxRows: 5}"
                      placeholder="Enter port.."></Input>
                </FormItem>
                <FormItem label="Options" prop="options">
                  <Select
                      style="width:150px"
                      v-model="newTaskData.optionID"
                      placeholder="Options">
                    <Option value="1">default</Option>
                    <Option value=2>2</Option>
                    <Option value=3>3</Option>
                    <Option value=4>4</Option>
                  </Select>
                </FormItem>

                <FormItem label="Thread">
                  <Slider :max=50 show-input v-model="newTaskData.threatNum"></Slider>
                </FormItem>
                <FormItem>
                  <div class="text-right">
                    <Button @click="createTask">
                      <i class="material-icons mr-1">add_box</i>
                      Submit
                    </Button>
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
        isCustomizePortList: false,
        newTaskData: {
          taskName: "port_scan_" + this.getDateTime(),
          targetList: "",
          portSelect: "default",
          portCustomizeList: "",
          optionID: "1",
          threatNum: 20
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
          option: this.newTaskData.optionID,
          threat: this.newTaskData.threatNum,
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
                  // this.$router.push('/scanner/poc/scans');
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
