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
