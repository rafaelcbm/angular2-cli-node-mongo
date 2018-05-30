import { ObjectID } from "mongodb";
import * as logger from 'logops';

import { MongoDB } from '../config/mongo-db';
import { BaseDAO } from './baseDAO';

export class UserDAO  extends BaseDAO {

	// Get a new Student based on the user name.
	public getUser(userName: string): any {
		return this.getDocument('users', { userName: userName });
	}

	public insertUser(user: any): any {
		return this.insertDocument(user, 'users');
	}

	// Return a promise of an array of users
	public getAllUsers(): any {
		return this.getDocuments('users');
	}

	public addConta(idUser: string, idConta: string): any {
		return MongoDB.getConnection().collection('users').update({ _id: idUser }, { $push: { contas: idConta } });
	}

	public removeConta(idUser: string, idConta: string): any {
		return MongoDB.getConnection().collection('users').update({ _id: idUser }, { $pull: { contas: { $in: [idConta] } } }, { multi: true });
	}
}
