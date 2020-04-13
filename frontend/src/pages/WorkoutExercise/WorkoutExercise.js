import {
    mapGetters
} from 'vuex';
import moment from 'moment';

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
            this.workout.exercises.splice(workoutExerciseIndex, 1);
            this.$store.dispatch('updateActiveWorkout', this.workout);
        },
        removeSet(workoutExerciseIndex, setIndex, refreshPreviousSets = true) {
            this.workout.exercises[workoutExerciseIndex].sets.splice(setIndex, 1);
            if (refreshPreviousSets) {
                this.recalculatePreviousForWorkoutExercise(workoutExerciseIndex);
            }
        },
        recalculatePreviousForWorkoutExercise(workoutExerciseIndex) {
            for (let i = 0; i < this.workout.exercises[workoutExerciseIndex].sets.length; i++) {
                this.calculatePrevious(workoutExerciseIndex, i);
            }
        },
        calculatePrevious(workoutExerciseIndex, setIndex) {
            const exercise = this.workout.exercises[workoutExerciseIndex];
            this.getPreviousSet(exercise.id, setIndex + 1)
                .then(previousSet => {
                    if (this.$helpers.AppHelper.isObjectEmpty(previousSet)) {
                        return;
                    }
                    this.workout.exercises[workoutExerciseIndex].sets[setIndex].previous = {
                        weight: previousSet.weight,
                        reps: previousSet.reps,
                        completed_at: previousSet.completed_at,
                    };
                    this.$store.dispatch('updateActiveWorkout', this.workout);
                });
        },
        addMultipleExercises(ids) {
            for (let i = 0; i < ids.length; i++) {
                this.addExcercise(ids[i]);
            }
            // clear new exercises
            this.newExercises = [];
        },
        addExcercise(id) {
            this.$store.dispatch('addActiveWorkoutExercise', {
                exerciseId: id
            });
            this.calculatePrevious(this.workout.exercises.length - 1, 0);
            this.calculatePrevious(this.workout.exercises.length - 1, 1);
            this.calculatePrevious(this.workout.exercises.length - 1, 2);
            // update store
            this.isExercisesDialogOpen = false;
        },
        addSet(workoutExerciseIndex) {
            this.workout.exercises[workoutExerciseIndex].sets.push({
                weight: null,
                reps: null,
                completed_at: null,
                previous: null
            });
            this.$store.dispatch('updateActiveWorkout', this.workout);
            this.calculatePrevious(workoutExerciseIndex, this.workout.exercises[workoutExerciseIndex].sets.length - 1);
        },
        getPreviousSet(exerciseId, setIndex) {
            return this.$axios.get(this.$helpers.AppHelper.getBaseApiUrl() + `users/${this.user.id}/exercises/${exerciseId}/sets/previous`, {
                    params: {
                        setIndex
                    }
                })
                .then((res) => {
                    return res.data;
                })
                .catch(err => {
                    console.error(err);
                })
                .then(set => {
                    return set;
                });
        },
        updateStoreActiveWorkout() {
            this.$store.dispatch('updateActiveWorkout', this.workout);
        },
        toggleCompleteSet(workoutExerciseIndex, setIndex) {
            const isCompleted = this.workout.exercises[workoutExerciseIndex].sets[setIndex].completed_at != null;
            if (isCompleted) {
                this.workout.exercises[workoutExerciseIndex].sets[setIndex].completed_at = null;
            } else {
                this.workout.exercises[workoutExerciseIndex].sets[setIndex].completed_at = moment().toDate();
                // if reps has a value do not set like previous one
                if (!this.workout.exercises[workoutExerciseIndex].sets[setIndex].reps) {
                    this.setSetSameAsPrevious(workoutExerciseIndex, setIndex);
                }
            }
        },
        setSetSameAsPrevious(workoutExerciseIndex, setIndex) {
            const previousSet = this.workout.exercises[workoutExerciseIndex].sets[setIndex].previous;
            if (previousSet) {
                this.workout.exercises[workoutExerciseIndex].sets[setIndex].weight = previousSet.weight;
                this.workout.exercises[workoutExerciseIndex].sets[setIndex].reps = previousSet.reps;
            }
        },
        cleanEmptySets() {
            for (let exerciseIndex = 0; exerciseIndex < this.workout.exercises.length; exerciseIndex++) {
                for (let setIndex = 0; setIndex < this.workout.exercises[exerciseIndex].sets.length; setIndex++) {
                    const set = this.workout.exercises[exerciseIndex].sets[setIndex];
                    if (set.reps == null || set.reps == '') {
                        this.removeSet(exerciseIndex, setIndex, false);
                        setIndex--;
                    }
                }
            }
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
