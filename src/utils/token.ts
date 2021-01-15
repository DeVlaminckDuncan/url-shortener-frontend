import jwt_decode from 'jwt-decode';
import cookie from './cookie';

export const decodeToken = (token: string) => {
	const decodedToken: any = jwt_decode(token);
	const expiration = new Date(decodedToken.exp * 1000);

	return {
		decodedToken: decodedToken,
		expirationDate: expiration,
	};
};

export const checkNewToken = (data: any): Boolean => {
	if (data.newToken && data.newToken != '') {
		const decodedToken = decodeToken(data.newToken);
		cookie.save('token', data.newToken, decodedToken.expirationDate);

		return true;
	}

	return false;
};
