<template>
    <v-navigation-drawer class="ml-4" width="230" v-model="drawer" app clipped color="white lighten-4">
        <v-list dense class="white lighten-4" width="230" >
            <template v-for="(item, i) in items">
                <v-row v-if="item.header" :key="i" align="center">
                    <v-col cols="6">
                        <v-subheader>
                            <h3 >{{ item.text }}</h3>
                        </v-subheader>
                    </v-col>
                </v-row>

                <v-list-group
                        v-else-if="item.group"
                        :key="i"
                        no-action
                        color="teal"
                >
                    <template v-slot:activator>
                        <v-list-item-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title >{{item.text}}</v-list-item-title>
                        </v-list-item-content>
                    </template>

                    <v-list-item
                            v-for="subItem in item.items"
                            :key="i + subItem.text"
                            @click="goToPath(subItem.path)"
                    >
                        <v-list-item-content >
                            <v-list-item-title>
                                <span :class="isPath(subItem.path) ? 'teal--text' : ''">{{ subItem.text }}</span>
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>

                <v-list-item v-else-if="item.dc" :key="i" link @click="goToPath(item.path)" >
                    <v-list-item-action>
                        <v-icon :class="isPath(item.path) ? 'teal--text' : ''">{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>
                            <span :class="isPath(item.path) ? 'teal--text' : ''">{{ item.text }}</span>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-divider v-if="item.divider" :key="i" dark class="my-4"/>
            </template>
        </v-list>

    </v-navigation-drawer>
</template>

<script>
    import sidebarItems from "../sidebar"
    export default {
        name: "SideBar",
        data: () => ({
            drawer: null,
            items: sidebarItems(),
            path: "",
            openNewConnectionDialog: false,
        }),
        methods: {
            isPath(path) {
                if (path === undefined) {
                    return false
                }
                return path === this.path;
            },
            goToPath(path){
                this.path = path;
                this.$router.push(path);
            },
        }
    }
</script>

<style scoped>

</style>