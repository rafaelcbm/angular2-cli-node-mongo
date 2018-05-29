import { Router, Request, Response, NextFunction } from "express";
import * as assert from "assert";
import { Container } from 'typedi';
import * as logger from 'logops';

import { LancamentoService } from './../services/lancamentoService';
import { handleError } from "../commons/businessError";

const lancamentoService: LancamentoService = Container.get(LancamentoService);

export const lancamentoRouter: Router = Router();

lancamentoRouter.get("/", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;

	lancamentoService.getLancamentos(userName)
		.then(lancamentos => response.json({
			"status": "sucesso",
			"data": lancamentos ? lancamentos : []
		}))
		.catch((e: Error) => handleError(e, response));
});

lancamentoRouter.post("/", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let lancamento = request.body.lancamento;

	logger.info('** ROUTER insertLancamento  userName = %j | lancamento = %j', userName, lancamento);

	lancamentoService.insertLancamento(userName, lancamento)
		.then(insertedDocument => response.status(201).json({
			"status": "sucesso",
			"data": insertedDocument
		}))
		.catch((e: Error) => handleError(e, response));
});

lancamentoRouter.delete("/:idLancamento", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let idLancamento = request.params.idLancamento;

	lancamentoService.removeLancamento(userName, idLancamento)
		.then(() => response.json({ "status": "sucesso" }))
		.catch((e: Error) => handleError(e, response));
});

lancamentoRouter.delete("/parcelados/:idLancamento", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let idLancamento = request.params.idLancamento;

	lancamentoService.removeLancamentosParcelados(userName, idLancamento)
		.then(() => response.json({ "status": "sucesso" }))
		.catch((e: Error) => handleError(e, response));
});

lancamentoRouter.put("/:idLancamento", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let idLancamento = request.params.idLancamento;
	let lancamento = request.body.lancamento;

	lancamentoService.updateLancamento(userName, idLancamento, lancamento)
		.then(lancamentoAlterado =>
			response.json({
				"status": "sucesso",
				"data": lancamentoAlterado
			}))
		.catch((e: Error) => handleError(e, response));
});

lancamentoRouter.get("/:competencia", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let competencia = request.params.competencia;

	lancamentoService.getLancamentosByCompetencia(userName, competencia)
		.then(lancamentos => response.json({
			"status": "sucesso",
			"data": lancamentos ? lancamentos : []
		}))
		.catch((e: Error) => handleError(e, response));
});

lancamentoRouter.put("/consolidar/:idLancamento/:lancamentoPago", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let idLancamento = request.params.idLancamento;
	let lancamentoPago = request.params.lancamentoPago;

	lancamentoService.consolidarLancamento(userName, idLancamento, lancamentoPago)
		.then(lancamentoAlterado =>
			response.json({
				"status": "sucesso",
				"data": lancamentoAlterado
			}))
		.catch((e: Error) => handleError(e, response));
});

lancamentoRouter.get("/competencia/:competencia", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let competencia = request.params.competencia;

	lancamentoService.obterCompetencia(userName, competencia)
		.then(competencia =>
			response.json({
				"status": "sucesso",
				"data": competencia
			}))
		.catch((e: Error) => handleError(e, response));
});

lancamentoRouter.get("/competencia/anterior/:competencia", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let competencia = request.params.competencia;

	lancamentoService.obterUltimaCompetenciaAnterior(userName, competencia)
		.then(competencia =>
			response.json({
				"status": "sucesso",
				"data": competencia
			}))
		.catch((e: Error) => handleError(e, response));
});
