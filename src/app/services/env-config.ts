const _isDev = window.location.port.indexOf('4200') > -1;
const getHost = () => {
	const protocol = window.location.protocol;
	const host = window.location.host;
	return `${protocol}//${host}`;
};
const apiURI = _isDev ? 'http://localhost:3001/api/' : `/api/`;
const hostURI = _isDev ? 'http://localhost:3001/' : `/`;

export const ENV = {
	BASE_URI: getHost(),
	BASE_API: apiURI,
	HOST_URI: hostURI
};
