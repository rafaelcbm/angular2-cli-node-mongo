import { ObjectID } from "mongodb";
import * as moment from 'moment';
import { Service, Inject } from 'typedi';
import * as logger from 'logops';

import { DataAccess } from "./abstractDAO";

@Service()
export class LancamentoDAO {

    @Inject() private _dataAccess: DataAccess;
    
    public getLancamentoByIds(idsLancamentos: any): any {

        //Converte os ids de String->ObjectID, para uso como parâmetro da consulta.
        let idsLancametosAsObjectID = [];
        idsLancamentos.forEach(id => idsLancametosAsObjectID.push(ObjectID.createFromHexString(id)));

        return this._dataAccess.getDocuments('lancamentos', { _id: { $in: idsLancametosAsObjectID } });
    }

    public getLancamentoById(idLancamento: string): any {

        return this._dataAccess.getDocumentById('lancamentos', idLancamento);
    }

    public getLancamentosByUser(idUser: string): any {
        return this._dataAccess.getDocuments('lancamentos', { _idUser: idUser });
    }

    public getLancamentoByDescricao(descricaoLancamento: string): any {

        return this._dataAccess.getDocument('lancamentos', { descricao: descricaoLancamento });
    }

    public insertLancamento(lancamento: any): any {
        //Parse data to Date
        lancamento.data = moment(lancamento.data, 'YYYY-MM-DD').toDate();
        logger.info("** DAL - lancamento depois: %j", lancamento);

        return this._dataAccess.insertDocument(lancamento, 'lancamentos');
    }

    public removeLancamentoById(idLancamento: string): any {
        return this._dataAccess.removeDocumentById('lancamentos', idLancamento);
    }

    public updateLancamento(idLancamento: any, lancamento: any): any {

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

            return this._dataAccess.dbConnection.collection('lancamentos').update(query, { $set: updateData }, { w: 1 });
        }
    }
}
