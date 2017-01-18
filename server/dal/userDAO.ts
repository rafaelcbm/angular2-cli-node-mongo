import { logger, dataAccess } from "../app";
let assert = require('assert');
let Q = require("q");
let co = require('co');
let ObjectID = require('mongodb').ObjectID;

// Create a class to manage the data manipulation.
export class UserDAO {

    // Get a new Student based on the user name.
    public getUser(userName: string): any {

        let deferred = Q.defer();
        if (dataAccess.dbConnection) {
            let cursor = dataAccess.dbConnection.collection('users').find();
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

        let deferred = Q.defer();
        if (dataAccess.dbConnection) {
            let cursor = dataAccess.dbConnection.collection('users').find();
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

        if (dataAccess.dbConnection) {

            return dataAccess.dbConnection.collection('users').update({ _id: idUser }, { $push: { contas: idConta } });
        }
    }

    public removeConta(idUser: string, idConta: string): any {

        if (dataAccess.dbConnection) {

            return dataAccess.dbConnection.collection('users').update({ _id: idUser }, { $pull: { contas: { $in: [idConta] } } }, { multi: true });
        }
    }
}
