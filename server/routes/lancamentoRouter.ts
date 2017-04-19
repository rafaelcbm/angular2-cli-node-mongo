import { Router, Request, Response, NextFunction } from "express";
import * as assert from "assert";
import * as co from "co";
import { Container } from 'typedi';
import * as logger from 'logops';

import { LancamentoService } from './../services/lancamentoService';
import { handleError } from "../commons/businessError";

const lancamentoService: LancamentoService = Container.get(LancamentoService);

export const lancamentoRouter: Router = Router();

lancamentoRouter.get("/", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;

	co(function* () {

		let lancamentos = yield lancamentoService.getLancamentos(userName);

		return response.json({
			"status": "sucesso",
			"data": lancamentos ? lancamentos : []
		});

	}).catch((e: Error) => handleError(e, response));
});


lancamentoRouter.post("/", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let lancamento = request.body.lancamento;

	co(function* () {

		let insertedDocument = yield lancamentoService.insertLancamento(userName, lancamento);

		response.status(201).json({
			"status": "sucesso",
			"data": insertedDocument
		});

	}).catch((e: Error) => handleError(e, response));
});


lancamentoRouter.delete("/:idLancamento", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let idLancamento = request.params.idLancamento;

	co(function* () {

		yield lancamentoService.removeLancamento(userName, idLancamento);

		response.json({ "status": "sucesso" });

	}).catch((e: Error) => handleError(e, response));
});


lancamentoRouter.put("/:idLancamento", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let idLancamento = request.params.idLancamento;
	let lancamento = request.body.lancamento;

	co(function* () {

		let lancamentoAlterado = yield lancamentoService.updateLancamento(userName, idLancamento, lancamento);

		response.json({
			"status": "sucesso",
			"data": lancamentoAlterado
		});

	}).catch((e: Error) => handleError(e, response));
});

lancamentoRouter.get("/:competencia", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let competencia = request.params.competencia;

	co(function* () {

		let lancamentos = yield lancamentoService.getLancamentosByCompetencia(userName, competencia);

		response.json({
			"status": "sucesso",
			"data": lancamentos ? lancamentos : []
		});

	}).catch((e: Error) => handleError(e, response));
});
