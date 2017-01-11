import { Router, Request, Response, NextFunction } from "express";
import { randomBytes, pbkdf2 } from "crypto";
import { sign } from "jsonwebtoken";
import { secret, length, digest } from "../config";
import { app, logger } from "../app";
import { UserDAO } from "../dal/userDAO";

const loginRouter: Router = Router();

var userDAO = new UserDAO();

loginRouter.post("/signup", function(request: Request, response: Response, next: NextFunction) {
    logger.info("** Login Router:signup");
    logger.info("** Resquest body %j", request.body);

    if (!request.body.password || !request.body.password.trim()) {
        let err = new Error("Password obrigatório!");
        return next(err);
    }

    var user: any = {
        userName: request.body.username,
        password: request.body.password
    }

    userDAO.getUser(user.userName).then((document) => {
        logger.info("** result mongo - user document=%j", document);

        // Se o document existir, entao envia msg de erro de usuario existente.
        // Caso contrario, cria o salt, adiciona ao user, salva o usuario, cria um token novo e retorna tudo detro do usuario.
        if (document) {
            // let err = new Error("Usuário já existente!");
            // return next(err);
            response.json({
                status: "erro",
                message: "Usuário já existente!"
            });
            response.sendStatus(201);
        }

        //Criar Salt por usuário
        const salt = randomBytes(128).toString("base64");
        user.salt = salt;

        pbkdf2(user.password, user.salt, 10000, length, digest, function(err, hash) {

            user.hash = hash.toString("hex");

            userDAO.insertUser(user).then((result) => {
                userDAO.getUser(user.userName).then((savedUser) => {

                    logger.info("** savedUser = %j", savedUser);

                    const token = sign({ "userName": savedUser.userName, permissions: [] }, secret, { expiresIn: "7d" });
                    response.json({
                        "status": "sucesso",
                        "jwt": token
                    });
                    response.sendStatus(201);
                })
            });
        });
    }).catch((e) => {
        logger.info("** Error = %j", e);

        return response.json({
            "status": "erro",
            "message": "Erro ao autenticar usuário!"
        });
    });

});


loginRouter.post("/login", function(request: Request, response: Response, next: NextFunction) {
    logger.info("** Login - Resquest body %j", request.body);
    logger.info("** Login - Resquest.userName %j", request.userName);


    userDAO.getUser(request.body.username).then((user) => {
        logger.info("** result mongo - user = %j", user);

        pbkdf2(request.body.password, user.salt, 10000, length, digest, function(err, hash) {
            if (err) {
                logger.info(err);
            }

            // check if password is active
            if (hash.toString("hex") === user.hash) {
                const token = sign({ "userName": user.userName, permissions: [] }, secret, { expiresIn: "7d" });
                response.json({
                    "status": "sucesso",
                    "jwt": token
                });
            } else {
                response.json({
                    "status": "erro",
                    "message": "Password incorreto!"
                });
            }
        });
    }).catch((e) => {
        logger.info("** Error = %j", e);

        return response.json({
            "status": "erro",
            "message": "Usuário não encontrado!"
        });
    });
});

export { loginRouter }