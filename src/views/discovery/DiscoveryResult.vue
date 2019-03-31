<template>
  <d-container fluid class="main-content-container px-4 pb-4">
    <!-- Page Header -->
    <d-row no-gutters class="page-header py-4">
      <!-- Page Title -->
      <d-col col sm="4" class="text-center text-sm-left mb-4 mb-sm-0">
        <!--<span class="text-uppercase page-subtitle">Task result</span>-->
        <h3 class="page-title">{{taskInfoData.name}}</h3>
      </d-col>
    </d-row>
    <d-row>
      <d-col lg="4">
        <d-card class="card-small mb-12">
          <!-- Card Header -->
          <d-card-header class="border-bottom">
            <h5 class="m-0">Scan Details</h5>
          </d-card-header>
          <d-card-body class="p-0">
            <d-list-group flush>
              <d-list-group-item class="p-3">
                <span class="d-flex mb-2">
                  <strong class="mr-1">
                    <i class="material-icons mr-1">flag</i>Name:</strong>
                  <a class="ml-auto">{{taskInfoData.name}}</a>
                </span>
                <span class="d-flex mb-2">
                  <strong class="mr-1">
                    <i class="material-icons mr-1">replay</i>Status:</strong>
                  <a class="ml-auto">{{taskInfoData.status}}</a>
                </span>
                <span class="d-flex mb-2">
                  <strong class="mr-1">
                    <i class="material-icons mr-1">center_focus_strong</i>Target:</strong>
                  <a class="ml-auto">
                    <ul style="list-style-type:none" v-for="item in taskInfoData.target">
                      <li>{{item}}</li>
                    </ul>
                  </a>
                </span>
                <span class="d-flex mb-2">
                  <strong class="mr-1">
                    <i class="material-icons mr-1">gamepad</i>Scanner:</strong>
                  <a class="ml-auto">
                    <ul style="list-style-type:none" v-for="item in taskInfoData.plugin">
                      <li>{{item}}</li>
                    </ul>
                  </a>
                </span>
                <span class="d-flex mb-2">
                  <strong class="mr-1">
                    <i class="material-icons mr-1">access_time</i>Start:</strong>
                  <a class="ml-auto">{{taskInfoData.date}}</a>
                </span>
                <span class="d-flex">
                  <strong class="mr-1">
                    <i class="material-icons mr-1">check_circle</i>End:</strong>
                  <a class="ml-auto">{{taskInfoData.end_date}}</a>
                </span>
              </d-list-group-item>
            </d-list-group>
          </d-card-body>
        </d-card>
        <br>
        <d-card class="card-small mb-12">
          <!-- Card Header -->
          <d-card-header class="border-bottom">
            <h5 class="m-0">Hosts</h5>
          </d-card-header>
          <d-card-body class="p-0">
            <d-list-group flush>
              <d-list-group-item class="p-3">
                <div  v-for="host in taskInfoData.host" >
                  <strong class="mr-1">
                    <i class="material-icons mr-1">check</i>{{host}}</strong>
                </div>
              </d-list-group-item>
            </d-list-group>
          </d-card-body>
        </d-card>
      </d-col>

      <d-col lg="8">
        <d-card class="card-small mb-12">
          <!-- Card Header -->
          <d-card-header class="border-bottom">
            <h5 class="m-0">Port</h5>
          </d-card-header>
          <d-card-body class="p-0">
            <d-list-group flush>
              <d-list-group-item class="px-3">
                <div v-for="item in hostInfoData">
                  <d-list-group flush >
                    <d-list-group-item class="p-0">
                      <h4 class="mr-1 dis-font-ip">
                        <span>{{item.host}} </span>
                        <span><Tag class="dis-font-port" color="default">{{item.port}}</Tag></span>
                      </h4>
                      <d-row>
                        <d-col lg="4">
                          <span class="d-flex dis-font-date">{{item.hostname}}</span>

                          <span class="d-flex dis-font-city">CN, Zhejiang - Hangzhou</span>
                          <span class="d-flex dis-font-date">{{item.date}}</span>
                        </d-col>
                        <d-col lg="8">
                          <p>{{item.res}}</p>
                        </d-col>
                      </d-row>
                    </d-list-group-item>
                  </d-list-group>
                  <br>
                </div>
              </d-list-group-item>
            </d-list-group>
          </d-card-body>
        </d-card>
      </d-col>
    </d-row>
  </d-container>
</template>

<script>
  export default {
    name: "DiscoveryResult",
    data() {
      return {
        taskID: "",
        taskInfoData: {
          tid: "",
          name: "",
          target: [],
          plugin: [],
          desc: "",
          status: "",
          date: "",
          end_date: "",
        },
        hostInfoData: {
          host: "",
          hostname: "",
          port: "",
          res: "",
          date: "",
        }
      }
    },
    mounted() {
      this.taskID = this.$route.params.tid;
      if (this.taskID) {
        this.$axios.get('discovery/task/' + this.taskID).then(response => {
          let resTask = response.data;
          if (resTask['status'] === 'success') {
            this.taskInfoData = resTask['data'];
          } else {
            this.$message.error(resTask.message)
          }
        });
        this.$axios.get('discovery/host/tid/' + this.taskID).then(response => {
          let resHost = response.data;
          if (resHost['status'] === 'success') {
            this.hostInfoData = resHost['data'];
          } else {
            this.$message.error(resHost.message)
          }
        });
      } else {
        this.message.warning("The request was invalid")
      }
    }
  }
</script>

<style scoped>
  .dis-font-port {
    color: #000;
    font-size: 13px;
    font-weight: 700;
  }
  .dis-font-ip {
    color: #444;
    font-size: 18px;
    font-weight: 700;
    line-height: 20px;
  }
  .dis-font-city {
    color: #000;
    font-size: 10px;
    font-weight: 400;
    margin-left: 0;
    line-height: 18px;
    text-decoration: none;
  }
  .dis-font-date {
    color: #aaa;
    font-size: 10px;
    font-weight: 400;
  }

</style>
