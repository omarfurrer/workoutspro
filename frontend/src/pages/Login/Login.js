export default {
    name: 'Login',
    data() {
        return {
            // form data and handling
            credentials: {
                email: null,
                password: null,
                recaptcha_token: null
            },
            isLoginFormBusy: false,
            loginFormError: null,
            loginFormValidationErrors: {},

            // messages to be displayed on page load
            successMessage: this.$route.query.login_success_message,
            errorMessage: this.$route.query.login_error_message,

            // form validation rules
            loginFormRules: {
                email: [
                    v => !!v || 'Email address is required.',
                    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email must be valid'
                ],
                password: [
                    v => !!v || 'Password is required.'
                ]
            }
        }
    },
    methods: {
        login() {

            this.loginFormError = null;
            this.loginFormValidationErrors = {}

            if (!this.$refs.loginForm.validate()) {
                return;
            }

            this.isLoginFormBusy = true;

            return this.$axios.post(this.$helpers.AppHelper.getBaseApiUrl() + `login`, this.credentials)
                .then((res) => {

                    // Store user and token in state
                    this.$store.dispatch('updateToken', res.data.token);
                    this.$store.dispatch('updateUser', res.data.user);

                    // redirect
                    const {
                        redirect
                    } = this.$route.query;
                    this.$router.push(redirect || '/dashboard');
                })
                .catch(err => {

                    // check if validation error, populate into validation errors object
                    // will be auto merged with any client side validation errors to be displayed below the input
                    if (this.$helpers.AppHelper.isApiValidationError(err)) {
                        this.loginFormValidationErrors = this.$helpers.AppHelper.getValidationErrors(err);
                        return;
                    }

                    this.loginFormError = err.response.data.message;

                })
                .then(() => {
                    this.isLoginFormBusy = false;
                });
        }
    }
}
