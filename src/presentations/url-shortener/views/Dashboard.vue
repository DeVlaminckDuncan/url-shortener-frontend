<template>
	<main>
		<div class="flex justify-center mb-12">
			<form>
				<InputField v-model="inputData.url" label="Long URL" name="longUrl" id="longUrl" />

				<button @click="submitLongUrl" class="customButton customButton--blue">Create</button>
			</form>
		</div>

		<hr class="mb-12 opacity-10" />

		<div v-if="state.urls.length">
			<div v-for="url of state.urls" :key="url.id" class="customUrlItem flex justify-between items-center mb-6 mx-6 p-6 shadow-sm">
				<div class="text-left">
					<!-- TODO: Add all the properties and display them nicely -->
					<div>
						<!-- change to input if editing -->
						<span v-if="editingItem">{{ url.shortenedURL.name }}</span>
						<input v-else type="url" :value="url.shortenedURL.name" class="w-full" />
					</div>
					<div>
						<a :href="'http://localhost:9001/' + url.shortenedURL.shortURL" target="_blank">{{ 'go-url-shortener.netlify.app/' + url.shortenedURL.shortURL }}</a>
					</div>
					<div>
						<a :href="url.shortenedURL.longURL" target="_blank">{{ url.shortenedURL.longURL }}</a>
					</div>

					<!-- TODO: Graph of url.visits -->
					<!-- <VueApexCharts width="500" type="bar" :options="chartOptions" :series="series" /> -->

					<!-- TODO: Edit & delete -->
				</div>

				<div class="flex">
					<!-- hide this one by default, show if editing -->
					<div v-if="!editingItem">
						<button @click="saveItem" class="customButton customButton--green">Save</button>
						<button @click="cancelEditingItem" class="customButton customButton--red ml-4">Cancel</button>
					</div>

					<!-- show this one by default, hide if editing -->
					<div v-if="editingItem" class="ml-4">
						<button @click="editItem" class="customButton customButton--green">Edit</button>
						<button @click="deleteItem" class="customButton customButton--red ml-4">Delete</button>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import route from '@/router';
import store, { MutationTypes } from '@/store';

import VueApexCharts from 'vue-apexcharts';

import { decodeToken, checkNewToken } from '@/utils/token';
import { get, post } from '@/utils/api';
import cookie from '@/utils/cookie';
import InputField from '../components/InputField.vue';
import ShortenedUrl from '@/models/ShortenedUrl';

type UrlData = {
	shortenedURL: ShortenedUrl;
	analytics?: Array<string>;
};

type State = {
	urls: Array<UrlData>;
};

export default defineComponent({
	components: {
		InputField,
		VueApexCharts,
	},

	setup() {
		const state = reactive({
			urls: [],
		});

		const inputData = {
			url: '',
		};

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

		const editingItem = ref(false);

		const getData = async () => {
			const token = cookie.get('token');

			if (token) {
				const userId = store.getters.getUserId();
				const data = await get(`short-urls/${userId}`, token);

				if (data.statusCode != 'OK') {
					if (data.statusCode == 'NON_EXISTING_USERTOKEN') {
						cookie.delete('token');

						route.replace('/login');
					}
				}

				const newToken = checkNewToken(data);
				if (newToken) {
					await getData();

					return;
				}

				state.urls = data.urls;
			} else {
				route.replace('/login');
			}
		};

		const submitLongUrl = async (event: Event) => {
			event.preventDefault();

			if (inputData.url != '') {
				const data = await post('create-short-url', inputData);

				if (data.statusCode == 'OK') {
					inputData.url = data.shortURL;
				}
			}
		};

		const saveItem = () => {};

		const cancelEditingItem = () => {
			editingItem.value = false;
		};

		const editItem = () => {
			editingItem.value = true;
		};

		const deleteItem = () => {};

		getData();

		return {
			state,
			inputData,
			submitLongUrl,
			chartOptions,
			series,
			saveItem,
			cancelEditingItem,
			editItem,
			deleteItem,
			editingItem,
		};
	},
});
</script>

<style lang="scss" scoped>
.customButton {
	@apply px-4;
	@apply py-2;
	@apply rounded-md;
	@apply text-white;
	@apply shadow-md;

	&:hover {
		opacity: 0.8;
	}

	&--blue {
		background-color: #0056c7;
	}

	&--green {
		background-color: #07c700;
	}

	&--red {
		background-color: #c70000;
	}
}

.customUrlItem {
	border: 1px solid rgb(238, 238, 238);
	background-color: rgb(253, 253, 253);
}
</style>
