import { length } from './../config';
import { Router, Request, Response, NextFunction } from "express";
import * as assert from "assert";
import * as co from "co";
import { Container } from 'typedi';
import * as logger from 'logops';

import { UserDAO } from "../dal/userDAO";
import { CategoriaDAO } from "../dal/categoriaDAO";
import { CategoriaService } from '../services/categoriaService';
import { BusinessError, handleError } from '../commons/businessError';

const categoriaDAO: CategoriaDAO = Container.get(CategoriaDAO);
const categoriaService: CategoriaService = Container.get(CategoriaService);
const userDAO: UserDAO = Container.get(UserDAO);

export const categoriaRouter: Router = Router();

categoriaRouter.get("/", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;

	co(function* () {

		let arvoreCategorias = yield categoriaService.obterArvoreCategorias(userName);
		assert.ok(arvoreCategorias);

		response.json({
			"status": "sucesso",
			"data": arvoreCategorias
		});

	}).catch((e: Error) => handleError(e, response));

});

categoriaRouter.post("/", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let novaCategoria = request.body.novaCategoria;

	co(function* () {

		let arvoreCategorias = yield categoriaService.salvarCategoria(userName, novaCategoria);
		assert.ok(arvoreCategorias);

		response.json({
			"status": "sucesso",
			"data": arvoreCategorias
		});
	}).catch((e: Error) => handleError(e, response));
});

categoriaRouter.delete("/:idCategoria", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let idCategoria = request.params.idCategoria;

	co(function* () {

		let arvoreCategorias = yield categoriaService.removeCategoria(userName, idCategoria);
		assert.ok(arvoreCategorias);

		response.json({
			"status": "sucesso",
			"data": arvoreCategorias
		});
	}).catch((e: Error) => handleError(e, response));
});

categoriaRouter.put("/:idCategoria", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let idCategoria = request.params.idCategoria;
	let nomeCategoria = request.body.nomeCategoria;

	co(function* () {

		let arvoreCategorias = yield categoriaService.updateCategoria(userName, idCategoria, nomeCategoria);
		assert.ok(arvoreCategorias);

		response.json({
			"status": "sucesso",
			"data": arvoreCategorias
		});
	}).catch((e: Error) => handleError(e, response));
});
