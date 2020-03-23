<template>
    <div class="mr-4 ml-4">
        <v-row>
            <v-col cols="3">
                <v-card class="mx-auto"
                        color="teal">
                    <v-card-title>
                        <v-row align="start" class="white--text">
                            <div>
                                <span class="ml-4 font-weight-black">Vulnerability</span>
                                <br>
                                <span class="ml-4">1000</span>
                            </div>
                        </v-row>
                        <v-icon color="white" class="mr-4" size="64">mdi-bug</v-icon>
                    </v-card-title>
                </v-card>
            </v-col>
            <v-col cols="3">
                <v-card class="mx-auto"
                        color="teal">
                    <v-card-title>
                        <v-row align="start" class="white--text">
                            <div>
                                <span class="ml-4 font-weight-black">Vulnerability</span>
                                <br>
                                <span class="ml-4">1000</span>
                            </div>
                        </v-row>
                        <v-icon color="white" class="mr-4" size="64">mdi-bug</v-icon>
                    </v-card-title>
                </v-card>
            </v-col>
            <v-col cols="3">
                <v-card class="mx-auto"
                        color="teal">
                    <v-card-title>
                        <v-row align="start" class="white--text">
                            <div>
                                <span class="ml-4 font-weight-black">Vulnerability</span>
                                <br>
                                <span class="ml-4">1000</span>
                            </div>
                        </v-row>
                        <v-icon color="white" class="mr-4" size="64">mdi-bug</v-icon>
                    </v-card-title>
                </v-card>
            </v-col>
            <v-col cols="3">
                <v-card class="mx-auto"
                        color="teal">
                    <v-card-title>
                        <v-row align="start" class="white--text">
                            <div>
                                <span class="ml-4 font-weight-black">Vulnerability</span>
                                <br>
                                <span class="ml-4">1000</span>
                            </div>
                        </v-row>
                        <v-icon color="white" class="mr-4" size="64">mdi-bug</v-icon>
                    </v-card-title>
                </v-card>
            </v-col>
        </v-row>

    </div>
</template>

<script>
    const exhale = ms =>
        new Promise(resolve => setTimeout(resolve, ms))

    export default {
        data: () => ({
            checking: false,
            heartbeats: [],
        }),

        computed: {
            avg () {
                const sum = this.heartbeats.reduce((acc, cur) => acc + cur, 0)
                const length = this.heartbeats.length

                if (!sum && !length) return 0

                return Math.ceil(sum / length)
            },
        },

        created () {
            this.takePulse(false)
        },

        methods: {
            heartbeat () {
                return Math.ceil(Math.random() * (120 - 80) + 80)
            },
            async takePulse (inhale = true) {
                this.checking = true

                inhale && await exhale(1000)

                this.heartbeats = Array.from({ length: 20 }, this.heartbeat)

                this.checking = false
            },
        },
    }
</script>

<style scoped>

</style>