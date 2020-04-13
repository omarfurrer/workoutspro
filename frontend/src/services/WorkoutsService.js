import AppHelper from '@/helpers/AppHelper';
import axios from 'axios';

export default {
    getPreviousSet(userId, exerciseId, setIndex) {
        return axios.get(AppHelper.getBaseApiUrl() + `users/${userId}/exercises/${exerciseId}/sets/previous`, {
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
}
