<template>
    <v-app id="keep">
        <TopToolbar/>
        <SideBar/>
        <Content/>
    </v-app>
</template>

<script>
    import TopToolbar from "./TopToolbar";
    import SideBar from "./SideBar";
    import Content from "./Content";
    export default {
        components: {
            TopToolbar,
            SideBar,
            Content
        },
        data: () => ({
            drawer: null,
        }),
    }
</script>

<style>
    #keep .v-navigation-drawer__border {
        display: none
    }
</style>