<template>
	<h1>Dashboard</h1>

	<main>
		<form>
			<InputField v-model="inputData.url" label="Long URL" name="longUrl" id="longUrl" />

			<Button @click="submitLongUrl" text="Sign up" color="blue-main" :classes="['px-12', 'py-2', 'rounded-lg', 'transition', 'duration-75', 'mr-4']" />
		</form>

		<div v-if="state.shortenedUrls.length">
			<div v-for="url of state.shortenedUrls" :key="url.id">
				{{ url.url }}
				{{ url.name }}
				<!-- Graph of url.visits -->

				<!-- edit & delete -->
			</div>
		</div>
	</main>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import route from '@/router';

import { get, post } from '@/utils/api';
import cookie from '@/utils/cookie';
import InputField from '../components/InputField.vue';
import ShortenedUrl from '@/models/ShortenedUrl';

type State = {
	shortenedUrls: Array<ShortenedUrl>;
};

export default defineComponent({
	components: {
		InputField,
	},

	setup() {
		const state: State = reactive({
			shortenedUrls: [],
		});

		const inputData = {
			url: '',
		};

		const getData = async () => {
			const token = cookie.get('token');

			if (token) {
				const data = await get('urls', token);

				state.shortenedUrls = data;
			} else {
				route.replace('/signup');
			}
		};

		const submitLongUrl = async (event: Event) => {
			event.preventDefault();

			if (inputData.url != '') {
				const shortUrlData = await post('shorten', inputData);

				inputData.url = shortUrlData.url;
			}
		};

		getData();

		return {
			state,
			inputData,
			submitLongUrl,
		};
	},
});
</script>
