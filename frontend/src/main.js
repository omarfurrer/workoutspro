import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import AppHelper from '@/helpers/AppHelper'
import WorkoutsService from '@/services/WorkoutsService'
import axios from 'axios';

Vue.config.productionTip = false;

Vue.prototype.$helpers = {
    AppHelper
};

Vue.prototype.$services = {
    WorkoutsService
};


// Add token to all requests if found
axios.interceptors.request.use((config) => {

    if (store.getters.isLoggedIn && store.getters.token) {
        config.headers.common['Authorization'] = `Bearer ${store.getters.token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Handle specific response codes
axios.interceptors.response.use((response) => {

    // if (response.status === 0 && response.code == '401') {
    //     store.actions.logout();
    //     window.location = '/login?login_error_message=You have been logged out due to inactivity. Please log in.';
    // }

    // if (response.data.status === 0 && response.data.code == '403') {
    //     toastr.error(response.data.errors[0], 'Error!');
    //     response.data.data = [];
    // }

    return response;
}, (error) => {

    if (error.response.status === 401) {
        store.dispatch('logout');
        window.location = '/login?login_error_message=You have been logged out due to inactivity. Please log in.';
    }

    return Promise.reject(error);
});

// axios.defaults.withCredentials = true;

// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

Vue.prototype.$axios = axios;

Vue.prototype.$eventHub = new Vue();


new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount("#app");
