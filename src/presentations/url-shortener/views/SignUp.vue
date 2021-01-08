<template>
	<h1>Sign up</h1>

	<main class="mt-8">
		<form>
			<div class="flex flex-col items-center">
				<InputField v-model="inputData.firstName" label="First name" name="firstName" id="firstName" />
				<InputField v-model="inputData.lastName" label="Last name" name="lastName" id="lastName" />
				<InputField v-model="inputData.username" label="Username" name="username" id="username" />
				<InputField v-model="inputData.email" label="Email" name="email" id="email" type="email" />
				<InputField v-model="inputData.password" label="Password" name="password" id="password" type="password" />
			</div>

			<div class="flex justify-center items-center">
				<Button @click="submit" text="Sign up" color="blue-main" :classes="['px-12', 'py-2', 'rounded-lg', 'transition', 'duration-75', 'mr-4']" />
				<router-link to="/login" class="text-blue-main">Log in</router-link>
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
			firstName: '',
			lastName: '',
			username: '',
			email: '',
			password: '',
		};

		const submit = async (event: Event) => {
			event.preventDefault();

			if (inputData.username != '' && inputData.password != '') {
				const tokenData = await post('signup', inputData);

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
