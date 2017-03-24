export class Log {

	public static log(msg: string, ...params) {
		console.log(msg, ...params);
	}

	public static info(msg: string, ...params) {
		console.info(msg, ...params);
	}

	public static debug(msg: string, ...params) {
		console.debug(msg, ...params);
	}

	public static warn(msg: string, ...params) {
		console.warn(msg, ...params);
	}

	public static error(msg: string, ...params) {
		console.error(msg, ...params);
	}
}
