import { logger, dataAccess } from "../app";
let assert = require('assert');
let Q = require("q");
let co = require('co');
let ObjectID = require('mongodb').ObjectID;

// Create a class to manage the data manipulation.
export class ContaDAO {

    // Get a new Student based on the user name.
    public getContaByIds(idsContas: any): any {

        //Converte os ids de String->ObjectID, para uso como parâmetro da consulta.
        let idsConstasAsObjectID = [];
        idsContas.forEach(id => idsConstasAsObjectID.push(ObjectID.createFromHexString(id)));

        let resultDocuments = [];

        let deferred = Q.defer();
        if (dataAccess.dbConnection) {
            let cursor = dataAccess.dbConnection.collection('contas').find({ _id: { $in: idsConstasAsObjectID } });
            cursor.each((err, document) => {

                assert.equal(err, null);
                if (err) {
                    deferred.reject(new Error(JSON.stringify(err)));
                }
                if (document) {
                    resultDocuments.push(document);
                }
                deferred.resolve(resultDocuments);

            });
        }

        return deferred.promise;
    }

    public getContaById(idConta: string): any {
        if (dataAccess.dbConnection) {
            return dataAccess.getDocumentById('contas', idConta);
        }
    }

    public getContaByNome(nomeConta: string): any {
        if (dataAccess.dbConnection) {
            return dataAccess.dbConnection.collection('contas').findOne({ nome: nomeConta });
        }
    }

    public insertConta(conta: any): any {
        if (dataAccess.dbConnection) {
            return dataAccess.insertDocument(conta, 'contas');
        }
    }

    public removeContaById(idConta: string): any {
        if (dataAccess.dbConnection) {            
            return dataAccess.removeDocumentById('contas', idConta);
        }
    }

    public updateConta(idConta: any, nomeNovaConta: any): any {
        if (dataAccess.dbConnection) {

            let query = { _id: new ObjectID(idConta) }
            let updateData = { nome: nomeNovaConta }

            return dataAccess.dbConnection.collection('contas').update(query, { $set: updateData }, { w: 1 });
        }
    }
}
