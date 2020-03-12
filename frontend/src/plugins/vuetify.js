import Vue from "vue";
import Vuetify from "vuetify/lib";
import variables from '@/assets/scss/variables.scss';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'mdi',
        values: {},
    },
    theme: {
        themes: {
            light: {
                primary: variables.primaryColor,
                secondary: variables.secondaryColor,
                success: variables.successColor,
                error: variables.errorColor,
                info: variables.infoColor,
                accent: variables.accentColor,
                warning: variables.warningColor,
            },
        },
    },
});
