import { ObjectID } from "mongodb";
import { Service } from 'typedi';
import * as logger from 'logops';
import { Container } from 'typedi';
import * as assert from "assert";

import { BusinessError } from './../commons/businessError';
import { UserDAO } from '../dal/userDAO';


@Service()
export class UserService {

	userDAO = Container.get(UserDAO);

	public *getUsers() {
		return yield this.userDAO.getAllUsers();
	}
}
