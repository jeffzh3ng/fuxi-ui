<template>
  <div>
    <d-row>
      <d-col>
        <d-form>
          <d-form-row class="mx-3">
            <d-col md="6" class="form-group">
              <Select @on-change="selectPayload" v-model="payloadItem.name" filterable>
                <Option v-for="item in items" :value="item.name" :key="item.name">{{ item.name }}</Option>
              </Select>
            </d-col>
            <d-col md="6">
              <Button @click="openNewPayloadModal=true">
                <i class="material-icons mr-1">add_box</i>
                New Payload
              </Button>
            </d-col>
          </d-form-row>
          <d-form-row class="mx-3">
            <d-col md="6">
              <Input v-model="payloadItem.value" class="pt-1" type="textarea" :autosize="{minRows: 15,maxRows: 20}" placeholder="..."/>
            </d-col>
          </d-form-row>
        </d-form>
        <br>
        <div class="mx-4">
          <d-button @click="deletePayload(payloadItem.pid)" type="submit" class="btn-white mr-2">
            <i class="material-icons mr-1">restore_from_trash</i>Trash</d-button>
          <d-button @click="updatePayload(payloadItem.pid)" type="submit " class="btn-white ">
            <i class="material-icons mr-1">border_color</i>Update</d-button>
        </div>
      </d-col>
    </d-row>
    <Modal
        v-model="openNewPayloadModal"
        scrollable
        footer-hide
        title="New Payload">
      <div>
        <d-row>
          <d-col lg="12" md="12" sm="12">
            <Input v-model="newPayloadValue.name" class="pt-1" placeholder="Payload name..."></Input>
          </d-col>
          <d-col class="pt-2"  lg="12" md="12" sm="12">
            <Input v-model="newPayloadValue.value" class="pt-1" type="textarea" :autosize="{minRows: 8,maxRows: 15}" placeholder="..."/>
          </d-col>
          <d-col class="pt-4 text-right" lg="12" md="12" sm="12">
            <Button @click="addNewPayload">
              <i class="material-icons mr-1">add_box</i>
              Submit
            </Button>
          </d-col>
        </d-row>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "XssPayloads",
    data() {
      return {
        spinShow: true,
        items: [],
        payloadItem: {
          name: "", value: "", pid: "",
        },
        reqApiPath: "/tools/xss/payloads",
        openNewPayloadModal: false,
        newPayloadValue: {
          name: "", value: ""
        }
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      getData() {
        this.$axios.get(this.reqApiPath).then(response => {
          let res = response.data;
          if (res['status'] === 'success') {
            this.items = [];
            this.items = res['data'];
            this.payloadItem.name = this.items[0]['name'];
            this.payloadItem.value = this.items[0]['value'];
            this.payloadItem.pid = this.items[0]['id'];
          } else {
            this.$message.error(res['message']);
          }
        })
      },
      addNewPayload(){
        if (this.newPayloadValue.name.length===0||this.newPayloadValue.value.length===0) {
          return
        }
        this.$axios.post("/tools/xss/payload", this.newPayloadValue).then(response => {
          let res = response.data;
          if (res['status'] === 'success') {
            this.$message.success(res['message']);
            this.openNewPayloadModal = false;
            this.newPayloadValue.name = "";
            this.newPayloadValue.value = "";
            this.getData()
          } else {
            this.$message.error(res['message']);
            this.openNewPayloadModal = false;
            this.getData()
          }
        })
      },
      selectPayload() {
        for (let i=0;i<this.items.length;i++) {
          if (this.items[i]['name'] === this.payloadItem.name) {
            this.payloadItem.name = this.items[i]['name'];
            this.payloadItem.value = this.items[i]['value'];
            this.payloadItem.pid = this.items[i]['id'];
          }
        }
      },
      deletePayload(pid) {
        this.$Modal.confirm({
          title: 'WARNING',
          content: 'Are you sure you want to delete this item?',
          closable: true,
          okText: 'OK',
          cancelText: 'Cancel',
          onOk: () => {
            this.$axios.delete("/tools/xss/payload/" + pid).then(response => {
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
      updatePayload(pid) {
        this.$axios.put("/tools/xss/payload/" + pid, {"value": this.payloadItem.value}).then(response => {
          let res = response.data;
          if (res['status'] === 'success') {
            this.$message.success(res['message']);
            this.getData()
          } else {
            this.$message.error(res['message']);
            this.getData()
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
