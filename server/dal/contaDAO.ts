import { ObjectID } from "mongodb";

import { MongoDB } from '../config/mongo-db';
import { BaseDAO } from './baseDAO';

export class ContaDAO extends BaseDAO {

	public getContaByIds(idsContas: any): any {

		//Converte os ids de String->ObjectID, para uso como parâmetro da consulta.
		let idsConstasAsObjectID = [];
		idsContas.forEach(id => idsConstasAsObjectID.push(ObjectID.createFromHexString(id)));

		return this.getDocuments('contas', { _id: { $in: idsConstasAsObjectID } });
	}

	public getContaById(idConta: string): any {

		return this.getDocumentById('contas', idConta);
	}

	public getContaByNome(nomeConta: string): any {

		return this.getDocument('contas', { nome: nomeConta });
	}

	public insertConta(conta: any): any {

		return this.insertDocument(conta, 'contas');
	}

	public removeContaById(idConta: string): any {
		return this.removeDocumentById('contas', idConta);
	}

	public updateConta(idConta: any, nomeNovaConta: any): any {

		let query = { _id: new ObjectID(idConta) }
		let updateData = { nome: nomeNovaConta }

		return MongoDB.getConnection().collection('contas').update(query, { $set: updateData }, { w: 1 });
	}
}
