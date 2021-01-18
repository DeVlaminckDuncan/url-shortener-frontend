<template>
	<div id="nav">
		<router-link to="/">Home</router-link>
		<span v-if="loggedIn">
			|
			<router-link to="/dashboard">Dashboard</router-link>
			|
			<router-link to="/settings">Settings</router-link>
		</span>
		<span v-if="!loggedIn">
			|
			<router-link to="/login">Login</router-link>
			|
			<router-link to="/signup">Sign up</router-link>
		</span>
		<span v-else>
			|
			<button @click="logOut()" class="font-semibold">Log out</button>
		</span>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import route from '@/router';

import cookie from '@/utils/cookie';

export default defineComponent({
	setup() {
		const loggedIn = ref(cookie.get('token') ? true : false);

		const logOut = () => {
			cookie.delete('token');

			loggedIn.value = false;

			route.push('/home');
			window.location.reload();
		};

		return {
			loggedIn,
			logOut,
		};
	},
});
</script>
