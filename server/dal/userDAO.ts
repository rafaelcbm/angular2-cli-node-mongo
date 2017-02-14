import { ObjectID } from "mongodb";
import * as assert from "assert";
import * as co from "co";

import { logger, dataAccess } from "../app";
import { DataAccess } from "./abstractDAO";

// Create a class to manage the data manipulation.
export class UserDAO {

    // Get a new Student based on the user name.
    public getUser(userName: string): any {
        return dataAccess.getDocument('users', { userName: userName });
    }

    public insertUser(user: any): any {
        return dataAccess.insertDocument(user, 'users');
    }

    // Return a promise of an array of users
    public getAllUsers(): any {
        return dataAccess.getDocuments('users');
    }

    public addConta(idUser: string, idConta: string): any {
        return dataAccess.dbConnection.collection('users').update({ _id: idUser }, { $push: { contas: idConta } });
    }

    public removeConta(idUser: string, idConta: string): any {
        return dataAccess.dbConnection.collection('users').update({ _id: idUser }, { $pull: { contas: { $in: [idConta] } } }, { multi: true });
    }
}
