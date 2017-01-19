import { Router, Request, Response, NextFunction } from "express";
import { randomBytes, pbkdf2 } from "crypto";
import { sign } from "jsonwebtoken";
import { secret, length, digest } from "../config";
import { app, logger } from "../app";
import { UserDAO } from "../dal/userDAO";

const loginRouter: Router = Router();

let userDAO = new UserDAO();

loginRouter.post("/signup", function(request: Request, response: Response, next: NextFunction) {

    let password = request.body.password;

    if (!password || !password.trim()) {
        let err = new Error("Password obrigatório!");
        return next(err);
    }

    let user: any = {
        userName: request.body.userName
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

        pbkdf2(password, user.salt, 10000, length, digest, function(err, hash) {

            user.hash = hash.toString("hex");

            userDAO.insertUser(user).then((result) => {
                userDAO.getUser(user.userName).then((savedUser) => {

                    const token = sign({ "userName": savedUser.userName, permissions: [] }, secret, { expiresIn: "7d" });
                    
                    response.status(201).json({
                        "status": "sucesso",
                        "jwt": token
                    });
                })
            });
        });
    }).catch((e) => {
        logger.info("** Error = ", e);

        return response.json({
            "status": "erro",
            "message": "Erro ao autenticar usuário!"
        });
    });

});


loginRouter.post("/login", function(request: Request, response: Response, next: NextFunction) {

    logger.info("** Login - Resquest body %j", request.body);

    userDAO.getUser(request.body.userName).then((user) => {

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
        logger.info("** Error = ", e);

        return response.json({
            "status": "erro",
            "message": "Usuário não encontrado!"
        });
    });
});

export { loginRouter }
