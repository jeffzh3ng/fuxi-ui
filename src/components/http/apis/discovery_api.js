import request from './request';

const discovery = {
    portTaskList () {
        return request.get("/discovery/port/task");
    },
    portTaskDelete (tid) {
        return request.delete("/discovery/port/task/" + tid);
    },
    portTaskRescan (tid) {
        return request.put("/discovery/port/task/" + tid + "?action=rescan");
    },
    portTaskDetail (tid) {
        return request.get("/discovery/port/task/" + tid);
    },
    portHostDelete (hid) {
        return request.delete("/discovery/port/host/" + hid);
    },
    portTaskNew (data) {
        return request.post("/discovery/port/task", data);
    },
    portTaskResult (tid) {
        return request.get("/discovery/port/task/host/" + tid);
    },
    portHostDetail (hid) {
        return request.get("/discovery/port/host/" + hid);
    },
    fpResult (search="") {
        if (search.length === 0) {
            return request.get("/discovery/fp/search");
        }
        return request.get("/discovery/fp/search" + search);
    },
    whatwebTempScan (data) {
        return request.post("/discovery/whatweb/task/test", data);
    },
    whatwebAdScan (data) {
        return request.post("/discovery/whatweb/task", data);
    },
    whatwebTaskList () {
        return request.get("/discovery/whatweb/task");
    },
    whatwebTaskDelete (tid) {
        return request.delete("/discovery/whatweb/task/" + tid);
    },
    whatwebTaskResult (tid) {
        return request.get("/discovery/whatweb/task/" + tid);
    },
    whatwebTaskResultDelete (rid) {
        return request.delete("/discovery/fp/result/" + rid);
    },
    subdomainTaskNew (data) {
        return request.post("/discovery/subdomain/task", data);
    },
    subdomainTaskList () {
        return request.get("/discovery/subdomain/task");
    },
    subdomainTaskDelete (tid) {
        return request.delete("/discovery/subdomain/task/" + tid);
    },
    subdomainTaskRescan (tid) {
        return request.put("/discovery/subdomain/task/" + tid, {"action": "rescan"});
    },
    subdomainResultList (tid = "") {
        if (tid.length === 0) {
            return request.get("/discovery/subdomain/result");
        }
        return request.get("/discovery/subdomain/result?keyword=tid&value=" + tid);
    },
    subdomainResultDelete (rid) {
        return request.delete("/discovery/subdomain/result/" + rid);
    },
};

export default discovery;
