import { Router, Request, Response, NextFunction } from "express";
import { Container } from 'typedi';
import * as logger from 'logops';

import { UserDAO } from "../dal/userDAO";

export const userRouter: Router = Router();

const userDAO: UserDAO = Container.get(UserDAO);

userRouter.get("/all", function(request: Request, response: Response, next: NextFunction) {
    logger.info("**UserRouter - getAllUsers - request: %j", request.body);

    userDAO.getAllUsers().then(users => {
        return response.json({
            "status": "sucesso",
            "users": users
        });
    }).catch((e) => {
        logger.info("** Error = %j", e);

        return response.json({
            "status": "erro",
            "message": "Erro ao obter usuários!"
        });
    });
});

