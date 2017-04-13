import { MongoClient, ObjectID, Db } from "mongodb";
import { Service } from 'typedi';
import * as logger from 'logops';

@Service()
export class DataAccess {
	private shareItUrl: string = 'mongodb://127.0.0.1:27017/test';
	public dbConnection = null;

	// Open the MongoDB connection.
	public openDbConnection() {
		return MongoClient.connect(this.shareItUrl).then(db => {
			this.dbConnection = db;
			logger.info('## Conectado com sucesso com o MongoBD');
		}).catch(err => {
			logger.info('## Erro ao tentar se conectar com MongoBD: %j', err);
			throw err;
		});;
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
		logger.info("** DAL - Collection: %j - Inserting Document: %j", collectionName, document);

		return this.dbConnection.collection(collectionName).insertOne(document);
	}

	public getDocuments(collectionName: string, query = {}): any {

		if (this.dbConnection) {
			return this.dbConnection.collection(collectionName).find(query).toArray();
		}
	}

	public getDocument(collectionName: string, query = {}): any {

		if (this.dbConnection) {
			return this.dbConnection.collection(collectionName).findOne(query);
		}
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

		if (this.dbConnection) {
			return this.dbConnection.collection(collectionName).removeOne({ _id: idAsObjectID });
		}
	}

	public removeDocuments(collectionName: string, query = {}): any {

		if (this.dbConnection) {
			return this.dbConnection.collection(collectionName).remove(query);
		}
	}

	public getDocumentCount(collectionName: string): any {

		return this.dbConnection && this.dbConnection.collection(collectionName).count();
	}
}
