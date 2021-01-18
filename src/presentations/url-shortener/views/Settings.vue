<template>
	<HeaderLinks />

	<h1>Settings</h1>

	<main class="mt-8">
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
		});

		const getData = async () => {
			const token = cookie.get('token');

			if (token) {
				const userId = store.getters.getUserId();
				const data = await get(`user/${userId}`, token);

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
