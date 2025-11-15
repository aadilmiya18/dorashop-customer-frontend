<template>
  <div class="tw-container tw-mx-auto tw-my-12 tw-text-center">
    <h1 class="tw-text-3xl tw-font-bold tw-text-red-600">Payment Failed!</h1>
    <p class="tw-mt-4">Your order ID: <strong>{{ orderId }}</strong></p>
    <p class="tw-mt-2">Please try again or contact support.</p>
    <q-btn to="/checkout" label="Go Back to Checkout" color="primary" class="tw-mt-6"/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const orderId = ref(null);

onMounted(() => {
  orderId.value = route.query.order || 'N/A';
});
</script>
