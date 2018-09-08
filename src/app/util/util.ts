export class Util {

	private constructor() { }

	public static parseCurrency(value: string): number {

		let result;
		if (value.toString().includes(',')) {
			const partes = value.split(',');
			const parteInteira = partes[0].replace('.', '');
			const parteDecimal = partes[1];

			result = Number.parseFloat(parteInteira.concat('.').concat(parteDecimal));
		} else {
			result = Number.parseFloat(value);
		}

		if (result.isNAN) {
			return 0.0;
		}

		return result;
	}
}
