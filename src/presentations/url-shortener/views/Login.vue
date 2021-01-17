<template>
	<HeaderLinks />

	<h1>Login</h1>

	<main class="mt-8">
		<form>
			<div class="flex flex-col items-center mb-2">
				<InputField v-model="state.inputData.login" label="Username or email" name="login" id="login" :marginBottom="state.loginError == ''" />
				<p v-if="state.loginError" class="text-red text-sm mt-2 mb-4">
					{{ state.loginError }}
				</p>

				<InputField v-model="state.inputData.password" label="Password" name="password" id="password" type="password" :marginBottom="state.passwordError == ''" />
				<p v-if="state.passwordError" class="text-red text-sm mt-2 mb-4">
					{{ state.passwordError }}
				</p>
			</div>

			<div class="flex justify-center items-center">
				<Button @click="submit" text="Log in" color="blue-main" :classes="['px-6', 'py-2', 'rounded-lg', 'transition', 'duration-75', 'mr-4']" />
				<router-link to="/signup" class="text-blue-main">Sign up</router-link>
			</div>
		</form>
	</main>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import route from '@/router';
import store, { MutationTypes } from '@/store';

import { decodeToken } from '@/utils/token';
import { post } from '@/utils/api';
import cookie from '@/utils/cookie';
import Button from '../components/Button.vue';
import InputField from '../components/InputField.vue';
import HeaderLinks from '../components/HeaderLinks.vue';

type LoginData = {
	email?: string;
	username?: string;
	password: string;
};

export default defineComponent({
	components: {
		Button,
		InputField,
		HeaderLinks,
	},

	setup() {
		const state = reactive({
			loginError: '',
			passwordError: '',

			inputData: {
				login: '',
				password: '',
			},
		});

		const submit = async (event: Event) => {
			event.preventDefault();

			if (state.inputData.login == '') {
				state.loginError = 'Enter your username or email.';
			} else {
				state.loginError = '';
			}

			if (state.inputData.password == '') {
				state.passwordError = 'Enter your password.';
			} else {
				state.passwordError = '';
			}

			if (state.inputData.login != '' && state.inputData.password != '') {
				const loginData: LoginData = {
					username: state.inputData.login,
					email: state.inputData.login,
					password: state.inputData.password,
				};

				const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				const isEmailAddress = emailRegex.test(String(state.inputData.login).toLowerCase());
				if (isEmailAddress) {
					delete loginData.username;
				} else {
					delete loginData.email;
				}

				const data = await post('login', loginData);

				if (data.statusCode == 'NON_EXISTING_USER') {
					state.loginError = 'This username or email does not exist.';
				} else if (data.statusCode == 'WRONG_PASSWORD') {
					state.passwordError = 'Wrong password.';
				}

				const decodedToken = decodeToken(data.token);
				cookie.save('token', data.token, decodedToken.expirationDate);

				store.commit(MutationTypes.SET_USERID, data.userID);

				route.push('/dashboard');
			}
		};

		return {
			state,

			submit,
		};
	},
});
</script>
