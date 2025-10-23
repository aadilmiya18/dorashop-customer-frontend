import {defineStore} from "pinia";
import {publicApi} from "boot/axios.js";
import {ref} from "vue";

export const useProductStore = defineStore('productStore', () => {
    const tableParams = ref({
        page: 1,
        rowsPerPage: 50,
        sortBy: 'id',
        descending: true,
        filters: {},
        total: 0,
    })

    const products = ref([])
    const currentProduct = ref({})

    const fetchProducts = async () => {
        try {
            const response = await publicApi.get('products', {
                params: {
                    page: tableParams.value.page,
                    rowsPerPage: tableParams.value.rowsPerPage,
                    sortBy: tableParams.value.sortBy,
                    descending: tableParams.value.descending,
                    filters: JSON.stringify(tableParams.value.filters)
                }
            })
            products.value = response.data.data
            tableParams.value.total = response.data?.meta?.total ?? 0
        } catch (e) {
            console.error(e)
            throw e;
        }
    }

    const fetchProductDetails = async (slug) => {
        try {
            const response = await publicApi.get(`products/${slug}`)
            currentProduct.value = response.data.data
        } catch (e) {
            console.error(e)
            throw e.response?.data?.message || 'Failed to fetch product';
        }
    }


    return {
        products,
        tableParams,
        fetchProducts,
        fetchProductDetails,
        currentProduct

    }
})