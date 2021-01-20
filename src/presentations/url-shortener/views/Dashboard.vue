<template>
	<HeaderLinks />

	<main>
		<div class="flex justify-center mb-12">
			<form>
				<InputField v-model="state.inputData.name" :value="state.inputData.name" label="Name" name="urlName" id="urlName" />
				<InputField v-model="state.inputData.longURL" :value="state.inputData.longURL" label="URL" name="url" id="url" type="url" />

				<Button @click="submitLongUrl" text="Create" color="blue-main" :classes="['px-6', 'py-2', 'rounded-lg', 'transition', 'duration-75']" />
			</form>
		</div>

		<hr class="mb-12 opacity-10" />

		<div v-if="state.urls.length">
			<div v-for="(url, index) of state.urls" :key="url.shortenedURL.id" class="customUrlItem flex justify-between items-center mb-6 mx-6 p-6 shadow-sm">
				<div class="text-left">
					<div>
						<div v-if="url.editingName" class="relative mb-3">
							<input v-model="url.editingName" class="w-max block border border-black border-opacity-25 rounded px-2 py-1 focus:outline-none" id="urlName" name="urlName" type="text" placeholder="Name" required />
						</div>
						<span v-else>{{ url.shortenedURL.name }}</span>
					</div>

					<div>
						<a :href="state.backendUrl + url.shortenedURL.shortURL" target="_blank">{{ state.backendUrl + url.shortenedURL.shortURL }}</a>
					</div>

					<div>
						<a :href="url.shortenedURL.longURL" target="_blank">{{ url.shortenedURL.longURL }}</a>
					</div>

					<p class="mt-4">{{ `${url.visits} visit${url.visits == 0 || url.visits > 1 ? 's' : ''}` }}</p>
					<Button v-if="url.visits > 0" @click="toggleChart(url)" :text="url.analyticsButtonText" color="blue-main" :classes="['px-6', 'py-2', 'rounded-lg', 'transition', 'duration-75']" />

					<div v-if="url.analyticsButtonText == 'Hide chart'">
						<VueApexCharts type="bar" :options="url.chartOptions" :series="url.chartSeries" :width="state.device.width / (state.device.width >= state.device.height ? 2 : 1.5)" :height="state.device.height / (state.device.height >= state.device.width ? 3 : 2)" />
					</div>

					<p class="mt-2">Created on {{ formatDate(url.shortenedURL.createdAt) }}</p>
				</div>

				<div class="flex">
					<div v-if="url.editingName" class="flex">
						<svg @click="updateShortUrl(url)" class="cursor-pointer customIcon--green" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6e6e6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>

						<svg @click="cancelEditingItem(url)" class="cursor-pointer ml-2 customIcon--red" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6e6e6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</div>

					<div v-else-if="url.deleting">
						<p class="mb-2">Are you sure you want to delete this shortened URL?</p>

						<div class="flex justify-end">
							<svg @click="deleteShortUrl(index)" class="cursor-pointer customIcon--green" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6e6e6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>

							<svg @click="toggleDeletingItem(url)" class="cursor-pointer ml-2 customIcon--red" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6e6e6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<line x1="18" y1="6" x2="6" y2="18"></line>
								<line x1="6" y1="6" x2="18" y2="18"></line>
							</svg>
						</div>
					</div>

					<div v-else class="ml-4 flex">
						<svg @click="editItem(url)" class="cursor-pointer customIcon--green" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6e6e6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
							<polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
						</svg>

						<svg @click="toggleDeletingItem(url)" class="cursor-pointer ml-2 customIcon--red" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6e6e6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<polyline points="3 6 5 6 21 6"></polyline>
							<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
							<line x1="10" y1="11" x2="10" y2="17"></line>
							<line x1="14" y1="11" x2="14" y2="17"></line>
						</svg>
					</div>
				</div>
			</div>
		</div>
		<div v-else-if="state.loading" class="flex justify-center mb-8">
			<svg width="48px" height="48px" viewBox="0 0 128 128">
				<g>
					<path d="M64 0a7 7 0 1 1-7 7 7 7 0 0 1 7-7zm29.86 12.2a2.8 2.8 0 1 1-3.83 1.02 2.8 2.8 0 0 1 3.83-1.02zm22.16 21.68a3.15 3.15 0 1 1-4.3-1.15 3.15 3.15 0 0 1 4.3 1.15zm.87 60.53a4.2 4.2 0 1 1-1.57-5.7 4.2 4.2 0 0 1 1.54 5.73zm7.8-30.5a3.85 3.85 0 1 1-3.85-3.85 3.85 3.85 0 0 1 3.85 3.84zm-30 53.2a4.55 4.55 0 1 1 1.66-6.23 4.55 4.55 0 0 1-1.67 6.22zM64 125.9a4.9 4.9 0 1 1 4.9-4.9 4.9 4.9 0 0 1-4.9 4.9zm-31.06-8.22a5.25 5.25 0 1 1 7.17-1.93 5.25 5.25 0 0 1-7.14 1.93zM9.9 95.1a5.6 5.6 0 1 1 7.65 2.06A5.6 5.6 0 0 1 9.9 95.1zM1.18 63.9a5.95 5.95 0 1 1 5.95 5.94 5.95 5.95 0 0 1-5.96-5.94zm8.1-31.6a6.3 6.3 0 1 1 2.32 8.6 6.3 6.3 0 0 1-2.3-8.6zM32.25 8.87a6.65 6.65 0 1 1-2.44 9.1 6.65 6.65 0 0 1 2.46-9.1z" fill="#000000" fill-opacity="1" />
					<animateTransform attributeName="transform" type="rotate" values="0 64 64;30 64 64;60 64 64;90 64 64;120 64 64;150 64 64;180 64 64;210 64 64;240 64 64;270 64 64;300 64 64;330 64 64" calcMode="discrete" dur="1080ms" repeatCount="indefinite"></animateTransform>
				</g>
			</svg>
		</div>
		<div v-else-if="state.error">
			<p v-if="state.error" class="text-red mb-8">
				{{ state.error }}
			</p>
		</div>
		<div v-else-if="state.urlsAmount == 0">
			You haven't created any short URLs yet!
		</div>
	</main>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import route from '@/router';
