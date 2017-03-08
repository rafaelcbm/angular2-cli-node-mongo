import { Router, Response, Request, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { secret } from "../config";
import { logger } from "../app";

const protectedRouter: Router = Router();

protectedRouter.use((request: Request & { headers: { authorization: string }, userName: string }, response: Response, next: NextFunction) => {
    const token = request.headers.authorization;

    verify(token, secret, function(tokenError, decodedToken) {
        if (tokenError) {
            return response.status(403).json({
                status: "erro",
                message: "Token inválido! Faça o login primeiro."
            });
        }

        logger.info("** DecodedToken.userName: %j", decodedToken.userName);

        // Popula o objeto de Request com o userName na própria request, contido no token verificado, para utilização nas chamadas da api.        
        request.userName = decodedToken.userName;

        next();
    });
});

protectedRouter.get("/", (request: Request, response: Response) => {

    response.json({
        status: "sucesso",
        message: "Parabéns, você possui um token válido.",
        title: "Protected call"
    });
});

export { protectedRouter }





