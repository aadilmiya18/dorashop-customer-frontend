<template>
  <div class="tw-min-h-screen tw-bg-gradient-to-br tw-from-gray-50 tw-to-gray-100">
    <div class="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 tw-py-8">
      <div
          class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-12 tw-bg-white tw-rounded-2xl tw-shadow-xl tw-p-8 lg:tw-p-12">

        <div class="tw-relative">
          <div class="tw-sticky tw-top-8">
            <div class="tw-rounded-2xl tw-overflow-hidden tw-bg-gray-100 tw-shadow-lg tw-aspect-square">
              <q-img
                  :src="showCaseImage"
                  class="tw-w-full tw-h-full tw-object-cover tw-transition-transform tw-duration-300 hover:tw-scale-105"
                  fit="cover"
              />
            </div>

            <div class="tw-flex tw-gap-3 tw-mt-6 tw-overflow-x-auto tw-pb-2">
              <div
                  v-for="(media, index) in currentProduct?.media?.slice(0, 4)"
                  :key="index"
                  @click="showCaseImage = media.url"
                  class="tw-flex-shrink-0 tw-w-20 tw-h-20 tw-rounded-lg tw-overflow-hidden"
                  :class="showCaseImage === media.url ? 'tw-border-4 tw-border-blue-500' : ''"
              >
                <q-img :src="media.url" class="tw-w-full tw-h-full tw-object-cover"/>
              </div>
            </div>
          </div>
        </div>

        <div class="tw-flex tw-flex-col tw-gap-6">

          <div class="tw-flex tw-items-center tw-gap-3 tw-flex-wrap">
            <span
                v-if="currentProduct?.brand"
                class="tw-px-4 tw-py-1.5 tw-bg-blue-100 tw-text-blue-700 tw-rounded-full tw-text-sm tw-font-medium"
            >
              {{ currentProduct?.brand }}
            </span>
            <span
                v-if="currentProduct?.category"
                class="tw-px-4 tw-py-1.5 tw-bg-purple-100 tw-text-purple-700 tw-rounded-full tw-text-sm tw-font-medium"
            >
              {{ currentProduct?.category }}
            </span>
          </div>

          <!-- Product Name -->
          <h1 class="tw-text-4xl tw-font-bold tw-text-gray-900 tw-leading-tight">
            {{ currentProduct?.name }}
          </h1>

          <!-- Rating -->
          <div class="tw-flex tw-items-center tw-gap-3">
            <q-rating
                v-model="currentProduct.rating"
                size="24px"
                color="amber"
                readonly
            />
            <span class="tw-text-gray-600 tw-font-medium">
              {{ currentProduct?.rating }}
            </span>
          </div>

          <!-- Price -->
          <div class="tw-flex tw-items-baseline tw-gap-3">
            <span class="tw-text-5xl tw-font-bold tw-text-gray-900">
              Rs.{{ currentProduct?.price }}
            </span>
            <!--            <span class="tw-text-lg tw-text-gray-500 tw-line-through" v-if="currentProduct?.original_price">-->
            <!--              Rs.{{ currentProduct?.original_price }}-->
            <!--            </span>-->
          </div>

          <p class="tw-text-gray-600 tw-leading-relaxed tw-text-lg">
            {{ currentProduct?.short_description }}
          </p>

          <div class="tw-border-t tw-border-gray-200 tw-pt-6"></div>

          <div class="tw-flex tw-items-center tw-gap-2">
            <div
                class="tw-w-3 tw-h-3 tw-rounded-full"
                :class="currentProduct?.stock > 0 ? 'tw-bg-green-500' : 'tw-bg-red-500'"
            ></div>
            <span class="tw-font-medium tw-text-gray-700">
              {{ currentProduct?.stock > 0 ? `${currentProduct?.stock} items in stock` : 'Out of stock' }}
            </span>
          </div>

          <div class="tw-space-y-3">
            <label class="tw-text-sm tw-font-semibold tw-text-gray-700 tw-uppercase tw-tracking-wide">
              Quantity
            </label>
            <div class="tw-flex tw-items-center tw-gap-4">
              <div
                  class="tw-flex tw-items-center tw-bg-gray-100 tw-rounded-xl tw-overflow-hidden tw-border-2 tw-border-gray-200">
                <q-btn
                    icon="mdi-minus"
                    flat
                    dense
                    class="tw-px-4 tw-py-3 hover:tw-bg-gray-200 tw-transition-colors"
                    @click="quantity--"
                    :disable="quantity === 0"
                />
                <div class="tw-w-20 tw-text-center tw-font-bold tw-text-xl tw-text-gray-900">
                  {{ quantity }}
                </div>
                <q-btn
                    icon="mdi-plus"
                    flat
                    dense
                    class="tw-px-4 tw-py-3 hover:tw-bg-gray-200 tw-transition-colors"
                    @click="quantity++"
                    :disable="currentProduct?.stock === quantity"
                />
              </div>
            </div>
          </div>

          <div class="tw-flex tw-gap-4 tw-pt-4">
            <q-btn
                label="Add to Cart"
                icon="mdi-cart-plus"
                color="primary"
                size="lg"
                class="tw-flex-1 tw-py-4 tw-text-lg tw-font-semibold tw-rounded-xl tw-shadow-lg hover:tw-shadow-xl tw-transition-all"
                :disable="quantity === 0 || currentProduct?.stock === 0"
                unelevated
                @click="addToCart"
            />
            <q-btn
                icon="mdi-heart-outline"
                flat
                size="lg"
                class="tw-px-6 tw-py-4 tw-rounded-xl tw-border-2 tw-border-gray-300 hover:tw-border-red-400 hover:tw-text-red-500 tw-transition-all"
                @click="addToWishlist"
            />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useProductStore} from "stores/productStore.js";
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import {useCartStore} from "stores/cartStore.js";
import {useWishlistStore} from "stores/wishlistStore.js";

const quantity = ref(0)
const showCaseImage = ref('')

const cartStore = useCartStore();

const productStore = useProductStore()
const {currentProduct} = storeToRefs(productStore)
const wishlistStore = useWishlistStore();

const route = useRoute()
const productSlug = computed(() => route.params.slug)

onMounted(async () => {
  await productStore.fetchProductDetails(productSlug.value)
  showCaseImage.value = currentProduct.value.media?.[0]?.url
})

const addToCart = async () => {
  const payload = {
    "product_id": currentProduct.value.id,
    "quantity": quantity.value,
    "price": currentProduct.value.price
  }

  await cartStore.addItemsToCart(payload)
  await cartStore.fetchCart();
}

const addToWishlist = async () => {
  await wishlistStore.addItemsToWishlists(currentProduct.value.id)
  await wishlistStore.fetchWishlists()
}
</script>