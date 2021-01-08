<template>
	<h1>Login</h1>

	<main class="mt-8">
		<form>
			<div class="flex flex-col items-center">
				<InputField v-model="inputData.login" label="Username or email" name="login" id="login" />
				<InputField v-model="inputData.password" label="Password" name="password" id="password" type="password" />
			</div>

			<div class="flex justify-center items-center">
				<Button @click="submit" text="Log in" color="blue-main" :classes="['px-12', 'py-2', 'rounded-lg', 'transition', 'duration-75', 'mr-4']" />
				<router-link to="/signup" class="text-blue-main">Sign up</router-link>
			</div>
		</form>
	</main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import route from '@/router';

import { post } from '@/utils/api';
import cookie from '@/utils/cookie';
import Button from '../components/Button.vue';
import InputField from '../components/InputField.vue';

export default defineComponent({
	components: {
		Button,
		InputField,
	},

	setup() {
		const inputData = {
			login: '',
			password: '',
		};

		const submit = async (event: Event) => {
			event.preventDefault();

			if (inputData.login != '' && inputData.password != '') {
				const tokenData = await post('login', inputData);

				cookie.save('token', tokenData.token, tokenData.expiration);

				route.push('/dashboard');
			}
		};

		return {
			inputData,
			submit,
		};
	},
});
</script>
