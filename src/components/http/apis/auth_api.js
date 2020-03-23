import request from './request';

const auth = {
    getToken (username, password) {
        return request.get("/token?username=" + username + "&password=" + password);
    },
};

export default auth;

