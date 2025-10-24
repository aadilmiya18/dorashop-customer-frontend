import {defineStore} from "pinia";
import {authApi} from "boot/axios.js";
import {ref} from "vue";
import {useQuasar} from "quasar";

export const useCartStore = defineStore('cartStore', () => {
    const tableParams = ref({
        page: 1,
        rowsPerPage: 50,
        sortBy: 'id',
        descending: true,
        filters: {},
        total: 0,
    })
    const $q = useQuasar();

    const cart = ref([])

    const fetchCart = async () => {
        try {
            const response = await authApi.get('carts', {
                params: {
                    page: tableParams.value.page,
                    rowsPerPage: tableParams.value.rowsPerPage,
                    sortBy: tableParams.value.sortBy,
                    descending: tableParams.value.descending,
                    filters: JSON.stringify(tableParams.value.filters)
                }
            })
            cart.value = response.data.data
            tableParams.value.total = response.data?.meta?.total ?? 0
        } catch (e) {
            console.error(e)
            throw e;
        }
    }

    const addItemsToCart = async (payload) => {
        try {
            await authApi.post(`carts/add`, payload)
            $q.notify({
                message: 'Item added to cart successfully',
                color: 'positive'
            })
            return true
        } catch (e) {
            console.error(e)
            throw e.response?.data?.message
        }
    }

    const removeItemsFromCart = async (id) => {
        try {
            await authApi.delete(`carts/remove`, {
                params: {
                    product_ids: id
                }
            })
            $q.notify({
                message: 'Item deleted from cart successfully',
                color: 'negative'
            })
            return true
        } catch (e) {
            console.error(e)
            throw e.response?.data?.message
        }
    }


    return {
        cart,
        tableParams,
        addItemsToCart,
        fetchCart,
        removeItemsFromCart
    }
})