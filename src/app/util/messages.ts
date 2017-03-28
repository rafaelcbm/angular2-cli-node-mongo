import { Log } from './log';
import { Injectable } from '@angular/core';

@Injectable()
export class Messages {

	constructor() { }

	ERROR_PARSE_CURRENCY: string = "ERROR_PARSE_CURRENCY";
	SUCCESS_PARSE_CURRENCY: string = "SUCCESS_PARSE_CURRENCY";

	public value(key: string, ...argumentos): string {
		//Máximo suportado: 3 param
		let param1;
		let param2;
		let param3;

		if (argumentos) {
			[param1 = '', param2 = '', param3 = ''] = argumentos;
		}

		let messages = {
			ERROR_PARSE_CURRENCY: `Erro ao converter valor numérico :<${param1}>.`,
			SUCCESS_PARSE_CURRENCY: `Sucesso ao converter valor numérico de:<${param1}> para:<${param2}>.`
		}

		return messages.hasOwnProperty(key) ? messages[key] : key;
	}
}
