<template>
  <d-container fluid class="main-content-container px-4 pb-4">
    <!-- Page Header -->
    <d-row no-gutters class="page-header py-4">
      <!-- Page Title -->
      <d-col col sm="4" class="text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">New Scan</span>
        <!--<h3 class="page-title">创建扫描任务</h3>-->
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
                      placeholder="选择扫描周期">
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
                  <Checkbox v-model="newScanData.other"> 扫描完成通知</Checkbox>
                </FormItem>
                <FormItem>
                  <Button type="primary" @click="createScanTask">创建任务</Button>
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
            <span><font size="1">设置目标及 POC 进行一次临时检测</font></span>
          </d-card-header>
          <br>
          <d-row class="justify-content-center">
            <d-col md="10" sm="10" lg="10">
              <d-form>
                <d-form-row>
                  <d-col md="12" class="form-group">
                    <label><font size="2">* 设置目标</font></label>
                    <Input
                        v-model="quickScanData.target"
                        type="textarea"
                        :autosize="{minRows: 3,maxRows: 5}"
                        placeholder="Enter target..."/>
                  </d-col>
                </d-form-row>
                <d-form-row>
                  <d-col md="12" class="form-group">
                    <label><font size="2">* 选择 POC</font></label>
                    <Select
                        v-model="quickPluginSelect"
                        multiple
                        filterable
                        placeholder="选择插件">
                        <Option v-for="item in pocList" :value="item.key">{{ item.label }}</Option>
                    </Select>
                  </d-col>
                </d-form-row>
                <d-form-row>
                  <CheckboxGroup class="mx-2">
                    <Checkbox label="扫描完成通知"></Checkbox>
                  </CheckboxGroup>
                </d-form-row>
                <br>
                <d-form-row>
                  <d-col md="12" class="form-group ">
                    <Button @click="quickScan" type="primary" shape="circle"><Icon type="ios-flash-outline" size="18"/> 快速扫描</Button>
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
        listStyle: {
          width: '200px',
          height: '250px'
        },
        pocList: [],
        newScanData: {
          name: "",
          target: "",
          freq: "once",
          thread: 20,
          poc_id: "",
          poc_name: "",
          other: false,
        },
        quickScanData: {
          target: "",
          poc_id: "",
          poc_name: "",
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
      this.$axios.get('scanner/poc/plugins').then(response => {
        let resPlugin = response.data;
        if (resPlugin['status'] === 'success') {
          for (let i=0;i<resPlugin.data.length; i++) {
            this.pocList.push({"key": resPlugin.data[i]['pid'], "label": resPlugin.data[i]['name']})
          }
        } else {
          this.$message.error(resPlugin.message);
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
        this.newScanData['poc_name'] = poc_name.join("\n");
        this.newScanData['poc_id'] = this.pluginSelect.join("\n");
        if (this.newScanData['name'].length !== 0 &&
          this.newScanData['poc_id'].length !== 0 &&
          this.newScanData['poc_name'].length !== 0 &&
          this.newScanData['target'].length !== 0) {
          this.$Modal.confirm({
            title: 'CONFIRM',
            content: 'Are you sure to add a new scan task?',
            closable: true,
            okText: 'OK',
            cancelText: 'Cancel',
            onOk: () => {
              this.$axios.post("scanner/poc/task", this.newScanData).then(response => {
                let resNewTask = response.data;
                if(resNewTask.status === "success") {
                  this.$message.success(resNewTask['message']);
                  this.$router.push('/scanner/poc/scans');
                } else {
                  this.$message.error(resNewTask['message'])
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
        this.quickScanData['poc_name'] = poc_name.join("\n");
        this.quickScanData['poc_id'] = this.quickPluginSelect.join("\n");
        this.quickModalTitle = this.quickScanData['target'] + " - " + this.quickScanData['poc_name'];
        this.quickModalSpinShow = true;
        this.quickResult = "";
        this.getQuickScanResModal = true;

        this.$axios.post("scanner/poc/scan", this.quickScanData).then(response => {
          let res = response.data;
          if(res.status === "success") {
            this.quickResult = res['data'];
            this.quickModalSpinShow = false
          } else {
            this.quickResult = res['message'];
            this.$message.error(res['message']);
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
  .demo-spin-col{
    height: 100px;
    position: relative;
    border: 1px solid #eee;
  }
</style>
