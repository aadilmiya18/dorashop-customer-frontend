import {defineStore} from "pinia";
import {authApi} from "boot/axios.js";
import {ref} from "vue";
import {useQuasar} from "quasar";

export const useWishlistStore = defineStore('wishlistStore', () => {
    const tableParams = ref({
        page: 1,
        rowsPerPage: 50,
        sortBy: 'id',
        descending: true,
        filters: {},
        total: 0,
    })
    const $q = useQuasar();

    const wishlists = ref([])

    const fetchWishlists = async () => {
        try {
            const response = await authApi.get('wishlists', {
                params: {
                    page: tableParams.value.page,
                    rowsPerPage: tableParams.value.rowsPerPage,
                    sortBy: tableParams.value.sortBy,
                    descending: tableParams.value.descending,
                    filters: JSON.stringify(tableParams.value.filters)
                }
            })
            wishlists.value = response.data.data
            tableParams.value.total = response.data?.meta?.total ?? 0
        } catch (e) {
            console.error(e)
            throw e;
        }
    }

    const addItemsToWishlists = async (payload) => {
        try {
            await authApi.post(`wishlists/add`, {
                product_id: payload
            })
            $q.notify({
                message: 'Item added to wishlist successfully',
                color: 'positive'
            })
            return true
        } catch (e) {
            console.error(e)
            throw e.response?.data?.message
        }
    }

    const removeItemsFromWishlists = async (id) => {
        try {
            await authApi.delete(`wishlists/${id}/remove`)
            $q.notify({
                message: 'Item deleted from wishlists successfully',
                color: 'negative'
            })
            return true
        } catch (e) {
            console.error(e)
            throw e.response?.data?.message
        }
    }


    return {
        wishlists,
        tableParams,
        addItemsToWishlists,
        fetchWishlists,
        removeItemsFromWishlists
    }
})