<template>
	<HeaderLinks />

	<main>
		<div class="flex justify-center mb-12">
			<form>
				<InputField v-model="state.inputData.name" :value="state.inputData.name" label="Name" name="urlName" id="urlName" />
				<InputField v-model="state.inputData.url" :value="state.inputData.url" label="URL" name="url" id="url" type="url" />

				<Button @click="submitLongUrl" text="Create" color="blue-main" :classes="['px-4', 'py-2', 'rounded-lg', 'transition', 'duration-75', 'mr-4']" />
			</form>
		</div>

		<hr class="mb-12 opacity-10" />

		<div v-if="state.urls.length">
			<div v-for="(url, index) of state.urls" :key="url.shortenedURL.id" class="customUrlItem flex justify-between items-center mb-6 mx-6 p-6 shadow-sm">
				<div class="text-left">
					<div>
						<div v-if="url.editing" class="relative mb-3">
							<input v-model="url.editingName" class="w-max block border border-black border-opacity-25 rounded px-2 py-1 focus:outline-none" id="urlName" name="urlName" type="text" placeholder="Name" required />
						</div>
						<span v-else>{{ url.shortenedURL.name }}</span>
					</div>

					<div>
						<a :href="'http://localhost:9001/' + url.shortenedURL.shortURL" target="_blank">{{ 'http://localhost:9001/' + url.shortenedURL.shortURL }}</a>
					</div>

					<div>
						<a :href="url.shortenedURL.longURL" target="_blank">{{ url.shortenedURL.longURL }}</a>
					</div>

					<p class="mt-4">{{ `${url.visits} visit${url.visits == 0 || url.visits > 1 ? 's' : ''}` }}</p>
					<Button v-if="url.visits > 0" @click="showChart(index)" text="View analytics" color="blue-main" :classes="['px-4', 'py-2', 'rounded-lg', 'transition', 'duration-75', 'mr-4']" />

					<p class="mt-2">Created on {{ formatDate(url.shortenedURL.createdAt) }}</p>

					<!-- TODO: Graph of url.visits -->
					<!-- <VueApexCharts width="500" type="bar" :options="chartOptions" :series="series" /> -->
				</div>

				<div class="flex">
					<div v-if="url.editing" class="flex">
						<svg @click="updateShortUrl(index)" class="cursor-pointer customIcon--green" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6e6e6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>

						<svg @click="cancelEditingItem(index)" class="cursor-pointer ml-2 customIcon--red" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6e6e6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</div>

					<div v-else class="ml-4 flex">
						<svg @click="editItem(index)" class="cursor-pointer customIcon--green" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6e6e6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
							<polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
						</svg>

						<svg @click="deleteShortUrl(index)" class="cursor-pointer ml-2 customIcon--red" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6e6e6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<polyline points="3 6 5 6 21 6"></polyline>
							<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
							<line x1="10" y1="11" x2="10" y2="17"></line>
							<line x1="14" y1="11" x2="14" y2="17"></line>
						</svg>
					</div>
				</div>
			</div>
		</div>
		<div v-else>
			You haven't created any short URLs yet!
		</div>
	</main>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import route from '@/router';
import store from '@/store';

import VueApexCharts from 'vue-apexcharts';

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
	visits: Number;
	editing: Boolean;
	editingName: string;
};

type NewUrlData = {
	name: string;
	url: string;
	userID: string;
};

type State = {
	urls: Array<UrlData>;
	inputData: NewUrlData;
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
			inputData: {
				name: '',
				url: '',
				userID: store.getters.getUserId(),
			},
		});

		const chartOptions = {
			chart: {
				id: 'vuechart-example',
			},
			xaxis: {
				categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
			},
		};
		const series = [
			{
				name: 'series-1',
				data: [30, 40, 45, 50, 49, 60, 70, 91],
			},
		];

		const getData = async () => {
			const token = cookie.get('token');

			if (token) {
				const userId = store.getters.getUserId();
				const data = await get(`short-urls/${userId}`, token);

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
						url.shortenedURL.createdAt = new Date(url.shortenedURL.createdAt);
					});
				}
			} else {
				route.replace('/login');
			}
		};

		const submitLongUrl = async (event: Event) => {
			event.preventDefault();

			if (state.inputData.name != '' && state.inputData.url != '' && state.inputData.userID != '') {
				const token = cookie.get('token');
				const data = await post('short-urls', state.inputData, token);

				checkTokenExists(data.statusCode, route);

				const newToken = checkNewToken(data);
				if (newToken) {
					await submitLongUrl(event);

					return;
				}

				state.inputData.url = 'http://localhost:9001/' + data.shortenedURL.shortURL;

				const shortenedUrl: ShortenedUrl = data.shortenedURL;

				shortenedUrl.createdAt = new Date(shortenedUrl.createdAt);

				const urlData: UrlData = {
					shortenedURL: shortenedUrl,
					visits: 0,
					editing: false,
					editingName: '',
				};
				state.urls.push(urlData);

				// Not the best way to do this but atleast it works...
				setTimeout(() => {
					// @ts-ignore
					document.querySelector('#longUrl').select();
					document.execCommand('copy');
				}, 10);
			}
		};

		const updateShortUrl = async (urlIndex: number) => {
			const url = state.urls[urlIndex];

			if (url.editingName != url.shortenedURL.name && url.editingName != '') {
				const newData = {
					name: url.editingName,
				};

				const token = cookie.get('token');

				const data = await put('short-urls', url.shortenedURL.id, newData, token);

				checkTokenExists(data.statusCode, route);

				const newToken = checkNewToken(data);
				if (newToken) {
					await updateShortUrl(urlIndex);

					return;
				}

				url.shortenedURL.name = url.editingName;
			}

			cancelEditingItem(urlIndex);
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

		const editItem = (urlIndex: number) => {
			const url = state.urls[urlIndex];

			url.editing = true;
			url.editingName = url.shortenedURL.name;
		};

		const cancelEditingItem = (urlIndex: number) => {
			const url = state.urls[urlIndex];

			url.editing = false;
			url.editingName = '';
		};

		const showChart = (urlIndex: number) => {};

		getData();

		return {
			formatDate,

			state,

			submitLongUrl,
			updateShortUrl,
			cancelEditingItem,
			editItem,
			deleteShortUrl,
			showChart,

			chartOptions,
			series,
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
