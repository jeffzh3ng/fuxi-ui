import Vue from "vue";
import Message from "./Message";

const v = new Vue({
    render(createElement) {
        return createElement(Message);
    }
});

v.$mount();

document.body.appendChild(v.$el);

const message = v.$children[0];

function info(content, timeout=3000) {
    message.info(content, timeout);
}

function error(content, timeout=3000) {
    message.error(content, timeout);
}

function success(content, timeout=3000) {
    message.success(content, timeout);
}

function warning(content, timeout=3000) {
    message.warning(content, timeout);
}

export default {
    info,
    error,
    warning,
    success
}