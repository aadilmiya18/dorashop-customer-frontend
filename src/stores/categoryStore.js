import {defineStore} from "pinia";
import {publicApi} from "boot/axios.js";
import {ref} from "vue";

export const useCategoryStore = defineStore('categoryStore', () => {
    const tableParams = ref({
        page: 1,
        rowsPerPage: 50,
        sortBy: 'id',
        descending: true,
        filters: {},
        total: 0,
    })

    const categories = ref([])
    const categoryProducts = ref([])
    const categoryChildrens = ref([])

    const parentChildrens = ref([])
    const allProducts = ref([])

    const fetchCategories = async () => {
        try {
            const response = await publicApi.get('categories', {
                params: {
                    page: tableParams.value.page,
                    rowsPerPage: tableParams.value.rowsPerPage,
                    sortBy: tableParams.value.sortBy,
                    descending: tableParams.value.descending,
                    filters: JSON.stringify(tableParams.value.filters)
                }
            })
            categories.value = response.data.data
            tableParams.value.total = response.data?.meta?.total ?? 0
        } catch (e) {
            console.error(e)
            throw e;
        }
    }

    const fetchCategoryProducts = async (slug) => {
        categoryProducts.value = []
        categoryChildrens.value = []

        try {
            const response = await publicApi.get(`categories/${slug}/products`, { params: { slug } })
            const data = response.data.data

            categoryProducts.value = data ?? []
            categoryChildrens.value = data?.children ?? []

        } catch (e) {
            console.error(e)
            throw e.response?.data?.message || 'Failed to fetch Category'
        }
    }

    const fetchParentChildrenCategories = async (slug) => {

        try {
            const response = await publicApi.get(`categories/${slug}/children`, { params: { slug } })
            parentChildrens.value = response.data.data.children
            allProducts.value = response.data.data.all_products
            return true
        } catch (e) {
            console.error(e)
            throw e.response?.data?.message || 'Failed to fetch Category'
        }
    }


    return {
        fetchCategories,
        categories,
        tableParams,
        fetchCategoryProducts,
        categoryProducts,
        categoryChildrens,
        fetchParentChildrenCategories,
        parentChildrens,
        allProducts,
    }
})