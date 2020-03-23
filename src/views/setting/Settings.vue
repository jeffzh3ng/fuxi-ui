<template>
    <div>
        <v-card-title>
            <v-list-item-action>
                <v-icon class="teal--text">mdi-cog-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content class="ml-n4">
                <v-list-item-title class="teal--text">
                    <span>SETTINGS</span>
                </v-list-item-title>
            </v-list-item-content>
        </v-card-title>

        <v-row class="mt-n4 ml-3">
            <v-col cols="12">
                <v-tabs v-model="tab">
                    <v-tab key="account">
                        Account
                    </v-tab>
                    <v-tab key="tools">
                        Tools
                    </v-tab>
                </v-tabs>

                <v-tabs-items v-model="tab">
                    <v-tab-item key="account" class="ml-n2">
                        <v-col cols="12">
                            <AccountSetting/>
                        </v-col>
                    </v-tab-item>

                    <v-tab-item key="tools">
                        <v-col cols="12">
                            <ToolsSetting/>
                        </v-col>
                    </v-tab-item>
                </v-tabs-items>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    import AccountSetting from "./AccountSetting"
    import ToolsSetting from "./ToolsSetting"
    export default {
        name: "Settings",
        components: {
            AccountSetting,
            ToolsSetting,
        },
        data: () => ({
            tab: null,
        })
    }
</script>

<style scoped>

</style>