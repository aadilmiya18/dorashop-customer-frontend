import {defineStore} from "pinia";
import {publicApi, authApi} from "boot/axios.js";
import {useQuasar} from "quasar";
import {ref} from "vue";
import {useRouter} from "vue-router";

export const useAuthStore = defineStore('authStore', () => {
    const $q = useQuasar();
    const router = useRouter();
    const currentUser = ref({});
    const accessToken = ref(localStorage.getItem('access_token') || '');

    const login = async (payload) => {
        try {
            const res = await publicApi.post('/auth/login', payload);
            accessToken.value = res.data.token;
            localStorage.setItem('access_token', accessToken.value);
            currentUser.value = res.data.user;

            $q.notify({message: res.data.message, color: "positive"});
            await router.push('/');
            return true;
        } catch (e) {
            $q.notify({
                message: e.response?.data?.message || "Invalid credentials",
                color: "negative",
            });
            return false;
        }
    };

    const register = async (payload) => {
        try {
            const res = await publicApi.post('/auth/register', payload);
            accessToken.value = res.data.token;
            localStorage.setItem('access_token', accessToken.value);
            currentUser.value = res.data.user;

            $q.notify({message: res.data.message, color: "positive"});
            await router.push('/');
            return true;
        } catch (e) {
            $q.notify({
                message: e.response?.data?.message || "Registration failed",
                color: "negative",
            });
            return false;
        }
    };

    const logout = async () => {
        try {
            await authApi.post('/auth/logout');
        } catch (e) {
            console.error("Logout failed:", e);
        } finally {
            accessToken.value = '';
            currentUser.value = null;
            localStorage.removeItem('access_token');
            router.push('/');
            $q.notify({message: 'Logged out successfully', color: "positive"});
        }
    };

    const validateToken = async () => {
        if (!accessToken.value) return false;
        try {
            const res = await authApi.get('/auth/me');
            currentUser.value = res.data.user;
            console.log('resp', res)
            return true;
        } catch {
            await logout();
            return false;
        }
    };

    const fetchProfile = async () => {
        try {
            const res = await authApi.get('/auth/me');
            currentUser.value = res.data.user;
        } catch (e) {
            console.error("Fetch profile failed:", e);
        }
    }


    const updateProfile = async (payload) => {
        try {
            const res = await authApi.put('/auth/update-profile', payload);
            currentUser.value = res.data.user;
            $q.notify({message: 'Profile updated successfully', color: "positive"});
            return true;
        } catch (e) {
            $q.notify({
                message: e.response?.data?.message || "Profile update failed",
                color: "negative",
            });
            return false;
        }
    }

    return {
        login,
        register,
        logout,
        validateToken,
        accessToken,
        currentUser,
        fetchProfile,
        updateProfile

    };
});
