import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CountryDetailView from '../views/CountryDetailView.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView,
    },
    {
        path: '/country/:code',
        name: 'CountryDetail',
        component: CountryDetailView,
        props: true, // Allows receiving :code directly as a prop in the component
    },
    {
        // Fallback route for unknown paths
        path: '/:pathMatch(.*)*',
        redirect: '/',
    },
];

const router = createRouter({
    // Note: On GitHub Pages, use the project subdirectory if configured in vite/vue.config
    history: createWebHistory(process.env.BASE_URL),
    routes,
    scrollBehavior() {
        // Always scroll to the top of the screen when switching pages
        return { top: 0 };
    },
});

export default router;