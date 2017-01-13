import { Router, Request, Response, NextFunction } from "express";
import * as assert from "assert";
//import * as co from "co";
var co = require('co');

import { app, logger } from "../app";
import { UserDAO } from "../dal/userDAO";
import { ContaDAO } from "../dal/contaDAO";

var userDAO = new UserDAO();
var contaDAO = new ContaDAO();

export const contaRouter: Router = Router();

contaRouter.get("/allByUser", function(request: Request & { userName: string }, response: Response, next: NextFunction) {

    var userName = request.userName;
    logger.info("** request.userName: %j", userName);
    var contas = [];

    co(function*() {

        var user = yield userDAO.getUser(userName);
        assert.ok(user);
        logger.info("** USER: %j", user);

        contas = yield contaDAO.getContaByIds(user.contas);
        logger.info("** CONTAS: %j", contas);

        //Nao necessario o "status(200)", pois a funcao json() ja retorna 200, soh pra lebrar da possibilidade
        response.status(200).json({
            "status": "sucessos",
            "contas": contas
        });


    }).catch((e) => {
        logger.info("** Error = %j", e);

        return response.json({
            "status": "erro",
            "message": "Erro ao obter contas do usuário!"
        });
    });
});


contaRouter.post("/inserir", function(request: Request & { userName: string }, response: Response, next: NextFunction) {

    var userName = request.userName;
    logger.info("** request.userName: %j", userName);

    logger.info("** request.body: %j", request.body);
    logger.info("** request.params: %j", request.params);

    let nomeConta = request.body.nomeConta;

    co(function*() {

        var user = yield userDAO.getUser(userName);
        assert.ok(user);
        logger.info("** USER: %j", user);

        yield contaDAO.insertConta({ nome: nomeConta });

        var contaObtida = yield contaDAO.getContaByNome(nomeConta);
        logger.info("** CONTA OBTIDA: %j", contaObtida);

        var retornoAddConta = yield userDAO.addConta(user._id, contaObtida._id.toHexString());
        logger.info("** retornoAddConta: %j", retornoAddConta);

        user = yield userDAO.getUser(userName);        
        logger.info("** USER Apos Atualizacao da Conta: %j", user);
        
        response.status(201).json({
            "status": "sucessos",
            "user": user
        });


    }).catch((e) => {
        logger.info("** Error = %j", e);

        return response.json({
            "status": "erro",
            "message": "Erro ao obter contas do usuário!"
        });
    });
});
