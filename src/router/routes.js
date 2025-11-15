const routes = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            {
                path: '',
                component: () => import('pages/IndexPage.vue')
            },
            {
                path: '/category/:slug',
                name: 'CategoryDetailsPage',
                component: () => import('pages/CategoryDetailsPage.vue'),
            },
            {
                path: '/product/:slug',
                name: 'ProductDetailsPage',
                component: () => import('pages/ProductDetailsPage.vue'),
            },
            {
                path: '/add-to-cart',
                name: 'AddToCartPage',
                component: () => import('pages/AddToCartPage.vue'),
            },
            {
                path: '/wishlists',
                name: 'WishlistsPage',
                component: () => import('pages/WishlistsPage.vue'),
            },
            {
                path: '/checkout',
                name: 'CheckoutPage',
                component: () => import('pages/CheckoutPage.vue'),
            },
            {
                path: '/esewa/success',
                name: 'EsewaSuccessPage',
                component: () => import('pages/EsewaSuccessPage.vue'),
            },
            {
                path: '/esewa/failure',
                name: 'EsewaFailurePage',
                component: () => import('pages/EsewaFailurePage.vue'),
            },
        ]
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue')
    }
]

export default routes
