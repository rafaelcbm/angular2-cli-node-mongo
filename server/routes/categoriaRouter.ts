import { Router, Request, Response, NextFunction } from "express";
import * as assert from "assert";
import * as co from "co";
import { Container } from 'typedi';
import * as logger from 'logops';

import { UserDAO } from "../dal/userDAO";
import { CategoriaDAO } from "../dal/categoriaDAO";
import { CategoriaService } from './../services/categoriaService';

const categoriaDAO: CategoriaDAO = Container.get(CategoriaDAO);
const categoriaService: CategoriaService = Container.get(CategoriaService);
const userDAO: UserDAO = Container.get(UserDAO);

export const categoriaRouter: Router = Router();

categoriaRouter.get("/", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;

	co(function* () {

		let user = yield userDAO.getUser(userName);
		assert.ok(user);

		let arvoreCategorias = yield categoriaService.getArvoreCategoriasByUser(user._id.toString());

		response.json({
			"status": "sucesso",
			"data": arvoreCategorias
		});

	}).catch((e) => {
		logger.info("** Error = ", e);

		return response.json({
			"status": "erro",
			"message": "Erro ao obter categorias do usuário!"
		});
	});
});

categoriaRouter.post("/", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let novaCategoria = request.body.novaCategoria;

	logger.info("** categoriaRouter.userName = ", userName);
	logger.info("** categoriaRouter.novaCategoria = ", novaCategoria);

	co(function* () {

		let user = yield userDAO.getUser(userName);
		assert.ok(user);
		logger.info("** USER: %j", user);

		let categorias = yield categoriaDAO.getCategoriasByUser(user._id.toString());
		logger.info("** categorias: %j", categorias);
		if (!categorias || categorias.find(categoria => categoria.nome === novaCategoria.nome)) {
			return response.json({
				"status": "erro",
				"message": `Usuário já possui categoria com o nome informado: "${novaCategoria.nome}".`
			});
		}

		let daoReturn = yield categoriaDAO.insertCategoria(novaCategoria);
		assert.equal(daoReturn.result.n, 1);

		let arvoreCategorias = yield categoriaService.getArvoreCategoriasByUser(user._id.toString());

		response.status(201).json({
			"status": "sucesso",
			"data": arvoreCategorias
		});
	}).catch((e) => {
		logger.info("** Error = ", e);

		return response.json({
			"status": "erro",
			"message": "Erro ao inserir categoria do usuário!"
		});
	});
});

categoriaRouter.delete("/:idCategoria", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let idCategoria = request.params.idCategoria;
	logger.info("** categoriaRouter.idCategoria = ", idCategoria);

	co(function* () {

		let user = yield userDAO.getUser(userName);
		assert.ok(user);

		let categorias = yield categoriaDAO.getCategoriasByUser(user._id.toString());
		logger.info("** categorias: %j", categorias);
		//TODO: Verificar essa condição
		if (!categorias || categorias.find(categoria => categoria._id.toString() === idCategoria)) {
			return response.json({
				"status": "erro",
				"message": `Categoria não pertence ao usuário informado!`
			});
		}

		let daoReturn = yield categoriaDAO.removeCategoriaById(idCategoria);
		assert.equal(daoReturn.result.n, 1);

		let arvoreCategorias = yield categoriaService.getArvoreCategoriasByUser(user._id.toString());

		response.status(201).json({
			"status": "sucesso",
			"data": arvoreCategorias
		});
	}).catch((e) => {
		logger.info("** Error = ", e);

		return response.json({
			"status": "erro",
			"message": "Erro ao remover categoria do usuário!"
		});
	});
});

categoriaRouter.put("/:idCategoria", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;
	let idCategoria = request.params.idCategoria;
	let nomeCategoria = request.body.nomeCategoria;

	co(function* () {

		let user = yield userDAO.getUser(userName);
		assert.ok(user);

		let categorias = yield categoriaDAO.getCategoriasByUser(user._id.toString());
		if (categorias.find(categoria => categoria._id.toString() === idCategoria)) {
			return response.json({
				"status": "erro",
				"message": `Categoria não pertence ao usuário informado!`
			});
		}

		if (categorias.find(categoria => categoria.nome === nomeCategoria)) {
			return response.json({
				"status": "erro",
				"message": `Usuário já possui categoria com o nome informado: "${nomeCategoria}".`
			});
		}

		let daoReturn = yield categoriaDAO.updateCategoria(idCategoria, nomeCategoria);
		assert.equal(daoReturn.result.n, 1);

		let arvoreCategorias = yield categoriaService.getArvoreCategoriasByUser(user._id.toString());

		response.status(201).json({
			"status": "sucesso",
			"data": arvoreCategorias
		});

	}).catch((e) => {
		logger.info("** Error = ", e);

		return response.json({
			"status": "erro",
			"message": "Erro ao alterar categoria do usuário!"
		});
	});
});
