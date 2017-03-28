import { Messages } from './messages';
import { Log } from './log';

export class Util {

	private constructor() { }

	public static parseCurrency(value: string): number {

		let result;

		if (value.includes(',')) {
			let partes = value.split(',');
			let parteInteira = partes[0].replace('.', '');
			let parteDecimal = partes[1];

			result = Number.parseFloat(parteInteira.concat('.').concat(parteDecimal));
		} else {
			result = Number.parseFloat(value);
		}

		let messages = new Messages();

		if (result.isNAN) {
			Log.warn(messages.value(messages.ERROR_PARSE_CURRENCY, value));
			return 0.0;
		}

		return result;
	}
}