import store from '@/store';

// @ts-ignore
import VueApexCharts from 'vue3-apexcharts';

import { formatDate } from '@/utils/dataFormattings';
import { checkNewToken, checkTokenExists } from '@/utils/token';
import { deleteById, get, post, put } from '@/utils/api';
import cookie from '@/utils/cookie';
import ShortenedUrl from '@/models/ShortenedUrl';
import InputField from '../components/InputField.vue';
import HeaderLinks from '../components/HeaderLinks.vue';
import Button from '../components/Button.vue';

type UrlData = {
	shortenedURL: ShortenedUrl;
	analytics?: Array<string>;
	analyticsButtonText: string;
	chartOptions?: any;
	chartSeries?: any;
	visits: Number;
	editingName: string;
	deleting: Boolean;
};

type NewUrlData = {
	name: string;
	longURL: string;
	userID: string;
};

type State = {
	urls: Array<UrlData>;
	urlsAmount: Number;
	inputData: NewUrlData;

	device: {
		width: any;
		height: any;
	};

	backendUrl: string;

	loading: Boolean;
	error: string;
};

export default defineComponent({
	components: {
		InputField,
		VueApexCharts,
		HeaderLinks,
		Button,
	},

	setup() {
		const state: State = reactive({
			urls: [],
			urlsAmount: -1,
			inputData: {
				name: '',
				longURL: '',
				userID: store.getters.getUserId(), // not working after log in ???
			},

			device: {
				width: window.innerWidth > 0 ? window.innerWidth : screen.width,
				height: window.innerHeight > 0 ? window.innerHeight : screen.height,
			},

			backendUrl: process.env.VUE_APP_BACKEND_URL.replace('api/', ''),

			loading: false,
			error: '',
		});

		const getData = async () => {
			const token = cookie.get('token');

			if (token) {
				const timeout = setTimeout(() => {
					state.loading = true;
				}, 1000);
				const data = await get(`short-urls/${state.inputData.userID}`, token);
				clearTimeout(timeout);
				state.loading = false;

				if (data.error) {
					state.error = data.message;
					return;
				}

				checkTokenExists(data.statusCode, route);

				const newToken = checkNewToken(data);
				if (newToken) {
					await getData();

					return;
				}

				if (data.urls) {
					state.urls = data.urls;
					state.urls.forEach((url) => {
						url.visits = url.analytics ? url.analytics.length : 0;

						url.analyticsButtonText = 'Show chart';

						if (url.analytics) {
							url.analytics.sort();

							const dates: Array<string> = [];
							url.analytics.forEach((visit) => {
								const date = visit.split(' ')[0];
								dates.push(date);
							});

							const uniqueDays = new Set(dates);

							const visitsPerDay: Array<Number> = [];
							uniqueDays.forEach((d) => {
								const visits = dates.filter((day) => day == d).length;
								visitsPerDay.push(visits);
							});

							url.chartOptions = {
								chart: {
									id: url.shortenedURL.id,
								},
								xaxis: {
									categories: Array.from(uniqueDays),
								},
							};
							url.chartSeries = [
								{
									name: 'Analytics',
									data: visitsPerDay,
								},
							];
						}

						url.shortenedURL.createdAt = new Date(url.shortenedURL.createdAt);
					});
				} else {
					state.urlsAmount = 0;
				}
			} else {
				route.replace('/login');
			}
		};

		const submitLongUrl = async (event: Event) => {
			event.preventDefault();

			if (state.inputData.name != '' && state.inputData.longURL != '' && state.inputData.userID != '') {
				const token = cookie.get('token');
				const data = await post('short-urls', state.inputData, token);

				checkTokenExists(data.statusCode, route);

				const newToken = checkNewToken(data);
				if (newToken) {
					await submitLongUrl(event);

					return;
				}

				state.inputData.longURL = state.backendUrl + data.shortenedURL.shortURL;

				const shortenedUrl: ShortenedUrl = data.shortenedURL;

				shortenedUrl.createdAt = new Date(shortenedUrl.createdAt);

				const urlData: UrlData = {
					shortenedURL: shortenedUrl,
					analyticsButtonText: 'Show chart',
					visits: 0,
					editingName: '',
					deleting: false,
				};
				state.urls.push(urlData);

				// Not the best way to do this but atleast it works...
				setTimeout(() => {
					// @ts-ignore
					document.querySelector('#url').select();
					document.execCommand('copy');
				}, 20);
			}
		};

		const updateShortUrl = async (url: UrlData) => {
			if (url.editingName != url.shortenedURL.name && url.editingName != '') {
				const newData = {
					name: url.editingName,
				};

				const token = cookie.get('token');

				const data = await put('short-urls', url.shortenedURL.id, newData, token);

				checkTokenExists(data.statusCode, route);

				const newToken = checkNewToken(data);
				if (newToken) {
					await updateShortUrl(url);

					return;
				}

				url.shortenedURL.name = url.editingName;
			}

			cancelEditingItem(url);
		};

		const toggleDeletingItem = (url: UrlData) => {
			url.deleting = !url.deleting;
		};

		const deleteShortUrl = async (urlIndex: number) => {
			const url = state.urls[urlIndex];

			const token = cookie.get('token');

			const data = await deleteById('short-urls', url.shortenedURL.id, token);

			checkTokenExists(data.statusCode, route);

			const newToken = checkNewToken(data);
			if (newToken) {
				await deleteShortUrl(urlIndex);

				return;
			}

			state.urls.splice(urlIndex, 1);
		};

		const editItem = (url: UrlData) => {
			url.editingName = url.shortenedURL.name;
		};

		const cancelEditingItem = (url: UrlData) => {
			url.editingName = '';
		};

		const toggleChart = (url: UrlData) => {
			if (url.analyticsButtonText == 'Show chart') {
				url.analyticsButtonText = 'Hide chart';
			} else {
				url.analyticsButtonText = 'Show chart';
			}
		};

		if (state.inputData.userID) {
			getData();
		} else {
			cookie.delete('token');

			route.push('/home');
			window.location.reload();
		}

		return {
			formatDate,

			state,

			submitLongUrl,
			updateShortUrl,
			cancelEditingItem,
			editItem,
			toggleDeletingItem,
			deleteShortUrl,
			toggleChart,
		};
	},
});
</script>

<style lang="scss" scoped>
.customUrlItem {
	border: 1px solid rgb(238, 238, 238);
	background-color: rgb(253, 253, 253);
}

.customIcon {
	&--green {
		&:hover {
			stroke: #07c700;
		}
	}

	&--red {
		&:hover {
			stroke: #c70000;
		}
	}
}
</style>
