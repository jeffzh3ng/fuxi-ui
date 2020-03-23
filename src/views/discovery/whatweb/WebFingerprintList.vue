<template>
    <div>
        <div v-for="(item, index) in data" :key="index">
            <div>
                <div class="mt-2">
                    <span class="teal--text title" v-if="item.title.length !== 0">## {{item['title']}}</span>
                </div>
                <div>
                    <span>{{item['domain']}}</span>
                </div>
                <div class="mt-1">
                    <span v-if="item['c_code'] !== 'zz'" :class="'mr-2 flag-icon flag-icon-'+item['c_code']"/>
                    <span v-else class="mr-2 flag-icon flag-icon-us"/>
                    <span class="mr-4">{{item['ip']}}</span>
                    <span>{{item['country']}}</span>
                </div>
                <div class="mt-1">
                    <span>Added on {{item['date']}}</span><br>
                </div>
                <div>
                    <v-row>
                        <v-col cols="7">
                            <v-btn elevation="0"
                                   x-small
                                   class="mr-2"
                                   color="blue"
                                   v-for="i in item.fingerprint"
                                   :key="i.plugin" :name="i.plugin"
                            >
                                <span class="white--text" v-if="i['string'].length === 0">{{i['plugin']}}</span>
                                <span class="white--text" v-else>{{i['plugin']}} [{{i['string'] | long}}]</span>
                            </v-btn>
                        </v-col>
                        <v-col cols="4" class="mt-n3">
                            <span class="subtitle-1">Request:</span>
                            <p>{{item['request']}}</p>
                        </v-col>
                    </v-row>
                </div>
                <div>
                    <v-divider class="mr-6 mb-2"/>
                </div>
            </div>
        </div>
        <v-row justify="center" v-if="data.length === 0" class="grey--text mb-12 mt-12 ml-n12">
            <h2>No available data</h2>
            <br>
        </v-row>
    </div>
</template>

<script>
    export default {
        name: "WebFingerprintList",
        props: {
            data: {
                default: function() {return {}}
            }
        },
    }
</script>

<style scoped>

</style>