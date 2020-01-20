<template>
    <div>
        <table class="ml-4" style="border-collapse:separate; border-spacing:1px 15px;">
            <thead>
                <tr v-for="item in items">
                    <th><h5 class="mr-4">{{item.desc}}</h5></th>
                    <th>
                        <d-input v-model="item.value" :value="item.value" class="ml-4"/>
                    </th>
                    <th><span class="mr-4"/></th>
                    <th><d-button @click="updateConfig(item.cid, item.key, item.value)" class="mr-4 ml-4">Save</d-button></th>
                </tr>

            </thead>
        </table>
    </div>
</template>

<script>
    export default {
        name: "ToolsConfig",
        data() {
            return {
                items: [],
                reqApiPath: "/settings/basic",
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                this.$axios.get(this.reqApiPath).then(response => {
                    let status = response['data']['status'];
                    let data = response['data']['result'];
                    if (status['status'] === 'success') {
                        this.items = data;
                    } else {
                        this.$message.error(status['message']);
                    }
                })
            },
            updateConfig(cid, key, value){
                let data = {
                    key: key,
                    value: value
                };
                this.$axios.put(this.reqApiPath + "/" + cid, data).then(response => {
                    let status = response['data']['status'];
                    if (status['status'] === 'success') {
                        this.$message.success(status['message']);
                    } else {
                        this.$message.error(status['message']);
                    }
                    this.getData()
                })
            }
        }
    }
</script>

<style scoped>

</style>