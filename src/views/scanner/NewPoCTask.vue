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

                <v-col cols="6" class="mt-n6">
                    <v-combobox
                            v-model="newTaskData.freq"
                            :items="['Once', 'Daily', 'Weekly', 'Monthly']"
                            label="Frequency"
                    ></v-combobox>
                </v-col>

                <v-col cols="12" class="mt-n4">
                    <div
                            style="border-left:1px solid #949494; border-top:1px solid #949494;
                                   border-bottom:1px solid #949494; border-right:1px solid #949494">

                        <div class="mr-2 ml-2 mt-2">
                            <strong class="teal--text">
                                Plugins: {{ plugins.length }}
                            </strong>
                            <strong class="ml-1 mr-1 grey--text">|</strong>
                            <strong class="success--text">
                                Selected: {{ completedTasks.length }}
                            </strong>
                            <v-text-field
                                    class="mt-n1"
                                    label="Filter"
                                    v-model="pluginFilter"
                            ></v-text-field>
                            <v-data-iterator
                                    style="max-height: 200px"
                                    class="overflow-y-auto mt-n4 mb-2"
                                    :items="plugins"
                                    :search="pluginFilter"
                                    :items-per-page="999999"
                                    hide-default-footer
                            >
                                <template v-slot:default="props" >
                                    <v-list dense>
                                        <div v-for="(item, i) in props.items" :key="i">
                                            <v-divider
                                                    v-if="i !== 0"
                                                    :key="`${i}-divider`"
                                            ></v-divider>
                                            <v-list-item dense :key="`${i}-${item.text}`">
                                                <v-list-item-action>
                                                    <v-checkbox
                                                            v-model="item.done"
                                                            :color="item.done && 'grey' || 'teal'"
                                                    >
                                                        <template v-slot:label>
                                                            <div
                                                                    :class="item.done && 'grey--text' || 'black--text'"
                                                                    class="ml-4"
                                                            >
                                                                <v-tooltip bottom>
                                                                    <template v-slot:activator="{ on }">
                                                                        <span v-on="on">{{item.text | long}}</span>
                                                                    </template>
                                                                    <span>{{item.text}}</span>
                                                                </v-tooltip>
                                                            </div>
                                                        </template>
                                                    </v-checkbox>
                                                </v-list-item-action>
                                                <v-spacer></v-spacer>
                                                <v-scroll-x-transition>
                                                    <v-icon
                                                            v-if="item.done"
                                                            color="success"
                                                    >
                                                        mdi-check
                                                    </v-icon>
                                                </v-scroll-x-transition>
                                            </v-list-item>
                                        </div>
                                    </v-list>
                                </template>
                            </v-data-iterator>
                        </div>
                    </div>
                </v-col>

                <v-col cols="12">
                    <v-textarea
                            outlined
                            :rules="[v => !!v || 'Target is required']"
                            v-model="newTaskData.target"
                            rows="5"
                            label="Target"
                            :placeholder="targetPlaceholder"
                    ></v-textarea>
                </v-col>

                <v-col cols="12" class="mt-n3">
                    <v-slider
                            v-model="newTaskData.threads"
                            label="Threads"
                            thumb-label="always"
                            value="30"
                    ></v-slider>
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
        name: "NewPoCTask",
        data: () => {
            return {
                pluginFilter: "",
                plugins: [],
                newTaskData: {
                    name: "", freq: "Once", poc:"", target: "", threads: 30,
                },
                targetPlaceholder: "Example:\n192.168.1.1\n192.168.2.0/24\nwww.test.com",
            }
        },
        mounted() {
            this.target = this.$route.query.target;
            if (this.target !== undefined) {
                this.newTaskData.target = this.target.split(",").join("\n");
            }
            this.getPluginList();
            this.newTaskData.name = "poc_task_" + this.$tools.getDateTime();
        },
        computed: {
            completedTasks () {
                return this.plugins.filter(task => task.done)
            },
            progress () {
                return this.completedTasks.length / this.plugins.length * 100
            },
        },
        methods: {
            getPluginList() {
                this.$api.scanner.pocPluginList().then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if(status['status'] === "success") {
                        for (let i=0; i<result.length; i++) {
                            this.plugins.push({
                                done: false,
                                text: result[i]['name'],
                                pid: result[i]['pid'],
                            })
                        }
                    } else {
                        this.$message.error(status['message']);
                    }
                })
            },
            newScan() {
                let plugins = [];
                for (let i=0; i<this.plugins.length; i++) {
                    if (this.plugins[i]['done']) {
                        plugins.push(this.plugins[i]['pid'])
                    }
                }
                if (plugins.length === 0) {
                    this.$message.error("You need to select the plugin");
                    return
                }
                if (this.newTaskData.name.length === 0 || this.newTaskData.target.length === 0) {
                    this.$message.error("Please check you input");
                    return
                }
                this.newTaskData.poc = plugins.join(",");
                this.newTaskData.target = this.newTaskData.target.split("\n").join(",");
                this.$api.scanner.pocNewTask(this.newTaskData).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    if(status['status'] === "success") {
                        this.$message.success(status['message']);
                        this.$router.push('/scanner/poc/tasks');
                        this.newTaskData = {
                            name: "", freq: "Once", poc:"", target: "", threads: 30,
                        }
                    } else {
                        this.$message.error(status['message']);
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>