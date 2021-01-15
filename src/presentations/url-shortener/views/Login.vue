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
import store, { MutationTypes } from '@/store';

import { decodeToken } from '@/utils/token';
import { post } from '@/utils/api';
import cookie from '@/utils/cookie';
import Button from '../components/Button.vue';
import InputField from '../components/InputField.vue';

type LoginData = {
	email?: string;
	username?: string;
	password: string;
};

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
				const loginData: LoginData = {
					username: inputData.login,
					email: inputData.login,
					password: inputData.password,
				};

				const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				const isEmailAddress = emailRegex.test(String(inputData.login).toLowerCase());
				if (isEmailAddress) {
					delete loginData.username;
				} else {
					delete loginData.email;
				}

				const data = await post('login', loginData);

				const decodedToken = decodeToken(data.token);
				cookie.save('token', data.token, decodedToken.expirationDate);

				store.commit(MutationTypes.SET_USERID, data.userID);

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
