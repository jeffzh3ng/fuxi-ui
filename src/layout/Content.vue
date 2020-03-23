<template>
    <v-content>
        <v-container fluid>
            <v-row align="center" justify="center" class="mr-2 ml-2 mt-2">
                <v-col cols="12">
                    <v-card
                            min-height="650"
                            elevation="4"
                    >
                        <router-view/>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-content>
</template>

<script>
    export default {
        name: "Content"
    }
</script>

<style scoped>

</style>