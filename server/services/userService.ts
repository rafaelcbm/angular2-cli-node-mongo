import { ObjectID } from "mongodb";
import * as logger from 'logops';
import * as assert from "assert";

import { BusinessError } from './../commons/businessError';
import { UserDAO } from '../dal/DAOs';

export class UserService {

	userDAO = new UserDAO();

	public getUsers() {
		return this.userDAO.getAllUsers();
	}
}
