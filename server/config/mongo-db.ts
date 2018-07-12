import { MongoClient, ObjectID, Db } from "mongodb";
import * as logger from 'logops';

import { mongoUrl } from './constants';

export class MongoDB {

	private static mongoClient: MongoClient = null;
	private static mongoDbConnection: Db = null;

	public static getConnection(): Db {
		try {
			if (MongoDB.mongoDbConnection) {
				//logger.info('* Conexão existente retornada');
				return MongoDB.mongoDbConnection;
			} else {
				MongoDB.connect().then(db => {
					logger.error('* Obtendo nova conexão');
					MongoDB.mongoDbConnection = db
					return MongoDB.mongoDbConnection;
				});
			}
		} catch (err) {
			logger.error('* Erro ao obter conexão com MongoBD: %j', err);
			throw err;
		}
	}

	public static async connect() {

		try {
			if (!MongoDB.mongoDbConnection) {
				MongoDB.mongoClient = await MongoClient.connect(mongoUrl, { useNewUrlParser: true });
				MongoDB.mongoDbConnection = MongoDB.mongoClient.db();
				logger.info('* Conectado com sucesso com o MongoBD.');
			}

			return MongoDB.mongoDbConnection;
		} catch (err) {
			logger.error('* Erro ao tentar se conectar com MongoBD !');
			logger.error(err);
			throw err;
		}
	}

	// Close the existing connection.
	public closeDbConnection() {
		if (MongoDB.mongoClient) {
			MongoDB.mongoClient.close();
			MongoDB.mongoClient = null;
		}
	}
}
