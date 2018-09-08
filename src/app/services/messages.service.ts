import { Injectable } from '@angular/core';

@Injectable()
export class MessagesService {

	constructor() { }

	SUCCESS_CREATE_CONTA = 'SUCCESS_CREATE_CONTA';
	SUCCESS_DELETE_CONTA = 'SUCCESS_DELETE_CONTA';
	SUCCESS_UPDATE_CONTA = 'SUCCESS_UPDATE_CONTA';
	SUCCESS_CREATE_LANCAMENTO = 'SUCCESS_CREATE_LANCAMENTO';
	SUCCESS_DELETE_LANCAMENTO = 'SUCCESS_DELETE_LANCAMENTO';
	SUCCESS_UPDATE_LANCAMENTO = 'SUCCESS_UPDATE_LANCAMENTO';
	SUCCESS_CREATE_CATEGORIA = 'SUCCESS_CREATE_CATEGORIA';
	SUCCESS_DELETE_CATEGORIA = 'SUCCESS_DELETE_CATEGORIA';
	SUCCESS_UPDATE_CATEGORIA = 'SUCCESS_UPDATE_CATEGORIA';


	public getMessage(key: string, ...argumentos): string {
		//Máximo suportado: 3 param
		let param1 = '', param2 = '', param3 = '';

		if (argumentos) {
			[param1 = '', param2 = '', param3 = ''] = argumentos;
		}

		const messages = {
			SUCCESS_CREATE_CONTA: `Conta <${param1}> criada com sucesso.`,
			SUCCESS_DELETE_CONTA: `Conta apagada com sucesso.`,
			SUCCESS_UPDATE_CONTA: `Conta <${param1}> atualizada com sucesso.`,

			SUCCESS_CREATE_LANCAMENTO: `Lancamento criado com sucesso.`,
			SUCCESS_DELETE_LANCAMENTO: `Lancamento apagado com sucesso.`,
			SUCCESS_UPDATE_LANCAMENTO: `Lancamento atualizado com sucesso.`,

			SUCCESS_CREATE_CATEGORIA: `Categoria criada com sucesso.`,
			SUCCESS_DELETE_CATEGORIA: `Categoria apagada com sucesso.`,
			SUCCESS_UPDATE_CATEGORIA: `Categoria atualizada com sucesso.`
		};

		return messages.hasOwnProperty(key) ? messages[key] : key;
	}
}
