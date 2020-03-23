import Axios from 'axios'
import message from '../../message'
import router from "../../../router";

let API_PATH = "";
if (process.env.VUE_APP_ENV === "production") {
    API_PATH = window.location.protocol + "//" + window.location.host + "/api/v1";
} else {
    API_PATH = process.env.VUE_APP_BASE_API
}

const request = Axios.create({
    // timeout: 20000,
    baseURL: API_PATH
});

request.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['token']  = token;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

request.interceptors.response.use((response) => {
    if (response.data['status']['code'] === 10401) {
        window.localStorage.removeItem('access_token');
        message.error('The token used in the request has expired.');
        router.push({path: '/login'}).then(r => {window.console.log(r)});
    }
    return response;
}, (error) => {
    if (error.response) {
        let status_code = error.response.status;
        if (status_code === 401) {
            window.localStorage.removeItem('access_token');
            message.error('The token used in the request has expired');
            router.push({path: '/login'}).then(r => {window.console.log(r)});
        } else if (status_code === 500) {
            message.error('Internal Server Error');
        } else {
            message.error('Unknown error');
        }
    } else {
        message.error('Network issue. Please check your internet connection');
    }
    return Promise.reject(error.response.data)
});

export default request
