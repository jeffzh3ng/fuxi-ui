import request from './request';

const scanner = {
    pocTaskList () {
        return request.get("/scanner/poc/task");
    },
    pocTaskDelete (tid) {
        return request.delete("/scanner/poc/task/" + tid);
    },
    pocPluginDelete (pid) {
        return request.delete("/scanner/poc/plugin/" + pid);
    },
    pocVulDelete (vid) {
        return request.delete("/scanner/poc/vul/" + vid);
    },
    pocVulDetail (vid) {
        return request.get("/scanner/poc/vul/" + vid);
    },
    pocTaskRescan (tid) {
        return request.put("/scanner/poc/task/" + tid + "?action=rescan");
    },
    pocPluginList () {
        return request.get("/scanner/poc/plugin");
    },
    pocNewTask(data) {
        return request.post("/scanner/poc/task", data)
    },
    pocPluginUpload(data) {
        return request.post("/scanner/poc/plugin", data)
    },
    pocPluginCode(pid) {
        return request.get("/scanner/poc/plugin/" + pid)
    },
    pocVulList(keyword) {
        if (keyword.length !== 0) {
            return request.get("/scanner/poc/vul" + keyword)
        }
        return request.get("/scanner/poc/vul")
    },
    sqlmapTaskList() {
        return request.get("/scanner/sqlmap/task")
    },
    sqlmapNewTask(data) {
        return request.post("/scanner/sqlmap/task", data)
    },
    sqlmapTaskDelete(tid) {
        return request.delete("/scanner/sqlmap/task/" + tid)
    },
    sqlmapTaskRescan(tid) {
        return request.put("/scanner/sqlmap/task/" + tid + "?action=rescan")
    },
    sqlmapTaskDetail(tid) {
        return request.get("/scanner/sqlmap/task/" + tid)
    },
    sqlmapTaskResult(tid) {
        return request.get("/scanner/sqlmap/result?keyword=tid&value=" + tid)
    },
    sqlmapResult() {
        return request.get("/scanner/sqlmap/result")
    },
    sqlmapResultDelete(rid) {
        return request.delete("/scanner/sqlmap/result/" + rid)
    },
    sqlmapResultDetail(rid) {
        return request.get("/scanner/sqlmap/result/" + rid)
    },
};

export default scanner;
