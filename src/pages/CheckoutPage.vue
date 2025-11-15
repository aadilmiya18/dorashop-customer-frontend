<template>
  <div class="tw-container tw-mx-auto tw-my-12 tw-px-4">
    <div class="tw-grid lg:tw-grid-cols-3 tw-gap-8">

      <div class="lg:tw-col-span-2 tw-space-y-8">

        <q-card class="tw-shadow-lg tw-rounded-xl tw-p-8">
          <h2 class="tw-text-2xl tw-font-bold tw-mb-6 tw-text-gray-800">Shipping Information</h2>

          <q-form class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-x-6 tw-gap-y-4">

            <q-input
                v-model="currentUser.name"
                label="Full Name"
                outlined
                class="tw-col-span-2"
            />

            <q-input
                v-model="currentUser.email"
                label="Email Address"
                outlined
                disable
                hint="Cannot be changed"
            />

            <q-input
                v-model="currentUser.mobile"
                label="Mobile Number"
                outlined
                disable
                hint="Cannot be changed"
            />

            <q-input
                v-model="currentUser.address"
                label="Shipping Address"
                outlined
                type="textarea"
                autogrow
                class="tw-col-span-2"
            />
          </q-form>
        </q-card>

        <q-card class="tw-shadow-lg tw-rounded-xl tw-p-8">
          <h2 class="tw-text-2xl tw-font-bold tw-mb-6 tw-text-gray-800">Review Your Order ({{ checkOutProducts.length }}
            items)</h2>

          <q-list separator>
            <q-item v-for="(item, index) in checkOutProducts" :key="index" class="tw-py-4">
              <q-item-section avatar>
                <q-img
                    :src="item?.product_image || 'placeholder.jpg'"
                    class="tw-w-16 tw-h-16 tw-object-cover tw-rounded-lg"
                    spinner-color="primary"
                    :ratio="1"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label class="tw-font-semibold">{{ item?.product_name }}</q-item-label>
                <q-item-label caption class="tw-text-sm">{{ item?.product_category }}</q-item-label>
                <q-item-label caption class="tw-text-sm tw-text-gray-600">Qty: {{ item?.quantity }} | Stock:
                  {{ item?.product_stock }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label class="tw-font-bold tw-text-lg tw-text-primary">Rs. {{
                    item?.price * item?.quantity
                  }}
                </q-item-label>
                <q-item-label caption>Rs. {{ item?.price }} / unit</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

        </q-card>

      </div>

      <div class="lg:tw-col-span-1 tw-space-y-8">

        <q-card class="tw-shadow-lg tw-rounded-xl tw-p-8 tw-sticky tw-top-12">
          <h2 class="tw-text-2xl tw-font-bold tw-mb-6 tw-text-gray-800">Order Summary</h2>

          <div class="tw-space-y-3">
            <div class="tw-flex tw-justify-between tw-text-base tw-text-gray-600">
              <span>Subtotal:</span>
              <span class="tw-font-medium">Rs. {{ subTotalPrice.toLocaleString() }}</span>
            </div>

            <div class="tw-flex tw-justify-between tw-text-base tw-text-gray-600">
              <span>Shipping (Fixed):</span>
              <span class="tw-font-medium">Rs. 100</span>
            </div>

            <q-separator class="tw-my-4"/>

            <div class="tw-flex tw-justify-between tw-font-extrabold tw-text-xl tw-text-primary">
              <span>Total Payable:</span>
              <span>Rs. {{ (subTotalPrice + 100).toLocaleString() }}</span>
            </div>
          </div>

          <q-separator class="tw-my-6"/>

          <h3 class="tw-text-xl tw-font-bold tw-mb-4 tw-text-gray-800">Payment Method</h3>
          <q-select
              v-model="selectedPaymentMethod"
              :options="paymentMethods"
              label="Select Payment Method"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              outlined
              required
              :rules="[val => !!val || 'Please select a payment method']"
              class="tw-w-full"
          />

          <q-btn
              v-if="selectedPaymentMethod"
              label="Proceed to Payment"
              color="primary"
              unelevated
              class="tw-w-full tw-mt-6 tw-font-semibold tw-py-3 tw-text-lg tw-rounded-lg"
              @click="proceedPayment"
          />

        </q-card>
      </div>

    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {useAuthStore} from "stores/authStore.js";
import {storeToRefs} from "pinia";
import {useCheckoutStore} from "stores/checkoutStore.js";
import {useQuasar} from "quasar";

const authStore = useAuthStore();
const {currentUser} = storeToRefs(authStore);
const $q = useQuasar()

const checkOutStore = useCheckoutStore()
const {checkOutProducts} = storeToRefs(checkOutStore);

onMounted(async () => {
  await authStore.fetchProfile();
  const saved = localStorage.getItem('checkOutProducts')
  if (saved) {
    checkOutProducts.value = JSON.parse(saved)
  }
});


const subTotalPrice = computed(() => {
  return checkOutProducts.value.reduce((acc, item) => {
    const prodPrice = item.price * item.quantity
    return prodPrice + acc
  }, 0)
})

const selectedPaymentMethod = ref(null);
const paymentMethods = ref([
  {label: 'Credit/Debit Card', value: 'card'},
  {label: 'Esewa', value: 'esewa'},
  {label: 'Cash on Delivery', value: 'cod'},
]);

const proceedPayment = async () => {
  if (!currentUser.value.address) {
    $q.notify({
      message: "Fillup Address first",
      color: "negative"
    })
    return;
  }

  await checkOutStore.payWithEsewa({
    name: currentUser.value.name,
    address: currentUser.value.address,
    subtotal: subTotalPrice.value,
    shipping: 100,
    total: subTotalPrice.value + 100,
    items: checkOutProducts.value
  })

  $q.notify({
    message: "Order Placed Successfully",
    color: "positive"
  })
}

</script>
