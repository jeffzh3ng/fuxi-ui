<template>
    <div>
        <v-card-title>
            <v-list-item-action>
                <v-icon class="teal--text">mdi-plus</v-icon>
            </v-list-item-action>
            <v-list-item-content class="ml-n4">
                <v-list-item-title class="teal--text">
                    <span>NEW SCAN</span>
                </v-list-item-title>
            </v-list-item-content>
        </v-card-title>

        <v-row class="mt-n2">
            <v-col cols="1">
            </v-col>
            <v-col cols="6">
                <v-col>
                    <v-text-field
                            label="Task Name"
                            v-model="newTaskData.name"
                            :rules="[v => !!v || 'Task name is required']"
                            persistent-hint
                            required
                    ></v-text-field>
                </v-col>

                <v-col cols="6" class="mt-n8">
                    <v-combobox
                            v-model="newTaskData.portType"
                            :items="['Default', 'Customize', 'All']"
                            label="Port"
                    ></v-combobox>
                </v-col>

                <v-col cols="12" class="mt-n6" v-if="newTaskData.portType === 'Customize'">
                    <v-textarea
                            outlined
                            :placeholder="portPlaceholder"
                            v-model="newTaskData.portList"
                            rows="2"
                            label="Port"
                    ></v-textarea>
                </v-col>

                <v-col cols="6" class="mt-n8">
                    <v-combobox
                            v-model="newTaskData.option"
                            :items="defaultOption"
                            label="Option"
                    ></v-combobox>
                </v-col>

                <v-col cols="12" class="mt-n4">
                    <v-textarea
                            outlined
                            :rules="[v => !!v || 'Target is required']"
                            v-model="newTaskData.target"
                            rows="5"
                            label="Target"
                            :placeholder="targetPlaceholder"
                    ></v-textarea>
                </v-col>

                <v-col class="mb-4 text-right">
                    <v-btn class="teal" @click="newScan">
                        <v-icon class="white--text">mdi-plus</v-icon>
                        <span class="white--text ml-2 mr-1">New scan</span>
                    </v-btn>
                </v-col>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    export default {
        name: "NewNetPortScan",
        data: () => {
            return {
                target: "",
                newTaskData: {
                    name: "", target: "", portType: "Default", portList: "", option: {text: "Default", value: "10001"},
                },
                defaultOption: [
                    {text: "Default", value: "10001"},
                    {text: "-sT -T4", value: "10002"},
                    {text: "-Pn", value: "10003"},
                ],
                targetPlaceholder: "Example:\n192.168.1.1\n192.168.2.0/24\nwww.test.com",
                portPlaceholder: "Example: 22,23,80,8080,9090",
            }
        },
        mounted() {
            this.target = this.$route.query.target;
            if (this.target !== undefined) {
                this.newTaskData.target = this.target.split(",").join("\n");
            }
            this.newTaskData.name = "port_task_" + this.$tools.getDateTime();
        },
        methods: {
            newScan() {
                let port = "";
                if (this.newTaskData.portType === "Customize") {
                    port = this.newTaskData.portList.split("\n").join(",");
                    if (port.length === 0) {
                        this.$message.error("Please enter the specific port");
                        return
                    }
                }
                if (this.newTaskData.portType === "All") {
                    port = "1-65535";
                }
                let data = {
                    name: this.newTaskData.name,
                    target: this.newTaskData.target.split("\n").join(","),
                    port: port,
                    option: this.newTaskData.option.value
                };
                if (data.name.length === 0 || data.target.length === 0) {
                    this.$message.error("Please check you input");
                    return
                }
                this.$api.discovery.portTaskNew(data).then(res => {
                    this.newTaskData = {
                        name: "", target: "", portType: "Default", portList: "", option: {text: "Default", value: "10001"},
                    };

                    let response = res.data;
                    let status = response['status'];
                    if(status['status'] === "success") {
                        this.$message.success(status['message']);
                        this.$router.push('/discovery/port/tasks');
                    } else {
                        this.$message.error(status['message']);
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>