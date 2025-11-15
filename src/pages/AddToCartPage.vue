<template>
  <div class="tw-min-h-screen tw-bg-gradient-to-br tw-from-gray-50 tw-to-gray-100 tw-py-8">
    <div class="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8">
      <div class="tw-mb-8 tw-flex tw-items-center tw-justify-between">
        <div>
          <h1 class="tw-text-3xl tw-font-bold tw-text-gray-900">Shopping Cart</h1>
          <p class="tw-mt-2 tw-text-sm tw-text-gray-600">
            {{ cart.length }} {{ cart.length === 1 ? 'item' : 'items' }} in your cart
          </p>
        </div>
        <q-btn
            v-if="cart.length > 0"
            label="Clear Cart"
            outline
            color="negative"
            icon="mdi-delete-sweep"
            @click="clearCart"
        />
      </div>

      <!-- Empty State -->
      <div v-if="cart.length === 0" class="tw-text-center tw-py-20">
        <div class="tw-inline-block tw-p-6 tw-bg-white tw-rounded-full tw-shadow-lg tw-mb-6">
          <q-icon name="shopping_cart" size="80px" class="tw-text-gray-300"/>
        </div>
        <p class="tw-text-2xl tw-font-semibold tw-text-gray-700 tw-mb-2">Your cart is empty</p>
        <p class="tw-text-gray-500 tw-mb-8">Add some items to get started!</p>
        <q-btn
            label="Continue Shopping"
            color="primary"
            size="lg"
            unelevated
            icon="arrow_back"
            @click="$router.push('/')"
        />
      </div>

      <div v-else class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-8">
        <div class="lg:tw-col-span-2 tw-space-y-4">
          <q-card class="tw-shadow-sm hover:tw-shadow-md tw-transition-shadow">
            <q-card-section class="tw-py-3">
              <div class="tw-flex tw-items-center tw-gap-3 tw-flex-wrap">
                <q-checkbox
                    v-model="selectAll"
                    color="primary"
                    @click="toggleSelectAll"
                    class="tw-mr-2"
                />
                <span class="tw-font-medium tw-text-gray-900">
                  Select All ({{ selectedItems.length }}/{{ cart.length }})
                </span>
                <q-space/>
                <q-btn
                    v-if="selectedItems.length > 0"
                    :label="`Delete ${selectedItems.length} Selected`"
                    color="negative"
                    outline
                    icon="delete"
                    @click="removeSelectedItems"
                />
              </div>
            </q-card-section>
          </q-card>

          <transition-group name="cart-item" tag="div" class="tw-space-y-4">
            <q-card
                v-for="item in cart"
                :key="item.id"
                class="tw-overflow-hidden tw-transition-all hover:tw-shadow-lg"
                :class="{
                'tw-ring-2 tw-ring-primary tw-ring-opacity-50': selectedItems.includes(item.product_id),
                'tw-shadow-sm': !selectedItems.includes(item.product_id)
              }"
            >
              <div class="tw-p-4 sm:tw-p-6">
                <div class="tw-flex tw-gap-4">
                  <div class="tw-flex-shrink-0 tw-pt-1">
                    <q-checkbox
                        v-model="selectedItems"
                        :val="item.product_id"
                        color="primary"
                        :disable="item.product_stock === 0"
                    />
                  </div>

                  <div class="tw-flex-shrink-0">
                    <div
                        class="tw-w-24 tw-h-24 sm:tw-w-32 sm:tw-h-32 tw-bg-gray-100 tw-rounded-xl tw-overflow-hidden tw-border tw-border-gray-200 tw-cursor-pointer hover:tw-opacity-80 tw-transition-opacity"
                        @click="$router.push({name: 'ProductDetailsPage', params:{slug: item.product_slug}})">
                      <img
                          v-if="item.product_image"
                          :src="item.product_image"
                          :alt="item.product_name"
                          class="tw-w-full tw-h-full tw-object-cover"
                      />
                      <div
                          v-else
                          class="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center tw-bg-gradient-to-br tw-from-gray-100 tw-to-gray-200"
                      >
                        <q-icon name="image" size="48px" class="tw-text-gray-400"/>
                      </div>
                    </div>
                  </div>

                  <div class="tw-flex-1 tw-min-w-0">
                    <div class="tw-flex tw-justify-between tw-gap-4 tw-mb-3">
                      <div class="tw-flex-1">
                        <h3
                            @click="$router.push({name: 'ProductDetailsPage', params:{slug: item.product_slug}})"
                            class="tw-text-lg tw-font-semibold tw-text-gray-900 hover:tw-text-primary hover:tw-underline tw-cursor-pointer tw-transition-colors tw-line-clamp-2"
                        >
                          {{ item.product_name }}
                        </h3>
                        <div class="tw-mt-2 tw-flex tw-flex-wrap tw-gap-x-4 tw-gap-y-1 tw-text-sm">
                          <p v-if="item.product_brand" class="tw-text-gray-600 tw-flex tw-items-center tw-gap-1">
                            <q-icon name="local_offer" size="16px"/>
                            <span class="tw-font-medium">{{ item.product_brand }}</span>
                          </p>
                          <p class="tw-text-gray-600 tw-flex tw-items-center tw-gap-1">
                            <q-icon name="category" size="16px"/>
                            {{ item.product_category }}
                          </p>
                        </div>
                      </div>

                      <q-btn
                          icon="close"
                          flat
                          round
                          dense
                          color="grey-7"
                          class="tw-self-start"
                          @click="removeItem(item.product_id)"
                      >
                        <q-tooltip>Remove from cart</q-tooltip>
                      </q-btn>
                    </div>

                    <q-banner
                        v-if="item.product_stock < 5 && item.product_stock > 0"
                        dense
                        rounded
                        class="tw-flex tw-items-center tw-gap-2 tw-bg-orange-100 tw-border tw-border-orange-200 tw-text-orange-800 tw-px-4 tw-py-2 tw-mb-3 tw-shadow-sm"
                    >
                      <div class="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-font-medium">
                        <q-icon name="warning" size="22px" class="tw-text-orange-600"/>
                        Only<span class="tw-font-bold">{{item.product_stock}}</span>left in stock.
                      </div>
                    </q-banner>

                    <q-banner
                        v-if="item.product_stock === 0"
                        dense
                        rounded
                        class="tw-flex tw-items-center tw-gap-2 tw-bg-red-100 tw-border tw-border-red-200 tw-text-red-800 tw-px-4 tw-py-2 tw-mb-3 tw-shadow-sm"
                    >
                      <div class="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-font-medium">
                        <q-icon name="error" size="22px" class="tw-text-red-600"/>
                        <span class="tw-font-semibold">Out of stock!</span>
                      </div>
                    </q-banner>


                    <div class="tw-flex tw-items-end tw-justify-between tw-flex-wrap tw-gap-4">
                      <div class="tw-flex tw-flex-col tw-gap-2">
                        <span class="tw-text-xs tw-text-gray-500 tw-uppercase tw-tracking-wide">Quantity</span>
                        <div
                            class="tw-flex tw-items-center tw-bg-gray-50 tw-border tw-border-gray-300 tw-rounded-lg tw-overflow-hidden">
                          <q-btn
                              icon="remove"
                              flat
                              dense
                              size="md"
                              class="hover:tw-bg-gray-200"
                              @click="item.quantity--"
                              :disable="item.quantity === 1"
                          />
                          <span
                              class="tw-px-6 tw-py-2 tw-text-base tw-font-semibold tw-bg-white tw-min-w-[60px] tw-text-center">
                            {{ item.quantity }}
                          </span>
                          <q-btn
                              icon="add"
                              flat
                              dense
                              size="md"
                              class="hover:tw-bg-gray-200"
                              @click="item.quantity++"
                              :disable="item.quantity >= item.product_stock"
                          />
                        </div>
                        <span class="tw-text-xs tw-text-gray-500">
                          {{ item.product_stock }} available
                        </span>
                      </div>

                      <div class="tw-text-right">
                        <p class="tw-text-xs tw-text-gray-500 tw-mb-1">
                          NPR {{ parseFloat(item.price).toFixed(2) }} × {{ item.quantity }}
                        </p>
                        <p class="tw-text-2xl tw-font-bold tw-text-gray-900">
                          NPR {{ (item.price * item.quantity).toFixed(2) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-card>
          </transition-group>
        </div>

        <div class="lg:tw-col-span-1">
          <q-card class="tw-sticky tw-top-8 tw-shadow-lg">
            <q-card-section>
              <h2 class="tw-text-2xl tw-font-bold tw-mb-1">
                Order Summary
              </h2>
              <p class="tw-text-sm tw-opacity-90">
                {{ selectedItems.length }} item(s) selected
              </p>
            </q-card-section>

            <q-separator/>

            <q-card-section>
              <div class="tw-space-y-4">
                <div class="tw-flex tw-justify-between tw-text-base">
                  <span class="tw-text-gray-600">Subtotal</span>
                  <span class="tw-font-semibold">NPR {{ selectedTotal.toFixed(2) }}</span>
                </div>

                <div class="tw-flex tw-justify-between tw-text-base">
                  <div class="tw-flex tw-items-center tw-gap-2">
                    <span class="tw-text-gray-600">Shipping</span>
                  </div>
                  <span class="tw-font-semibold">
                    {{ selectedTotal > 0 ? 'NPR 100.00' : 'NPR 0.00' }}
                  </span>
                </div>

                <q-separator/>

                <div class="tw-flex tw-justify-between tw-items-center tw-py-2 tw-bg-gray-50 tw-rounded-lg tw-px-4">
                  <span class="tw-font-bold tw-text-lg tw-text-gray-900">Total</span>
                  <span class="tw-font-bold tw-text-2xl tw-text-primary">
                    NPR {{ allTotal.toFixed(2) }}
                  </span>
                </div>
              </div>
            </q-card-section>

            <q-separator/>

            <q-card-section>
              <q-btn
                  label="Proceed to Checkout"
                  color="primary"
                  class="tw-w-full"
                  size="lg"
                  unelevated
                  icon-right="arrow_forward"
                  :disable="selectedItems.length === 0"
                  @click="proceedToCheckout"
              />
              <q-btn
                  label="Continue Shopping"
                  flat
                  color="primary"
                  class="tw-w-full tw-mt-2"
                  icon="arrow_back"
                  @click="$router.push('/')"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useCartStore} from "stores/cartStore.js";
import {storeToRefs} from "pinia";
import {onMounted, computed, ref} from "vue";
import {useQuasar} from "quasar";
import {useRouter} from "vue-router";
import {useCheckoutStore} from "stores/checkoutStore.js";

const cartStore = useCartStore();
const {cart} = storeToRefs(cartStore);
const $q = useQuasar();
const selectedItems = ref([]);
const selectedItemsDetails = computed(() => {
  return cart.value.filter((item) => selectedItems.value.includes(item.product_id))
})
const router = useRouter()

onMounted(() => {
  cartStore.fetchCart();
  // if (cart.value.length > 0) {
  //   selectedItems.value = cart.value.map((item) => item.product_id);
  // }
});


const removeItem = (id) => {
  $q.dialog({
    title: 'Remove Item',
    message: 'Are you sure you want to remove this item from your cart?',
    cancel: {
      label: 'Cancel',
      flat: true,
      color: 'grey'
    },
    ok: {
      label: 'Remove',
      color: 'negative',
      unelevated: true
    },
    persistent: true
  }).onOk(async () => {
    await cartStore.removeItemsFromCart([id]);
    await cartStore.fetchCart();
      selectedItems.value = selectedItems.value.filter(itemId => itemId !== id);
    $q.notify({
      type: 'positive',
      message: 'Item removed from cart',
      position: 'top',
      timeout: 2000
    });
  });
};

const removeSelectedItems = () => {
  $q.dialog({
    title: 'Remove Selected Items',
    message: `Remove ${selectedItems.value.length} selected item(s) from your cart?`,
    cancel: {
      label: 'Cancel',
      flat: true,
      color: 'grey'
    },
    ok: {
      label: 'Remove All',
      color: 'negative',
      unelevated: true
    },
    persistent: true
  }).onOk(async () => {
    await cartStore.removeItemsFromCart(selectedItems.value);
    await cartStore.fetchCart();
    selectedItems.value = [];
    $q.notify({
      type: 'positive',
      message: 'Selected items removed from cart',
      position: 'top',
      timeout: 2000
    });
  });
};

const clearCart = () => {
  $q.dialog({
    title: 'Clear Cart',
    message: 'Are you sure you want to remove all items from your cart?',
    cancel: {
      label: 'Cancel',
      flat: true,
      color: 'grey'
    },
    ok: {
      label: 'Clear All',
      color: 'negative',
      unelevated: true
    },
    persistent: true
  }).onOk(async () => {
    const allIds = cart.value.map(item => item.product_id);
    await cartStore.removeItemsFromCart(allIds);
    await cartStore.fetchCart();
    selectedItems.value = [];
    $q.notify({
      type: 'positive',
      message: 'Cart cleared successfully',
      position: 'top',
      timeout: 2000
    });
  });
};

const toggleSelectAll = () => {
  if (selectedItems.value.length === cart.value.length) {
    selectedItems.value = []
    return
  }
  selectedItems.value = cart.value.map((item) => item.product_id).filter(id => {
    const item = cart.value.find(i => i.product_id === id);
    return item.product_stock !== 0;
  });
}

const selectAll = computed(() => selectedItems.value.length === cart.value.length)

const selectedTotal = computed(() => {
  return cart.value
      .filter((item) => selectedItems.value.includes(item.product_id))
      .filter(i => i.product_stock !== 0 )
      .reduce((total, item) => total + (item.price * item.quantity), 0)
})

const allTotal = computed(() => selectedTotal.value > 0 ? selectedTotal.value + 100 : 0)

const checkOutStore = useCheckoutStore()
const {checkOutProducts} = storeToRefs(checkOutStore);
const proceedToCheckout = () => {
  checkOutProducts.value = selectedItemsDetails.value
  localStorage.setItem('checkOutProducts', JSON.stringify(selectedItemsDetails.value));
  router.push({name: 'CheckoutPage'})
};
</script>