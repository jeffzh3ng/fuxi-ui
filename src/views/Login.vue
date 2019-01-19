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
              <h5 class="m-0">Access Your Account</h5>
            </d-card-header>

            <d-list-group flush>
              <d-list-group-item class="p-3">
                <d-row>
                  <d-col>
                    <d-form>
                      <d-form-row>
                        <d-col md="12" class="form-group">
                          <label>Username</label>
                          <d-form-input type="text" placeholder="Username" />
                        </d-col>
                      </d-form-row>
                      <d-form-row>
                        <d-col md="12" class="form-group">
                          <label>Password</label>
                          <d-form-input type="text" placeholder="Password"/>
                        </d-col>
                      </d-form-row>
                      <d-form-row>
                        <d-col md="12" class="form-group mx-1">
                          <d-checkbox>Remember me for 30 days.</d-checkbox>
                        </d-col>
                      </d-form-row>
                      <d-form-row>
                        <d-col md="12" class="form-group">
                          <Button type="primary" long shape="circle"> Access Account</Button>
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
    name: 'Register'
  }
</script>
<style scoped>
  .cardBule {
    overflow: hidden;
    -webkit-box-shadow: inset 0 4px 0 0 #007bff;
    box-shadow: inset 0 4px 0 0 #007bff;
    border-radius: .625rem;
  }
  .card-body {
    /* overflow: hidden; */
    /* -webkit-box-shadow: inset 0 4px 0 0 #007bff; */
    box-shadow: inset 0 4px 0 0 #007bff;
    border-radius: 0.625rem;
    border: 1rem;
    padding: 1.875rem;
    -ms-flex: 1 1 auto;
    -webkit-box-flex: 1;
    flex: 1 1 auto;
  }
</style>
