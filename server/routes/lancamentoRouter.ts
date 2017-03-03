import { Router, Request, Response, NextFunction } from "express";
import * as assert from "assert";
import * as co from "co";

import { app, logger } from "../app";
import { UserDAO } from "../dal/userDAO";
import { LancamentoDAO } from "../dal/lancamentoDAO";

let userDAO = new UserDAO();
let lancamentoDAO = new LancamentoDAO();

export const lancamentoRouter: Router = Router();

lancamentoRouter.get("/", function(request: Request & { userName: string }, response: Response, next: NextFunction) {

    let userName = request.userName;

    co(function* () {

        let user = yield userDAO.getUser(userName);
        assert.ok(user);

        let lancamentos = yield lancamentoDAO.getLancamentosByUser(user._id.toString());
        logger.info("** LANCAMENTOS: %j", lancamentos);

        if (!lancamentos) {
            return response.json({
                "status": "sucesso",
                "lancamentos": []
            });
        }

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


lancamentoRouter.post("/", function(request: Request & { userName: string }, response: Response, next: NextFunction) {

    let userName = request.userName;

    logger.info("** lancamentoRouter.post: request.body.lancamento = %j", request.body.lancamento);
    let lancamento = request.body.lancamento;

    co(function* () {

        let user = yield userDAO.getUser(userName);
        assert.ok(user);

        // Transforma o _id para String
        lancamento._idUser = user._id.toString();
        logger.info("** typeof lancamento._idUser: %s", typeof lancamento._idUser);

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


lancamentoRouter.delete("/:idLancamento", function(request: Request & { userName: string }, response: Response, next: NextFunction) {

    let userName = request.userName;
    let idLancamento = request.params.idLancamento;

    co(function* () {

        let lancamentoObtido = yield lancamentoDAO.getLancamentoById(idLancamento);
        logger.info("** Remover Lancamentos - lancamentoObtido = %j", lancamentoObtido);
        if (!lancamentoObtido) {
            return response.json({
                "status": "erro",
                "message": "Lancamento não encontrado!"
            });
        }

        let user = yield userDAO.getUser(userName);
        assert.ok(user);

        if (user._id.toHexString() != lancamentoObtido._idUser.toHexString()) {
            return response.json({
                "status": "erro",
                "message": `Lancamento (${lancamentoObtido.nome}) não pertence ao usuário informado!`
            });
        }

        let daoReturn = yield lancamentoDAO.removeLancamentoById(idLancamento);
        assert.equal(daoReturn.result.n, 1);

        response.json({
            "status": "sucesso"
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
    let lancamento = request.body.lancamento;

    co(function* () {

        let user = yield userDAO.getUser(userName);
        assert.ok(user);

        if (!user.contas) {
            return response.json({
                "status": "erro",
                "message": `Usuário não possui contas cadastradas! Favor crie uma conta antes cadastrar um lançamento!`
            });
        }

        if (user.contas) {

            let contaLancamento = user.contas.find(conta => conta === lancamento.conta._id);

            if (!contaLancamento) {
                return response.json({
                    "status": "erro",
                    "message": `Lancamento informado não pertence a uma conta do usuário!`
                });
            }
        }

        let daoReturn = yield lancamentoDAO.updateLancamento(idLancamento, lancamento);
        assert.equal(daoReturn.result.n, 1);

        let lancamentoAlterado = yield lancamentoDAO.getLancamentoByDescricao(lancamento.descricao);
        assert.ok(lancamentoAlterado);

        response.status(201).json({
            "status": "sucesso",
            "lancamento": lancamentoAlterado
        });
    }).catch((e) => {
        logger.info("** Error = ", e);

        return response.json({
            "status": "erro",
            "message": "Erro ao alterar lancamento do usuário!"
        });
    });
});
