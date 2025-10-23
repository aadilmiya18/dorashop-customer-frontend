<template>
  <div v-if="parentChildrens?.length" class="tw-bg-gradient-to-br tw-from-blue-50 tw-to-indigo-50 tw-py-12">
    <div class="tw-max-w-[1600px] tw-mx-auto tw-px-8">
      <h2 class="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mb-8 tw-flex tw-items-center tw-gap-3">
        <q-icon name="mdi-shape" size="32px" color="primary" />
        Shop by Category
      </h2>
      <div class="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-4 xl:tw-grid-cols-6 tw-gap-6">
        <div
            v-for="(item, index) in parentChildrens"
            :key="index"
            class="tw-group tw-bg-white tw-rounded-2xl tw-shadow-md hover:tw-shadow-2xl tw-transition-all tw-duration-300 tw-cursor-pointer tw-overflow-hidden hover:tw-scale-105"
            @click="fetchProducts(item)"
        >
          <div class="tw-relative tw-h-40 tw-bg-gradient-to-br tw-from-blue-100 tw-to-purple-100 tw-overflow-hidden">
            <q-img
                :src="item?.media?.url"
                class="tw-w-full tw-h-full tw-object-cover group-hover:tw-scale-110 tw-transition-transform tw-duration-500"
            >
              <template v-slot:error>
                <div class="tw-flex tw-items-center tw-justify-center tw-h-full tw-bg-gray-100">
                  <q-icon name="mdi-image-off" size="48px" color="grey-4" />
                </div>
              </template>
            </q-img>
            <div class="tw-absolute tw-inset-0 tw-bg-gradient-to-t tw-from-black/40 tw-to-transparent tw-opacity-0 group-hover:tw-opacity-100 tw-transition-opacity tw-duration-300"></div>
          </div>
          <div class="tw-p-4 tw-text-center">
            <h3 class="tw-text-sm tw-font-semibold tw-text-gray-800 group-hover:tw-text-primary tw-transition-colors tw-line-clamp-2">
              {{ item.name }}
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="tw-max-w-[1600px] tw-mx-auto tw-px-8 tw-py-12">
    <div v-if="products?.length" class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4 tw-gap-8">
      <div v-for="(product, index) in products" :key="index">
        <product-item :item="product" />
      </div>
    </div>

    <div v-else class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-20">
      <div class="tw-bg-gray-100 tw-rounded-full tw-p-8 tw-mb-6">
        <q-icon name="mdi-package-variant" size="80px" color="grey-5" />
      </div>
      <h3 class="tw-text-2xl tw-font-semibold tw-text-gray-700 tw-mb-2">
        No Products Available
      </h3>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import ProductItem from "components/Products/ProductItem.vue";
import { useCategoryStore } from "stores/categoryStore.js";
import {useRoute, useRouter} from "vue-router";
import { storeToRefs } from "pinia";

const categoryStore = useCategoryStore();
const { categoryProducts, categoryChildrens, parentChildrens, allProducts } = storeToRefs(categoryStore);
const route = useRoute();
const router = useRouter()
const categorySlug = computed(() => route.params.slug);
const querySlug = computed(() => route.query.parent)


const products = ref([]);

watch(() => categoryProducts.value,
    (newVal) => {
      if(!newVal.parent_slug){
        products.value = allProducts.value
      }else{
        products.value = categoryProducts.value.products
      }
    },{immediate: true}
)


onMounted(async () => {
  await categoryStore.fetchCategoryProducts(categorySlug.value);
  await categoryStore.fetchParentChildrenCategories(categorySlug.value);

  if(querySlug.value){
    await categoryStore.fetchParentChildrenCategories(querySlug.value);
  }
  if(!categoryProducts.value.parent_slug){
    products.value = allProducts.value
  }else{
    products.value = categoryProducts.value.products
  }
},);

watch(
    () => categorySlug.value,
    (newVal) => {
      categoryStore.fetchCategoryProducts(categorySlug.value);
    }
);


const fetchProducts = (item) => {
  router.push({ name: 'CategoryDetailsPage', params: { slug: item.slug }, query:{parent: item.parent_slug} })
}


watch(
    () => querySlug.value,
    (newVal) => {
      if(newVal) {
        categoryStore.fetchParentChildrenCategories(querySlug.value)
      }
    },{immediate: true}
);

</script>