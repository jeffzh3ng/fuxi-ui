<template>
    <v-snackbar
            v-model="open"
            top
            :timeout="timeout"
            style="font-family: Roboto, sans-serif"
            :color="color"
    >
        <span
                class="text--white"
                style="font-family: Roboto, sans-serif; font-size: medium"
        >
            {{message}}
        </span>
        <v-btn
                color="#ffffff"
                text
                @click="open = false"
        >
            Close
        </v-btn>
    </v-snackbar>
</template>

<script>
    let colorType = {
        error: 'rgb(255, 82, 81)',
        info: 'rgb(0, 151, 167)',
        success: '#009688',
        warning: '#f57c00',
    };
    export default {
        name: "Snackbar",
        components: {},
        data() {
            return {
                timeout: 2500,
                open: false,
                color: colorType['primary'],
                message: ""
            };
        },
        created() {},
        methods: {
            info(message, timeout) {
                this.message = message;
                this.open = true;
                this.timeout = timeout;
                this.color = colorType['info']
            },
            error(message, timeout) {
                this.message = message;
                this.open = true;
                this.timeout = timeout;
                this.color = colorType['error']
            },
            success(message, timeout) {
                this.message = message;
                this.open = true;
                this.timeout = timeout;
                this.color = colorType['success']
            },
            warning(message, timeout) {
                this.message = message;
                this.open = true;
                this.timeout = timeout;
                this.color = colorType['warning']
            }
        }
    };
</script>
<style>


</style>
