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
        exercises: [],
        workouts: [],
        activeWorkout: null
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
        UPDATE_EXERCISES(state, payload) {
            state.exercises = payload;
        },
        UPDATE_WORKOUTS(state, payload) {
            state.workouts = payload;
        },
        UPDATE_ACTIVE_WORKOUT(state, payload) {
            state.activeWorkout = payload;
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
        updateExercises({
            commit
        }, payload) {
            commit('UPDATE_EXERCISES', payload);
        },
        updateWorkouts({
            commit
        }, payload) {
            commit('UPDATE_WORKOUTS', payload);
        },
        updateActiveWorkout({
            commit
        }, payload) {
            commit('UPDATE_ACTIVE_WORKOUT', payload);
        },
        resetActiveWorkout({
            commit
        }, payload) {
            const defaultState = getDefaultState();
            commit('UPDATE_ACTIVE_WORKOUT', defaultState.activeWorkout);
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
        exercises: state => state.exercises,
        getExercise: state => (id) => {
            const exercise = state.exercises.find(x => x.id === id);
            return exercise;
        },
        workouts: state => state.workouts,
        activeWorkout: state => state.activeWorkout,
        // getWorkoutExercise: state => (workoutExerciseId) => {
        //     const workoutExercise = state.activeWorkout.exercises.find(x => x.workout_exercise_id === workoutExerciseId);
        //     return workoutExercise;
        // },
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
