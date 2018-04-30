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

	contaService.getContas(userName)
		.then(contas => response.json({
			"status": "sucesso",
			"data": contas
		}))
		.catch((e: Error) => handleError(e, response));
});

contaRouter.post("/", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let nomeConta = request.body.nomeConta;

	contaService.insertConta(userName, nomeConta)
		.then(contaObtida => response.status(201).json({
			"status": "sucesso",
			"data": contaObtida
		}))
		.catch((e: Error) => handleError(e, response));
});

contaRouter.delete("/:idConta", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let idConta = request.params.idConta;

	contaService.removeConta(userName, idConta)
		.then(user => response.json({
			"status": "sucesso",
			"user": user
		}))
		.catch((e: Error) => handleError(e, response));
});

contaRouter.put("/:idConta", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let idConta = request.params.idConta;
	let nomeConta = request.body.nomeConta;

	contaService.updateConta(userName, idConta, nomeConta)
		.then(contaAlterada => response.json({
			"status": "sucesso",
			"data": contaAlterada
		}))
		.catch((e: Error) => handleError(e, response));
});
