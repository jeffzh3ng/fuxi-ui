<template>
    <div class="ml-4">
        <v-card-title>
            <v-list-item-action>
                <v-icon class="teal--text">mdi-monitor-dashboard</v-icon>
            </v-list-item-action>
            <v-list-item-content class="ml-n3">
                <v-list-item-title class="teal--text">
                    <span>Dashboard</span>
                </v-list-item-title>
            </v-list-item-content>
        </v-card-title>

        <v-row class="mr-8 ml-2 mt-n4">
            <v-col cols="3" v-for="(item, index) in countStatisticsItems" :key="index">
                <v-card class="mx-auto"
                        @click="goToPath(item.path)"
                        color="teal lighten-1">
                    <v-card-title>
                        <v-row align="start" class="white--text">
                            <div>
                                <span class="ml-2 font-weight-black">{{item.text}}</span><br>
                                <span class="ml-2">{{item.value}}</span>
                            </div>
                        </v-row>
                        <v-icon color="white" size="64">{{item.icon}}</v-icon>
                    </v-card-title>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="ml-2 mr-8">
            <v-col cols="12">
                <v-card class="mx-auto" min-height="150">
                    <v-card-title>
                        <v-list-item-action>
                            <v-icon class="teal--text">mdi-calendar-sync-outline</v-icon>
                        </v-list-item-action>
                        <v-list-item-content class="ml-n3">
                            <v-list-item-title class="teal--text">
                                <span>Running tasks</span>
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-card-title>
                    <v-card-text>
                        <div v-if="runningTaskItems.length === 0" class="ml-1">
                            <span class="subtitle-1">
                                No tasks are currently running
                            </span>
                        </div>
                        <v-simple-table v-if="runningTaskItems.length !== 0" class="mt-n4">
                            <template v-slot:default>
                                <thead>
                                <tr>
                                    <th class="text-left">Module</th>
                                    <th class="text-left">Task Name</th>
                                    <th class="text-left">Status</th>
                                    <th class="text-left">OP</th>
                                    <th class="text-left">Create Date</th>
                                    <th class="text-left">Elapsed Time</th>
                                    <th class="text-left">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="item in runningTaskItems" :key="item.tid">
                                    <td>{{ item.module |capitalize }}</td>
                                    <td @click="goToModule(item['module'])">{{ item.name }}</td>
                                    <td>
                                        <v-btn v-if="item.status === 'running'" text icon class="amber--text" x-small>
                                            <v-icon>mdi-checkbox-blank-circle</v-icon>
                                        </v-btn>
                                        <v-btn v-if="item.status === 'waiting'" text icon class="grey--text" x-small>
                                            <v-icon>mdi-checkbox-blank-circle</v-icon>
                                        </v-btn>
                                        <v-btn v-if="item.status === 'completed'" text icon class="teal--text" x-small>
                                            <v-icon>mdi-checkbox-blank-circle</v-icon>
                                        </v-btn>
                                    </td>
                                    <td>{{ item.op }}</td>
                                    <td>{{ item.date }}</td>
                                    <td>{{ item['elapsed_time'] }}</td>
                                    <td>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn v-on="on" @click="taskStop(item['celery_id'], item['table'], item['tid'])" color="error" icon>
                                                    <v-icon>mdi-stop-circle-outline</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>STOP</span>
                                        </v-tooltip>
                                    </td>
                                </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" class="mb-6">
                <v-card>
                    <v-card-title>
                        <v-list-item-action>
                            <v-icon class="teal--text">mdi-cpu-64-bit</v-icon>
                        </v-list-item-action>
                        <v-list-item-content class="ml-n3">
                            <v-list-item-title class="teal--text">
                                <span>CPU</span>
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-card-title>
                    <v-card-text>
                        <DashboardTrendCPU/>
                    </v-card-text>
                </v-card>
                <v-card class="mt-6">
                    <v-card-title>
                        <v-list-item-action>
                            <v-icon class="teal--text">mdi-memory</v-icon>
                        </v-list-item-action>
                        <v-list-item-content class="ml-n3">
                            <v-list-item-title class="teal--text">
                                <span>Memory</span>
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-card-title>
                    <v-card-text>
                        <DashboardTrendMemory/>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    import DashboardTrendCPU from "./DashboardTrendCPU";
    import DashboardTrendMemory from "./DashboardTrendMemory";
    export default {
        name: "Dashboard",
        components: {
            DashboardTrendCPU,
            DashboardTrendMemory,
        },
        data: () => ({
            spinShow: true,
            countStatisticsItems: [
                {text: "VULNERABILITY", value: 0, icon: "mdi-bug", path: "/scanner/poc/vul"},
                {text: "XSS SHEEP", value: 0, icon: "mdi-card-account-details-outline", path: "/exploit/xss/result"},
                {text: "SQL INJECTION", value: 0, icon: "mdi-needle", path: "/scanner/sqlmap/tasks"},
                // {text: "JSONP SHEEP", value: 0, icon: "mdi-anchor", path: "/exploit/jsonp/result"},
                {text: "HTTP LOG", value: 0, icon: "mdi-iframe-array-outline", path: "/exploit/http/result"},
            ],
            runningTaskItems: [],
        }),
        mounted() {
            this.getCount();
            this.getRunningTaskList();
        },
        methods: {
            goToPath(path){
                this.$router.push(path);
            },
            getCount() {
                this.$api.dashboard.count().then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if(status['status'] === "success") {
                        for (let i=0; i<this.countStatisticsItems.length; i++) {
                            if (this.countStatisticsItems[i].text === "VULNERABILITY") {
                                this.countStatisticsItems[i].value = result['vuls']
                            } else if(this.countStatisticsItems[i].text === "XSS SHEEP") {
                                this.countStatisticsItems[i].value = result['xss']
                            } else if (this.countStatisticsItems[i].text === "JSONP SHEEP") {
                                this.countStatisticsItems[i].value = result['jsonp']
                            } else if (this.countStatisticsItems[i].text === "HTTP LOG") {
                                this.countStatisticsItems[i].value = result['http']
                            } else if (this.countStatisticsItems[i].text === "SQL INJECTION") {
                                this.countStatisticsItems[i].value = result['sqlmap']
                            }
                        }
                    } else {
                        this.$message.error(status['message']);
                    }
                })
            },
            getRunningTaskList() {
                this.$api.dashboard.runningTaskList().then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if(status['status'] === "success") {
                        this.runningTaskItems = result;
                    } else {
                        this.$message.error(status['message']);
                    }
                })
            },
            goToModule(module_name){
                if (module_name === "sqlmap scanner") {
                    this.$router.push('/scanner/sqlmap/tasks');
                } else if (module_name === "port scanner") {
                    this.$router.push('/discovery/port/tasks');
                } else if (module_name === "whatweb scanner") {
                    this.$router.push('/discovery/whatweb');
                } else if (module_name === "subdomain scanner") {
                    this.$router.push('/discovery/subdomain/tasks');
                } else if (module_name === "poc scanner") {
                    this.$router.push('/scanner/poc/tasks');
                }
            },
            taskStop(celery_id, table, tid){
                console.log(celery_id, table, tid);
                this.$message.error("This feature is not available now");
                // this.$api.dashboard.taskStop(celery_id, table, tid).then(res => {
                //     let response = res.data;
                //     let status = response['status'];
                //     if(status['status'] === "success") {
                //         this.$message.success(status['message']);
                //         this.getRunningTaskList()
                //     } else {
                //         this.$message.error(status['message']);
                //     }
                // })
            }
        }
    }
</script>

<style scoped>

</style>