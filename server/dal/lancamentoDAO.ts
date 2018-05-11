import { ObjectID } from "mongodb";
import * as moment from 'moment';
import { Service, Inject } from 'typedi';
import * as logger from 'logops';

import { DataAccess } from "./abstractDAO";

@Service()
export class LancamentoDAO {

	@Inject() private _dataAccess: DataAccess;
	LANCAMENTO_COLLECTION = 'lancamentos';

	public getLancamentoByIds(idsLancamentos: any): any {

		//Converte os ids de String->ObjectID, para uso como parâmetro da consulta.
		let idsLancametosAsObjectID = [];
		idsLancamentos.forEach(id => idsLancametosAsObjectID.push(ObjectID.createFromHexString(id)));

		return this._dataAccess.getDocuments(this.LANCAMENTO_COLLECTION, { _id: { $in: idsLancametosAsObjectID } });
	}

	public getLancamentoById(idLancamento: string): any {

		return this._dataAccess.getDocumentById(this.LANCAMENTO_COLLECTION, idLancamento);
	}

	public getLancamentosByUser(idUser: string): any {
		return this._dataAccess.getDocuments(this.LANCAMENTO_COLLECTION, { _idUser: idUser });
	}

	public getLancamentoByDescricao(descricaoLancamento: string): any {
		return this._dataAccess.getDocument(this.LANCAMENTO_COLLECTION, { descricao: descricaoLancamento });
	}

	public getLancamentosByCompetencia(idUser: string, competencia: string): any {

		let dataInicio = moment(competencia, "YYYYMM").toDate();
		let dataFim = moment(competencia, "YYYYMM").add(1, 'months').toDate();
		console.log('** dataInicio = ', dataInicio);
		console.log('** dataFim = ', dataFim);
		console.log('** idUser = ', idUser);

		return this._dataAccess.getDocuments(this.LANCAMENTO_COLLECTION,
			{ $and: [{ _idUser: idUser }, { data: { $gte: dataInicio } }, { data: { $lt: dataFim } }] });

	}

	public insertLancamento(lancamento: any): any {

		//Parse data to Date
		lancamento.data = moment(lancamento.data, 'YYYY-MM-DD').toDate();
		return this._dataAccess.insertDocument(lancamento, this.LANCAMENTO_COLLECTION);
	}

	public removeLancamentoById(idLancamento: string): any {
		return this._dataAccess.removeDocumentById(this.LANCAMENTO_COLLECTION, idLancamento);
	}

	public updateLancamento2(idLancamento: any, lancamento: any): any {

		if (this._dataAccess.dbConnection) {

			let query = { _id: new ObjectID(idLancamento) }

			//Parse data to Date
			lancamento.data = moment(lancamento.data, 'YYYY-MM-DD').toDate();
			let updateData = {
				descricao: lancamento.descricao,
				data: lancamento.data,
				conta: lancamento.conta,
				valor: lancamento.valor,
				isDebito: lancamento.isDebito,
			}

			return this._dataAccess.dbConnection.collection(this.LANCAMENTO_COLLECTION).update(query, { $set: updateData }, { w: 1 });
		}
	}

	public updateLancamento(query: any, updateObj: any, options: any = { multi: true }): any {

		return this._dataAccess.dbConnection.collection(this.LANCAMENTO_COLLECTION).update(query, updateObj, options);
	}


	public getCompetencia(idUser: string, competencia): any {

		return this._dataAccess.getDocument('competencias',
			{ $and: [{ _idUser: idUser }, { competencia: competencia }] });
	}

	public obterCompetenciasPosteriores(idUser: string, competencia): any {

		return this._dataAccess.getDocuments('competencias', { $and: [{ _idUser: idUser }, { competencia: { $gt: competencia } }] });
	}

	public obterUltimaCompetenciaAnterior(idUser: string, competencia): any {

		let query = { $and: [{ _idUser: idUser }, { competencia: { $lt: competencia } }] };
		let sort = { competencia: -1 };

		return this._dataAccess.getDocument('competencias', query, sort);
	}

	public updateCompetencia(query: any, updateObj: any, options: any = { multi: true }): any {

		return this._dataAccess.dbConnection.collection('competencias').update(query, updateObj, options);
	}

	public insertCompetencia(competencia): any {

		return this._dataAccess.insertDocument(competencia, 'competencias');
	}

}
