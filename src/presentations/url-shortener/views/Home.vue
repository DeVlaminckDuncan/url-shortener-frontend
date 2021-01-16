<template>
	<HeaderLinks />

	<main class="mt-6">
		<div v-if="loggedIn">
			Welcome back!
			<p>Check your links on the <router-link to="/dashboard" class="text-blue-main">dashboard</router-link></p>
		</div>

		<div v-else>
			<p class="mb-2 text-lg">Welcome to URL Shortener!</p>
			<p class="text-lg">Get started by <router-link to="/signup" class="text-blue-main">creating an account.</router-link></p>
		</div>
	</main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import cookie from '@/utils/cookie';
import HeaderLinks from '../components/HeaderLinks.vue';

export default defineComponent({
	components: {
		HeaderLinks,
	},

	setup() {
		const loggedIn = ref(cookie.get('token') ? true : false);

		return {
			loggedIn,
		};
	},
});
</script>
