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
                  :model="newScanData"
                  :rules="ruleScanDate"
                  label-position="left"
                  :label-width="100">
                <FormItem label="Name" prop="name">
                  <Input v-model="newScanData.name" placeholder="Enter your name"></Input>
                </FormItem>
                <FormItem label="Frequency" prop="freq">
                  <Select
                      style="width:150px"
                      v-model="newScanData.freq"
                      placeholder="Frequency">
                    <Option value="once">Once</Option>
                    <Option value="daily">Every day</Option>
                    <Option value="weekly">Every week</Option>
                    <Option value="monthly">Every month</Option>
                  </Select>
                </FormItem>
                <FormItem label="PoC" prop="plugin">
                  <Transfer
                      :data="pocList"
                      :target-keys="pluginSelect"
                      filterable
                      :list-style="listStyle"
                      filter-placeholder="Filter"
                      :titles="['PoC List','Selected']"
                      :filter-method="filterMethod"
                      @on-change="handleChange2"></Transfer>
                </FormItem>
                <FormItem label="Target" prop="target">
                  <Input
                      type="textarea"
                      :autosize="{minRows: 5,maxRows: 7}"
                      v-model="newScanData.target"
                      :placeholder="targetPlaceholder"></Input>
                </FormItem>
                <FormItem label="Thread">
                  <Slider v-model="newScanData.thread" :max=50 show-input></Slider>
                </FormItem>
                <FormItem label="Notification" prop="interest">
                  <Checkbox v-model="newScanData.other"> Notification</Checkbox>
                </FormItem>
                <FormItem>
                  <div class="text-right">
                    <Button @click="createScanTask">
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
        <d-card class="card-small mb-12">
          <!-- Card Header -->
          <d-card-header class="border-bottom">
            <h5 class="m-0">Quick Scan</h5>
            <span><font size="1">Set target and POC for a temporary check</font></span>
          </d-card-header>
          <br>
          <d-row class="justify-content-center">
            <d-col md="10" sm="10" lg="10">
              <d-form>
                <d-form-row>
                  <d-col md="12" class="form-group">
                    <label><font size="2">* Target</font></label>
                    <Input
                        v-model="quickScanData.target"
                        type="textarea"
                        :autosize="{minRows: 3,maxRows: 5}"
                        placeholder="Enter target..."/>
                  </d-col>
                </d-form-row>
                <d-form-row>
                  <d-col md="12" class="form-group">
                    <label><font size="2">* POC</font></label>
                    <Select
                        v-model="quickPluginSelect"
                        multiple
                        filterable
                        placeholder="poc">
                        <Option v-for="item in pocList" :value="item.key">{{ item.label }}</Option>
                    </Select>
                  </d-col>
                </d-form-row>
                <!--<d-form-row>-->
                  <!--<CheckboxGroup class="mx-2">-->
                    <!--<Checkbox label="Notification"></Checkbox>-->
                  <!--</CheckboxGroup>-->
                <!--</d-form-row>-->
                <br>
                <d-form-row>
                  <d-col md="12" class="form-group ">
                    <Button @click="quickScan">
                      <i class="material-icons">library_add</i>
                      Execute
                    </Button>
                  </d-col>
                </d-form-row>
              </d-form>
              <Modal
                  :styles="{top: '30px'}"
                  footer-hide
                  width="600"
                  v-model="getQuickScanResModal"
                  :title="quickModalTitle">
                <div>
                  <Spin fix v-if="quickModalSpinShow">
                    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                    <div>Quick scanning</div>
                  </Spin>
                  <pre>{{quickResult}}</pre>
                </div>
              </Modal>
            </d-col>
          </d-row>
        </d-card>
      </d-col>
    </d-row>
  </d-container>
</template>

<script>
  export default {
    name: "PocNewScan",
    data () {
      return {
        getQuickScanResModal: false,
        listStyle: {width: '200px', height: '250px'},
        pocList: [],
        newScanData: {
          name: "",
          target: "",
          freq: "once",
          thread: 20,
          poc_id: "",
          other: false,
        },
        quickScanData: {
          target: "",
          poc_id: ""
        },
        quickPluginSelect: [],
        pluginSelect: [],
        ruleScanDate: {
          name: [
            {required: true, message: 'Task name cannot be empty', trigger: 'blur'}
          ],
          target: [
            {required: true, message: 'Target cannot be empty', trigger: 'blur'}
          ],
          plugin: [
            {required: true, message: 'POC cannot be empty', trigger: 'blur'}
          ],
        },
        targetPlaceholder: "Example:\n" +
          "192.168.1.1\n" +
          "192.168.2.0/24\n" +
          "test.com",
        quickResult: "",
        quickModalTitle: "",
        quickModalSpinShow: true
      }
    },
    mounted: function () {
      let plugin_api = "scanner/poc/plugin";
      this.$axios.get(plugin_api).then(response => {
        let status = response['data']['status'];
        let data = response['data']['result'];
        if (status['status'] === 'success') {
          for (let i=0;i<data.length; i++) {
            this.pocList.push({"key": data[i]['pid'], "label": data[i]['name']})
          }
        } else {
          this.$message.error(status.message);
        }
      })
    },
    methods: {
      handleChange2 (newTargetKeys) {
        this.pluginSelect = newTargetKeys;
      },
      filterMethod (data, query) {
        return data.label.indexOf(query) > -1;
      },
      createScanTask(){
        let poc_name = [];
        for (let i=0; i<this.pocList.length; i++) {
          if (this.pluginSelect.indexOf(this.pocList[i]['key']) !==-1) {
            poc_name.push(this.pocList[i]['label'])
          }
        }
        this.newScanData['poc'] = this.pluginSelect.join(",");
        this.newScanData['target'] = this.newScanData['target'].split("\n").join(",");
        if (this.newScanData['name'].length !== 0 &&
          this.newScanData['poc'].length !== 0 &&
          this.newScanData['target'].length !== 0) {
          this.$Modal.confirm({
            title: 'CONFIRM',
            content: 'Are you sure to add a new scan task?',
            closable: true,
            okText: 'OK',
            cancelText: 'Cancel',
            onOk: () => {
              this.$axios.post("scanner/poc/task", this.newScanData).then(response => {
                let status = response['data']['status'];
                if(status['status'] === "success") {
                  this.$message.success(status['message']);
                  this.$router.push('/scanner/poc/scans');
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
      quickScan(){
        let poc_name = [];
        for (let i=0; i<this.pocList.length; i++) {
          if (this.quickPluginSelect.indexOf(this.pocList[i]['key']) !== -1) {
            poc_name.push(this.pocList[i]['label'])
          }
        }
        this.quickScanData['target'] = this.quickScanData['target'].split("\n").join(",");
        this.quickScanData['poc'] = this.quickPluginSelect.join(",");
        this.quickScanData['quick'] = true;
        this.quickModalTitle = this.quickScanData['target'] + " - " + this.quickScanData['poc_name'];
        this.quickModalSpinShow = true;
        this.quickResult = "";
        this.getQuickScanResModal = true;

        this.$axios.post("scanner/poc/task", this.quickScanData).then(response => {
          let status = response['data']['status'];
          let data = response['data']['result'];
          if(status.status === "success") {
            this.quickResult = data;
            this.quickModalSpinShow = false
          } else {
            this.quickResult = status['message'];
            this.$message.error(status['message']);
            this.quickModalSpinShow = false
          }
        })
      }
    }
  }
</script>

<style>
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
</style>
