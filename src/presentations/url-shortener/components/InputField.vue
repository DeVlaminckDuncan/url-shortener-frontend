<template>
	<div :class="marginBottom ? 'mb-6' : ''" class="relative">
		<input @change="changeInputValue" class="w-64 input block border border-black border-opacity-25 rounded shadow-md px-3 py-2 focus:outline-none" :id="id" :type="type" :name="name ? name : ''" :placeholder="placeholder" :value="value" :step="step" :autocomplete="autocomplete ? 'on' : 'off'" required />
		<label v-if="label" class="label absolute text-opacity-75 bg-white px-3 py-1 pointer-events-none" :for="id">{{ label }}</label>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		id: {
			type: String,
			default: Math.random()
				.toString(36)
				.substring(7),
		},
		label: String,
		type: {
			type: String,
			default: 'text',
		},
		name: String,
		placeholder: String,
		value: String,
		modelValue: String,
		step: {
			type: Number,
			default: 1,
		},
		marginBottom: {
			type: Boolean,
			default: true,
		},
		autocomplete: {
			type: Boolean,
			default: true,
		},
	},

	setup(props, { emit }) {
		const changeInputValue = (event: any) => {
			emit('update:modelValue', event.target.value);
		};

		return {
			changeInputValue,
		};
	},
});
</script>
