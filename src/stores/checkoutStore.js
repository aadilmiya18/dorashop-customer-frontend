import {defineStore} from "pinia";
import {ref} from "vue";
import {authApi} from "boot/axios.js";

export const useCheckoutStore = defineStore('checkoutStore', () => {

    const checkOutProducts = ref([]);


    const createOrder = async (payload) => {
        try {
            const response = await authApi.post('order/create', payload);
            return response.data;
        } catch (e) {
            console.error(e)
        }
    }

    const payWithEsewa = async (payload) => {
        const {pid, total, signature} = await createOrder(payload);

        const form = document.createElement('form');
        form.method = "POST"
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form"

        const params = {
            amount: total,
            tax_amount: 0,
            product_service_charge: 0,
            product_delivery_charge: 0,
            total_amount: total,
            transaction_uuid: pid,
            product_code: "EPAYTEST",
            success_url: "http://localhost:8000/api/customer/esewa/success",
            failure_url: "http://localhost:8000/api/customer/esewa/failure",
            signed_field_names: "total_amount,transaction_uuid,product_code",
            signature: signature
        };


        Object.keys(params).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = params[key];
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
    }

    return {
        checkOutProducts,
        createOrder,
        payWithEsewa
    }

})