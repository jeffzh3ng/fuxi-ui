import request from './request';

const setting = {
    userList () {
        return request.get("/settings/user");
    },
    userDelete (uid) {
        return request.delete("/settings/user/" + uid);
    },
    userAdd (data) {
        return request.post("/admin", data);
    },
    userUpdate (uid, data) {
        return request.put("/settings/user/"+ uid, data);
    },
    changePassword (data) {
        return request.put("admin", data);
    },
    whoami() {
        return request.get("who");
    },
    settingList() {
        return request.get("/settings/basic");
    },
    updateSetting(cid, data) {
        return request.put("/settings/basic/" + cid, data);
    },
};

export default setting;
