<template>
	<HeaderLinks />

	<h1>Login</h1>

	<main class="mt-8">
		<form>
			<div class="flex flex-col items-center mb-2">
				<p v-if="state.error" class="text-red mb-8">
					{{ state.error }}
				</p>

				<InputField v-model="state.inputData.login" :value="state.inputData.login" label="Username or email" name="login" id="login" :marginBottom="state.loginError == ''" />
				<p v-if="state.loginError" class="text-red text-sm mt-2 mb-4">
					{{ state.loginError }}
				</p>

				<InputField v-model="state.inputData.password" :value="state.inputData.password" label="Password" name="password" id="password" type="password" :marginBottom="state.passwordError == ''" />
				<p v-if="state.passwordError" class="text-red text-sm mt-2 mb-4">
					{{ state.passwordError }}
				</p>
			</div>

			<div v-if="state.loading" class="flex justify-center mb-8">
				<svg width="48px" height="48px" viewBox="0 0 128 128">
					<g>
						<path d="M64 0a7 7 0 1 1-7 7 7 7 0 0 1 7-7zm29.86 12.2a2.8 2.8 0 1 1-3.83 1.02 2.8 2.8 0 0 1 3.83-1.02zm22.16 21.68a3.15 3.15 0 1 1-4.3-1.15 3.15 3.15 0 0 1 4.3 1.15zm.87 60.53a4.2 4.2 0 1 1-1.57-5.7 4.2 4.2 0 0 1 1.54 5.73zm7.8-30.5a3.85 3.85 0 1 1-3.85-3.85 3.85 3.85 0 0 1 3.85 3.84zm-30 53.2a4.55 4.55 0 1 1 1.66-6.23 4.55 4.55 0 0 1-1.67 6.22zM64 125.9a4.9 4.9 0 1 1 4.9-4.9 4.9 4.9 0 0 1-4.9 4.9zm-31.06-8.22a5.25 5.25 0 1 1 7.17-1.93 5.25 5.25 0 0 1-7.14 1.93zM9.9 95.1a5.6 5.6 0 1 1 7.65 2.06A5.6 5.6 0 0 1 9.9 95.1zM1.18 63.9a5.95 5.95 0 1 1 5.95 5.94 5.95 5.95 0 0 1-5.96-5.94zm8.1-31.6a6.3 6.3 0 1 1 2.32 8.6 6.3 6.3 0 0 1-2.3-8.6zM32.25 8.87a6.65 6.65 0 1 1-2.44 9.1 6.65 6.65 0 0 1 2.46-9.1z" fill="#000000" fill-opacity="1" />
						<animateTransform attributeName="transform" type="rotate" values="0 64 64;30 64 64;60 64 64;90 64 64;120 64 64;150 64 64;180 64 64;210 64 64;240 64 64;270 64 64;300 64 64;330 64 64" calcMode="discrete" dur="1080ms" repeatCount="indefinite"></animateTransform>
					</g>
				</svg>
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
			error: '',

			inputData: {
				login: '',
				password: '',
			},

			loading: false,
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
				state.error = '';

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

				const timeout = setTimeout(() => {
					state.loading = true;
				}, 1000);
				const data = await post('login', loginData);
				clearTimeout(timeout);
				state.loading = false;

				if (data.statusCode != 'OK') {
					if (data.statusCode == 'NON_EXISTING_USER') {
						state.loginError = 'This username or email does not exist.';
					} else if (data.statusCode == 'WRONG_PASSWORD') {
						state.passwordError = 'Wrong password.';
					}
				}

				if (data.error) {
					state.error = data.message;
					return;
				}

				const decodedToken = decodeToken(data.token);
				cookie.save('token', data.token, decodedToken.expirationDate);

				store.commit(MutationTypes.SET_USERID, data.userID);

				route.push('/home');
			} else {
				state.error = 'Fill in all the fields!';
			}
		};

		return {
			state,

			submit,
		};
	},
});
</script>
