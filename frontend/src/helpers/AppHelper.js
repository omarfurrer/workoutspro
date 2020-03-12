export default {
    getEnv(key, defaultValue) {
        if (typeof process.env[key] === 'undefined') {
            return defaultValue;
        }
        if (process.env[key] === 'true') {
            return true;
        } else if (process.env[key] === 'false') {
            return false;
        } else {
            return process.env[key];
        }
    },
    getBaseUrl() {
        return this.getEnv('VUE_APP_BASE_URL');
    },
    getBaseApiUrl() {
        return this.getEnv('VUE_APP_BASE_URL') + this.getEnv('VUE_APP_API_URL');
    },
    isApiValidationError(error) {
        return error.response.status == 422;
    },
    getValidationErrors(error) {
        const validationErrors = {};
        for (const field in error.response.data.errors) {
            validationErrors[field] = error.response.data.errors[field][0];
        }
        return validationErrors;
    },
    getFirstValidationError(error) {
        const errorsFirstKey = Object.keys(error.response.data.errors)[0];
        return error.response.data.errors[errorsFirstKey][0];
    },
    toFixed(x, n) {
        const v = (typeof x === 'string' ? x : x.toString()).split('.');
        if (n <= 0) return v[0];
        let f = v[1] || '';
        if (f.length > n) return `${v[0]}.${f.substr(0,n)}`;
        while (f.length < n) f += '0';
        return `${v[0]}.${f}`
    },
    getMetaFromRoute(route, name) {
        // We will reverse the array of matched routes, that way the children meta routes can override parent ones
        const routes = [...route.matched].reverse();
        return routes.find(record => record.meta[name]).meta[name];
    },
    toFormData(data) {
        const formData = new FormData();
        Object.keys(data).forEach(key => formData.append(key, data[key] == null ? '' : data[key])); // Laravel does not parse nulls when using form data so we convert them to empty string
        return formData;
    }
}
