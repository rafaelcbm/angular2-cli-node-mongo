import { logger } from "../app";

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var Q = require("q");
var ObjectID = require('mongodb').ObjectID;


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

    // Insert a new document in the collection.
    public insertDocument(document: any, collectionName: string): any {
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

    // Return a Promise of an array od documents
    public getAllDocuments(collectionName: string): any {
        logger.info("** DAL.getAllDocuments:%s", collectionName);

        var allDocuments = [];

        var deferred = Q.defer();

        if (this.dbConnection) {
            var cursor = this.dbConnection.collection(collectionName).find();
            cursor.each((err, document) => {
                logger.info("** document = %j", document);

                if (err) {
                    deferred.reject(new Error(JSON.stringify(err)));
                }
                if (document) {
                    allDocuments.push(document);
                }

                deferred.resolve(allDocuments);
            });
        }

        return deferred.promise;
    }

    //Obter um documento pelo atributo _id passado como parâmetro
    //A funcao findOne retorna uma Promise, entao eh soh retorna-la
    public getDocumentById(collectionName: string, id: string): any {
        logger.info("** getDocumentById on: %s , id: %s", collectionName, id);

        let idAsObjectID = ObjectID.createFromHexString(id);

        if (this.dbConnection) {
            return this.dbConnection.collection(collectionName).findOne({ _id: idAsObjectID });
        }
    }

    // Get the count of all documents in the collection.
    public getDocumentCount(collectionName: string): any {
        var deferred = Q.defer();
        this.dbConnection && this.dbConnection.collection(collectionName).count((err, result) => {
            assert.equal(err, null);
            if (err) {
                deferred.reject(new Error(JSON.stringify(err)));
            }
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

}
