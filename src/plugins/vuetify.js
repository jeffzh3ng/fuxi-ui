import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import FlagIcon from 'vue-flag-icon'
import colors from "vuetify/lib/util/colors";

import '@mdi/font/css/materialdesignicons.css'
import "roboto-fontface/css/roboto/roboto-fontface.css"


Vue.filter('capitalize',function(val){
    if (val.length === 0) {
        return val
    }
    return val[0].toUpperCase() + val.slice(1);
});

Vue.filter('long',function(val){
    if (val.length < 35) {
        return val
    }
    return val.substring(0, 32) + "...";
});

Vue.use(FlagIcon);

Vue.use(Vuetify, {
    iconfont: 'mdi',
});

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: colors.teal.base,
            },
        },
    },
});
