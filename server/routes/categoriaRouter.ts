import { Router, Request, Response, NextFunction } from "express";
import * as assert from "assert";
import { Container } from 'typedi';
import * as logger from 'logops';

import { CategoriaService } from '../services/categoriaService';
import { handleError } from '../commons/businessError';

const categoriaService: CategoriaService = Container.get(CategoriaService);

export const categoriaRouter: Router = Router();

categoriaRouter.get("/", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;

	categoriaService.getArvoreCategorias(userName)
		.then(arvoreCategorias => response.json({
			"status": "sucesso",
			"data": arvoreCategorias
		}))
		.catch((e: Error) => handleError(e, response));
});

categoriaRouter.get("/flat", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;

	categoriaService.getCategorias(userName)
		.then(categorias => response.json({
			"status": "sucesso",
			"data": categorias
		}))
		.catch((e: Error) => handleError(e, response));
});

categoriaRouter.post("/", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let novaCategoria = request.body.novaCategoria;

	categoriaService.insertCategoria(userName, novaCategoria)
		.then(arvoreCategorias => response.status(201).json({
			"status": "sucesso",
			"data": arvoreCategorias
		}))
		.catch((e: Error) => handleError(e, response));
});

categoriaRouter.delete("/:idCategoria", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let idCategoria = request.params.idCategoria;

	categoriaService.removeCategoria(userName, idCategoria)
		.then(arvoreCategorias => response.json({
			"status": "sucesso",
			"data": arvoreCategorias
		}))
		.catch((e: Error) => handleError(e, response));
});

categoriaRouter.put("/:idCategoria", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let idCategoria = request.params.idCategoria;
	let nomeCategoria = request.body.nomeCategoria;


	categoriaService.updateCategoria(userName, idCategoria, nomeCategoria)
		.then(arvoreCategorias => response.json({
			"status": "sucesso",
			"data": arvoreCategorias
		}))
		.catch((e: Error) => handleError(e, response));
});
