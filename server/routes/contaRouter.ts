import { Router, Request, Response, NextFunction } from "express";
import * as assert from "assert";
//import * as co from "co";
let co = require('co');

import { app, logger } from "../app";
import { UserDAO } from "../dal/userDAO";
import { ContaDAO } from "../dal/contaDAO";

let userDAO = new UserDAO();
let contaDAO = new ContaDAO();

export const contaRouter: Router = Router();

contaRouter.get("/", function(request: Request & { userName: string }, response: Response, next: NextFunction) {

    let userName = request.userName;

    co(function* () {

        let user = yield userDAO.getUser(userName);
        assert.ok(user);

        if (!user.contas) {
            return response.json({
                "status": "sucesso",
                "contas": []
            });
        }

        let contas = yield contaDAO.getContaByIds(user.contas);
        logger.info("** CONTAS: %j", contas);

        response.json({
            "status": "sucesso",
            "contas": contas
        });

    }).catch((e) => {
        logger.info("** Error = ", e);

        return response.json({
            "status": "erro",
            "message": "Erro ao obter contas do usuário!"
        });
    });
});


contaRouter.post("/", function(request: Request & { userName: string }, response: Response, next: NextFunction) {

    let userName = request.userName;
    let nomeConta = request.body.nomeConta;

    co(function* () {

        let user = yield userDAO.getUser(userName);
        assert.ok(user);
        //user._id é um OBJETO, nao string, apesar da exibição no log ser igual
        logger.info("** typeof user._id: %s", typeof user._id);

        let daoReturn = yield contaDAO.insertConta({ nome: nomeConta });
        assert.equal(daoReturn.result.n, 1);

        let contaObtida = yield contaDAO.getContaByNome(nomeConta);
        assert.ok(contaObtida);

        daoReturn = yield userDAO.addConta(user._id, contaObtida._id.toHexString());
        assert.equal(daoReturn.result.n, 1);

        response.status(201).json({
            "status": "sucesso",
            "conta": contaObtida
        });
    }).catch((e) => {
        logger.info("** Error = ", e);

        return response.json({
            "status": "erro",
            "message": "Erro ao inserir conta do usuário!"
        });
    });
});

contaRouter.delete("/:idConta", function(request: Request & { userName: string }, response: Response, next: NextFunction) {

    let userName = request.userName;
    let idConta = request.params.idConta;

    co(function* () {

        let contaObtida = yield contaDAO.getContaById(idConta);
        logger.info("** Remover Contas - contaObtida = %j", contaObtida);
        if (!contaObtida) {
            return response.json({
                "status": "erro",
                "message": "Conta não encontrada!"
            });
        }

        let user = yield userDAO.getUser(userName);
        assert.ok(user);

        if (user.contas) {
            let contasUsuario = user.contas.filter(conta => conta == idConta);

            logger.info("** Remover Contas - filter contasUsuario = ", contasUsuario);

            if (contasUsuario.length == 0) {
                return response.json({
                    "status": "erro",
                    "message": `Conta (${contaObtida.nome}) não pertence ao usuário informado!`
                });
            }
        }

        logger.info("** Remover Contas - idConta = %j", idConta);
        let daoReturn = yield contaDAO.removeContaById(idConta);
        logger.info("** Remover Contas - daoReturn 1 = %j", daoReturn);
        assert.equal(daoReturn.result.n, 1);

        daoReturn = yield userDAO.removeConta(user._id, contaObtida._id.toHexString());
        logger.info("** Remover Contas - daoReturn 2 = %j", daoReturn);
        assert.equal(daoReturn.result.n, 1);

        user = yield userDAO.getUser(userName);
        logger.info("** Remover Contas - user = %j", user);
        assert.ok(user);

        response.json({
            "status": "sucesso",
            "user": user
        });
    }).catch((e) => {
        logger.info("** Error = ", e);

        return response.json({
            "status": "erro",
            "message": "Erro ao remover conta do usuário!"
        });
    });
});

contaRouter.put("/:idConta", function(request: Request & { userName: string }, response: Response, next: NextFunction) {

    let userName = request.userName;
    let idConta = request.params.idConta;
    let nomeConta = request.body.nomeConta;

    co(function* () {

        let user = yield userDAO.getUser(userName);
        assert.ok(user);

        if (user.contas) {
            let contasUsuario = user.contas.filter(conta => conta == idConta);

            if (contasUsuario.length == 0) {
                return response.json({
                    "status": "erro",
                    "message": `Conta informada não pertence ao usuário informado!`
                });
            }
        }

        let daoReturn = yield contaDAO.updateConta(idConta, nomeConta);
        assert.equal(daoReturn.result.n, 1);

        let contaAlterada = yield contaDAO.getContaByNome(nomeConta);
        assert.ok(contaAlterada);

        response.status(201).json({
            "status": "sucesso",
            "conta": contaAlterada
        });
    }).catch((e) => {
        logger.info("** Error = ", e);

        return response.json({
            "status": "erro",
            "message": "Erro ao alterar conta do usuário!"
        });
    });
});
