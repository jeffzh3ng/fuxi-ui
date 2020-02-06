<template>
    <div>{{ nowDate }}</div>
</template>

<script>
    export default {
        name: "Demo",
        data() {
            return {
                nowDate: "",
            }
        },
        mounted() {
            this.nowDate = "wait 3s...";
            setTimeout(function(){
                this.getDate()
            }, 3000);
        },
        methods: {
            getDate() {
                this.nowDate = new Date();
            }
        }
    }
</script>

<style scoped>

</style>