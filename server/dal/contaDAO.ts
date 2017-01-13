import { logger, dataAccess } from "../app";
var assert = require('assert');
var Q = require("q");
var co = require('co');
var ObjectID = require('mongodb').ObjectID;

// Create a class to manage the data manipulation.
export class ContaDAO {

    // Get a new Student based on the user name.
    public getContaByIds(idsContas: any): any {

        logger.info("** DAL getContaByIDs idsContas %j", idsContas);

        //Converte os ids de String->ObjectID, para uso como parâmetro da consulta.
        let idsConstasAsObjectID = [];
        idsContas.forEach(id => idsConstasAsObjectID.push(ObjectID.createFromHexString(id)));
        logger.info("** DAL getContaByIDs idsConstasAsObjectID %j", idsConstasAsObjectID);

        var resultDocuments = [];

        var deferred = Q.defer();
        if (dataAccess.dbConnection) {
            var cursor = dataAccess.dbConnection.collection('contas').find({ _id: { $in: idsConstasAsObjectID } });
            cursor.each((err, document) => {

                logger.info("** DAL getContaByIDs document: %j", document);
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

    public insertConta(conta: any): any {
        return dataAccess.insertDocument(conta, 'contas');
    }

    public getContaById(idConta: string): any {
        return dataAccess.getDocumentById('contas', idConta);
    }

    public getContaByNome(nomeConta: string): any {
         if (dataAccess.dbConnection) {
            return dataAccess.dbConnection.collection('contas').findOne({ nome: nomeConta });
        }
    }
}
