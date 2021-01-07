<template>
	<div id="nav">
		<router-link to="/">Home</router-link>
		|
		<span v-if="token">
			<router-link to="/dashboard">Dashboard</router-link>
			|
		</span>
		<router-link to="/login">Login</router-link>
		|
		<router-link to="/signup">Sign up</router-link>
	</div>
	<router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import cookie from '@/utils/cookie';

export default defineComponent({
	setup() {
		const token = cookie.get('token');

		return {
			token,
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
