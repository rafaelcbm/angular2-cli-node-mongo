import { ObjectID } from "mongodb";
import * as assert from "assert";
import * as co from "co";

import { logger, dataAccess } from "../app";
import { DataAccess } from "./abstractDAO";

// Create a class to manage the data manipulation.
export class ContaDAO extends DataAccess {

    // Get a new Student based on the user name.
    public getContaByIds(idsContas: any): any {

        //Converte os ids de String->ObjectID, para uso como parâmetro da consulta.
        let idsConstasAsObjectID = [];
        idsContas.forEach(id => idsConstasAsObjectID.push(ObjectID.createFromHexString(id)));

        return dataAccess.getDocuments('contas', { _id: { $in: idsConstasAsObjectID } });
    }

    public getContaById(idConta: string): any {

        return dataAccess.getDocumentById('contas', idConta);
    }

    public getContaByNome(nomeConta: string): any {

        return dataAccess.getDocument('contas', { nome: nomeConta });
    }

    public insertConta(conta: any): any {

        return dataAccess.insertDocument(conta, 'contas');
    }

    public removeContaById(idConta: string): any {
        return dataAccess.removeDocumentById('contas', idConta);
    }

    public updateConta(idConta: any, nomeNovaConta: any): any {

        if (dataAccess.dbConnection) {

            let query = { _id: new ObjectID(idConta) }
            let updateData = { nome: nomeNovaConta }

            return dataAccess.dbConnection.collection('contas').update(query, { $set: updateData }, { w: 1 });
        }
    }
}
