import { createStore } from 'vuex';

export enum MutationTypes {
	SET_USERID = 'setUserId',
}

const state = {
	userId: localStorage.userId ? JSON.parse(localStorage.userId) : '',
};

export default createStore({
	state: state,

	getters: {
		getUserId: (state) => () => {
			return state.userId ? state.userId : null;
		},
	},

	mutations: {
		[MutationTypes.SET_USERID](state, userId) {
			const data = userId;
			localStorage.setItem('userId', JSON.stringify(data));
		},
	},
});
