import { Router, Request, Response, NextFunction } from "express";
import * as assert from "assert";
import * as co from "co";
import { Container } from 'typedi';
import * as logger from 'logops';

import { CategoriaService } from '../services/categoriaService';
import { handleError } from '../commons/businessError';

const categoriaService: CategoriaService = Container.get(CategoriaService);

export const categoriaRouter: Router = Router();

categoriaRouter.get("/", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;

	co(function* () {

		let arvoreCategorias = yield categoriaService.getArvoreCategorias(userName);
		assert.ok(arvoreCategorias);

		response.json({
			"status": "sucesso",
			"data": arvoreCategorias
		});

	}).catch((e: Error) => handleError(e, response));

});

categoriaRouter.get("/flat", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	logger.info('****** CATEGORIA FLAT', userName);

	co(function* () {

		let categorias = yield categoriaService.getCategorias(userName);
		assert.ok(categorias);

		response.json({
			"status": "sucesso",
			"data": categorias
		});

	}).catch((e: Error) => handleError(e, response));

});

categoriaRouter.post("/", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let novaCategoria = request.body.novaCategoria;

	co(function* () {

		let arvoreCategorias = yield categoriaService.insertCategoria(userName, novaCategoria);
		assert.ok(arvoreCategorias);

		response.status(201).json({
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
