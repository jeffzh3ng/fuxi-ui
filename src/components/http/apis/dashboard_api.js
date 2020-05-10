import request from './request';

const dashboard = {
    count () {
        return request.get("/dashboard/count");
    },
    runningTaskList () {
        return request.get("/dashboard/running");
    },
    systemInfo () {
        return request.get("/dashboard/system");
    },
    taskStop (cid, table, tid) {
        return request.delete("dashboard/task/stop/" + cid + "?table=" + table + "&tid=" + tid);
    },
};

export default dashboard;
