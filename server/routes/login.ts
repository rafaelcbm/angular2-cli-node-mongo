import { Router, Request, Response, NextFunction } from "express";
import { randomBytes, pbkdf2 } from "crypto";
import { sign } from "jsonwebtoken";
import { secret, length, digest } from "../config";
import { app, logger, dataAccess } from "../app";

const loginRouter: Router = Router();

const user = {
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
        let err = new Error("No password");
        return next(err);
    }

    dataAccess.insertUser({ nome: request.body.username, password: request.body.password }).then((result) => {
        logger.info("** result mongo - user result=%j", result);

        dataAccess.getUser(request.body.username).then((document) => {
            logger.info("** result mongo - user document=%j", document);

            //TODO: Se o document existir, entao envia msg de erro de usuario existente. 
            // Caso contrario, cria o salt, adiciona ao user, salva o usuario, cria um token novo e retorna tudo detro do usuario.

            response.json(document);
            response.sendStatus(201);
        })
    }).catch((e) => {
        logger.info("** result mongo - user error=%j", e);

        return response.status(403).json({
            message: "Erro ao inserir user no mongodb"
        });
    });

    // const salt = randomBytes(128).toString("base64");

    // pbkdf2(request.body.password, salt, 10000, length, digest, function(err, hash) {
    //     response.json({
    //         hashed: hash.toString("hex"),
    //         salt: salt
    //     });
    // });
});


loginRouter.post("/", function(request: Request, response: Response, next: NextFunction) {

    pbkdf2(request.body.password, user.salt, 10000, length, digest, function(err, hash) {
        if (err) {
            console.log(err);
        }

        // check if password is active
        if (hash.toString("hex") === user.hashedPassword) {

            const token = sign({ "user": user.username, permissions: [] }, secret, { expiresIn: "7d" });

            response.json({ "jwt": token });

        } else {
            response.json({ message: "Wrong password" });
        }

    });
});

// login method (bkp)
// loginRouter.post("/", function (request: Request, response: Response, next: NextFunction) {

//     pbkdf2(request.body.password, user.salt, 10000, length, digest, function (err, hash) {
//         if (err) {
//             console.log(err);
//         }

//         // check if password is active
//         if (hash.toString("hex") === user.hashedPassword) {

//             const token = sign({"user": user.username, permissions: []}, secret, { expiresIn: "7d" });

//             response.json({"jwt": token});

//         } else {
//             response.json({message: "Wrong password"});
//         }

//     });
// });

export { loginRouter }
