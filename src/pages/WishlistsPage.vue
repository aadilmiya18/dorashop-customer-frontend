<template>
  <div class="bg-white q-pa-lg rounded-borders q-mx-auto" style="max-width: 1100px;">
    <div class="text-h6 q-mb-md flex items-center">
      <q-icon name="favorite" color="red" class="q-mr-sm"/>
      My Wishlist
    </div>

    <!-- Empty State -->
    <div
        v-if="!wishlists.length"
        class="flex flex-center column text-center q-pa-xl text-grey-7"
    >
      <q-icon name="mdi-heart-off" size="64px" class="q-mb-sm text-grey-6"/>
      <div class="text-subtitle1">Your wishlist is empty</div>
      <div class="text-caption q-mb-md">
        Start adding products you love to keep track of them.
      </div>
      <q-btn
          color="primary"
          label="Browse Products"
          icon="shopping_bag"
          to="/"
      />
    </div>

    <!-- Wishlist Items -->
    <div v-else class="wishlist-grid q-gutter-md">
      <q-card
          v-for="item in wishlists"
          :key="item.id"
          flat
          bordered
          class="wishlist-card q-pa-sm flex items-center justify-between"
      >
        <div class="flex items-center">
          <!-- Product Image -->
          <q-img
              :src="item.product_image || '/placeholder-image.png'"
              :alt="item.product_name"
              class="wishlist-img q-mr-md"
              spinner-color="primary"
          >
            <template v-slot:error>
              <div class="tw-flex tw-items-center tw-justify-center tw-h-full tw-w-full tw-bg-gray-100">
                <q-icon name="mdi-image-off" size="48px" color="grey-4"/>
              </div>
            </template>
          </q-img>

          <!-- Product Info -->
          <div>
            <div
                class="text-subtitle1 text-weight-medium cursor-pointer hover:tw-underline"
                @click="$router.push({name: 'ProductDetailsPage', params:{slug: item.product_slug}})"
            >
              {{ item.product_name }}
            </div>
            <div class="text-caption text-grey-7">
              Price:
              <span class="text-weight-bold">
                {{ formatPrice(item.product_discount_price || item.product_price) }}
              </span>
            </div>
            <div class="text-caption text-grey">
              {{ item.product_stock > 0 ? 'In Stock' : 'Out of Stock' }}
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center q-gutter-sm">
          <q-btn
              color="primary"
              flat
              round
              icon="shopping_cart"
              @click="addToCart(item.product_id)"
              :disable="item.product_stock <= 0"
          >
            <q-tooltip>Add to Cart</q-tooltip>
          </q-btn>

          <q-btn
              color="negative"
              flat
              round
              icon="delete"
              @click="removeWishlist(item.product_id)"
          >
            <q-tooltip>Remove</q-tooltip>
          </q-btn>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import {onMounted} from "vue";
import {useWishlistStore} from "stores/wishlistStore.js";
import {storeToRefs} from "pinia";
import {useQuasar} from "quasar";
import {useCartStore} from "stores/cartStore.js";

const wishlistStore = useWishlistStore();
const {wishlists} = storeToRefs(wishlistStore);
const $q = useQuasar();

const cartStore = useCartStore();

onMounted(() => {
  wishlistStore.fetchWishlists();
});

const formatPrice = (price) => {
  return price ? `₨${parseFloat(price).toFixed(2)}` : "—";
};

const addToCart = async (product) => {
  const payload = {
    "product_id": product.id,
    "quantity": product.quantity,
    "price": product.price
  }

  await cartStore.addItemsToCart(payload)
  await cartStore.fetchCart();
};

const removeWishlist = async (wishlistId) => {
  await wishlistStore.removeItemsFromWishlists(wishlistId);
  await wishlistStore.fetchWishlists();
};
</script>

<style scoped>
.wishlist-grid {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .wishlist-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.wishlist-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.wishlist-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.wishlist-img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}
</style>
