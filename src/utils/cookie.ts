export default {
	get: (name: string): any => {
		const cookieName = name + '=';
		const decodedCookie = decodeURIComponent(document.cookie);
		const ca = decodedCookie.split(';');

		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1);
			if (c.indexOf(cookieName) == 0) return c.substring(cookieName.length, c.length);
		}

		return '';
	},

	save: (name: string, value: string, expires?: string | Date): any => {
		let expiresString = '';

		if (expires) {
			if (typeof expires == 'string') {
				expires = new Date(expires);
			}

			expires = expires.toString();

			expiresString = `; expires=${expires}`;
		}

		document.cookie = `${name}=${value}${expiresString}`;
	},
};
