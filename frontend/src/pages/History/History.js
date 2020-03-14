import {
    mapGetters
} from 'vuex';

export default {
    name: 'History',
    data() {
        return {
            isLoading: false
        }
    },
    computed: {
        ...mapGetters({
            'storeWorkouts': 'workouts',
            'user': 'user',
            'activeWorkout': 'activeWorkout'
        }),
        workouts() {
            if (!this.storeWorkouts) {
                return [];
            }
            return this.storeWorkouts;
        }
    },
    created() {
        this.updateWorkouts();
    },
    methods: {
        createNewWorkout() {
            this.$store.dispatch('updateActiveWorkout', {
                name: 'Workout Name',
                exercises: []
            });
            this.$router.push({
                path: '/new-workout'
            });
        },
        updateWorkouts() {
            console.log('Updating Workouts');
            return this.getWorkouts()
                .then(workouts => {
                    if (workouts) {
                        this.$store.dispatch('updateWorkouts', workouts);
                    }
                });
        },
        getWorkouts() {
            this.isLoading = true;

            return this.$axios.get(this.$helpers.AppHelper.getBaseApiUrl() + `users/${this.user.id}/workouts`)
                .then((res) => {
                    return res.data;
                })
                .catch(err => {
                    console.error(err);
                })
                .then(workouts => {
                    this.isLoading = false;
                    return workouts;
                });
        }
    }
}
