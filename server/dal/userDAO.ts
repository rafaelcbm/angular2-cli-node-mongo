import { logger, dataAccess } from "../app";
var assert = require('assert');
var Q = require("q");
var co = require('co');

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
                } else if (document !== null && document['nome'] === userName) {
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
                } else if (document !== null && document['nome'] === userName) {
                    return deferred.resolve(document);
                } else if (document === null) {
                    return deferred.resolve(document);
                }
            });
        }

        return deferred.promise;
    }

    // Insert a new User.
    public insertUser(user: any): any {
        return dataAccess.insertDocument(user, 'users');
    }

    // Get all users - JS 5 way
    public getAllUsers(): any {
        logger.info("** DAL.getAllUsers");

        var users = [];

        var deferred = Q.defer();

        if (dataAccess.dbConnection) {
            var cursor = dataAccess.dbConnection.collection('users').find();
            cursor.each((err, document) => {
                logger.info("** USER = %j", document);

                assert.equal(err, null);

                if (err) {
                    deferred.reject(new Error(JSON.stringify(err)));
                }
                if (document) {
                    users.push(document);
                }

                deferred.resolve(users);
            });
        }



        return deferred.promise;
    }

    // Get all users - JS 6 way
    public getAllUsersJS6(): any {
        logger.info("** DAL.getAllUsersJS6");

        var users = [];

        var deferred = Q.defer();

        if (dataAccess.dbConnection) {
            co(function*() {
                // Get the cursor
                var cursor = dataAccess.dbConnection.collection('users').find();

                // Iterate over the cursor
                while (yield cursor.hasNext()) {
                    var doc = yield cursor.next();
                    logger.info("** USER = %j", doc);

                    if (doc) {
                        users.push(doc);
                    }
                    deferred.resolve(users);
                }

            }).catch(function(err) {
                console.log(err.stack);
                deferred.reject(new Error(JSON.stringify(err)));
            });
        }

        return deferred.promise;
    }
}
