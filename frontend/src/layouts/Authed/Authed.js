export default {
    name: 'Authed',
    data() {
        return {
            isNavigationBarVisible: false
        }
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
    }
}
