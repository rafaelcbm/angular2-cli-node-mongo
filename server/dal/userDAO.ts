import { logger, dataAccess } from "../app";
var assert = require('assert');
var Q = require("q");
var co = require('co');
var ObjectID = require('mongodb').ObjectID;

// Create a class to manage the data manipulation.
export class UserDAO {

    // Get a new Student based on the user name.
    public getUser(userName: string): any {
        logger.info("** DAL :getUser - userName=%s", userName);

        var deferred = Q.defer();
        if (dataAccess.dbConnection) {
            var cursor = dataAccess.dbConnection.collection('users').find();
            cursor.each((err, document) => {
                assert.equal(err, null);
                if (err) {
                    deferred.reject(new Error(JSON.stringify(err)));
                } else if (document !== null && document['userName'] === userName) {
                    return deferred.resolve(document);
                } else if (document === null) {
                    return deferred.resolve(document);
                }
            });
        }

        return deferred.promise;
    }

    public getUseByPassword(userName: string): any {
        logger.info("** DAL :getUser - userName=%s", userName);

        var deferred = Q.defer();
        if (dataAccess.dbConnection) {
            var cursor = dataAccess.dbConnection.collection('users').find();
            cursor.each((err, document) => {
                assert.equal(err, null);
                if (err) {
                    deferred.reject(new Error(JSON.stringify(err)));
                } else if (document !== null && document['userName'] === userName) {
                    return deferred.resolve(document);
                } else if (document === null) {
                    return deferred.resolve(document);
                }
            });
        }

        return deferred.promise;
    }

    public insertUser(user: any): any {
        return dataAccess.insertDocument(user, 'users');
    }

    // Return a promise of an array of users
    public getAllUsers(): any {
        return dataAccess.getAllDocuments('users');
    }

    public addConta(idUser: string, idConta: string): any {

        logger.info("** DAL.addConta idUser = %j , idConta = %j", idUser, idConta);
        
        if (dataAccess.dbConnection) {            
            
            return dataAccess.dbConnection.collection('users').update({ _id: idUser }, { $push: { contas: idConta } });
        }
    }
}
