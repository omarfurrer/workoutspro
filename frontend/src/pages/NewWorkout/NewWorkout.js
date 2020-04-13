import {
    mapGetters
} from 'vuex';

export default {
    name: 'WorkoutExercise',
    data() {
        return {
            isExercisesDialogOpen: false,
            newExercises: []
        }
    },
    computed: {
        ...mapGetters({
            'user': 'user',
            'workout': 'activeWorkout',
            'exercises': 'exercises'
        })
    },
    created() {
        console.log(this.workout)
    },
    methods: {
        removeExercise(workoutExerciseIndex) {
            this.$store.dispatch('removeActiveWorkoutExercise', {
                exerciseIndex: workoutExerciseIndex
            });
        },
        removeSet(workoutExerciseIndex, setIndex, refreshPreviousSets = true) {
            this.$store.dispatch('removeActiveWorkoutSet', {
                exerciseIndex: workoutExerciseIndex,
                setIndex,
                shouldRecalulatePreviousSets: refreshPreviousSets
            });
        },
        recalculatePreviousForWorkoutExercise(workoutExerciseIndex) {
            this.$store.dispatch('recalculateActiveWorkoutPreviousSets', {
                exerciseIndex: workoutExerciseIndex
            });
        },
        calculatePrevious(workoutExerciseIndex, setIndex) {
            this.$store.dispatch('calculateActiveWorkoutPreviousSet', {
                exerciseIndex: workoutExerciseIndex,
                setIndex
            });
        },
        addMultipleExercises(ids) {
            this.$store.dispatch('addActiveWorkoutExercises', {
                exerciseIds: ids
            });
            // clear new exercises
            this.newExercises = [];
        },
        addExcercise(id) {
            this.$store.dispatch('addActiveWorkoutExercise', {
                exerciseId: id
            });
            // update store
            this.isExercisesDialogOpen = false;
        },
        addSet(workoutExerciseIndex) {
            this.$store.dispatch('addActiveWorkoutExerciseSet', {
                exerciseIndex: workoutExerciseIndex
            });
        },
        updateStoreActiveWorkout() {
            this.$store.dispatch('updateActiveWorkout', this.workout);
        },
        toggleCompleteSet(workoutExerciseIndex, setIndex) {
            this.$store.dispatch('toggleActiveWorkoutExerciseSetComplete', {
                exerciseIndex: workoutExerciseIndex,
                setIndex
            });
        },
        setSetSameAsPrevious(workoutExerciseIndex, setIndex) {
            this.$store.dispatch('setActiveWorkoutExerciseSetAsPrevious', {
                exerciseIndex: workoutExerciseIndex,
                setIndex
            });
        },
        cleanEmptySets() {
            this.$store.dispatch('cleanActiveWorkoutExerciseSets');
        },
        saveNewWorkout() {
            // clean empty sets
            this.cleanEmptySets();
            if (!this.workout || this.workout.exercises.length < 1) {
                return;
            }
            return this.$axios.post(this.$helpers.AppHelper.getBaseApiUrl() + `users/${this.user.id}/workouts`, this.workout)
                .then((res) => {
                    this.$store.dispatch('resetActiveWorkout');
                    this.$router.push({
                        path: '/dashboard'
                    });
                })
                .catch(err => {
                    console.error(err);
                })
                .then(set => {
                    // loading shit
                });
        },
        cancelNewWorkout() {
            this.$store.dispatch('resetActiveWorkout');
            this.$router.push({
                path: '/dashboard'
            });
        }
    }
}
