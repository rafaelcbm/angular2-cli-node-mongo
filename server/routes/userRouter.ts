import { Router, Request, Response, NextFunction } from "express";
import { app, logger } from "../app";
import { UserDAO } from "../dal/userDAO";
import { co } from "co";

var userDAO = new UserDAO();


export const userRouter: Router = Router();

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
            "message": "Erro ao autenticar usuário!"
        });
    });
});

