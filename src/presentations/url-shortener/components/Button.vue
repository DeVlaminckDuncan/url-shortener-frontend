<template>
	<button :style="`${width ? `width:${width}` : ''};${height ? `height:${height}` : ''}`" :class="[bgClassName, classes]" class="text-white font-semibold shadow-md focus:outline-none">{{ text }}</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		text: String,
		color: String,
		width: String,
		height: String,
		classes: Array,
	},

	setup(props) {
		const bgClassName = `bg-${props.color}`;

		return {
			bgClassName: bgClassName,
		};
	},
});
</script>

<style lang="scss" scoped>
button {
	&:hover,
	&:active {
		--tw-bg-opacity: 0.9;
	}
}
</style>
