import { nextTick } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import { capitalize } from '@/utils/dataFormattings';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'CheckToken',
		component: () => import(/* webpackChunkName: "checkToken" */ '../presentations/url-shortener/views/CheckToken.vue'),
		children: [
			{
				path: '/',
				alias: '/home',
				name: 'Home',
				component: () => import(/* webpackChunkName: "home" */ '../presentations/url-shortener/views/Home.vue'),
			},

			{
				path: '/dashboard',
				name: 'Dashboard',
				component: () => import(/* webpackChunkName: "dashboard" */ '../presentations/url-shortener/views/Dashboard.vue'),
			},

			{
				path: '/settings',
				name: 'Settings',
				component: () => import(/* webpackChunkName: "settings" */ '../presentations/url-shortener/views/Settings.vue'),
			},
		],
	},

	{
		path: '/login',
		name: 'Login',
		component: () => import(/* webpackChunkName: "login" */ '../presentations/url-shortener/views/Login.vue'),
	},

	{
		path: '/signup',
		name: 'SignUp',
		component: () => import(/* webpackChunkName: "signUp" */ '../presentations/url-shortener/views/SignUp.vue'),
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

router.afterEach((to) => {
	nextTick(() => {
		if (to.name) {
			// Set page title by using the component name eg 'Login' -> 'Login - URL Shortener'

			document.title = `${capitalize(
				to.name
					.toString()
					.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)
					.trim(),
			)} - URL Shortener`;
		}
	});
});

export default router;
