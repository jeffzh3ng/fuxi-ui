<template>
    <div>
        <span class="subtitle-1 ml-1" v-if="value.length < 2">
        No Memory information
    </span>
        <v-sheet>
            <v-sparkline
                    :value="value"
                    :gradient="gradient"
                    :smooth="radius || false"
                    :padding="padding"
                    :line-width="width"
                    height="35"
                    :stroke-linecap="lineCap"
                    :gradient-direction="gradientDirection"
                    :fill="fill"
                    :type="type"
                    :auto-line-width="autoLineWidth"
                    auto-draw
            >
                <template v-slot:label="item">
                    {{ item.value }}%
                </template>
            </v-sparkline>
        </v-sheet>
    </div>
</template>


<script>
    const gradients = [
        ['#222'],
        ['#42b3f4'],
        ['red', 'orange', 'yellow'],
        ['purple', 'violet'],
        ['#00c6ff', '#F0F', '#FF0'],
        ['#f72047', '#ffd200', '#1feaea'],
    ];

    export default {
        data: () => ({
            width: 1,
            radius: 10,
            padding: 8,
            lineCap: 'round',
            gradient: gradients[5],
            value: [],
            gradientDirection: 'top',
            gradients,
            fill: false,
            type: 'trend',
            autoLineWidth: false,
        }),
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                this.$api.dashboard.systemInfo().then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if(status['status'] === "success") {
                        this.value = result['memory_percent']
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