const BACKEND_URL_LOCAL: string = process.env.VUE_APP_BACKEND_URL_LOCAL;

export const get = (endpoint: string, token?: string): any => {
	try {
		return fetch(`${BACKEND_URL_LOCAL}${endpoint}`, {
			headers: {
				Authorization: token ? `Bearer ${token}` : '',
			},
		})
			.then((r) => r.json())
			.catch((error: any) => {
				console.error(error);
				return null;
			});
	} catch (error) {
		return new Error(error);
	}
};

export const post = (endpoint: string, payload: object, token?: string): any => {
	try {
		return fetch(`${BACKEND_URL_LOCAL}${endpoint}`, {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'content-type': 'application/json',
				Authorization: token ? `Bearer ${token}` : '',
			},
		}).then((r) => r.json());
	} catch (error) {
		return new Error(error);
	}
};

export const put = (endpoint: string, id: string, payload: object, token?: string): any => {
	try {
		return fetch(`${BACKEND_URL_LOCAL}${endpoint}/${id}`, {
			method: 'PUT',
			body: JSON.stringify(payload),
			headers: {
				'content-type': 'application/json',
				Authorization: token ? `Bearer ${token}` : '',
			},
		});
	} catch (error) {
		return new Error(error);
	}
};

export const deleteById = (endpoint: string, id: string, token?: string): any => {
	try {
		return fetch(`${BACKEND_URL_LOCAL}${endpoint}/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: token ? `Bearer ${token}` : '',
			},
		});
	} catch (error) {
		return new Error(error);
	}
};
