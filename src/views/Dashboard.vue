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

        <v-row class="ml-4">
            <v-row class="mr-8 mt-n4">
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
        </v-row>
    </div>
</template>

<script>
    export default {
        name: "Dashboard",
        data: () => ({
            spinShow: true,
            countStatisticsItems: [
                {text: "VULNERABILITY", value: 0, icon: "mdi-bug", path: "/scanner/poc/vul"},
                {text: "XSS SHEEP", value: 0, icon: "mdi-card-account-details-outline", path: "/exploit/xss/result"},
                {text: "JSONP SHEEP", value: 0, icon: "mdi-anchor", path: "/exploit/jsonp/result"},
                {text: "HTTP LOG", value: 0, icon: "mdi-iframe-array-outline", path: "/exploit/http/result"},
            ],
        }),
        mounted() {
            this.getCount();
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
                            }
                        }
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