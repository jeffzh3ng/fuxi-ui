<template>
    <div>
        <d-button @click="openModalNewUser = true" size="sm" class="btn-accent ml-auto ml-1 mr-4">
            <i class="material-icons mr-1">library_add</i>
            <strong>New User</strong>
        </d-button>
        <d-button @click="openModalChangePasswd = true" size="sm" class="btn-accent ml-auto ml-1 ml-4">
            <i class="material-icons mr-1">lock_open</i>
            <strong>Change Password</strong>
        </d-button>
        <Modal
                v-model="openModalNewUser"
                scrollable
                footer-hide
                title="New Account">
            <div>
                <d-row>
                    <d-col lg="12" md="12" sm="12" class="pt-3">
                        <span class="text-danger mr-1">*</span><span>Username</span>
                        <Input v-model="userData.username" class="pt-1" placeholder="Username..."/>
                    </d-col>
                    <d-col lg="12" md="12" sm="12" class="pt-3">
                        <span>Nick</span>
                        <Input v-model="userData.nick" class="pt-1" placeholder="Not required"/>
                    </d-col>
                    <d-col lg="12" md="12" sm="12" class="pt-3">
                        <span>E-Mail</span>
                        <Input v-model="userData.email" class="pt-1" placeholder="Not required"/>
                    </d-col>
                    <d-col lg="12" md="12" sm="12" class="pt-3">
                        <span class="text-danger mr-1">*</span><span>Password</span>
                        <Input v-model="userData.password" class="pt-1" placeholder="Password" type="password"/>
                        <Input v-model="userData.password_v" class="pt-1" placeholder="Verify" type="password"/>
                    </d-col>
                    <d-col class="pt-4 text-right" lg="12" md="12" sm="12">
                        <Button @click="newUser">
                            <i class="material-icons mr-1">add_box</i>
                            Submit
                        </Button>
                    </d-col>
                </d-row>
            </div>
        </Modal>
        <Modal
                v-model="openModalEditUser"
                scrollable
                footer-hide
                title="Modify User Information">
            <div>
                <d-row>
                    <d-col lg="12" md="12" sm="12" class="pt-3">
                        <span class="text-danger mr-1">*</span><span>Username</span>
                        <Input v-model="tempUserData.username" class="pt-1" placeholder="Username..."/>
                    </d-col>
                    <d-col lg="12" md="12" sm="12" class="pt-3">
                        <span>Nick</span>
                        <Input v-model="tempUserData.nick" class="pt-1" placeholder="Not required"/>
                    </d-col>
                    <d-col lg="12" md="12" sm="12" class="pt-3">
                        <span>E-Mail</span>
                        <Input v-model="tempUserData.email" class="pt-1" placeholder="Not required"/>
                    </d-col>

                    <d-col class="pt-4 text-right" lg="12" md="12" sm="12">
                        <Button @click="editUser(tempUserData.uid)">
                            <i class="material-icons mr-1">add_box</i>
                            Submit
                        </Button>
                    </d-col>
                </d-row>
            </div>
        </Modal>
        <Modal
                v-model="openModalChangePasswd"
                scrollable
                footer-hide
                title="Change Password">
            <div>
                <d-row>
                    <d-col lg="12" md="12" sm="12" class="pt-3">
                        <span class="text-danger mr-1">*</span><span>New Password</span>
                        <Input v-model="passwdData.password" type="password" class="pt-2" placeholder="Password"/>
                    </d-col>
                    <d-col lg="12" md="12" sm="12" class="pt-3">
<!--                        <span class="text-danger mr-1">*</span><span>Verify</span>-->
                        <Input v-model="passwdData.password_v" type="password" class="pt-1" placeholder="Verify"/>
                    </d-col>
                    <d-col class="pt-4 text-right" lg="12" md="12" sm="12">
                        <Button @click="changePassword">
                            <i class="material-icons mr-1">add_box</i>
                            Submit
                        </Button>
                    </d-col>
                </d-row>
            </div>
        </Modal>
        <table class="table mt-4">
            <thead class="bg-light">
                <tr>
                    <th scope="col" class="border-0 text-center">#</th>
                    <th scope="col" class="border-0">Name</th>
                    <th scope="col" class="border-0">Nick</th>
                    <th scope="col" class="border-0">Role</th>
                    <th scope="col" class="border-0">E-Mail</th>
                    <th scope="col" class="border-0">Date</th>
                    <th scope="col" class="border-0 text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in tableData">
                    <td class="text-center">{{ index + 1 }}</td>
                    <td>{{item['username']}}</td>
                    <td>{{item['nick']}}</td>
                    <td>{{item['role']}}</td>
                    <td>{{item['email']}}</td>
                    <td>{{item['date']}}</td>
                    <td class="text-center">
                        <Tooltip placement="top" content="Edit" theme="light">
                            <Icon @click="openEditUserModal(item['uid'], item['username'], item['nick'], item['email'])" class="mx-2" title="Edit" size="21" type="ios-create" />
                        </Tooltip>
                        <Tooltip placement="top" content="Delete" theme="light">
                            <Icon @click="deleteUser(item['uid'])" title="Delete" size="21" type="ios-trash" />
                        </Tooltip>
                    </td>
                </tr>
            </tbody>
        </table>
        <br>
        <Page
                class="mx-4"
                :total="getRowCount(items)"
                show-elevator
                show-total
                show-sizer
                :page-size="pageSize"
                @on-page-size-change="sizeChange"
                @on-change="pageChange"/>
    </div>
