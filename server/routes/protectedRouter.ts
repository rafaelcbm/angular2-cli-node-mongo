import { Router, Response, Request, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { secret } from "../config";
import { app, logger } from "../app";

const protectedRouter: Router = Router();

protectedRouter.use((request: Request & { headers: { authorization: string }, userName: string }, response: Response, next: NextFunction) => {
    const token = request.headers.authorization;

    verify(token, secret, function(tokenError, decodedToken) {
        if (tokenError) {
            return response.status(403).json({
                message: "Invalid token, please Log in first"
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
        text: "Greetings, you have valid token.",
        title: "Protected call"
    });
});

export { protectedRouter }





