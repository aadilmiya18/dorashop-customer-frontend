<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="tw-shadow-2xl">
      <!-- Main Header -->
      <div class="tw-bg-[#1976D2] tw-shadow-lg">
        <div
            class="tw-flex tw-justify-between tw-items-center tw-px-8 lg:tw-px-16 tw-py-4 tw-max-w-[1600px] tw-mx-auto">
          <!-- Logo Section -->
          <div
              @click="$router.push('/')"
              class="tw-flex tw-items-center tw-gap-4 tw-cursor-pointer tw-group"
          >
            <q-avatar size="60px"
                      class="tw-transition-all tw-duration-300 group-hover:tw-scale-150 group-hover:tw-rotate-3 tw-bg-white tw-shadow-lg">
              <img
                  src="../assets/logo.png"
                  class="tw-object-cover"
              />
            </q-avatar>
            <span class="tw-text-2xl tw-font-bold tw-text-white tw-hidden md:tw-block tw-tracking-wide">
              Dora Shop
            </span>
          </div>

          <!-- Search Bar -->
          <div class="tw-flex-1 tw-max-w-3xl tw-mx-8 tw-hidden lg:tw-block">
            <q-input
                placeholder="Search for Products, Brands and More"
                filled
                bg-color="white"
                class="search-input tw-rounded-full tw-shadow-md hover:tw-shadow-xl tw-transition-all tw-duration-300"
                debounce="400"
            >
              <template #prepend>
                <q-icon name="mdi-magnify" color="blue-7" size="24px" class="tw-ml-2"/>
              </template>
              <template #append>
                <q-btn
                    flat
                    dense
                    round
                    icon="mdi-microphone"
                    color="blue-7"
                    size="sm"
                    class="tw-mr-1"
                >
                  <q-tooltip class="tw-bg-blue-grey-8">Voice Search</q-tooltip>
                </q-btn>
              </template>
            </q-input>
          </div>

          <!-- Action Buttons -->
          <div class="tw-flex tw-items-center tw-gap-1">
            <div v-if="currentUser" class="tw-flex">
            <q-icon name="mdi-account-circle" size="24px" class="tw-mr-2"/>
              {{currentUser?.name}}
            </div>
            <q-btn
                v-if="!currentUser"
                flat
                no-caps
                class="action-btn tw-hidden md:tw-flex tw-text-white hover:tw-bg-white/20"
                padding="sm md"
                @click="openLoginDialog = true"
            >
              <q-icon name="mdi-account-circle" size="24px" class="tw-mr-2"/>
              <span class="tw-font-medium">Login</span>
              <q-tooltip class="tw-bg-blue-grey-8">Sign in to your account</q-tooltip>
            </q-btn>

            <q-btn
                v-else
                flat
                no-caps
                class="action-btn tw-hidden md:tw-flex tw-text-white hover:tw-bg-white/20"
                padding="sm md"
                @click="logoutUser"
            >
              <q-icon name="mdi-logout" size="24px" class="tw-mr-2"/>
              <span class="tw-font-medium">Logout</span>
              <q-tooltip class="tw-bg-blue-grey-8">Log Out</q-tooltip>
            </q-btn>



            <q-btn
                flat
                no-caps
                class="action-btn tw-relative tw-text-white hover:tw-bg-white/20"
                padding="sm md"
            >
              <q-badge
                  color="red-6"
                  floating
                  rounded
                  class="tw-font-bold"
              >
                3
              </q-badge>
              <q-icon name="mdi-cart" size="24px" class="tw-mr-2"/>
              <span class="tw-font-medium tw-hidden md:tw-inline">Cart</span>
              <q-tooltip class="tw-bg-blue-grey-8">View your cart</q-tooltip>
            </q-btn>

            <q-btn
                flat
                no-caps
                class="action-btn tw-relative tw-hidden sm:tw-flex tw-text-white hover:tw-bg-white/20"
                padding="sm md"
            >
              <q-badge
                  color="pink-5"
                  floating
                  rounded
                  class="tw-font-bold"
              >
                12
              </q-badge>
              <q-icon name="mdi-heart" size="24px" class="tw-mr-2"/>
              <span class="tw-font-medium tw-hidden md:tw-inline">Wishlist</span>
              <q-tooltip class="tw-bg-blue-grey-8">Your favorites</q-tooltip>
            </q-btn>

            <q-btn
                flat
                round
                class="action-btn tw-relative tw-text-white hover:tw-bg-white/20"
                padding="sm"
            >
              <q-badge
                  color="orange-6"
                  floating
                  rounded
                  class="tw-animate-bounce tw-font-bold"
              >
                5
              </q-badge>
              <q-icon name="mdi-bell" size="24px"/>
              <q-tooltip class="tw-bg-blue-grey-8">Notifications</q-tooltip>
            </q-btn>

            <!-- Mobile Menu -->
            <q-btn
                flat
                round
                icon="mdi-menu"
                class="lg:tw-hidden tw-text-white hover:tw-bg-white/20"
                @click="mobileMenuOpen = !mobileMenuOpen"
            />
          </div>
        </div>

        <!-- Mobile Search Bar -->
        <div class="tw-px-4 tw-pb-4 lg:tw-hidden">
          <q-input
              placeholder="Search products..."
              filled
              dense
              bg-color="white"
              class="search-input tw-rounded-full tw-shadow-md"
              debounce="400"
          >
            <template #prepend>
              <q-icon name="mdi-magnify" color="blue-7"/>
            </template>
          </q-input>
        </div>
      </div>

      <!-- Category Navigation Bar -->
      <div class="tw-bg-gradient-to-r tw-from-[#1565C0] tw-to-[#1976D2] tw-shadow-md">
        <div class="tw-max-w-[1600px] tw-mx-auto tw-px-8 lg:tw-px-16 tw-py-3">
          <div class="tw-flex tw-items-center tw-gap-6 tw-overflow-x-auto scrollbar-hide">
            <q-btn
                v-for="(category,index) in allCategories"
                :key="index"
                flat
                no-caps
                dense
                class="category-btn tw-text-white hover:tw-bg-white/20 tw-transition-all tw-duration-300 tw-rounded-lg tw-px-4 tw-whitespace-nowrap tw-font-medium"
                @click="redirectToDetails(category)"
            >
              {{ category.name }}
            </q-btn>
          </div>
        </div>
      </div>
    </q-header>

    <q-page-container>
      <router-view/>
    </q-page-container>

    <!-- Mobile Menu Drawer -->
    <q-drawer
        v-model="mobileMenuOpen"
        side="right"
        overlay
        behavior="mobile"
        class="tw-bg-gradient-to-b tw-from-blue-50 tw-to-blue-100"
    >
      <div class="tw-bg-[#1976D2] tw-p-6 tw-text-white">
        <div class="tw-flex tw-items-center tw-gap-3">
          <q-avatar size="50px" class="tw-bg-white">
            <img src="../assets/logo.png"/>
          </q-avatar>
          <div>
            <div class="tw-text-xl tw-font-bold">Dora Shop</div>
            <div class="tw-text-sm tw-text-blue-100">Your shopping destination</div>
          </div>
        </div>
      </div>

      <q-list class="tw-p-4">
        <q-item clickable v-ripple class="tw-rounded-lg tw-mb-2 hover:tw-bg-blue-100 tw-transition-all">
          <q-item-section avatar>
            <q-icon name="mdi-account-circle" color="blue-7" size="28px"/>
          </q-item-section>
          <q-item-section>
            <q-item-label class="tw-font-semibold tw-text-blue-grey-9">Login</q-item-label>
            <q-item-label caption class="tw-text-blue-grey-7">Access your account</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple class="tw-rounded-lg tw-mb-2 hover:tw-bg-blue-100 tw-transition-all">
          <q-item-section avatar>
            <q-badge color="red-6" floating rounded class="tw-animate-pulse">3</q-badge>
            <q-icon name="mdi-cart" color="blue-7" size="28px"/>
          </q-item-section>
          <q-item-section>
            <q-item-label class="tw-font-semibold tw-text-blue-grey-9">Cart</q-item-label>
            <q-item-label caption class="tw-text-blue-grey-7">3 items</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple class="tw-rounded-lg tw-mb-2 hover:tw-bg-blue-100 tw-transition-all">
          <q-item-section avatar>
            <q-badge color="pink-5" floating rounded>12</q-badge>
            <q-icon name="mdi-heart" color="pink-6" size="28px"/>
          </q-item-section>
          <q-item-section>
            <q-item-label class="tw-font-semibold tw-text-blue-grey-9">Wishlist</q-item-label>
            <q-item-label caption class="tw-text-blue-grey-7">12 items</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="tw-my-4"/>

        <q-item-label header class="tw-text-[#1976D2] tw-font-bold tw-text-lg">Categories</q-item-label>
        <q-item
            v-for="category in categories"
            :key="category"
            clickable
            v-ripple
            class="tw-rounded-lg tw-mb-1 hover:tw-bg-blue-100 tw-transition-all"
        >
          <q-item-section>
            <q-item-label class="tw-text-blue-grey-9">{{ category }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="mdi-chevron-right" color="blue-grey-5"/>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
  </q-layout>

  <login v-model="openLoginDialog" />
</template>

<script setup>
import {onMounted, ref, watch} from 'vue'
import {useCategoryStore} from "stores/categoryStore.js";
import {storeToRefs} from "pinia";
import {useRouter} from "vue-router";
import Login from "components/Login/Login.vue";
import {useAuthStore} from "stores/authStore.js";
import {useQuasar} from "quasar";

const authStore = useAuthStore();
const {currentUser} = storeToRefs(authStore)

const mobileMenuOpen = ref(false)

const categoryStore = useCategoryStore();
const {categories} = storeToRefs(categoryStore)
const allCategories = ref([])
const router = useRouter()
const openLoginDialog = ref(false)

onMounted(() => {
  categoryStore.fetchCategories()
  authStore.validateToken()
})

watch(() => categories.value,
    (newCategories) => {
      allCategories.value = [{name: 'Home', slug:'home'}, ...newCategories]
    }, {immediate: true}
)

const redirectToDetails = (category) => {
  if(category.slug === 'home'){
    router.push('/')
    return;
  }
  router.push({name: 'CategoryDetailsPage', params:{slug: category.slug}})
  categoryStore.fetchParentChildrenCategories(category.slug)

}
const $q = useQuasar()
const logoutUser = async () => {
  try {
    $q.dialog({
      title: 'Logout',
      message: 'Are you sure you want to logout',
      cancel: {
        label: 'Cancel',
        color: 'grey-7',
        flat: true
      },
      ok: {
        label: 'Logout',
        color: 'negative',
        unelevated: true,
      },
      persistent: true,
    }).onOk(async () => {
      await authStore.logout()
    })
  } catch (e) {
    $q.notify({
      message: e?.message || 'An error occurred',
      color: 'negative',
      icon: 'mdi-alert-circle',
      position: 'top'
    })
  }
}

</script>

<style scoped>
.action-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
}

.category-btn {
  position: relative;
  overflow: hidden;
}

.category-btn::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: white;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.category-btn:hover::before {
  width: 80%;
}

.search-input :deep(.q-field__control) {
  border-radius: 50px;
}

.search-input :deep(.q-field__control::before) {
  border: none;
}

.search-input :deep(.q-field__control::after) {
  border: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>