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
            <h5 class="m-0">创建任务</h5>
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
                <FormItem label="任务名称" prop="name">
                  <Input v-model="newScanData.name" placeholder="Enter your name"></Input>
                </FormItem>
                <FormItem label="扫描周期" prop="cycle">
                  <Select
                      style="width:150px"
                      v-model="newScanData.cycle"
                      placeholder="选择扫描周期">
                    <Option value="0">Once</Option>
                    <Option value="1">Every day</Option>
                    <Option value="7">Every week</Option>
                    <Option value="7">Every month</Option>
                  </Select>
                </FormItem>
                <FormItem label="扫描插件" prop="plugin">
                  <Transfer
                      class=".ivu-transfer-list-body-search-wrapper"
                      :data="data2"
                      :target-keys="newScanData.plugin"
                      filterable
                      filter-placeholder="筛选"
                      :titles="['POC 列表','已选 POC']"
                      :filter-method="filterMethod"
                      @on-change="handleChange2"></Transfer>
                </FormItem>
                <FormItem label="扫描对象" prop="target">
                  <Input
                      type="textarea"
                      :autosize="{minRows: 5,maxRows: 7}"
                      v-model="newScanData.target"
                      placeholder="Enter your target"></Input>
                </FormItem>
                <FormItem label="扫描并发">
                  <Slider v-model="newScanData.thread" :max=50 show-input></Slider>
                </FormItem>
                <FormItem label="其他配置" prop="interest">
                  <CheckboxGroup v-model="newScanData.other">
                    <Checkbox label="扫描完成通知"></Checkbox>
                    <Checkbox label="其他"></Checkbox>
                  </CheckboxGroup>
                </FormItem>
                <FormItem>
                  <Button type="primary">创建任务</Button>
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
            <h5 class="m-0">快速检测</h5>
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
                        type="textarea"
                        :autosize="{minRows: 3,maxRows: 5}"
                        placeholder="Enter target..."/>
                  </d-col>
                </d-form-row>
                <d-form-row>
                  <d-col md="12" class="form-group">
                    <label><font size="2">* 选择 POC</font></label>
                    <Select multiple filterable placeholder="选择插件">
                      <Option value="aa">大声a点撒大接口是你测试adasda</Option>
                      <Option value="bb">大声阿斯顿撒大点a</Option>
                      <Option value="cc">大撒打算大声点b</Option>
                      <Option value="dd">大撒打算大声大是dvsds点b</Option>
                      <Option value="ee">大撒打算大 大撒撒打算声点b</Option>
                      <Option value="ff">大撒打算大声阿 dasd 去点b</Option>
                      <Option value="gg">大撒打算大声阿asda dasd 去点b</Option>
                      <Option value="ads">大撒打算大声阿asda dasd 去点b</Option>
                      <Option value="adsa">das dasd 去点b</Option>
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
                    <Button type="primary" shape="circle"><Icon type="ios-flash-outline" size="18"/> 快速扫描</Button>
                  </d-col>
                </d-form-row>
              </d-form>
            </d-col>
          </d-row>
        </d-card>
      </d-col>
    </d-row>
  </d-container>
</template>

<script>
  export default {
    name: "AliothNewScan",
    data () {
      return {
        data2: [
          { "key": "1", "label": "Content 1"},
          { "key": "2", "label": "Content 2"},
        ],
        newScanData: {
          name: "",
          target: "",
          cycle: "0",
          thread: 20,
          plugin: [],
          other: [],
        },
        ruleScanDate: {
          name: [
            {required: true, message: 'Task name cannot be empty', trigger: 'blur'}
          ],
          cycle: [
            {required: true, message: 'Target cannot be empty', trigger: 'blur'}
          ],
          target: [
            {required: true, message: 'Target cannot be empty', trigger: 'blur'}
          ],
          plugin: [
            {required: true, message: 'POC cannot be empty', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      handleChange2 (newTargetKeys) {
        this.newScanData.plugin = newTargetKeys;
      },
      filterMethod (data, query) {
        return data.label.indexOf(query) > -1;
      }
    }
  }
</script>

<style>
  .ivu-transfer-list-body-search-wrapper {
    padding: 15px 8px 0;
  }
</style>
