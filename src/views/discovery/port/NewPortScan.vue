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
                  <Input  placeholder="Enter task name"></Input>
                </FormItem>
                <FormItem label="Target" prop="target">
                  <Input
                      type="textarea"
                      :autosize="{minRows: 5,maxRows: 10}"
                      placeholder="Enter target.."></Input>
                </FormItem>
                <FormItem label="Port" prop="port">
                  <Select
                      style="width:200px"
                      @on-change="changePortSelect"
                      placeholder="Default">
                    <Option value="default">Default</Option>
                    <Option value="customize">Customize</Option>
                  </Select>
                  <Input
                      v-if=isCustomizePortList
                      class="pt-1"
                      type="textarea"
                      :autosize="{minRows: 2,maxRows: 5}"
                      placeholder="Enter port.."></Input>
                </FormItem>
                <FormItem label="Options" prop="options">
                  <Select
                      style="width:150px"
                      placeholder="Options">
                    <Option value="once">Once</Option>
                    <Option value="daily">Every day</Option>
                    <Option value="weekly">Every week</Option>
                    <Option value="monthly">Every month</Option>
                  </Select>
                </FormItem>

                <FormItem label="Thread">
                  <Slider :max=50 show-input></Slider>
                </FormItem>
                <FormItem>
                  <div class="text-right">
                    <Button>
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
        isCustomizePortList: false
      }
    },
    mounted: function () {
    },
    methods: {
      changePortSelect(value){
        this.isCustomizePortList = value === "customize";
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
