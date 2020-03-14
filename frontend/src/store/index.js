import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import localforage from 'localforage';
import AppHelper from '@/helpers/AppHelper';

/**
 * https://github.com/championswimmer/vuex-persist#note-on-localforage-and-async-stores
 */

Vue.use(Vuex);

const getDefaultState = () => {
    return {
        user: {},
        token: null,
        workouts: []
    }
};

export default new Vuex.Store({
    state: getDefaultState(),
    mutations: {
        UPDATE_USER(state, payload) {
            state.user = payload;
        },
        UPDATE_TOKEN(state, payload) {
            state.token = payload;
        },
        UPDATE_WORKOUTS(state, payload) {
            state.workouts = payload;
        },
        LOG_OUT(state) {
            // Merge rather than replace so we don't lose observers
            // https://github.com/vuejs/vuex/issues/1118
            Object.assign(state, getDefaultState())
        },
    },
    actions: {
        updateUser({
            commit
        }, payload) {
            commit('UPDATE_USER', payload);
        },
        updateToken({
            commit
        }, payload) {
            commit('UPDATE_TOKEN', payload);
        },
        updateWorkouts({
            commit
        }, payload) {
            commit('UPDATE_WORKOUTS', payload);
        },
        logout({
            commit
        }) {
            commit('LOG_OUT');
        }
    },
    getters: {
        user: state => state.user,
        token: state => state.token,
        isLoggedIn: state => !!state.token,
        workouts: state => state.workouts
    },
    modules: {},
    plugins: [new VuexPersistence({
        key: 'workoutspro',
        storage: localforage, // using localForage for indexeddb support
        asyncStorage: true,
        reducer: state => {
            // Some props need to be refreshed in case they were changed in the .env
            // const defaultState = getDefaultState();
            // state.baseAsset = defaultState.baseAsset;
            return state;
        },
    }).plugin]
});
