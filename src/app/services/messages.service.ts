import { Injectable } from '@angular/core';

@Injectable()
export class MessagesService {

	constructor() { }

	SUCCESS_CREATE_CONTA: string = "SUCCESS_CREATE_CONTA";
	SUCCESS_DELETE_CONTA: string = "SUCCESS_DELETE_CONTA";
	SUCCESS_UPDATE_CONTA: string = "SUCCESS_UPDATE_CONTA";
	SUCCESS_CREATE_LANCAMENTO: string = "SUCCESS_CREATE_LANCAMENTO";
	SUCCESS_DELETE_LANCAMENTO: string = "SUCCESS_DELETE_LANCAMENTO";
	SUCCESS_UPDATE_LANCAMENTO: string = "SUCCESS_UPDATE_LANCAMENTO";

	public getMessage(key: string, ...argumentos): string {
		//Máximo suportado: 3 param
		let param1 = '', param2 = '', param3 = '';

		if (argumentos) {
			[param1 = '', param2 = '', param3 = ''] = argumentos;
		}

		let messages = {
			SUCCESS_CREATE_CONTA: `Conta <${param1}> criada com sucesso.`,
			SUCCESS_DELETE_CONTA: `Conta apagada com sucesso.`,
			SUCCESS_UPDATE_CONTA: `Conta <${param1}> atualizada com sucesso.`,

			SUCCESS_CREATE_LANCAMENTO: `Lancamento criado com sucesso.`,
			SUCCESS_DELETE_LANCAMENTO: `Lancamento apagado com sucesso.`,
			SUCCESS_UPDATE_LANCAMENTO: `Lancamento atualizado com sucesso.`
		}

		return messages.hasOwnProperty(key) ? messages[key] : key;
	}
}
