<template>
    <d-container fluid class="main-content-container px-4 pb-4">
        <!-- Page Header -->
        <d-row no-gutters class="page-header py-4">
            <!-- Page Title -->
            <d-col col sm="4" class="text-center text-sm-left mb-4 mb-sm-0">
                <span class="text-uppercase page-subtitle">Configuration Management</span>
                <h3 class="page-title">Settings</h3>
            </d-col>
        </d-row>
        <d-row>
            <d-col lg="12">
                <d-card>
                    <d-card-body>
                        <Tabs size="small">
                            <TabPane icon="md-person-add" label="Account Management">
                                <AccountManage/>
                            </TabPane>
                            <TabPane icon="md-hammer" label="Tools Configuration">
                                <ToolsConfig/>
                            </TabPane>
                            <TabPane icon="md-cog" label="System configuration">
                                <SystemConfig/>
                            </TabPane>
                        </Tabs>
                    </d-card-body>
                </d-card>
            </d-col>
        </d-row>
    </d-container>
</template>

<script>
    import AccountManage from "./AccountManage";
    import SystemConfig from "./SystemConfig";
    import ToolsConfig from "./ToolsConfig";
    export default {
        name: "Settings",
        components: {
            AccountManage,
            SystemConfig,
            ToolsConfig,
        }
    }
</script>

<style scoped>

</style>