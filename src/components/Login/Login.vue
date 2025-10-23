<template>
  <q-dialog v-model="openDialog" persistent>
    <q-card class="tw-w-[400px] tw-rounded-2xl tw-p-4">
      <div class="tw-flex tw-justify-between tw-items-center tw-mb-4">
        <div class="tw-text-xl tw-font-semibold">
          {{ isLogin ? 'Login' : 'Create Account' }}
        </div>
        <q-btn flat round icon="close" dense @click="closeDialog"/>
      </div>

      <div v-if="isLogin">
        <q-input v-model="loginForm.email" label="Email" type="email" outlined dense class="tw-mb-3"/>
        <q-input v-model="loginForm.password" label="Password" type="password" outlined dense class="tw-mb-4"/>

        <q-btn
            label="Login"
            color="primary"
            class="tw-w-full tw-mb-2"
            @click="submitLogin"
        />

        <div class="tw-text-center tw-text-sm tw-text-gray-500">
          Don't have an account?
          <q-btn flat dense label="Sign Up" @click="isLogin = false" color="primary"/>
        </div>
      </div>

      <div v-else>
        <q-input v-model="registerForm.name" label="Full Name" outlined dense class="tw-mb-3"/>
        <q-input v-model="registerForm.email" label="Email" type="email" outlined dense class="tw-mb-3"/>
        <q-input v-model="registerForm.mobile" label="Mobile" type="tel" outlined dense class="tw-mb-3"/>
        <q-input v-model="registerForm.password" label="Password" type="password" outlined dense class="tw-mb-4"/>

        <q-btn
            label="Register"
            color="primary"
            class="tw-w-full tw-mb-2"
            @click="submitRegister"
        />

        <div class="tw-text-center tw-text-sm tw-text-gray-500">
          Already have an account?
          <q-btn flat dense label="Login" @click="isLogin = true" color="primary"/>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { useAuthStore } from "stores/authStore.js";
import {storeToRefs} from "pinia";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(["update:modelValue"]);

const openDialog = ref(false);
watch(() => props.modelValue, val => openDialog.value = val);
watch(openDialog, val => emit("update:modelValue", val));

const authStore = useAuthStore();
const {currentUser} = storeToRefs(authStore)

const isLogin = ref(true);

const loginForm = ref({
  email: '',
  password: ''
});

const registerForm = ref({
  name: '',
  email: '',
  mobile: '',
  password: ''
});

const closeDialog = () => {
  openDialog.value = false;
  resetForms();
};

const resetForms = () => {
  loginForm.value = { email: '', password: '' };
  registerForm.value = { name: '', email: '', mobile: '', password: '' };
};

const submitLogin = async () => {
  const payload = {
    email: loginForm.value.email.trim(),
    password: loginForm.value.password,
  };

  await authStore.login(payload).then((res) => {
    if (res) {
      closeDialog();
    }
  });
};

const submitRegister = async () => {
  const payload = {
    name: registerForm.value.name.trim(),
    email: registerForm.value.email.trim(),
    mobile: registerForm.value.mobile.trim(),
    password: registerForm.value.password,
  };

  await authStore.register(payload).then((res) => {
    if (res) {
      closeDialog();
    }
  });
};
</script>

<style scoped>
.tw-w-\[400px\] {
  width: 400px;
}
</style>
