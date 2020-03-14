export default {
    name: 'Authed',
    data() {
        return {
            isNavigationBarVisible: false
        }
    },
    created() {
        this.updateExercises();
    },
    methods: {
        toggleNavigationsBar() {
            this.isNavigationBarVisible = !this.isNavigationBarVisible;
        },
        logout() {
            this.$store.dispatch('logout');
            this.$router.push({
                path: '/'
            });
        },
        updateExercises() {
            console.log('Updating Exercises');
            return this.getExercises()
                .then(exercises => {
                    if (exercises) {
                        this.$store.dispatch('updateExercises', exercises);
                    }
                });
        },
        getExercises() {
            return this.$axios.get(this.$helpers.AppHelper.getBaseApiUrl() + `exercises`)
                .then((res) => {
                    return res.data;
                })
                .catch(err => {
                    console.error(err);
                })
                .then(exercises => {
                    return exercises;
                });
        }
    }
}
