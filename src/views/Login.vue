<template>
    <v-app id="inspire">
        <v-content>
            <v-container fluid>
                <v-row justify="center">
                    <v-col cols="12" sm="8" md="4">
                        <br><br><br><br>
                        <v-card class="elevation-12 mt-lg-12">
                            <v-toolbar color="teal" dark flat>
                                <v-toolbar-title>SIGN IN</v-toolbar-title>
                                <v-spacer />
                            </v-toolbar>
                            <v-card-text @keydown.enter=login>
                                <v-form >
                                    <v-text-field
                                            label="Login"
                                            name="login"
                                            color="teal"
                                            :rules="[v => !!v || 'Username is required']"
                                            prepend-icon="mdi-account"
                                            type="text"
                                            v-model="username"
                                    />
                                    <v-text-field
                                            label="Password"
                                            name="password"
                                            color="teal"
                                            prepend-icon="mdi-lock"
                                            :rules="[v => !!v || 'Password is required']"
                                            type="password"
                                            v-model="password"
                                    />
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer />
                                <v-btn
                                        color="teal"
                                        class="mr-2 mb-3"
                                        @click="login"
                                ><span class="white--text">Login</span></v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    export default {
        name: "Login",
        data:() => {
            return {
                username: "",
                password: "",
            }
        },
        methods: {
            login() {
                if (this.username.length === 0) {
                    this.$message.error("Please enter your username");
                    return
                }
                if (this.password.length === 0) {
                    this.$message.error("Please enter your password");
                    return
                }
                this.$api.auth.getToken(this.username, this.password).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if(status['status'] === "success") {
                        localStorage.setItem('access_token', result);
                        if (localStorage.getItem('access_token')) {
                            this.$api.TOKEN = result;
                            this.$router.push('/');
                        } else {
                            this.$message.error("set token failed")
                        }
                    } else {
                        this.password = "";
                        this.$message.error(status['message']);
                    }
                });
            }
        }
    }
</script>