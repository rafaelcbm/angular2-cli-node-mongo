import { Router, Request, Response, NextFunction } from "express";

import { UserService } from './../services/userService';
import { UserDAO } from "../dal/userDAO";
import { handleError } from "../commons/businessError";

export const userRouter: Router = Router();

const userService: UserService = new UserService();

userRouter.get("/all", function (request: Request, response: Response, next: NextFunction) {

	userService.getUsers()
		.then(users => response.json({
			"status": "sucesso",
			"data": users
		}))
		.catch((e: Error) => handleError(e, response));
});

