<template>
	<HeaderLinks />

	<h1>Sign up</h1>

	<main class="mt-8">
		<form>
			<div class="flex flex-col items-center">
				<p v-if="error" class="text-red mb-8">
					{{ error }}
				</p>

				<InputField v-model="inputData.firstName" label="First name" name="firstName" id="firstName" />
				<InputField v-model="inputData.lastName" label="Last name" name="lastName" id="lastName" />
				<InputField v-model="inputData.username" label="Username" name="username" id="username" />
				<InputField v-model="inputData.email" label="Email" name="email" id="email" type="email" />
				<InputField v-model="inputData.password" label="Password" name="password" id="password" type="password" />
			</div>

			<div class="flex justify-center items-center">
				<Button @click="submit" text="Sign up" color="blue-main" :classes="['px-6', 'py-2', 'rounded-lg', 'transition', 'duration-75', 'mr-4']" />
				<router-link to="/login" class="text-blue-main">Log in</router-link>
			</div>
		</form>
	</main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import route from '@/router';
import store, { MutationTypes } from '@/store';

import { decodeToken } from '@/utils/token';
import { post } from '@/utils/api';
import cookie from '@/utils/cookie';
import Button from '../components/Button.vue';
import InputField from '../components/InputField.vue';
import HeaderLinks from '../components/HeaderLinks.vue';

export default defineComponent({
	components: {
		Button,
		InputField,
		HeaderLinks,
	},

	setup() {
		const inputData = {
			firstName: '',
			lastName: '',
			username: '',
			email: '',
			password: '',
		};

		const error = ref('');

		const submit = async (event: Event) => {
			event.preventDefault();

			if (inputData.firstName != '' && inputData.lastName != '' && inputData.username != '' && inputData.email != '' && inputData.password != '') {
				error.value = '';

				const data = await post('signup', inputData);

				const decodedToken = decodeToken(data.token);
				cookie.save('token', data.token, decodedToken.expirationDate);

				store.commit(MutationTypes.SET_USERID, data.userID);

				route.push('/home');
				window.location.reload();
			} else {
				error.value = 'Fill in all the fields!';
			}
		};

		return {
			inputData,
			error,

			submit,
		};
	},
});
</script>
