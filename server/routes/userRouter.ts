import { Router, Request, Response, NextFunction } from "express";
import { Container } from 'typedi';
import * as co from "co";

import { UserService } from './../services/userService';
import { UserDAO } from "../dal/userDAO";
import { handleError } from "../commons/businessError";

export const userRouter: Router = Router();

const userService: UserService = Container.get(UserService);

userRouter.get("/all", function (request: Request, response: Response, next: NextFunction) {

	co(function* () {

		let users = yield userService.getUsers();

		response.json({
			"status": "sucesso",
			"data": users
		});

	}).catch((e: Error) => handleError(e, response));
});

