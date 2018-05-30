import { MongoClient, ObjectID, Db } from "mongodb";
import * as logger from 'logops';

import { MongoDB } from '../config/mongo-db';
//import { Service } from 'typedi';

//@Service()
export class BaseDAO {

	// Insert a new document in the collection.
	public insertDocument(document: any, collectionName: string): any {
		//logger.info("** DAL - Collection: %j - Inserting Document: %j", collectionName, document);
		return MongoDB.getConnection().collection(collectionName).insertOne(document);
	}

	public getDocuments(collectionName: string, query = {}, sort?, limit?): any {


		let cursor = MongoDB.getConnection().collection(collectionName).find(query);
		if (sort) cursor = cursor.sort(sort);
		if (limit) cursor = cursor.limit(limit);

		return cursor.toArray();

	}

	public getDocument(collectionName: string, query = {}, sort?): any {

		let options;
		if (sort) {
			options = {};
			options.sort = sort;
		}
		return MongoDB.getConnection().collection(collectionName).findOne(query, options);

	}

	//Obter um documento pelo atributo _id passado como parâmetro
	//A funcao findOne retorna uma Promise, entao eh soh retorna-la
	public getDocumentById(collectionName: string, id: string): any {

		let idAsObjectID = ObjectID.createFromHexString(id);

		return this.getDocument(collectionName, { _id: idAsObjectID });
	}

	// Recebe o _id do documento como string, transforma em ObjectID e o remove.
	public removeDocumentById(collectionName: string, id: string): any {

		let idAsObjectID = ObjectID.createFromHexString(id);

		return MongoDB.getConnection().collection(collectionName).deleteOne({ _id: idAsObjectID });

	}

	public removeDocuments(collectionName: string, query = {}): any {

		return MongoDB.getConnection().collection(collectionName).remove(query);

	}

	public getDocumentCount(collectionName: string): any {

		return MongoDB.getConnection().collection(collectionName).count({});
	}
}
