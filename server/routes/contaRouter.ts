import { Router, Request, Response, NextFunction } from "express";
import * as assert from "assert";
import * as co from "co";
import { Container } from 'typedi';
import * as logger from 'logops';

import { ContaService } from './../services/contaService';
import { handleError } from "../commons/businessError";

export const contaRouter: Router = Router();

const contaService: ContaService = Container.get(ContaService);


contaRouter.get("/", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;

	co(function* () {

		let contas = yield contaService.getContas(userName);

		response.json({
			"status": "sucesso",
			"data": contas
		});

	}).catch((e: Error) => handleError(e, response));
});


contaRouter.post("/", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let nomeConta = request.body.nomeConta;

	co(function* () {

		let contaObtida = yield contaService.insertConta(userName, nomeConta);

		response.status(201).json({
			"status": "sucesso",
			"data": contaObtida
		});
	}).catch((e: Error) => handleError(e, response));
});

contaRouter.delete("/:idConta", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let idConta = request.params.idConta;

	co(function* () {

		let user = yield contaService.removeConta(userName, idConta);

		response.json({
			"status": "sucesso",
			"user": user
		});

	}).catch((e: Error) => handleError(e, response));

});

contaRouter.put("/:idConta", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let idConta = request.params.idConta;
	let nomeConta = request.body.nomeConta;

	co(function* () {

		let contaAlterada = yield contaService.updateConta(userName, idConta, nomeConta);

		response.json({
			"status": "sucesso",
			"data": contaAlterada
		});

	}).catch((e: Error) => handleError(e, response));
});