</template>

<script>
    export default {
        name: "AccountManage",
        data() {
            return {
                items: [],
                tableData: [],
                pageSize: 10,
                pageCurrent: 1,
                reqApiPath: "/settings/user",
                openModalNewUser: false,
                userData: {
                    username: "",
                    nick: "",
                    email: "",
                    password: "",
                    password_v: "",
                },
                tempUserData: {
                    uid: "",
                    username: "",
                    nick: "",
                    email: "",
                },
                passwdData: {
                    password: "",
                    password_v: "",
                },
                openModalEditUser: false,
                openModalChangePasswd: false
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getRowCount(items) {
                return items.length
            },
            pageChange(currentPage) {
                let _start = (currentPage - 1) * this.pageSize;
                let _end = currentPage * this.pageSize;
                this.tableData = this.items.slice(_start, _end);
                this.pageCurrent = currentPage;
            },
            sizeChange(index) {
                this.pageSize = index;
                let _start = 0;
                let _end = this.pageSize;
                this.tableData = this.items.slice(_start, _end);
            },
            getData() {
                this.$axios.get(this.reqApiPath).then(response => {
                    let status = response['data']['status'];
                    let data = response['data']['result'];
                    if (status['status'] === 'success') {
                        this.items = data;
                        let _start = (this.pageCurrent - 1) * this.pageSize;
                        let _end = this.pageCurrent * this.pageSize;
                        this.tableData = this.items.slice(_start, _end);
                        this.spinShow = false
                    } else {
                        this.$message.error(status['message']);
                        this.spinShow = false
                    }
                })
            },
            newUser() {
                if (this.userData.username.length === 0 ){
                    this.$message.error("Please enter username!");
                    return
                }
                if (this.userData.password_v !== this.userData.password) {
                    this.$message.error("Password and confirm password don't match!");
                } else {
                    let data = {
                        username: this.userData.username,
                        nick: this.userData.nick,
                        email: this.userData.email,
                        password: this.userData.password,
                    };
                    this.openModalNewUser = false;
                    this.$axios.post("/admin", data).then(response => {
                        let status = response['data']['status'];
                        if (status['status'] === 'success') {
                            this.$message.success(status['message']);
                            this.openModalNewUser = false;
                            this.userData = {
                                username: "",
                                nick: "",
                                email: "",
                                password: "",
                                password_v: "",
                            };
                            this.getData()
                        } else {
                            this.$message.error(status['message']);
                            this.getData()
                        }
                    })
                }
            },
            changePassword(){
                if (this.passwdData.password_v !== this.passwdData.password) {
                    this.$message.error("Password and confirm password don't match!");
                } else {
                    let data = {
                        username: "",
                        password: this.passwdData.password,
                    };
                    this.openModalChangePasswd = false;
                    this.$axios.put("/admin", data).then(response => {
                        let status = response['data']['status'];
                        if (status['status'] === 'success') {
                            this.$message.success(status['message']);
                            this.openModalNewUser = false;
                            this.passwdData = {
                                password: "",
                                password_v: "",
                            };
                            this.getData()
                        } else {
                            this.$message.error(status['message']);
                            this.getData()
                        }
                    })
                }
            },
            openEditUserModal(uid, username, nick, email) {
                this.tempUserData.uid = uid;
                this.tempUserData.username = username;
                this.tempUserData.nick = nick;
                this.tempUserData.email = email;
                this.openModalEditUser = true;
            },
            editUser(uid) {
                this.openModalEditUser = false;
                let data = this.tempUserData;
                this.tempUserData = {
                    uid: "",
                    username: "",
                    nick: "",
                    email: "",
                };
                this.$axios.put(this.reqApiPath + "/" + uid, data).then(response => {
                    let status = response['data']['status'];
                    if (status['status'] === 'success') {
                        this.$message.success(status['message']);
                        this.getData()
                    } else {
                        this.$message.error(status['message']);
                        this.getData()
                    }
                })
            },
            deleteUser(uid) {
                this.$Modal.confirm({
                    title: 'WARNING',
                    content: 'Are you sure you want to delete this account?',
                    closable: true,
                    okText: 'OK',
                    cancelText: 'Cancel',
                    onOk: () => {
                        this.$axios.delete(this.reqApiPath + "/" + uid).then(response => {
                            let status = response['data']['status'];
                            if (status['status'] === 'success') {
                                this.$message.success(status['message']);
                                this.getData()
                            } else {
                                this.$message.error(status['message']);
                                this.getData()
                            }
                        })
                    }});
            },
        }
    }
</script>

<style scoped>

</style>