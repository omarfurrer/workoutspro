import {
    mapGetters
} from 'vuex';

export default {
    name: 'NewWorkout',
    data() {
        return {
            isExercisesDialogOpen: false
        }
    },
    computed: {
        ...mapGetters({
            'user': 'user',
            'workout': 'activeWorkout',
            'exercises': 'exercises',
            'getExercise': 'getExercise'
        })
    },
    created() {
        console.log(this.workout)
    },
    methods: {
        removeExercise(workoutExerciseId) {
            const workoutExerciseIndex = this.workout.exercises.findIndex(exercise => exercise.workout_exercise_id == workoutExerciseId);
            if (workoutExerciseIndex < 0) {
                return;
            }
            this.workout.exercises.splice(workoutExerciseIndex, 1);
            this.$store.dispatch('updateActiveWorkout', this.workout);
        },
        removeSet(workoutExerciseId, setIndex) {
            const workoutExerciseIndex = this.workout.exercises.findIndex(exercise => exercise.workout_exercise_id == workoutExerciseId);
            if (workoutExerciseIndex < 0) {
                return;
            }
            this.workout.exercises[workoutExerciseIndex].sets.splice(setIndex, 1);
            this.recalculatePreviousForWorkoutExercise(workoutExerciseId);
        },
        recalculatePreviousForWorkoutExercise(workoutExerciseId) {
            const workoutExerciseIndex = this.workout.exercises.findIndex(exercise => exercise.workout_exercise_id == workoutExerciseId);
            if (workoutExerciseIndex < 0) {
                return;
            }
            for (let i = 0; i < this.workout.exercises[workoutExerciseIndex].sets.length; i++) {
                this.calculatePrevious(workoutExerciseId, i);
            }
        },
        calculatePrevious(workoutExerciseId, setIndex) {
            const workoutExerciseIndex = this.workout.exercises.findIndex(exercise => exercise.workout_exercise_id == workoutExerciseId);
            if (workoutExerciseIndex < 0) {
                return;
            }
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
        addExcercise(id) {
            const exercise = this.getExercise(id);
            const sets = [];
            // console.log(exercise);
            for (let i = 0; i < 3; i++) {
                sets.push({
                    weight: null,
                    reps: null,
                    completed_at: null,
                    previous: null
                });
            }
            const workoutExerciseIdTemp = Math.random().toString(36).substr(2, 3);
            this.workout.exercises.push({
                workout_exercise_id: workoutExerciseIdTemp,
                id: exercise.id,
                name: exercise.name,
                sets: sets
            });
            this.$store.dispatch('updateActiveWorkout', this.workout);
            this.calculatePrevious(workoutExerciseIdTemp, 0);
            this.calculatePrevious(workoutExerciseIdTemp, 1);
            this.calculatePrevious(workoutExerciseIdTemp, 2);
            // update store
            this.isExercisesDialogOpen = false;
        },
        addSet(workoutExerciseId) {
            const workoutExerciseIndex = this.workout.exercises.findIndex(exercise => exercise.workout_exercise_id == workoutExerciseId);
            if (workoutExerciseIndex < 0) {
                return;
            }
            this.workout.exercises[workoutExerciseIndex].sets.push({
                weight: null,
                reps: null,
                completed_at: null,
                previous: null
            });
            this.$store.dispatch('updateActiveWorkout', this.workout);
            this.calculatePrevious(workoutExerciseId, this.workout.exercises[workoutExerciseIndex].sets.length - 1);
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
        }
    }
}
