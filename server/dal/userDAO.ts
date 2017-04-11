import { ObjectID } from "mongodb";
import { Service, Inject } from 'typedi';
import * as logger from 'logops';

import { DataAccess } from "./abstractDAO";

// Create a class to manage the data manipulation.
@Service()
export class UserDAO {

	@Inject()
	private _dataAccess: DataAccess;

	// Get a new Student based on the user name.
	public getUser(userName: string): any {
		return this._dataAccess.getDocument('users', { userName: userName });
	}

	public insertUser(user: any): any {
		return this._dataAccess.insertDocument(user, 'users');
	}

	// Return a promise of an array of users
	public getAllUsers(): any {
		return this._dataAccess.getDocuments('users');
	}

	public addConta(idUser: string, idConta: string): any {
		return this._dataAccess.dbConnection.collection('users').update({ _id: idUser }, { $push: { contas: idConta } });
	}

	public removeConta(idUser: string, idConta: string): any {
		return this._dataAccess.dbConnection.collection('users').update({ _id: idUser }, { $pull: { contas: { $in: [idConta] } } }, { multi: true });
	}
}
