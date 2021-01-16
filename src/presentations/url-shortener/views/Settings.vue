<template>
	<HeaderLinks />

	<h1>Settings</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import HeaderLinks from '../components/HeaderLinks.vue';

export default defineComponent({
	components: {
		HeaderLinks,
	},

	setup() {
		return {};
	},
});
</script>
