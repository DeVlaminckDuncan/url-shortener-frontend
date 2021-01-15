<template>
	<div id="nav">
		<router-link to="/">Home</router-link>
		<span v-if="loggedIn">
			|
			<router-link to="/dashboard">Dashboard</router-link>
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
	<router-view />
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

			route.push('/');

			loggedIn.value = false;
		};

		return {
			loggedIn,
			logOut,
		};
	},
});
</script>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

#nav {
	padding: 30px;

	a {
		font-weight: bold;
		color: #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}

.label {
	left: 4px;
	top: 6px;
	transition: 0.2s ease all;
	-moz-transition: 0.2s ease all;
	-webkit-transition: 0.2s ease all;

	.input:focus ~ &,
	.input:valid ~ & {
		padding: 2px 12px;
		top: -16px;
		font-size: 14px;
	}
}

.input {
	&:-webkit-autofill,
	&:-webkit-autofill:hover,
	&:-webkit-autofill:focus,
	&:-webkit-autofill:active {
		box-shadow: 0 0 0 30px white inset;
	}
}
</style>
