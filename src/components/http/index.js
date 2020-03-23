import scanner from './apis/scanner_api';
import discovery from './apis/discovery_api';
import auth from './apis/auth_api';
import exploit from './apis/exploit_api';
import dashboard from './apis/dashboard_api';
import setting from './apis/setting_api';

let SERVER_ADDER = "";
if (process.env.VUE_APP_ENV === "production") {
    SERVER_ADDER = window.location.protocol + "//" + window.location.host + "/api/v1";
} else {
    SERVER_ADDER = process.env.VUE_APP_BASE_API
}
let TOKEN = localStorage.getItem('access_token');


export default {
    SERVER_ADDER,
    TOKEN,
    auth,
    scanner,
    discovery,
    exploit,
    dashboard,
    setting,
}