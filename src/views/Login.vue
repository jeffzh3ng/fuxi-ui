<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <d-row class="justify-content-center">
        <d-col md="4" sm="6">
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <d-card>
            <!-- Card Header -->
            <d-card-header class="border-bottom text-center">
              <h5 class="m-0"><i class="material-icons">security</i>&nbsp;&nbsp;Access Your Account</h5>
            </d-card-header>

            <d-list-group flush>
              <d-list-group-item class="p-3">
                <d-row>
                  <d-col>
                    <d-form>
                      <d-form-row>
                        <d-col md="12" class="form-group">
                          <label><font size="2">Username</font></label>
                          <d-form-input
                              v-model="loginData.username"
                              type="text"
                              placeholder="Username"
                              @keyup.enter.native="login"/>
                        </d-col>
                      </d-form-row>
                      <d-form-row>
                        <d-col md="12" class="form-group">
                          <label><font size="2">Password</font></label>
                          <d-form-input
                              v-model="loginData.password"
                              type="password"
                              placeholder="Password"
                              @keyup.enter.native="login"/>
                        </d-col>
                      </d-form-row>
                      <d-form-row>
                        <d-col md="12" class="form-group mx-1">
                          <d-checkbox v-model="loginData.expiration">
                            <font size="2">Remember me for 15 days.</font>
                          </d-checkbox>
                        </d-col>
                      </d-form-row>
                      <d-form-row>
                        <d-col md="12" class="form-group">
                          <Button @click="login" type="primary" shape="circle">
                            <i class="material-icons">reply</i>
                            &nbsp;
                            Access Account
                          </Button>
                        </d-col>
                      </d-form-row>
                    </d-form>
                  </d-col>
                </d-row>
              </d-list-group-item>
            </d-list-group>
          </d-card>
        </d-col>
      </d-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data() {
      return {
        loginData: {
          username: '',
          password: '',
          expiration: false
        },
      }
    },
    methods: {
      login(){
        this.$axios.post("token", this.loginData).then(response => {
          let loginRes = response.data;
          if(loginRes.status === "success") {
            this.$message.success(loginRes['message']);
            localStorage.setItem('access_token', loginRes['data']);
            if (localStorage.getItem('access_token')) {
              this.$router.push('/');
            } else {
              this.$message.error("Set token error")
            }
          } else {
            this.$message.error(loginRes.message)
          }
        })
      }
    }
  }
</script>
<style scoped>
</style>
