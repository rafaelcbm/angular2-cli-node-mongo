import { Router, Request, Response, NextFunction } from "express";
import { randomBytes, pbkdf2 } from "crypto";
import { sign } from "jsonwebtoken";
import { secret, length, digest } from "../config";
import { app, logger, dataAccess } from "../app";

const loginRouter: Router = Router();

const user2 = {
    hashedPassword: "6fb3a68cb5fe34d0c2c9fc3807c8fa9bc0e7dd10023065ea4233d40a2d6bb4a7e336a82f48bcb5a7cc95b8a590cf03a4a07615a226d09a89420a342584a" +
        "a28748336aa0feb7ac3a12200d13641c8f8e26398cfdaf268dd68746982bcf59415670655edf4e9ac30f6310bd2248cb9bc185db8059fe979294dd3611fdf28c2b731",
    salt: "OxDZYpi9BBJUZTTaC/yuuF3Y634YZ90KjpNa+Km4qGgZXGI6vhSWW0T91rharcQWIjG2uPZEPXiKGnSAQ73s352aom56AIYpYCfk7uNsd+7AzaQ6dxTnd9AzCCdIc/J" +
        "62JohpHPJ5eGHUJJy3PAgHYcfVzvBHnIQlTJCQdQAonQ=",
    username: "john"
};

loginRouter.post("/signup", function(request: Request, response: Response, next: NextFunction) {
    logger.info("** Login Router:signup");
    logger.info("** Resquest body %j", request.body);

    if (!request.body.password || !request.body.password.trim()) {
        let err = new Error("Password obrigatório!");
        return next(err);
    }

    var user: any = {
        nome: request.body.username,
        password: request.body.password
    }

    dataAccess.getUser(user.nome).then((document) => {
        logger.info("** result mongo - user document=%j", document);

        //TODO: Se o document existir, entao envia msg de erro de usuario existente.
        // Caso contrario, cria o salt, adiciona ao user, salva o usuario, cria um token novo e retorna tudo detro do usuario.
        if (document) {
            // let err = new Error("Usuário já existente!");
            // return next(err);
            response.json({ status: "error", message: "Usuário já existente!" });
            response.sendStatus(201);
        }

        //Criar Salt por usuário
        const salt = randomBytes(128).toString("base64");
        user.salt = salt;

        pbkdf2(user.password, user.salt, 10000, length, digest, function(err, hash) {

            user.hash = hash.toString("hex");

            dataAccess.insertUser(user).then((result) => {
                dataAccess.getUser(user.nome).then((savedUser) => {

                    logger.info("** savedUser = %j", savedUser);

                    const token = sign({ "user": savedUser.nome, permissions: [] }, secret, { expiresIn: "7d" });
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

        return response.status(403).json({
            message: "Erro ao autenticar usuário!"
        });
    });

});


loginRouter.post("/login", function(request: Request, response: Response, next: NextFunction) {
    logger.info("** Login - Resquest body %j", request.body);

    dataAccess.getUser(request.body.username).then((user) => {
        logger.info("** result mongo - user = %j", user);
        logger.info("** login - user.salt = %j", user.salt);
        logger.info("** login - request.body.password = %j", request.body.password);

        logger.info("** request.body.password = %j", request.body.password);
        logger.info("** user.password = %j", user.password);

        pbkdf2(request.body.password, user.salt, 10000, length, digest, function(err, hash) {
            if (err) {
                logger.info(err);
            }

            logger.info("** hash gerado = %j", hash.toString("hex"));
            logger.info("** hash igual ?? %s", (hash.toString("hex") === user.hash));

            // check if password is active
            if (hash.toString("hex") === user.hash) {
                const token = sign({ "user": user.nome, permissions: [] }, secret, { expiresIn: "7d" });
                response.json({
                    "status": "sucesso",
                    "jwt": token
                });
            } else {
                response.json({
                    "status": "erro",
                    "msg": "Password incorreto!"
                });
            }
        });
    }).catch((e) => {
        logger.info("** Error = %j", e);

        return response.json({
            "status": "erro",
            "msg": "Usuário não encontrado!"
        });
    });
});

export { loginRouter }
