import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import localforage from 'localforage';
import AppHelper from '@/helpers/AppHelper';
import WorkoutsService from '@/services/WorkoutsService';
import moment from 'moment';

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
        ADD_ACTIVE_WORKOUT_EXERCISE(state, payload) {
            state.activeWorkout.exercises.push(payload);
        },
        ADD_ACTIVE_WORKOUT_EXERCISE_SET(state, payload) {
            const {
                exerciseIndex,
                setData
            } = payload;
            state.activeWorkout.exercises[exerciseIndex].sets.push(setData);
        },
        UPDATE_ACTIVE_WORKOUT_EXERCISE_SET_PREVIOUS(state, payload) {
            const {
                exerciseIndex,
                setIndex,
                previousSetData
            } = payload;
            state.activeWorkout.exercises[exerciseIndex].sets[setIndex].previous = previousSetData;
        },
        UPDATE_ACTIVE_WORKOUT_EXERCISE_SET(state, payload) {
            const {
                exerciseIndex,
                setIndex,
                setData
            } = payload;
            state.activeWorkout.exercises[exerciseIndex].sets[setIndex] = setData;
        },
        REMOVE_ACTIVE_WORKOUT_EXERCISE_SET(state, payload) {
            const {
                exerciseIndex,
                setIndex
            } = payload;
            state.activeWorkout.exercises[exerciseIndex].sets.splice(setIndex, 1);
        },
        REMOVE_ACTIVE_WORKOUT_EXERCISE(state, payload) {
            const {
                exerciseIndex
            } = payload;
            state.activeWorkout.exercises.splice(exerciseIndex, 1);
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
        addActiveWorkoutExercises({
            dispatch
        }, payload) {
            const {
                exerciseIds,
                nOfSets = 3,
                shouldCalulatePrevious = true
            } = payload;
            for (let i = 0; i < exerciseIds.length; i++) {
                dispatch('addActiveWorkoutExercise', {
                    exerciseId: exerciseIds[i],
                    nOfSets,
                    shouldCalulatePrevious
                });
            }
        },
        addActiveWorkoutExercise({
            commit,
            getters,
            dispatch
        }, payload) {
            const {
                exerciseId,
                nOfSets = 3,
                shouldCalulatePrevious = true
            } = payload;
            const exercise = getters.getExercise(exerciseId);
            const sets = [];
            for (let i = 0; i < nOfSets; i++) {
                sets.push({
                    weight: null,
                    reps: null,
                    completed_at: null,
                    previous: null
                });
            }
            commit('ADD_ACTIVE_WORKOUT_EXERCISE', {
                id: exercise.id,
                name: exercise.name,
                sets: sets
            });
            if (shouldCalulatePrevious) {
                for (let i = 0; i < nOfSets; i++) {
                    dispatch('calculateActiveWorkoutPreviousSet', {
                        exerciseIndex: getters.activeWorkout.exercises.length - 1,
                        setIndex: i
                    });
                }
            }
        },
        addActiveWorkoutExerciseSet({
            commit,
            getters,
            dispatch
        }, payload) {
            const {
                exerciseIndex,
                shouldCalulatePrevious = true
            } = payload;

            commit('ADD_ACTIVE_WORKOUT_EXERCISE_SET', {
                exerciseIndex,
                setData: {
                    weight: null,
                    reps: null,
                    completed_at: null,
                    previous: null
                }
            });
            if (shouldCalulatePrevious) {
                dispatch('calculateActiveWorkoutPreviousSet', {
                    exerciseIndex,
                    setIndex: getters.activeWorkout.exercises[exerciseIndex].sets.length - 1
                });
            }
        },
        calculateActiveWorkoutPreviousSet({
            commit,
            getters
        }, payload) {
            const {
                exerciseIndex,
                setIndex
            } = payload;

            const exercise = getters.activeWorkout.exercises[exerciseIndex];

            WorkoutsService.getPreviousSet(getters.user.id, exercise.id, setIndex + 1)
                .then(previousSet => {
                    if (AppHelper.isObjectEmpty(previousSet)) {
                        return;
                    }
                    commit('UPDATE_ACTIVE_WORKOUT_EXERCISE_SET_PREVIOUS', {
                        exerciseIndex,
                        setIndex,
                        previousSetData: {
                            weight: previousSet.weight,
                            reps: previousSet.reps,
                            completed_at: previousSet.completed_at,
                        }
                    });
                });

        },
        recalculateActiveWorkoutPreviousSets({
            getters,
            dispatch
        }, payload) {
            const {
                exerciseIndex
            } = payload;

            for (let i = 0; i < getters.activeWorkout.exercises[exerciseIndex].sets.length; i++) {
                dispatch('calculateActiveWorkoutPreviousSet', {
                    exerciseIndex: exerciseIndex,
                    setIndex: i
                });
            }

        },
        removeActiveWorkoutSet({
            dispatch,
            commit
        }, payload) {
            const {
                exerciseIndex,
                setIndex,
                shouldRecalulatePreviousSets = true
            } = payload;

            commit('REMOVE_ACTIVE_WORKOUT_EXERCISE_SET', {
                exerciseIndex,
                setIndex
            });

            if (shouldRecalulatePreviousSets) {
                dispatch('recalculateActiveWorkoutPreviousSets', {
                    exerciseIndex
                });
            }

        },
        removeActiveWorkoutExercise({
            commit
        }, payload) {
            const {
                exerciseIndex,
            } = payload;

            commit('REMOVE_ACTIVE_WORKOUT_EXERCISE', {
                exerciseIndex
            });

        },
        setActiveWorkoutExerciseSetAsPrevious({
            commit,
            getters
        }, payload) {
            const {
                exerciseIndex,
                setIndex,
            } = payload;

            let currentSetData = getters.activeWorkout.exercises[exerciseIndex].sets[setIndex];

            if (currentSetData.previous) {
                currentSetData.weight = currentSetData.previous.weight;
                currentSetData.reps = currentSetData.previous.reps;

                commit('UPDATE_ACTIVE_WORKOUT_EXERCISE_SET', {
                    exerciseIndex,
                    setIndex,
                    setData: currentSetData
                });
            }

        },
        toggleActiveWorkoutExerciseSetComplete({
            commit,
            getters,
            dispatch
        }, payload) {
            const {
                exerciseIndex,
                setIndex,
            } = payload;

            let currentSetData = getters.activeWorkout.exercises[exerciseIndex].sets[setIndex];

            const isCompleted = currentSetData.completed_at != null;

            if (isCompleted) {
                currentSetData.completed_at = null;
            } else {
                currentSetData.completed_at = moment().toDate();
                // if reps has a value do not set like previous one
                if (!currentSetData.reps) {
                    dispatch('setActiveWorkoutExerciseSetAsPrevious', {
                        exerciseIndex,
                        setIndex
                    });
                }
            }

            commit('UPDATE_ACTIVE_WORKOUT_EXERCISE_SET', {
                exerciseIndex,
                setIndex,
                setData: currentSetData
            });
        },
        cleanActiveWorkoutExerciseSets({
            commit,
            getters
        }, payload) {
            for (let exerciseIndex = 0; exerciseIndex < getters.activeWorkout.exercises.length; exerciseIndex++) {
                for (let setIndex = 0; setIndex < getters.activeWorkout.exercises[exerciseIndex].sets.length; setIndex++) {
                    const set = getters.activeWorkout.exercises[exerciseIndex].sets[setIndex];
                    if (set.reps == null || set.reps == '') {
                        commit('REMOVE_ACTIVE_WORKOUT_EXERCISE_SET', {
                            exerciseIndex,
                            setIndex
                        });
                        setIndex--;
                    }
                }
            }
        },
        createActiveWorkout({
            commit,
            dispatch
        }, payload) {
            const {
                workout
            } = payload;

            commit('UPDATE_ACTIVE_WORKOUT', {
                name: workout ? workout.name : 'Workout Name',
                exercises: []
            });

            if (workout) {
                workout.exercises.forEach(duplicateWorkoutExercise => {
                    dispatch('addActiveWorkoutExercise', {
                        exerciseId: duplicateWorkoutExercise.id,
                        nOfSets: duplicateWorkoutExercise.sets.length
                    });
                    // exercises.push({
                    //     id: duplicateWorkoutExercise.id,
                    //     nOfSets: duplicateWorkoutExercise.sets.length
                    // });
                });
            }

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

    },
    modules: {},
    plugins: [new VuexPersistence({
        key: 'workoutspro',
        storage: localforage, // using localForage for indexeddb support
        asyncStorage: true
    }).plugin]
});
