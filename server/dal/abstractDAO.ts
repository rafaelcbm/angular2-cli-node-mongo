import { logger } from "../app";

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var Q = require("q");


// Create a class to manage the data manipulation.
export class DataAccess {
    static shareItUrl: string = 'mongodb://127.0.0.1:27017/test';
    dbConnection: any = null;

    // Open the MongoDB connection.
    public openDbConnection() {
        if (this.dbConnection == null) {
            MongoClient.connect(DataAccess.shareItUrl, (err, db) => {
                assert.equal(null, err);
                logger.info("** Connected correctly to MongoDB server.");
                this.dbConnection = db;
            });
        }
    }

    // Close the existing connection.
    public closeDbConnection() {
        if (this.dbConnection) {
            this.dbConnection.close();
            this.dbConnection = null;
        }
    }



    // public insertStudent(user: any): any {
    //     return this.insertDocument(student, 'Students');
    // }

    // Get the current count of Student entities.
    // public getStudentsCount(): any {
    //     return this.getDocumentCount('Students');
    // }

     // Get a new Student based on the user name.
    public getUser(userName: string): any {
        logger.info("** DAL :getUser - userName=%s", userName);

        var deferred = Q.defer();
        if (this.dbConnection) {
            var cursor = this.dbConnection.collection('users').find();
            cursor.each((err, document) => {
                assert.equal(err, null);
                if (err) {
                    deferred.reject(new Error(JSON.stringify(err)));
                }
                else if (document !== null && document['nome'] === userName) {
                    return deferred.resolve(document);
                }
                else if (document === null) {
                    return deferred.resolve(document);
                }
            });
        }

        return deferred.promise;
    }

    public getUseByPassword(userName: string): any {
        logger.info("** DAL :getUser - userName=%s", userName);

        var deferred = Q.defer();
        if (this.dbConnection) {
            var cursor = this.dbConnection.collection('users').find();
            cursor.each((err, document) => {
                assert.equal(err, null);
                if (err) {
                    deferred.reject(new Error(JSON.stringify(err)));
                }
                else if (document !== null && document['nome'] === userName) {
                    return deferred.resolve(document);
                }
                else if (document === null) {
                    return deferred.resolve(document);
                }
            });
        }

        return deferred.promise;
    }

    // Insert a new User.
    public insertUser(user: any): any {
        return this.insertDocument(user, 'users');
    }

     // Insert a new document in the collection.
    private insertDocument(document: any, collectionName: string): any {
        logger.info("** DAL - insertDocument: %j, %j", document, collectionName);
        //logger.info("** DAL - this.dbConnection: %j, %j", this.dbConnection);

        var deferred = Q.defer();
        this.dbConnection.collection(collectionName).insertOne(document, (err, result) => {
            assert.equal(err, null);
            if (err) {
                deferred.reject(new Error(JSON.stringify(err)));
            }

            logger.info("** DAL - insertDocument: result = , %j", result);
            deferred.resolve(result);
        });

        return deferred.promise;
    }



    // // Get a new Student based on the user name.
    // public getStudent(userName: string): any {
    //     var deferred = Q.defer();
    //     if (this.dbConnection) {
    //         var cursor = this.dbConnection.collection('Students').find();
    //         cursor.each((err, document) => {
    //             assert.equal(err, null);
    //             if (err) {
    //                 deferred.reject(new Error(JSON.stringify(err)));
    //             }
    //             else if (document !== null && document['userName'] === userName) {
    //                 return deferred.resolve(document);
    //             }
    //             else if (document === null) {
    //                 return deferred.resolve(document);
    //             }
    //         });
    //     }

    //     return deferred.promise;
    // }

    // // Insert a new document in the collection.
    // private insertDocument(document: any, collectionName: string): any {
    //     var deferred = Q.defer();
    //     this.dbConnection.collection(collectionName).insertOne(document, (err, result) => {
    //         assert.equal(err, null);
    //         if (err) {
    //             deferred.reject(new Error(JSON.stringify(err)));
    //         }
    //         deferred.resolve(result);
    //     });

    //     return deferred.promise;
    // }

    // // Get the count of all documents in the collection.
    // private getDocumentCount(collectionName: string): any {
    //     var deferred = Q.defer();
    //     this.dbConnection && this.dbConnection.collection(collectionName).count((err, result) => {
    //         assert.equal(err, null);
    //         if (err) {
    //             deferred.reject(new Error(JSON.stringify(err)));
    //         }
    //         deferred.resolve(result);
    //     });
    //     return deferred.promise;
    // }
}