<template>
	<HeaderLinks />

	<main class="mt-6">
		<p class="mb-2 text-lg">Welcome to URL Shortener!</p>
		<p class="text-lg">Get started by <router-link to="/signup" class="text-blue-main">creating an account.</router-link></p>
	</main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import HeaderLinks from '../components/HeaderLinks.vue';

export default defineComponent({
	components: {
		HeaderLinks,
	},
});
</script>
