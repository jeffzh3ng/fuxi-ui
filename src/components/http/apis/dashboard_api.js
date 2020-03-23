import request from './request';

const dashboard = {
    count () {
        return request.get("/dashboard/count");
    },
};

export default dashboard;
