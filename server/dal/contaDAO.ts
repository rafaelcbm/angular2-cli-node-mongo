import { ObjectID } from "mongodb";
import { Service, Inject } from 'typedi';

import { DataAccess } from "./abstractDAO";

@Service()
export class ContaDAO extends DataAccess {

    @Inject() private _dataAccess: DataAccess;

    public getContaByIds(idsContas: any): any {

        //Converte os ids de String->ObjectID, para uso como parâmetro da consulta.        
        let idsConstasAsObjectID = [];
        idsContas.forEach(id => idsConstasAsObjectID.push(ObjectID.createFromHexString(id)));

        return this._dataAccess.getDocuments('contas', { _id: { $in: idsConstasAsObjectID } });
    }

    public getContaById(idConta: string): any {

        return this._dataAccess.getDocumentById('contas', idConta);
    }

    public getContaByNome(nomeConta: string): any {

        return this._dataAccess.getDocument('contas', { nome: nomeConta });
    }

    public insertConta(conta: any): any {

        return this._dataAccess.insertDocument(conta, 'contas');
    }

    public removeContaById(idConta: string): any {
        return this._dataAccess.removeDocumentById('contas', idConta);
    }

    public updateConta(idConta: any, nomeNovaConta: any): any {

        if (this._dataAccess.dbConnection) {

            let query = { _id: new ObjectID(idConta) }
            let updateData = { nome: nomeNovaConta }

            return this._dataAccess.dbConnection.collection('contas').update(query, { $set: updateData }, { w: 1 });
        }
    }
}
