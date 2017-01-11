import { Router, Request, Response, NextFunction } from "express";
import { app, logger } from "../app";
import { UserDAO } from "../dal/userDAO";

var userDAO = new UserDAO();

export const contaRouter: Router = Router();

contaRouter.get("/allByUser", function(request: Request, response: Response, next: NextFunction) {

    co(function*() {

        var userName = request.userName;

        var user = yield userDAO.getUser(userName);
        assert.ok(user!=null);

        //TODO: obter contas do usuario e retorna-las
        // Insert a single document
        var r = yield db.collection('inserts').insertOne({ a: 1 });
        assert.equal(1, r.insertedCount);

        // Insert multiple documents
        var r = yield db.collection('inserts').insertMany([{ a: 2 }, { a: 3 }]);
        assert.equal(2, r.insertedCount);

        // Close connection
        db.close();
    }).catch((e) => {
        logger.info("** Error = %j", e);

        return response.json({
            "status": "erro",
            "message": "Erro ao obter contas do usuário!"
        });
    });
});
