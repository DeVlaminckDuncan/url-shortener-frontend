import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import store from './store';

// @ts-ignore
import VueApexCharts from 'vue3-apexcharts';

import './assets/tailwind.css';

createApp(App)
	.use(VueApexCharts)
	.use(store)
	.use(router)
	.mount('#app');
