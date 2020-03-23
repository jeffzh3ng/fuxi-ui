<template>
    <div class="ml-2">
        <v-row>
            <v-col cols="12">
                <table>
                    <tr>
                        <td><span class="subtitle-1">KEY</span></td>
                        <td><span class="subtitle-1">DESC</span></td>
                        <td><span class="subtitle-1">VALUE</span></td>
                        <td><span class="subtitle-1">ACTION</span></td>
                    </tr>
                    <tr v-for="(item, index) in items" :key="index">
                        <td><span class="mr-4">{{item['key']}}</span></td>
                        <td>
                            <span class="mr-6">{{item['desc'] | long}}</span>
                        </td>
                        <td style="width: 300px;">
                            <v-text-field v-model="item['value']" class="mr-4"></v-text-field>
                        </td>
                        <td>
                            <v-btn small elevation="0">
                                <span @click="updateConfig(item['cid'], item['key'], item['value'])">update</span>
                            </v-btn>
                        </td>
                    </tr>
                </table>
            </v-col>
        </v-row>
        <template>

        </template>

    </div>
</template>

<script>
    export default {
        name: "ToolsSetting",
        data: () => ({
            items: [],
        }),
        mounted() {
          this.getData();
        },
        methods: {
            getData() {
                this.$api.setting.settingList().then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if (status['status'] === "success") {
                        this.items = result;
                    } else {
                        this.$message.error(status['message']);
                    }
                });
            },
            updateConfig(cid, key, value){
                let data = {
                    key: key,
                    value: value
                };
                this.$api.setting.updateSetting(cid, data).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    if (status['status'] === "success") {
                        this.$message.success(status['message']);
                    } else {
                        this.$message.error(status['message']);
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>