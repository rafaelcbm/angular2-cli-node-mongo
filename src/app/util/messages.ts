export class Messages {

	private constructor() { }

	public static value(key: string): string {
		return Messages.keys.hasOwnProperty(key) ? Messages.keys[key] : key;
	}

	public static keys = {
		'key1': 'value1'
	}
}
