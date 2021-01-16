<template>
	<router-view></router-view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import route from '@/router';

import cookie from '@/utils/cookie';

export default defineComponent({
	setup() {
		const checkTokenCookie = () => {
			if (cookie.get('token') == '') {
				route.replace('/home');
			}
		};

		checkTokenCookie();
	},
});
</script>
