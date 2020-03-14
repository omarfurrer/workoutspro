import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
// import Echo from "laravel-echo";
// window.Pusher = require('pusher-js');

/**
 * 
 * *** OVERVIEW ***
 * 
 * vue
 *  Unauthed
 *    Login
 *  Authed
 */

// Layouts
import AuthedLayout from '../layouts/Authed/Authed.vue';
import UnauthedLayout from '../layouts/Unauthed/Unauthed.vue';

// Pages
import LoginPage from '../pages/Login/Login.vue';
// import DashboardPage from '../pages/Dashboard/Dashboard.vue';
import HistoryPage from '../pages/History/History.vue';

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: 'login'
    },
    {
        path: '/',
        component: UnauthedLayout,
        children: [
            // {
            //     path: '',
            //     component: LandingPage
            // },
            {
                path: 'login',
                component: LoginPage
            },
            // {
            //     path: 'password/forgot',
            //     component: ForgotPasswordPage
            // },
            // {
            //     path: 'password/reset',
            //     component: ResetPasswordPage
            // },
            // {
            //     path: 'verification/resend',
            //     component: ResendVerificationEmailPage
            // }
        ]
    },
    {
        path: '/',
        component: AuthedLayout,
        meta: {
            requireAuth: true
        },
        children: [{
            path: 'dashboard',
            component: HistoryPage
        }]
    },
    {
        path: '*',
        redirect: '/'
    }
];


const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

// make sure store has been updated before moving on to next route
router.beforeEach(async (to, from, next) => {
    await store.restored
    next()
});

// Auth middleware
router.beforeEach((to, from, next) => {

    const isLoggedIn = store.getters.isLoggedIn;
    const requiresAuth = to.matched.some(record => record.meta.requireAuth);

    if (!isLoggedIn) {
        if (window.Echo) {
            // Leave Pusher channel for notifications  
            // window.Echo.leave(`private-App.Models.User.${store.getters.user.id}`);
        }
    } else {
        // initiate Pusher if logged in and pusher is not defined
        // if (!window.Echo) {
        //     window.Echo = new Echo({
        //         broadcaster: 'pusher',
        //         key: AppHelper.getEnv('VUE_APP_PUSHER_KEY'),
        //         cluster: AppHelper.getEnv('VUE_APP_PUSHER_CLUSTER'),
        //         encrypted: true,
        //         auth: {
        //             headers: {
        //                 'Authorization': 'Bearer ' + store.getters.token
        //             }
        //         }
        //     });
        // }
    }

    if (requiresAuth && !isLoggedIn) {
        // redirect to login page if not logged in and requires auth
        next(`/login?redirect=${to.fullPath}&login_error_message=Please login first to continue`);
    } else if (!requiresAuth && isLoggedIn) {
        // redirect to dashboard if logged in and does not require auth
        next('/dashboard');
    } else {
        next();
    }

});

export default router
