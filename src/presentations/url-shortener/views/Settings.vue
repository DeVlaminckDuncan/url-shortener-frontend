<template>
	<HeaderLinks />

	<h1>Settings</h1>

	<main class="mt-8">
		<div v-if="state.loading" class="flex justify-center mb-8">
			<svg width="48px" height="48px" viewBox="0 0 128 128">
				<g>
					<path d="M64 0a7 7 0 1 1-7 7 7 7 0 0 1 7-7zm29.86 12.2a2.8 2.8 0 1 1-3.83 1.02 2.8 2.8 0 0 1 3.83-1.02zm22.16 21.68a3.15 3.15 0 1 1-4.3-1.15 3.15 3.15 0 0 1 4.3 1.15zm.87 60.53a4.2 4.2 0 1 1-1.57-5.7 4.2 4.2 0 0 1 1.54 5.73zm7.8-30.5a3.85 3.85 0 1 1-3.85-3.85 3.85 3.85 0 0 1 3.85 3.84zm-30 53.2a4.55 4.55 0 1 1 1.66-6.23 4.55 4.55 0 0 1-1.67 6.22zM64 125.9a4.9 4.9 0 1 1 4.9-4.9 4.9 4.9 0 0 1-4.9 4.9zm-31.06-8.22a5.25 5.25 0 1 1 7.17-1.93 5.25 5.25 0 0 1-7.14 1.93zM9.9 95.1a5.6 5.6 0 1 1 7.65 2.06A5.6 5.6 0 0 1 9.9 95.1zM1.18 63.9a5.95 5.95 0 1 1 5.95 5.94 5.95 5.95 0 0 1-5.96-5.94zm8.1-31.6a6.3 6.3 0 1 1 2.32 8.6 6.3 6.3 0 0 1-2.3-8.6zM32.25 8.87a6.65 6.65 0 1 1-2.44 9.1 6.65 6.65 0 0 1 2.46-9.1z" fill="#000000" fill-opacity="1" />
					<animateTransform attributeName="transform" type="rotate" values="0 64 64;30 64 64;60 64 64;90 64 64;120 64 64;150 64 64;180 64 64;210 64 64;240 64 64;270 64 64;300 64 64;330 64 64" calcMode="discrete" dur="1080ms" repeatCount="indefinite"></animateTransform>
				</g>
			</svg>
		</div>

		<div class="flex justify-center mb-12">
			<form class="flex flex-col items-center">
				<p v-if="state.error" class="text-red mb-8">
					{{ state.error }}
				</p>

				<InputField v-model="state.user.firstName" :value="state.user.firstName" label="First name" name="firstName" id="firstName" />
				<InputField v-model="state.user.lastName" :value="state.user.lastName" label="Last name" name="lastName" id="lastName" />
				<InputField v-model="state.user.username" :value="state.user.username" label="Username" name="username" id="username" />
				<InputField v-model="state.user.email" :value="state.user.email" label="Email" name="email" id="email" />
				<InputField v-model="state.user.password" :value="state.user.password" label="New password" name="password" id="password" type="password" />

				<Button @click="updateUser" :text="state.saveButtonText" color="blue-main" :classes="['px-6', 'py-2', 'rounded-lg', 'transition', 'duration-75']" class="mt-2" />
			</form>
		</div>

		<div v-if="state.deletingUser">
			<p class="mb-2">Are you sure you want to delete your account?</p>

			<div class="flex justify-center">
				<svg @click="deleteUser" class="cursor-pointer customIcon--green" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6e6e6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>

				<svg @click="toggleDeleting" class="cursor-pointer ml-2 customIcon--red" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6e6e6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</div>
		</div>
		<Button v-else @click="toggleDeleting" text="Delete account" color="red" :classes="['px-6', 'py-2', 'rounded-lg', 'transition', 'duration-75']" />
	</main>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import route from '@/router';
import store from '@/store';

import { deleteById, get, put } from '@/utils/api';
import cookie from '@/utils/cookie';
import { checkNewToken, checkTokenExists } from '@/utils/token';
import User from '@/models/User';
import HeaderLinks from '../components/HeaderLinks.vue';
import InputField from '../components/InputField.vue';
import Button from '../components/Button.vue';

type State = {
	user: User;
	username: string;
	saveButtonText: string;
	deletingUser: Boolean;

	error: string;
	loading: Boolean;
};

export default defineComponent({
	components: {
		HeaderLinks,
		InputField,
		Button,
	},

	setup() {
		const state: State = reactive({
			user: {
				id: '',
				firstName: '',
				lastName: '',
				username: '',
				email: '',
				password: '',
			},
			username: '',
			saveButtonText: 'Save',
			deletingUser: false,

			error: '',
			loading: false,
		});

		const getData = async () => {
			const token = cookie.get('token');

			if (token) {
				const userId = store.getters.getUserId();

				const timeout = setTimeout(() => {
					state.loading = true;
				}, 1000);
				const data = await get(`user/${userId}`, token);
				clearTimeout(timeout);
				state.loading = false;

				if (data.error) {
					state.error = data.message;
					return;
				}

				checkTokenExists(data.statusCode, route);

				const newToken = checkNewToken(data);
				if (newToken) {
					await getData();

					return;
				}

				if (data.user) {
					state.user = data.user;
					state.username = data.user.username;
				}
			} else {
				route.replace('/login');
			}
		};

		const updateUser = async (event: Event) => {
			event.preventDefault();

			const token = cookie.get('token');

			if (token) {
				const data = await put('user', state.user.id, state.user, token);

				checkTokenExists(data.statusCode, route);

				const newToken = checkNewToken(data);
				if (newToken && state.user.username == state.username) {
					await updateUser(event);

					return;
				}

				if (data.statusCode == 'OK') {
					state.saveButtonText = 'Data saved!';
				} else if (data.statusCode == 'DUPLICATE_USER') {
					state.error = 'That username or email is already in use.';
				}
			} else {
				route.replace('/login');
			}
		};

		const toggleDeleting = () => {
			state.deletingUser = !state.deletingUser;
		};

		const deleteUser = async () => {
			if (state.deletingUser) {
				const token = cookie.get('token');

				if (token) {
					const data = await deleteById('user', state.user.id, token);

					checkTokenExists(data.statusCode, route);

					const newToken = checkNewToken(data);
					if (newToken) {
						await deleteUser();

						return;
					}

					cookie.delete('token');

					route.replace('/');
				} else {
					route.replace('/login');
				}
			}
		};

		getData();

		return {
			state,

			updateUser,
			toggleDeleting,
			deleteUser,
		};
	},
});
</script>

<style lang="scss" scoped>
.customIcon {
	&--green {
		&:hover {
			stroke: #07c700;
		}
	}

	&--red {
		&:hover {
			stroke: #c70000;
		}
	}
}
</style>
