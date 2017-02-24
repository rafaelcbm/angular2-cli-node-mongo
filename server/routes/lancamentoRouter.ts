import { Router, Request, Response, NextFunction } from "express";
import * as assert from "assert";
import * as co from "co";

import { app, logger } from "../app";
import { UserDAO } from "../dal/userDAO";
import { LancamentoDAO } from "../dal/lancamentoDAO";

let userDAO = new UserDAO();
let lancamentoDAO = new LancamentoDAO();

export const lancamentoRouter: Router = Router();
/*
lancamentoRouter.get("/", function(request: Request & { userName: string }, response: Response, next: NextFunction) {

    let userName = request.userName;

    co(function* () {

        let user = yield userDAO.getUser(userName);
        assert.ok(user);        

        if (!user.lancamentos) {
            return response.json({
                "status": "sucesso",
                "lancamentos": []
            });
        }

        let lancamentos = yield lancamentoDAO.getLancamentoByIds(user.lancamentos);
        logger.info("** CONTAS: %j", lancamentos);

        response.json({
            "status": "sucesso",
            "lancamentos": lancamentos
        });

    }).catch((e) => {
        logger.info("** Error = ", e);

        return response.json({
            "status": "erro",
            "message": "Erro ao obter lancamentos do usuário!"
        });
    });
});
*/

lancamentoRouter.post("/", function(request: Request & { userName: string }, response: Response, next: NextFunction) {

    let userName = request.userName;

    logger.info("** lancamentoRouter.post: request.body.lancamento = %j", request.body.lancamento);
    let lancamento = request.body.lancamento;

    co(function* () {

        let user = yield userDAO.getUser(userName);
        assert.ok(user);

        let daoReturn = yield lancamentoDAO.insertLancamento(lancamento);
        logger.info("** daoReturn: %j", daoReturn);
        assert.equal(daoReturn.result.n, 1);

        let lancamentoObtida = yield lancamentoDAO.getLancamentoByDescricao(lancamento.descricao);
        assert.ok(lancamentoObtida);

        //TODO: vincular o lancamento à conta, na verdade, o contrario
        // daoReturn = yield userDAO.addLancamento(user._id, lancamentoObtida._id.toHexString());
        // assert.equal(daoReturn.result.n, 1);

        response.status(201).json({
            "status": "sucesso",
            "lancamento": lancamentoObtida
        });
    }).catch((e) => {
        logger.info("** Error = ", e);

        return response.json({
            "status": "erro",
            "message": "Erro ao inserir lancamento do usuário!"
        });
    });
});
/*
lancamentoRouter.delete("/:idLancamento", function(request: Request & { userName: string }, response: Response, next: NextFunction) {

    let userName = request.userName;
    let idLancamento = request.params.idLancamento;

    co(function* () {

        let lancamentoObtida = yield lancamentoDAO.getLancamentoById(idLancamento);
        logger.info("** Remover Lancamentos - lancamentoObtida = %j", lancamentoObtida);
        if (!lancamentoObtida) {
            return response.json({
                "status": "erro",
                "message": "Lancamento não encontrada!"
            });
        }

        let user = yield userDAO.getUser(userName);
        assert.ok(user);

        if (user.lancamentos) {
            let lancamentosUsuario = user.lancamentos.filter(lancamento => lancamento == idLancamento);

            logger.info("** Remover Lancamentos - filter lancamentosUsuario = ", lancamentosUsuario);

            if (lancamentosUsuario.length == 0) {
                return response.json({
                    "status": "erro",
                    "message": `Lancamento (${lancamentoObtida.nome}) não pertence ao usuário informado!`
                });
            }
        }

        logger.info("** Remover Lancamentos - idLancamento = %j", idLancamento);
        let daoReturn = yield lancamentoDAO.removeLancamentoById(idLancamento);
        logger.info("** Remover Lancamentos - daoReturn 1 = %j", daoReturn);
        assert.equal(daoReturn.result.n, 1);

        daoReturn = yield userDAO.removeLancamento(user._id, lancamentoObtida._id.toHexString());
        logger.info("** Remover Lancamentos - daoReturn 2 = %j", daoReturn);
        assert.equal(daoReturn.result.n, 1);

        user = yield userDAO.getUser(userName);
        logger.info("** Remover Lancamentos - user = %j", user);
        assert.ok(user);

        response.json({
            "status": "sucesso",
            "user": user
        });
    }).catch((e) => {
        logger.info("** Error = ", e);

        return response.json({
            "status": "erro",
            "message": "Erro ao remover lancamento do usuário!"
        });
    });
});

lancamentoRouter.put("/:idLancamento", function(request: Request & { userName: string }, response: Response, next: NextFunction) {

    let userName = request.userName;
    let idLancamento = request.params.idLancamento;
    let nomeLancamento = request.body.nomeLancamento;

    co(function* () {

        let user = yield userDAO.getUser(userName);
        assert.ok(user);

        if (user.lancamentos) {
            let lancamentosUsuario = user.lancamentos.filter(lancamento => lancamento == idLancamento);

            if (lancamentosUsuario.length == 0) {
                return response.json({
                    "status": "erro",
                    "message": `Lancamento informada não pertence ao usuário informado!`
                });
            }
        }

        let lancamentos = yield lancamentoDAO.getLancamentoByIds(user.lancamentos);
        if (lancamentos.find(lancamento => lancamento.nome === nomeLancamento)) {
            return response.json({
                "status": "erro",
                "message": `Usuário já possui lancamento com o nome informado: "${nomeLancamento}".`
            });
        }

        let daoReturn = yield lancamentoDAO.updateLancamento(idLancamento, nomeLancamento);
        assert.equal(daoReturn.result.n, 1);

        let lancamentoAlterada = yield lancamentoDAO.getLancamentoByNome(nomeLancamento);
        assert.ok(lancamentoAlterada);

        response.status(201).json({
            "status": "sucesso",
            "lancamento": lancamentoAlterada
        });
    }).catch((e) => {
        logger.info("** Error = ", e);

        return response.json({
            "status": "erro",
            "message": "Erro ao alterar lancamento do usuário!"
        });
    });
});
*/