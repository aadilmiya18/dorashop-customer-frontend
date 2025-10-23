<template>
  <div
      @click="$router.push({name: 'ProductDetailsPage', params:{slug:item?.slug}})"
      class="tw-group tw-w-full tw-bg-white tw-rounded-2xl tw-shadow-md hover:tw-shadow-2xl tw-overflow-hidden tw-transition-all tw-duration-300 hover:tw-scale-[1.02]"
  >
    <!-- Image Container -->
    <div class="tw-relative tw-h-[280px] tw-bg-gradient-to-br tw-from-gray-50 tw-to-gray-100 tw-overflow-hidden">
      <q-img
          :src="item?.media?.url || '/placeholder-image.png'"
          alt="Product image"
          class="tw-w-full tw-h-full tw-object-cover group-hover:tw-scale-110 tw-transition-transform tw-duration-500"
      >
        <template v-slot:error>
          <div class="tw-flex tw-items-center tw-justify-center tw-h-full tw-w-full tw-bg-gray-100">
            <q-icon name="mdi-image-off" size="48px" color="grey-4" />
          </div>
        </template>
      </q-img>

      <q-btn
          round
          flat
          icon="mdi-heart-outline"
          class="tw-absolute tw-top-4 tw-right-4 tw-bg-white/90 hover:tw-bg-white tw-shadow-lg tw-backdrop-blur-sm"
          size="sm"
      >
        <q-tooltip class="tw-bg-blue-grey-8">Add to Wishlist</q-tooltip>
      </q-btn>
    </div>

    <!-- Content -->
    <div class="tw-p-6">
      <!-- Product Name -->
      <h3 class="tw-text-gray-800 tw-font-semibold tw-text-base tw-leading-snug tw-mb-4 tw-h-[3rem] tw-overflow-hidden tw-line-clamp-2 group-hover:tw-text-primary tw-transition-colors">
        {{ item?.name }}
      </h3>

      <!-- Rating -->
      <div class="tw-flex tw-items-center tw-gap-2 tw-mb-4">
        <q-rating
            v-model="item.rating"
            size="16px"
            color="amber"
            readonly
        />
        <span class="tw-text-xs tw-text-gray-500">
          ({{ item.rating || 0 }})
        </span>
      </div>

      <!-- Price Section -->
      <div class="tw-flex tw-items-baseline tw-gap-2 tw-mb-5">
        <span class="tw-text-2xl tw-font-bold tw-text-primary">
          Rs. {{ item?.price }}
        </span>
<!--        <span v-if="item?.originalPrice" class="tw-text-sm tw-text-gray-400 tw-line-through">-->
<!--          Rs. {{ item?.originalPrice }}-->
<!--        </span>-->
<!--        <span v-if="item?.discount" class="tw-ml-auto tw-bg-green-100 tw-text-green-700 tw-px-2 tw-py-1 tw-rounded-md tw-text-xs tw-font-semibold">-->
<!--          {{ item?.discount }}% OFF-->
<!--        </span>-->
      </div>

      <!-- Action Buttons -->
      <div class="tw-flex tw-gap-2">
        <q-btn
            label="Add to Cart"
            color="primary"
            unelevated
            class="tw-flex-1 tw-h-[44px] tw-rounded-xl tw-font-medium"
            icon-right="mdi-cart-plus"
        >
          <q-tooltip class="tw-bg-blue-grey-8">Add to cart</q-tooltip>
        </q-btn>
      </div>
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
});
</script>